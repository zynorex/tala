git clone <repo-url>
type CreateUserData = z.infer<typeof createUserSchema>;
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
        code: `git clone <repo-url>
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
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const copy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="overflow-hidden rounded-sm border-4 border-black bg-white shadow-brutal hover:shadow-brutal-lg transition-shadow"
        >
          <button
            onClick={() => toggle(section.id)}
            className="flex w-full items-center justify-between bg-white px-6 py-4 transition-colors hover:bg-gray-100"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="text-xl font-black">{section.title}</h3>
                <p className="text-sm text-black/70">{section.summary}</p>
              </div>
            </div>
            <ChevronDown
              size={24}
              className={`text-black transition-transform ${expanded.has(section.id) ? 'rotate-180' : ''}`}
            />
          </button>

          {expanded.has(section.id) && (
            <div className="space-y-4 border-t-4 border-black bg-gray-50 px-6 py-5">
              {section.steps && (
                <ul className="space-y-2 text-sm text-black/80">
                  {section.steps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.snippets && section.snippets.map((snippet, idx) => {
                const codeId = `${section.id}-${idx}`;
                return (
                  <div key={codeId} className="overflow-hidden rounded-sm border-3 border-black bg-black shadow-brutal">
                    <div className="flex items-center justify-between border-b-3 border-black bg-black px-4 py-2">
                      <span className="text-sm font-mono font-bold text-white">{snippet.label}</span>
                      <button
                        onClick={() => copy(snippet.code, codeId)}
                        className="flex items-center gap-2 rounded-sm bg-orange-500 px-3 py-1 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                      >
                        {copiedCode === codeId ? (
                          <>
                            <Check size={16} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto bg-black px-4 py-3 text-sm text-white"><code>{snippet.code}</code></pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

