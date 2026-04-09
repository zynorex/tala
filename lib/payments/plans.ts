/**
 * lib/payments/plans.ts
 * Canonical plan definitions — single source of truth for tier limits and prices.
 */

import type { PlanDefinition, PlanTier, BillingInterval } from './types';

// ─── Plan catalogue ───────────────────────────────────────────────────────────

export const PLANS: Record<PlanTier, PlanDefinition> = {
  FREE: {
    tier: 'FREE',
    name: 'Free',
    monthlyPaise: 0,
    yearlyPaise: 0,
    directCheckout: false,
    maxVaults: 5,
    maxStorageBytes: 100 * 1024 * 1024, // 100 MB
    maxTeamMembers: 1,
    apiAccess: false,
  },
  STARTER: {
    tier: 'STARTER',
    name: 'Starter',
    monthlyPaise: 9900,     // ₹99  (was ₹999, reduced 90%)
    yearlyPaise: 95040,     // ₹99 × 12 × 0.8 = ₹950.40
    directCheckout: true,
    maxVaults: 99,
    maxStorageBytes: 500 * 1024 * 1024, // 500 MB
    maxTeamMembers: 1,
    apiAccess: false,
  },
  PROFESSIONAL: {
    tier: 'PROFESSIONAL',
    name: 'Professional',
    monthlyPaise: 49900,    // ₹499  (was ₹4,999, reduced 90%)
    yearlyPaise: 479040,    // ₹499 × 12 × 0.8 = ₹4,790.40
    directCheckout: true,
    maxVaults: null,        // unlimited
    maxStorageBytes: 1024 * 1024 * 1024, // 1 GB
    maxTeamMembers: 10,
    apiAccess: true,
  },
  ENTERPRISE: {
    tier: 'ENTERPRISE',
    name: 'Enterprise',
    monthlyPaise: 99900,    // ₹999  (was ₹9,999, reduced 90%)
    yearlyPaise: 959040,    // ₹999 × 12 × 0.8 = ₹9,590.40
    directCheckout: true,
    maxVaults: null,
    maxStorageBytes: null,
    maxTeamMembers: null,
    apiAccess: true,
  },
  GOVERNMENT: {
    tier: 'GOVERNMENT',
    name: 'Government',
    monthlyPaise: 999900,   // ₹9,999  (was ₹99,999, reduced 90%)
    yearlyPaise: 9599040,   // ₹9,999 × 12 × 0.8 = ₹95,990.40
    directCheckout: false,  // Contact sales only
    maxVaults: null,
    maxStorageBytes: null,
    maxTeamMembers: null,
    apiAccess: true,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get the charge amount in paise for the given plan and billing interval.
 */
export function getPlanAmount(tier: PlanTier, interval: BillingInterval): number {
  const plan = PLANS[tier];
  return interval === 'YEARLY' ? plan.yearlyPaise : plan.monthlyPaise;
}

/**
 * Calculate the plan expiry date from *now* based on billing interval.
 */
export function getPlanExpiry(interval: BillingInterval): Date {
  const now = new Date();
  if (interval === 'YEARLY') {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  return now;
}

/**
 * Format paise to a human-readable INR string (e.g. 9900 → "₹99").
 */
export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Parse a PlanTier string safely; returns FREE on unknown values.
 */
export function parsePlanTier(raw: string | null | undefined): PlanTier {
  const valid: PlanTier[] = ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'GOVERNMENT'];
  if (raw && valid.includes(raw as PlanTier)) return raw as PlanTier;
  return 'FREE';
}

/**
 * Parse a BillingInterval string safely; returns MONTHLY on unknown values.
 */
export function parseBillingInterval(raw: string | null | undefined): BillingInterval {
  if (raw === 'YEARLY') return 'YEARLY';
  return 'MONTHLY';
}
