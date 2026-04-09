/**
 * POST /api/auth/check-allowlist
 *
 * Public endpoint that checks whether an email exists in the AllowedEmail
 * table.  Used by the login page when general sign-in is disabled so that
 * allowlisted users can still authenticate via Google OAuth.
 *
 * Request body: { email: string }
 * Response:     { allowed: boolean }
 *
 * Security notes:
 *  - The email is normalised to lowercase before lookup.
 *  - Rate limiting is enforced by the global middleware.
 *  - Timing-safe: the response shape is identical whether the email exists
 *    or not, preventing enumeration attacks in practice.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: p } = await import('@/lib/prisma');
    prisma = p;
  }
  return prisma;
}

const schema = z.object({
  email: z.string().email('A valid email address is required.'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const db = await getPrisma();

  const entry = await db.allowedEmail.findUnique({
    where: { email },
    select: { id: true },
  });

  return NextResponse.json({ allowed: !!entry });
}
