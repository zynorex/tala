/**
 * POST /api/payments/create-order
 *
 * Creates a Razorpay order for the authenticated user.
 * Rate-limited: 8 requests / minute.
 *
 * Body: { planTier: PlanTier, billingInterval: 'MONTHLY' | 'YEARLY' }
 * Response: { orderId, amount, currency, keyId, planTier, billingInterval, dbPaymentId }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createPaymentOrder } from '@/lib/payments/razorpay';
import { parseBillingInterval, parsePlanTier } from '@/lib/payments/plans';
import { rateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit';

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  planTier: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  billingInterval: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY'),
});

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const userId: string = (session.user as { id: string }).id;

  // 2. Rate limit (keyed on userId to prevent account-hopping)
  const { allowed, response: rlResponse } = await rateLimit(req, userId, rateLimitConfigs.payment);
  if (!allowed) {
    return rlResponse ?? NextResponse.json(
      { error: 'Too many requests. Please wait before creating another order.' },
      { status: 429 },
    );
  }

  // 3. Parse & validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input.', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { planTier, billingInterval } = parsed.data;

  // 4. Create order
  try {
    const result = await createPaymentOrder({
      userId,
      planTier,
      billingInterval,
      ipAddress: req.headers.get('x-forwarded-for') ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create payment order.';
    console.error('[payments/create-order]', message, err);

    if (message.includes('Contact sales')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Return enough detail to debug without leaking internals
    const safeMessage =
      message.includes('not found') || message.includes('foreign key')
        ? 'User account not found. Please sign out and sign in again.'
        : message.includes('environment variable')
        ? 'Payment service is misconfigured. Please contact support.'
        : 'Failed to create payment order. Please try again.';

    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
