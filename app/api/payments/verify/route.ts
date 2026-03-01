/**
 * POST /api/payments/verify
 *
 * Verifies a Razorpay payment signature and activates the user's plan.
 * Rate-limited: 5 requests / minute (tight — prevents brute-force).
 *
 * Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
 * Response: { success, planTier, planExpiresAt }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { verifyAndActivatePayment } from '@/lib/payments/razorpay';
import { rateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit';

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const userId: string = (session.user as { id: string }).id;

  // 2. Rate limit (tight — prevents brute-forcing signatures)
  const { allowed, response: rlResponse } = await rateLimit(req, userId, rateLimitConfigs.paymentVerify);
  if (!allowed) {
    return rlResponse ?? NextResponse.json(
      { error: 'Too many verification attempts. Please wait.' },
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

  // 4. Verify signature & activate plan
  try {
    const result = await verifyAndActivatePayment({
      ...parsed.data,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        planTier: result.planTier,
        planExpiresAt: result.planExpiresAt.toISOString(),
        paymentId: result.paymentId,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment verification failed.';
    console.error('[payments/verify]', err);

    if (message.includes('signature')) {
      // Explicit signature failure — do not leak details beyond 402
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 402 });
    }
    if (message.includes('not found')) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    if (message.includes('mismatch')) {
      return NextResponse.json({ error: 'Unauthorized payment attempt.' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
