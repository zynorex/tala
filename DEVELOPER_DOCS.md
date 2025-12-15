# TALA Developer Documentation

Complete developer guide for setting up, understanding, and extending the TALA Vault system.

---

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [Environment Variables](#environment-variables)
5. [Architecture Overview](#architecture-overview)
6. [API Implementation](#api-implementation)
7. [Encryption System](#encryption-system)
8. [Authentication Flow](#authentication-flow)
9. [Testing Guide](#testing-guide)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)

---

## Development Setup

### Prerequisites

- **Node.js:** 18.17+
- **npm:** 9.0+
- **PostgreSQL:** 14+ (or use Prisma Accelerate for serverless)
- **Git:** 2.30+

### Initial Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd tala

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Initialize database
npx prisma generate
npx prisma migrate dev

# 5. Start development server
npm run dev
```

**Available Scripts:**

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write .",
  "type-check": "tsc --noEmit"
}
```

---

## Project Structure

```
tala/
├── app/                          # Next.js app directory
│   ├── api/
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── route.ts         # POST/GET/PUT /api/auth
│   │   │   └── login/
│   │   │       └── route.ts     # POST/GET /api/auth/login
│   │   └── vaults/              # Vault management endpoints
│   │       ├── route.ts         # POST/GET /api/vaults
│   │       └── [id]/
│   │           └── route.ts     # GET/PUT/DELETE /api/vaults/{id}
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   ├── providers/               # Context providers
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── lib/                          # Shared utilities
│   ├── auth/                    # Authentication utilities
│   │   ├── jwt.ts               # JWT token generation/verification
│   │   ├── schemas.ts           # Zod validation schemas
│   │   └── api-response.ts      # Response formatting
│   ├── crypto/                  # Cryptography
│   │   └── encryption.ts        # AES-256-GCM encryption
│   ├── vault/                   # Vault operations
│   │   └── vaultEncryption.ts   # Vault-specific encryption
│   ├── ipfs/                    # IPFS integration
│   ├── utils/                   # Utility functions
│   ├── validators/              # Input validation
│   ├── prisma.ts                # Prisma client singleton
│   └── generated/               # Generated files
│       └── prisma/              # Prisma client (auto-generated)
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Migration files
│
├── config/
│   └── wagmi.ts                 # Wagmi (Web3) configuration
│
├── contracts/
│   └── TALAVault.sol            # Smart contract
│
├── public/                       # Static assets
│
├── docs/
│   ├── API_DOCUMENTATION.md     # API reference
│   ├── IMPLEMENTATION_SUMMARY.md # Feature overview
│   ├── INTEGRATION_GUIDE.md     # Integration examples
│   └── DEVELOPER_DOCS.md        # This file
│
└── Configuration Files
    ├── next.config.ts           # Next.js configuration
    ├── tsconfig.json            # TypeScript configuration
    ├── tailwind.config.ts       # Tailwind CSS config
    ├── postcss.config.mjs       # PostCSS config
    ├── eslint.config.mjs        # ESLint configuration
    └── .env.local               # Environment variables (local)
```

---

## Database Schema

### User Model

```prisma
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
```

**Indexes:**
- `email` - Fast email lookups
- `walletAddress` - Web3 wallet lookups

**Usage:**
```typescript
// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    walletAddress: '0x...',
    username: 'johndoe',
    displayName: 'John Doe'
  }
});

// Find by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Get user with counts
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    _count: {
      select: { vaults: true, activityLogs: true }
    }
  }
});
```

### Vault Model

```prisma
model Vault {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  
  // Metadata
  name          String
  description   String?
  
  // Encryption
  encryptedData String
  keyHash       String
  fileHash      String
  
  // File info
  fileName      String
  fileSize      Int
  mimeType      String?
  
  // Status
  isActive      Boolean    @default(true)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  // Relations
  activityLogs  ActivityLog[]
}
```

**Indexes:**
- `userId` - User's vaults
- `createdAt` - Recent vaults

**Usage:**
```typescript
// Create vault
const vault = await prisma.vault.create({
  data: {
    userId: 'user-id',
    name: 'My Vault',
    description: 'Personal files',
    encryptedData: encryptedContent,
    keyHash: hashOfKey,
    fileHash: hashOfFile,
    fileName: 'documents.zip',
    fileSize: 1024000,
    mimeType: 'application/zip'
  }
});

// List user's vaults
const vaults = await prisma.vault.findMany({
  where: { 
    userId: 'user-id',
    isActive: true 
  },
  orderBy: { createdAt: 'desc' },
  take: 10
});

// Soft delete
const vault = await prisma.vault.update({
  where: { id: vaultId },
  data: { isActive: false }
});
```

### ActivityLog Model

```prisma
model ActivityLog {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  
  vaultId       String?
  vault         Vault?     @relation(fields: [vaultId], references: [id])
  
  // Action details
  action        String     // "view", "download", "update", "share", "delete"
  description   String?
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime   @default(now())
}
```

**Usage:**
```typescript
// Log activity
await prisma.activityLog.create({
  data: {
    userId: 'user-id',
    vaultId: 'vault-id',
    action: 'VAULT_CREATED',
    description: 'Created vault: My Vault',
    ipAddress: request.ip,
    userAgent: request.headers['user-agent']
  }
});

// Get audit trail
const logs = await prisma.activityLog.findMany({
  where: { userId: 'user-id' },
  orderBy: { createdAt: 'desc' },
  take: 50
});
```

### ApiKey Model

```prisma
model ApiKey {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  
  name          String
  keyHash       String     @unique
  
  isActive      Boolean    @default(true)
  lastUsedAt    DateTime?
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}
```

---

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tala"
# OR use Prisma Accelerate
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

# JWT
JWT_SECRET="your-super-secret-key-min-32-chars"

# Web3 / Blockchain
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="project-id"
NEXT_PUBLIC_TALA_VAULT_ADDRESS="0x..."
PRIVATE_KEY="private-key-for-smart-contract"

# IPFS / Pinata
NEXT_PUBLIC_PINATA_API_KEY="api-key"
NEXT_PUBLIC_PINATA_SECRET_API_KEY="secret-key"
NEXT_PUBLIC_PINATA_JWT="jwt-token"

# Optional
POLYGONSCAN_API_KEY="api-key-for-polygon-scan"
```

### Local Development (.env.local)

```env
# Use SQLite for local development (optional)
DATABASE_URL="file:./dev.db"

# Generate a strong JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-project-id"

# IPFS (get from Pinata)
NEXT_PUBLIC_PINATA_API_KEY="your-key"
NEXT_PUBLIC_PINATA_SECRET_API_KEY="your-secret"
NEXT_PUBLIC_PINATA_JWT="your-jwt"
```

### Environment Variable Security

- **Never commit `.env.local`** - Add to `.gitignore`
- **Use `.env.example`** - Document all required variables
- **Rotate secrets regularly** - Especially JWT_SECRET and API keys
- **Use different secrets per environment** - Dev, staging, production
- **Validate on startup** - Check all required vars are set

---

## Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                     Client Application                   │
│  (React Components, Hooks, Context)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes Layer                    │
│  - /api/auth (Registration, Login, Profile)             │
│  - /api/auth/login (Token verification)                 │
│  - /api/vaults (Create, List)                           │
│  - /api/vaults/{id} (Detail, Update, Delete)            │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
┌──────────┐  ┌─────────────┐  ┌──────────┐
│ Validation │  │ JWT Auth    │  │ Encryption │
│ (Zod)     │  │ Middleware  │  │ System   │
└──────────┘  └─────────────┘  └──────────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Prisma ORM            │
        │  (Database Abstraction) │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   PostgreSQL Database  │
        │  (Users, Vaults, Logs) │
        └────────────────────────┘
```

### Request Flow

```
1. Client Request
   ├─ POST /api/auth/login
   ├─ Headers: Content-Type, Authorization
   └─ Body: JSON data

2. API Route Handler
   ├─ Parse request body
   ├─ Validate with Zod schema
   └─ Return error if invalid

3. Authentication (if protected)
   ├─ Extract Bearer token from header
   ├─ Verify JWT signature
   ├─ Validate token expiry
   └─ Extract userId from payload

4. Authorization
   ├─ Check user permissions
   ├─ Verify resource ownership
   └─ Return 403 if unauthorized

5. Database Operation
   ├─ Query/create/update with Prisma
   ├─ Handle database errors
   └─ Return results

6. Response Formatting
   ├─ Use apiSuccess/apiError helpers
   ├─ Include timestamp
   └─ Return JSON with HTTP status

7. Client Receives
   ├─ Status code
   ├─ JSON response
   └─ Error details if failed
```

### Security Layers

```
Layer 1: Input Validation
├─ Zod schema validation
├─ Type coercion
└─ Error messages

Layer 2: Authentication
├─ JWT token verification
├─ Token expiry check
└─ Bearer token extraction

Layer 3: Authorization
├─ User ownership verification
├─ Permission checks
└─ Resource access control

Layer 4: Data Protection
├─ AES-256-GCM encryption
├─ PBKDF2 key derivation
└─ SHA-256 hashing

Layer 5: Audit Trail
├─ Activity logging
├─ IP address tracking
└─ User agent logging
```

---

## API Implementation

### Creating New Endpoints

**Step 1: Define Zod Schema**

```typescript
// lib/auth/schemas.ts
export const myEndpointSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  value: z.number().positive()
});
```

**Step 2: Create API Route**

```typescript
// app/api/myendpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { myEndpointSchema } from '@/lib/auth/schemas';
import { apiSuccess, apiError, handleValidationError, httpErrors } from '@/lib/auth/api-response';
import { verifyRequest } from '@/lib/auth/jwt';

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
    // 1. Verify authentication
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(httpErrors.unauthorized, { status: 401 });
    }

    // 2. Parse and validate input
    const body = await req.json();
    const validation = myEndpointSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(handleValidationError(validation.error), { status: 400 });
    }

    // 3. Database operation
    const db = await getPrisma();
    const result = await db.myModel.create({
      data: {
        userId: payload.userId,
        ...validation.data
      }
    });

    // 4. Return success response
    return NextResponse.json(apiSuccess(result), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      handleDbError(error),
      { status: 500 }
    );
  }
}
```

**Step 3: Test the Endpoint**

```bash
curl -X POST http://localhost:3000/api/myendpoint \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "value": 42}'
```

### Pagination Pattern

```typescript
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(httpErrors.unauthorized, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    const db = await getPrisma();

    // Get total count
    const total = await db.myModel.count({
      where: { userId: payload.userId }
    });

    // Get paginated results
    const data = await db.myModel.findMany({
      where: { userId: payload.userId },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(
      apiSuccess({
        data,
        pagination: {
          total,
          page,
          pageSize,
          pages: Math.ceil(total / pageSize)
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
```

---

## Encryption System

### Key Derivation

```typescript
import { deriveVaultKeyFromPassword } from '@/lib/vault/vaultEncryption';

// Derive key from password
const key = deriveVaultKeyFromPassword('userPassword123');
// Returns: { key: Buffer, keyHash: string, derivedFrom: 'password', createdAt: number }
```

### File Encryption

```typescript
import { encryptVaultFile, decryptVaultFile } from '@/lib/vault/vaultEncryption';

// Encrypt file
const fileBuffer = Buffer.from(fileContent);
const encrypted = encryptVaultFile(fileBuffer, key);
// Returns: { iv, ciphertext, authTag, algorithm }

// Decrypt file
const decrypted = decryptVaultFile(encrypted, key);
// Returns: Buffer
```

### Encryption Details

- **Algorithm:** AES-256-GCM
- **Key Size:** 256 bits
- **Nonce Size:** 96 bits (12 bytes)
- **Auth Tag Size:** 128 bits (16 bytes)
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **Hash Function:** SHA-256

**Implementation:**

```typescript
// From lib/crypto/encryption.ts
import crypto from 'crypto';

export function encryptWithAES256(
  plaintext: Buffer,
  key: Buffer,
  iv?: Buffer
): EncryptedData {
  const nonce = iv || crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  
  let ciphertext = cipher.update(plaintext);
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: nonce.toString('hex'),
    ciphertext: ciphertext.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decryptWithAES256(
  encrypted: EncryptedData,
  key: Buffer
): Buffer {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encrypted.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  
  let plaintext = decipher.update(Buffer.from(encrypted.ciphertext, 'hex'));
  plaintext = Buffer.concat([plaintext, decipher.final()]);
  
  return plaintext;
}
```

---

## Authentication Flow

### JWT Token Structure

```
Header (JOSE)
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload
{
  "userId": "user-uuid",
  "email": "user@example.com",
  "walletAddress": "0x...",
  "iat": 1702639800,
  "exp": 1703244600
}

Signature
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

### Token Generation

```typescript
import { generateToken } from '@/lib/auth/jwt';

const token = generateToken(
  userId,
  email,
  walletAddress
);
// Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Token Verification

```typescript
import { verifyToken } from '@/lib/auth/jwt';

const payload = verifyToken(token);
// Returns: { userId, email, walletAddress, iat, exp }
```

### Middleware Usage

```typescript
import { verifyRequest } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const payload = verifyRequest(req);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // payload contains: { userId, email, walletAddress }
}
```

---

## Testing Guide

### Unit Tests

```typescript
// Example: Testing encryption
import { encryptWithAES256, decryptWithAES256 } from '@/lib/crypto/encryption';

describe('Encryption', () => {
  it('should encrypt and decrypt data', () => {
    const key = Buffer.alloc(32); // 256-bit key
    const plaintext = Buffer.from('Hello, World!');
    
    const encrypted = encryptWithAES256(plaintext, key);
    const decrypted = decryptWithAES256(encrypted, key);
    
    expect(decrypted.toString()).toBe('Hello, World!');
  });

  it('should produce different ciphertexts for same plaintext', () => {
    const key = Buffer.alloc(32);
    const plaintext = Buffer.from('Test');
    
    const encrypted1 = encryptWithAES256(plaintext, key);
    const encrypted2 = encryptWithAES256(plaintext, key);
    
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
  });
});
```

### API Tests

```typescript
// Example: Testing authentication endpoint
describe('POST /api/auth', () => {
  it('should register new user', async () => {
    const res = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        walletAddress: '0x...',
        username: 'testuser',
        displayName: 'Test User'
      })
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.email).toBe('test@example.com');
  });

  it('should reject duplicate email', async () => {
    // Create first user
    await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        email: 'duplicate@example.com',
        walletAddress: '0x1...',
        username: 'user1',
        displayName: 'User 1'
      })
    });

    // Try to create duplicate
    const res = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        email: 'duplicate@example.com',
        walletAddress: '0x2...',
        username: 'user2',
        displayName: 'User 2'
      })
    });

    expect(res.status).toBe(409);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Use production PostgreSQL database
- [ ] Configure Prisma Accelerate for serverless
- [ ] Set up environment variables for production
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable request logging
- [ ] Configure backups
- [ ] Set up monitoring/alerting
- [ ] Review security headers
- [ ] Test authentication flow
- [ ] Test encryption/decryption
- [ ] Load test API endpoints
- [ ] Set up CI/CD pipeline

### Vercel Deployment

```bash
# 1. Connect to Vercel
vercel link

# 2. Set environment variables
vercel env add JWT_SECRET
vercel env add DATABASE_URL

# 3. Deploy
vercel deploy --prod

# 4. Verify deployment
curl https://your-app.vercel.app/api/health
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

```bash
# Build image
docker build -t tala:latest .

# Run container
docker run -e DATABASE_URL="..." -e JWT_SECRET="..." -p 3000:3000 tala:latest
```

---

## Troubleshooting

### Common Issues

#### "PrismaClientInitializationError"

**Problem:** Prisma client fails to initialize during build

**Solution:**
```typescript
// Use lazy loading
let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}
```

#### "JWT token invalid or expired"

**Problem:** Token verification fails

**Debug:**
```typescript
const token = localStorage.getItem('tala_auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
console.log('Now:', new Date());
```

#### "DATABASE_URL is not set"

**Problem:** Database connection not configured

**Solution:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify DATABASE_URL is set
echo $DATABASE_URL

# If using PostgreSQL locally
DATABASE_URL="postgresql://user:password@localhost:5432/tala"

# If using Prisma Accelerate
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
```

#### "CORS error when calling API"

**Problem:** Cross-origin requests blocked

**Solution:**
```typescript
// app/api/route.ts
export async function POST(req: NextRequest) {
  // Next.js automatically allows same-origin requests
  // For external domains, check middleware
}
```

### Debug Mode

```typescript
// Enable debug logging
process.env.DEBUG = 'prisma:*';

// Log JWT operations
console.log('Token payload:', payload);

// Log database queries
// Set datasource to log = ["query"]
```

---

## Contributing

### Code Style

```typescript
// Use const by default
const value = 5;

// Use arrow functions
const getData = async () => {};

// Use async/await
const result = await fetchData();

// Add type annotations
const user: User = { id: '1', name: 'John' };

// Use meaningful names
const getUserVaults = async (userId: string) => {};
```

### Commit Messages

```
Format: <type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code restructuring
- test: Tests
- chore: Build/dependencies

Examples:
- feat: add vault encryption endpoint
- fix: handle edge case in JWT verification
- docs: update API documentation
- refactor: simplify error handling
```

### Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style
3. Test thoroughly
4. Update documentation
5. Push to branch: `git push origin feature/your-feature`
6. Create PR with description
7. Address review comments
8. Squash commits if needed
9. Merge when approved

### Branch Naming

```
feature/user-authentication
fix/jwt-token-expiry
docs/api-documentation
refactor/encryption-system
```

---

## Additional Resources

### Official Documentation

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs/
- **Zod:** https://zod.dev
- **TypeScript:** https://www.typescriptlang.org/docs/

### Security Resources

- **OWASP:** https://owasp.org/www-community/
- **JWT Best Practices:** https://tools.ietf.org/html/rfc8949
- **Encryption:** https://crypto.stackexchange.com/

### Tools

- **Postman:** https://www.postman.com/
- **VS Code Extensions:** ESLint, Prettier, Thunder Client
- **Terminal:** PowerShell or bash with curl

---

## Support & Contact

- **Issues:** Create GitHub issue
- **Email:** support@tala.io
- **Discord:** Join community server
- **Documentation:** https://docs.tala.io

---

**Last Updated:** December 15, 2025
**Version:** 1.0.0
**Maintained By:** TALA Development Team
