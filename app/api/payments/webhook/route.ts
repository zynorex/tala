/**
 * POST /api/payments/webhook
 *
 * Razorpay webhook endpoint.
 * - NO authentication (Razorpay calls this server-to-server)
 * - NO CSRF check (added to CSRF_EXEMPT_ROUTES in middleware)
 * - Validates X-Razorpay-Signature using HMAC-SHA256
 *
 * Handled events:
 *   payment.captured   → upgrade user plan
 *   payment.failed     → mark payment failed
 *   order.paid         → noop (covered by payment.captured)
 *
 * Idempotent: safe to call multiple times for the same event.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  handlePaymentCaptured,
  handlePaymentFailed,
} from '@/lib/payments/razorpay';
import type { RazorpayWebhookPayload } from '@/lib/payments/types';

export async function POST(req: NextRequest) {
  // 1. Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  // 2. Verify webhook signature
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn('[payments/webhook] Invalid webhook signature received.');
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  // 3. Parse payload
  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Malformed JSON.' }, { status: 400 });
  }

  const event = payload.event;
  console.info(`[payments/webhook] Received event: ${event}`);

  // 4. Route to handler
  try {
    switch (event) {
      case 'payment.captured': {
        const payment = payload.payload?.payment?.entity;
        if (payment) {
          await handlePaymentCaptured({
            id: payment.id,
            order_id: payment.order_id,
            notes: payment.notes,
          });
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload?.payment?.entity;
        if (payment) {
          await handlePaymentFailed({
            id: payment.id,
            order_id: payment.order_id,
            error_description: payment.error_description,
          });
        }
        break;
      }

      case 'order.paid':
        // Covered by payment.captured — no additional action needed
        break;

      case 'payment.authorized':
        // Auto-capture is handled by Razorpay; wait for payment.captured
        break;

      default:
        // Acknowledge unknown events gracefully — don't 4xx (Razorpay retries on non-2xx)
        console.info(`[payments/webhook] Unhandled event type: ${event}`);
    }
  } catch (err) {
    console.error(`[payments/webhook] Error handling event "${event}":`, err);
    // Return 500 so Razorpay retries
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  // 5. Acknowledge
  return NextResponse.json({ received: true }, { status: 200 });
}
