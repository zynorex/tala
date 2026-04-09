/**
 * GET /api/payments/status
 *
 * Returns the authenticated user's current plan and recent payment history.
 * Used by the pricing page to reflect the active plan and show upgrade paths.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/payments/plans';
import type { PlanTier, BillingInterval } from '@/lib/payments/types';

export async function GET(req: NextRequest) {
  // 1. Auth
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const userId: string = (session.user as { id: string }).id;

  // 2. Load user billing data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      planExpiresAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  // 3. Check whether plan is still valid
  const planTier = (user.plan ?? 'FREE') as PlanTier;
  const planExpiresAt = user.planExpiresAt;
  const isExpired =
    planTier !== 'FREE' && planExpiresAt !== null && planExpiresAt < new Date();

  const effectivePlan: PlanTier = isExpired ? 'FREE' : planTier;

  // 4. Load last 5 payments for display
  const recentPayments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      planTier: true,
      billingInterval: true,
      amountPaise: true,
      currency: true,
      status: true,
      createdAt: true,
      periodEnd: true,
    },
  });

  return NextResponse.json({
    plan: {
      tier: effectivePlan,
      name: PLANS[effectivePlan].name,
      expiresAt: planExpiresAt?.toISOString() ?? null,
      isExpired,
    },
    limits: {
      maxVaults: PLANS[effectivePlan].maxVaults,
      maxStorageBytes: PLANS[effectivePlan].maxStorageBytes,
      maxTeamMembers: PLANS[effectivePlan].maxTeamMembers,
      apiAccess: PLANS[effectivePlan].apiAccess,
    },
    recentPayments: recentPayments.map((p: typeof recentPayments[number]) => ({
      id: p.id,
      planTier: p.planTier as PlanTier,
      billingInterval: p.billingInterval as BillingInterval,
      amountPaise: p.amountPaise,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      periodEnd: p.periodEnd?.toISOString() ?? null,
    })),
  });
}
