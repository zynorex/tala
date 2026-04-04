/**
 * POST /api/admin/allowlist   — Add an email to the login allowlist
 * GET  /api/admin/allowlist   — List all allowed emails
 * DELETE /api/admin/allowlist — Remove an email from the allowlist
 *
 * All endpoints require a valid admin JWT (issued by /api/admin/login).
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: p } = await import('@/lib/prisma');
    prisma = p;
  }
  return prisma;
}

/** Verify the admin JWT and return the decoded payload, or null. */
function verifyAdminToken(req: NextRequest): { sub: string; role: string } | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as any;
    if (decoded.role !== 'admin' || decoded.type !== 'admin_session') return null;
    return { sub: decoded.sub, role: decoded.role };
  } catch {
    return null;
  }
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const addSchema = z.object({
  email: z.string().email('A valid email address is required.'),
  note: z.string().max(200).optional(),
});

const removeSchema = z.object({
  email: z.string().email('A valid email address is required.'),
});

// ─── GET — list all allowed emails ────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getPrisma();

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));
  const search = url.searchParams.get('search')?.trim();

  const where = search
    ? { email: { contains: search, mode: 'insensitive' as const } }
    : {};

  const [items, total] = await Promise.all([
    db.allowedEmail.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.allowedEmail.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, limit });
}

// ─── POST — add email to allowlist ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { email, note } = parsed.data;
  const db = await getPrisma();

  // Idempotent — if the email already exists, return it.
  const existing = await db.allowedEmail.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json(
      { message: 'Email is already on the allowlist.', entry: existing },
      { status: 200 },
    );
  }

  const entry = await db.allowedEmail.create({
    data: {
      email: email.toLowerCase(),
      note: note ?? null,
      addedBy: admin.sub,
    },
  });

  return NextResponse.json({ message: 'Email added.', entry }, { status: 201 });
}

// ─── DELETE — remove email from allowlist ─────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = removeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { email } = parsed.data;
  const db = await getPrisma();

  const existing = await db.allowedEmail.findUnique({ where: { email: email.toLowerCase() } });
  if (!existing) {
    return NextResponse.json({ error: 'Email not found on the allowlist.' }, { status: 404 });
  }

  await db.allowedEmail.delete({ where: { id: existing.id } });

  return NextResponse.json({ message: 'Email removed from the allowlist.' });
}
