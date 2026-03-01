/**
 * lib/payments/types.ts
 * Enterprise-grade Razorpay payment type definitions
 */

export type PlanTier = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'GOVERNMENT';
export type BillingInterval = 'MONTHLY' | 'YEARLY';
export type PaymentStatus =
  | 'CREATED'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

// ─── Plan definition ──────────────────────────────────────────────────────────

export interface PlanDefinition {
  tier: PlanTier;
  name: string;
  /** Monthly price in INR paise (₹999 = 99900 paise) */
  monthlyPaise: number;
  /** Yearly price in INR paise (20 % discount) */
  yearlyPaise: number;
  /** Whether this tier supports direct Razorpay checkout */
  directCheckout: boolean;
  /** Max vaults allowed (null = unlimited) */
  maxVaults: number | null;
  /** Max storage per vault in bytes (null = unlimited) */
  maxStorageBytes: number | null;
  /** Max team members (null = unlimited) */
  maxTeamMembers: number | null;
  /** API access enabled */
  apiAccess: boolean;
}

// ─── Razorpay order ───────────────────────────────────────────────────────────

export interface CreateOrderInput {
  userId: string;
  planTier: PlanTier;
  billingInterval: BillingInterval;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateOrderResult {
  orderId: string;      // Razorpay order_xxx
  amount: number;       // Paise
  currency: string;
  keyId: string;        // Public key for checkout
  planTier: PlanTier;
  billingInterval: BillingInterval;
  dbPaymentId: string;  // Internal Payment record id
}

// ─── Payment verification ─────────────────────────────────────────────────────

export interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  userId: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  planTier: PlanTier;
  planExpiresAt: Date;
  paymentId: string;
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

export type RazorpayWebhookEvent =
  | 'payment.captured'
  | 'payment.failed'
  | 'payment.authorized'
  | 'order.paid'
  | 'refund.created'
  | 'subscription.activated'
  | 'subscription.charged'
  | 'subscription.completed'
  | 'subscription.cancelled'
  | 'subscription.halted';

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: RazorpayWebhookEvent;
  contains: string[];
  payload: {
    payment?: {
      entity: RazorpayPaymentEntity;
    };
    order?: {
      entity: RazorpayOrderEntity;
    };
    subscription?: {
      entity: RazorpaySubscriptionEntity;
    };
    refund?: {
      entity: Record<string, unknown>;
    };
  };
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: 'payment';
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string | null;
  method: string;
  captured: boolean;
  description: string | null;
  email: string | null;
  contact: string | null;
  notes: Record<string, string>;
  fee: number | null;
  tax: number | null;
  error_code: string | null;
  error_description: string | null;
  created_at: number;
}

export interface RazorpayOrderEntity {
  id: string;
  entity: 'order';
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpaySubscriptionEntity {
  id: string;
  entity: 'subscription';
  plan_id: string;
  status: string;
  current_start: number | null;
  current_end: number | null;
  ended_at: number | null;
  quantity: number;
  notes: Record<string, string>;
  charge_at: number;
  start_at: number;
  end_at: number;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: boolean;
  created_at: number;
  expire_by: number | null;
  short_url: string;
  has_scheduled_changes: boolean;
  change_scheduled_at: number | null;
  source: string;
  offer_id: string | null;
  remaining_count: number;
}
