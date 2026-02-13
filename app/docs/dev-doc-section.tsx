'use client';

import { useState } from 'react';
import { Check, ChevronDown, Copy } from 'lucide-react';

type Snippet = {
  label: string;
  lang: string;
  code: string;
};

type Section = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  steps?: string[];
  snippets?: Snippet[];
};

const sections: Section[] = [
  {
    id: 'setup',
    title: 'Environment setup',
    icon: '🧭',
    summary: 'Install dependencies, create your env file, and run the workspace.',
    steps: [
      'Clone the repository and install packages with npm install.',
      'Copy .env.example to .env.local and fill secrets.',
      'Run prisma generate and prisma migrate dev to prepare the database.',
      'Start the dev server with npm run dev.',
    ],
    snippets: [
      {
        label: 'Install and prepare',
        lang: 'bash',
        code: `git clone https://github.com/your-org/tala
cd TALA
npm install
cp .env.example .env.local
npx prisma generate
npx prisma migrate dev
npm run dev`,
      },
    ],
  },
  {
    id: 'data',
    title: 'Prisma models',
    icon: '🗄️',
    summary: 'Base models for users and vaults with audit friendly fields.',
    snippets: [
      {
        label: 'User model',
        lang: 'prisma',
        code: `model User {
  id            String   @id @default(cuid())
  email         String   @unique
  walletAddress String?  @unique
  displayName   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  vaults        Vault[]
}`,
      },
      {
        label: 'Vault model',
        lang: 'prisma',
        code: `model Vault {
  id            String   @id @default(cuid())
  userId        String
  name          String
  description   String?
  encryptedData String
  keyHash       String
  fileHash      String
  unlockAt      DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id])
}`,
      },
    ],
  },
  {
    id: 'api',
    title: 'Route pattern',
    icon: '🛰️',
    summary: 'Authenticated handler with validation, persistence, and structured replies.',
    snippets: [
      {
        label: 'POST example',
        lang: 'typescript',
        code: `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { httpErrors, apiSuccess } from '@/lib/auth/api-response';
import { verifyRequest } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

const payloadSchema = z.object({
  name: z.string().min(3),
  unlockAt: z.number(),
  cid: z.string(),
});

export async function POST(req: NextRequest) {
  const auth = verifyRequest(req);
  if (!auth) return NextResponse.json(httpErrors.unauthorized, { status: 401 });

  const body = await req.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(httpErrors.badRequest(parsed.error.format()), { status: 400 });
  }

  const vault = await prisma.vault.create({
    data: { ...parsed.data, userId: auth.userId },
  });

  return NextResponse.json(apiSuccess(vault), { status: 201 });
}`,
      },
    ],
  },
  {
    id: 'encryption',
    title: 'Client encryption',
    icon: '🔐',
    summary: 'Create an AES 256 key in the browser, encrypt, and clear secrets after upload.',
    snippets: [
      {
        label: 'Encrypt and decrypt',
        lang: 'typescript',
        code: `import { encryptWithAES256, decryptWithAES256 } from '@/lib/crypto/encryption';

const message = Buffer.from('Confidential exam set');
const key = crypto.getRandomValues(new Uint8Array(32));

const encrypted = encryptWithAES256(message, key);
const decrypted = decryptWithAES256(encrypted, key);

console.log(decrypted.toString());`,
      },
    ],
  },
  {
    id: 'auth',
    title: 'JWT guard',
    icon: '🔑',
    summary: 'Issue signed tokens and guard routes with a shared verifier.',
    snippets: [
      {
        label: 'Sign and verify',
        lang: 'typescript',
        code: `import { generateToken, verifyToken } from '@/lib/auth/jwt';

const token = generateToken('user-123', 'alice@example.com');
const payload = verifyToken(token);

if (!payload) throw new Error('token invalid');
console.log(payload.userId);`,
      },
    ],
  },
  {
    id: 'testing',
    title: 'Fast checks',
    icon: '🧪',
    summary: 'Hit critical endpoints with curl to validate the flow.',
    snippets: [
      {
        label: 'Create vault',
        lang: 'bash',
        code: `curl -X POST http://localhost:3000/api/vaults \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "bafy...",
    "unlockAt": 1893456000,
    "name": "Exam Set A"
  }'`,
      },
      {
        label: 'Check status',
        lang: 'bash',
        code: `curl -X GET http://localhost:3000/api/vaults/vault-123/status \
  -H "Authorization: Bearer <token>"`,
      },
    ],
  },
];

export function DevDocSection() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['setup']));
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <section className="space-y-4">
      {sections.map((section) => {
        const open = expanded.has(section.id);
        return (
          <div key={section.id} className="rounded-2xl border-4 border-black bg-white shadow-brutal">
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              onClick={() => toggle(section.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  {section.icon}
                </span>
                <div>
                  <p className="text-lg font-black text-black">{section.title}</p>
                  <p className="text-sm text-black/70">{section.summary}</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="border-t-4 border-black px-5 py-4 space-y-4">
                {section.steps && (
                  <ol className="list-inside list-decimal space-y-2 text-sm text-black/80">
                    {section.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}

                {section.snippets && (
                  <div className="space-y-3">
                    {section.snippets.map((snippet) => (
                      <div key={snippet.label} className="rounded-xl border-3 border-black bg-cream p-3">
                        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.12em] text-black/70">
                          <span>{snippet.label}</span>
                          <span>{snippet.lang}</span>
                        </div>
                        <div className="relative">
                          <pre className="overflow-x-auto whitespace-pre-wrap bg-white p-3 text-xs text-black/90 border-2 border-black rounded-lg"><code>{snippet.code}</code></pre>
                          <button
                            onClick={() => copy(snippet.code)}
                            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded border-2 border-black bg-white px-2 py-1 text-[11px] font-black text-black"
                          >
                            {copiedCode === snippet.code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedCode === snippet.code ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

