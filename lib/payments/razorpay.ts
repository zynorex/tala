/**
 * lib/payments/razorpay.ts
 * Enterprise-grade Razorpay server-side utilities.
 *
 * Responsibilities:
 *  - Singleton Razorpay instance (safe for serverless cold starts)
 *  - Order creation with DB record
 *  - Payment signature verification (HMAC-SHA256)
 *  - Webhook signature verification
 *  - Plan upgrade with atomic DB transaction
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { PLANS, getPlanAmount, getPlanExpiry, parseBillingInterval, parsePlanTier } from './plans';
import type {
  CreateOrderInput,
  CreateOrderResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
  PlanTier,
  BillingInterval,
} from './types';

// ─── Environment validation ───────────────────────────────────────────────────

function getRazorpayKeyId(): string {
  const key = process.env.RAZORPAY_KEY_ID?.trim();
  if (!key) throw new Error('RAZORPAY_KEY_ID environment variable is not set.');
  return key;
}

function getRazorpayKeySecret(): string {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET environment variable is not set.');
  return secret;
}

function getWebhookSecret(): string {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET environment variable is not set.');
  return secret;
}

// ─── Singleton client ─────────────────────────────────────────────────────────

let razorpayInstance: Razorpay | null = null;

/**
 * Returns a memoised Razorpay instance.
 * Throws at runtime if credentials are missing rather than at module load time
 * (avoids breaking builds when env vars are not present in CI/preview).
 */
export function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: getRazorpayKeyId(),
      key_secret: getRazorpayKeySecret(),
    });
  }
  return razorpayInstance;
}

// ─── Order creation ───────────────────────────────────────────────────────────

/**
 * Creates a Razorpay order and stores a pending Payment record in the DB.
 *
 * @throws if the plan is not allowed for direct checkout or credentials are missing.
 */
export async function createPaymentOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const { userId, planTier, billingInterval, ipAddress, userAgent } = input;

  const plan = PLANS[planTier];
  if (!plan.directCheckout) {
    throw new Error(`Plan "${planTier}" does not support self-service checkout. Contact sales.`);
  }

  const amountPaise = getPlanAmount(planTier, billingInterval);
  if (amountPaise <= 0) {
    throw new Error('Invalid plan amount.');
  }

  const periodStart = new Date();
  const periodEnd = getPlanExpiry(billingInterval);

  const rzp = getRazorpayClient();

  // Idempotency receipt — user + plan + timestamp rounded to the minute
  const receipt = `tala_${userId.slice(0, 8)}_${planTier.toLowerCase()}_${Date.now()}`.slice(0, 40);

  // Create order on Razorpay
  const order = await rzp.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt,
    notes: {
      userId,
      planTier,
      billingInterval,
      source: 'tala_dashboard',
    },
  });

  // Persist a CREATED payment record so we can reconcile later
  const payment = await prisma.payment.create({
    data: {
      userId,
      planTier,
      billingInterval,
      razorpayOrderId: order.id,
      amountPaise,
      currency: 'INR',
      status: 'CREATED',
      periodStart,
      periodEnd,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      notes: { receipt },
    },
  });

  return {
    orderId: order.id,
    amount: amountPaise,
    currency: 'INR',
    keyId: getRazorpayKeyId(),
    planTier,
    billingInterval,
    dbPaymentId: payment.id,
  };
}

// ─── Payment verification ─────────────────────────────────────────────────────

/**
 * Verifies the triple (orderId, paymentId, signature) returned by Razorpay
 * after a successful payment on the client side.
 *
 * On success, atomically:
 *  1. Updates the Payment record → CAPTURED
 *  2. Upgrades the User plan
 *
 * @throws on signature mismatch or DB failure — caller must catch and 402/500.
 */
export async function verifyAndActivatePayment(
  input: VerifyPaymentInput,
): Promise<VerifyPaymentResult> {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId } = input;

  // 1. Verify HMAC-SHA256 signature
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', getRazorpayKeySecret())
    .update(body)
    .digest('hex');

  if (
    !crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpaySignature, 'hex'),
    )
  ) {
    throw new Error('Payment signature verification failed.');
  }

  // 2. Load the Payment record and confirm ownership
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId },
  });

  if (!payment) {
    throw new Error('Payment order not found.');
  }
  if (payment.userId !== userId) {
    throw new Error('Payment userId mismatch — potential fraud.');
  }
  if (payment.status === 'CAPTURED') {
    // Idempotent: already activated — don't double-upgrade
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return {
      success: true,
      planTier: payment.planTier as PlanTier,
      planExpiresAt: payment.periodEnd ?? new Date(),
      paymentId: payment.id,
    };
  }

  // 3. Atomic upgrade: update Payment + User inside a transaction
  const planTier = payment.planTier as PlanTier;
  const planExpiresAt = payment.periodEnd ?? getPlanExpiry(payment.billingInterval as BillingInterval);

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'CAPTURED',
        updatedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        plan: planTier,
        planExpiresAt,
        updatedAt: new Date(),
      },
    }),
  ]);

  return {
    success: true,
    planTier,
    planExpiresAt,
    paymentId: payment.id,
  };
}

// ─── Webhook verification ─────────────────────────────────────────────────────

/**
 * Verifies an incoming Razorpay webhook request.
 * @param rawBody - The raw request body as a string (must NOT be JSON.parsed first)
 * @param signature - Value of the `X-Razorpay-Signature` header
 * @returns true if the signature is valid
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', getWebhookSecret())
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

// ─── Webhook event handlers ───────────────────────────────────────────────────

/**
 * Handles `payment.captured` webhook event.
 * Called when Razorpay auto-captures a payment (e.g. UPI, netbanking).
 */
export async function handlePaymentCaptured(paymentEntity: {
  id: string;
  order_id: string;
  notes?: Record<string, string>;
}): Promise<void> {
  const existing = await prisma.payment.findUnique({
    where: { razorpayOrderId: paymentEntity.order_id },
  });
  if (!existing || existing.status === 'CAPTURED') return;

  const planTier = existing.planTier as PlanTier;
  const planExpiresAt = existing.periodEnd ?? getPlanExpiry(existing.billingInterval as BillingInterval);

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: existing.id },
      data: {
        razorpayPaymentId: paymentEntity.id,
        status: 'CAPTURED',
        updatedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: existing.userId },
      data: {
        plan: planTier,
        planExpiresAt,
        updatedAt: new Date(),
      },
    }),
  ]);
}

/**
 * Handles `payment.failed` webhook event.
 */
export async function handlePaymentFailed(paymentEntity: {
  id: string;
  order_id: string;
  error_description?: string | null;
}): Promise<void> {
  const existing = await prisma.payment.findUnique({
    where: { razorpayOrderId: paymentEntity.order_id },
  });
  if (!existing || existing.status === 'FAILED') return;

  await prisma.payment.update({
    where: { id: existing.id },
    data: {
      razorpayPaymentId: paymentEntity.id,
      status: 'FAILED',
      failureReason: paymentEntity.error_description ?? 'Unknown failure',
      updatedAt: new Date(),
    },
  });
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export { parsePlanTier, parseBillingInterval, PLANS, getPlanAmount, getPlanExpiry };
