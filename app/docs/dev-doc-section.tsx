'use client';

import { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';

const devDocSections = [
  {
    id: 'setup',
    title: 'Development Setup',
    icon: '🚀',
    content: `
## Quick Start (5 minutes)

\`\`\`bash
# Clone and install
git clone <repo-url>
cd TALA
npm install

# Setup environment
cp .env.example .env.local

# Database setup
npx prisma generate
npx prisma migrate dev

# Start development
npm run dev
\`\`\`

Visit http://localhost:3000 and you're ready!

## Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+ or Prisma Accelerate
- Git 2.30+
    `
  },
  {
    id: 'database',
    title: 'Database Schema',
    icon: '🗄️',
    content: `
## User Model
\`\`\`typescript
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  walletAddress String?    @unique
  username      String?    @unique
  displayName   String?
  
  // Profile
  avatarUrl     String?
  bio           String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  // Relations
  vaults        Vault[]
  activityLogs  ActivityLog[]
  apiKeys       ApiKey[]
}
\`\`\`

## Vault Model
\`\`\`typescript
model Vault {
  id            String     @id @default(cuid())
  userId        String
  name          String
  description   String?
  
  encryptedData String
  keyHash       String
  fileHash      String
  
  isActive      Boolean    @default(true)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  activityLogs  ActivityLog[]
}
\`\`\`
    `
  },
  {
    id: 'api',
    title: 'API Implementation',
    icon: '🔌',
    content: `
## Protected Route Pattern

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { mySchema } from '@/lib/auth/schemas';
import { apiSuccess, handleValidationError, httpErrors } from '@/lib/auth/api-response';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const payload = verifyRequest(req);
    if (!payload) return NextResponse.json(httpErrors.unauthorized, { status: 401 });

    // 2. Validate input
    const body = await req.json();
    const validation = mySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(handleValidationError(validation.error), { status: 400 });
    }

    // 3. Database operation
    const db = await getPrisma();
    const result = await db.model.create({
      data: { userId: payload.userId, ...validation.data }
    });

    // 4. Return success
    return NextResponse.json(apiSuccess(result), { status: 201 });
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
\`\`\`
    `
  },
  {
    id: 'encryption',
    title: 'Encryption System',
    icon: '🔐',
    content: `
## Key Derivation

\`\`\`typescript
import { deriveVaultKeyFromPassword } from '@/lib/vault/vaultEncryption';

const key = deriveVaultKeyFromPassword('password123');
// Returns: { key: Buffer, keyHash: string, derivedFrom: 'password' }
\`\`\`

## Encrypt/Decrypt

\`\`\`typescript
import { encryptWithAES256, decryptWithAES256 } from '@/lib/crypto/encryption';

// Encrypt
const plaintext = Buffer.from('Secret data');
const encrypted = encryptWithAES256(plaintext, key.key);
// Returns: { iv, ciphertext, authTag, algorithm }

// Decrypt
const decrypted = decryptWithAES256(encrypted, key.key);
\`\`\`

## Security Details
- **Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 (100,000 iterations)
- **Hash:** SHA-256
- **Nonce Size:** 96 bits
- **Auth Tag:** 128 bits
    `
  },
  {
    id: 'authentication',
    title: 'JWT Authentication',
    icon: '🔑',
    content: `
## Generate Token

\`\`\`typescript
import { generateToken } from '@/lib/auth/jwt';

const token = generateToken(userId, email, walletAddress);
// Token valid for 7 days
// Algorithm: HS256
\`\`\`

## Verify Token

\`\`\`typescript
import { verifyToken } from '@/lib/auth/jwt';

const payload = verifyToken(token);
// Returns: { userId, email, walletAddress, iat, exp }
\`\`\`

## Use in Routes

\`\`\`typescript
import { verifyRequest } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const payload = verifyRequest(req);
  
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Access: payload.userId, payload.email, payload.walletAddress
}
\`\`\`
    `
  },
  {
    id: 'validation',
    title: 'Input Validation (Zod)',
    icon: '✓',
    content: `
## Create Schema

\`\`\`typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3).max(20),
  displayName: z.string().min(1).max(100),
  walletAddress: z.string().optional()
});

// Type inference
type CreateUserData = z.infer<typeof createUserSchema>;
\`\`\`

## Use in Handlers

\`\`\`typescript
const validation = createUserSchema.safeParse(body);

if (!validation.success) {
  return NextResponse.json(
    handleValidationError(validation.error),
    { status: 400 }
  );
}

const { email, username, displayName } = validation.data;
\`\`\`
    `
  },
  {
    id: 'testing',
    title: 'Testing & API',
    icon: '🧪',
    content: `
## API Testing with cURL

\`\`\`bash
# Register user
curl -X POST http://localhost:3000/api/auth \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "walletAddress": "0x...",
    "username": "testuser",
    "displayName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test@example.com"}'

# Get profile (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \\
  http://localhost:3000/api/auth
\`\`\`

## HTTP Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Server Error
    `
  },
  {
    id: 'environment',
    title: 'Environment Variables',
    icon: '⚙️',
    content: `
## Required Variables

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/TALA"
# OR
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

# JWT
JWT_SECRET="min-32-characters-long-secret-key"

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="project-id"
NEXT_PUBLIC_TALA_VAULT_ADDRESS="0x..."
PRIVATE_KEY="private-key"

# IPFS
NEXT_PUBLIC_PINATA_API_KEY="api-key"
NEXT_PUBLIC_PINATA_SECRET_API_KEY="secret"
NEXT_PUBLIC_PINATA_JWT="jwt"
\`\`\`

## Generate JWT Secret

\`\`\`bash
# Using OpenSSL
openssl rand -base64 32

# Using Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`
    `
  }
];

export function DevDocSection() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['setup'])
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const extractCodeBlocks = (text: string) => {
    const parts: (string | { type: 'code'; lang: string; code: string })[] = [];
    let lastIndex = 0;
    const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push({
        type: 'code',
        lang: match[1] || 'text',
        code: match[2].trim()
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="space-y-4">
      {devDocSections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className="bg-white border-4 border-black rounded-sm overflow-hidden shadow-brutal hover:shadow-brutal-lg transition-shadow"
        >
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors bg-white"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{section.icon}</span>
              <h3 className="text-xl font-black text-black font-mono">{section.title}</h3>
            </div>
            <ChevronDown
              size={24}
              className={`text-black transition-transform ${
                expandedSections.has(section.id) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Section Content */}
          {expandedSections.has(section.id) && (
            <div className="border-t-4 border-black px-6 py-4 bg-gray-50">
              <div className="space-y-4">
                {extractCodeBlocks(section.content).map((part, index) => {
                  if (typeof part === 'string') {
                    return (
                      <div key={index} className="text-gray-800 space-y-2">
                        {part.split('\n').map((line, i) => {
                          if (line.startsWith('## ')) {
                            return (
                              <h4 key={i} className="text-lg font-black text-black mt-3 mb-2 font-mono">
                                {line.slice(3)}
                              </h4>
                            );
                          } else if (line.startsWith('- ')) {
                            return (
                              <li key={i} className="ml-6 font-medium">
                                {line.slice(2)}
                              </li>
                            );
                          } else if (line.startsWith('**') && line.includes(':**')) {
                            const [label, content] = line.split(':**');
                            return (
                              <p key={i} className="font-medium">
                                <strong>{label.slice(2)}:</strong>
                                {content}
                              </p>
                            );
                          }
                          return line ? <p key={i} className="font-medium">{line}</p> : null;
                        })}
                      </div>
                    );
                  } else if (part.type === 'code') {
                    const codeId = `${section.id}-code-${index}`;
                    return (
                      <div key={index} className="bg-black rounded-sm my-4 overflow-hidden border-3 border-black shadow-brutal">
                        <div className="flex items-center justify-between px-4 py-2 bg-black border-b-3 border-black">
                          <span className="text-sm text-white font-mono font-bold">{part.lang || 'code'}</span>
                          <button
                            onClick={() => copyToClipboard(part.code, codeId)}
                            className="flex items-center gap-2 px-3 py-1 rounded-sm bg-orange-500 hover:bg-orange-600 text-white text-sm transition-colors font-bold"
                          >
                            {copiedCode === codeId ? (
                              <>
                                <Check size={16} />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="px-4 py-3 overflow-x-auto text-sm text-white font-mono bg-black">
                          <code>{part.code}</code>
                        </pre>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

