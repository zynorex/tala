# TALA Developer Quick Reference

Fast lookup guide for common development tasks.

---

## File Locations Quick Reference

```
lib/auth/
  ├── jwt.ts           → generateToken, verifyToken, verifyRequest
  ├── schemas.ts       → Zod validation schemas
  └── api-response.ts  → apiSuccess, apiError, httpErrors

lib/crypto/
  └── encryption.ts    → encryptWithAES256, decryptWithAES256

lib/vault/
  └── vaultEncryption.ts → encryptVaultFile, decryptVaultFile

app/api/
  ├── auth/
  │   ├── route.ts     → POST/GET/PUT /api/auth
  │   └── login/
  │       └── route.ts → POST/GET /api/auth/login
  └── vaults/
      ├── route.ts     → POST/GET /api/vaults
      └── [id]/
          └── route.ts → GET/PUT/DELETE /api/vaults/{id}

prisma/
  └── schema.prisma   → Database schema definitions
```

---

## Common API Patterns

### Protected Route Template

```typescript
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

    // 3. Get database
    const db = await getPrisma();

    // 4. Database operation
    const result = await db.model.create({
      data: { userId: payload.userId, ...validation.data }
    });

    // 5. Return success
    return NextResponse.json(apiSuccess(result), { status: 201 });
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
```

### Creating Zod Schema

```typescript
import { z } from 'zod';

export const mySchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1).max(255),
  age: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([])
});

// Type inference
type MyData = z.infer<typeof mySchema>;
```

### Error Handling Pattern

```typescript
// Manual errors
return NextResponse.json(
  { success: false, error: 'Custom error', timestamp: new Date().toISOString() },
  { status: 400 }
);

// Using helpers
return NextResponse.json(httpErrors.badRequest, { status: 400 });
return NextResponse.json(httpErrors.unauthorized, { status: 401 });
return NextResponse.json(httpErrors.notFound, { status: 404 });
return NextResponse.json(httpErrors.serverError, { status: 500 });
```

---

## Database Operations

### Create

```typescript
const db = await getPrisma();

const user = await db.user.create({
  data: {
    email: 'user@example.com',
    username: 'username'
  },
  select: { id: true, email: true } // Return only these fields
});
```

### Read

```typescript
// Find unique
const user = await db.user.findUnique({
  where: { email: 'user@example.com' }
});

// Find many
const users = await db.user.findMany({
  where: { isActive: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0
});

// Count
const total = await db.user.count({
  where: { isActive: true }
});
```

### Update

```typescript
const user = await db.user.update({
  where: { id: userId },
  data: {
    displayName: 'New Name',
    bio: 'New bio'
  }
});

// Update many
await db.vault.updateMany({
  where: { userId },
  data: { isActive: false }
});
```

### Delete

```typescript
// Hard delete
await db.vault.delete({
  where: { id: vaultId }
});

// Soft delete
await db.vault.update({
  where: { id: vaultId },
  data: { isActive: false }
});
```

### Relations

```typescript
// Include related data
const user = await db.user.findUnique({
  where: { id: userId },
  include: {
    vaults: true,
    activityLogs: { take: 10 }
  }
});

// Count relations
const user = await db.user.findUnique({
  where: { id: userId },
  include: {
    _count: {
      select: {
        vaults: true,
        activityLogs: true
      }
    }
  }
});
```

---

## Encryption Utilities

### Import Functions

```typescript
import {
  encryptWithAES256,
  decryptWithAES256,
  hashData,
  generateEncryptionKey,
  deriveVaultKeyFromPassword
} from '@/lib/crypto/encryption';

import {
  encryptVaultFile,
  decryptVaultFile,
  generateVaultKey,
  deriveVaultKeyFromPassword
} from '@/lib/vault/vaultEncryption';
```

### Encrypt/Decrypt

```typescript
// Generate key
const key = generateEncryptionKey(); // Random key
const keyFromPassword = deriveVaultKeyFromPassword('password'); // Password-based

// Encrypt
const plaintext = Buffer.from('Secret data');
const encrypted = encryptWithAES256(plaintext, key.key);
// Returns: { iv, ciphertext, authTag, algorithm }

// Decrypt
const decrypted = decryptWithAES256(encrypted, key.key);
// Returns: Buffer
```

### Hashing

```typescript
import crypto from 'crypto';

// Hash password
const passwordHash = crypto
  .createHash('sha256')
  .update('password')
  .digest('hex');

// Hash file
const fileHash = crypto
  .createHash('sha256')
  .update(fileContent)
  .digest('hex');

// Verify hash
const isValid = fileHash === storedHash;
```

---

## JWT Operations

### Generate Token

```typescript
import { generateToken } from '@/lib/auth/jwt';

const token = generateToken(
  userId,        // Required: UUID
  email,         // Optional: user email
  walletAddress  // Optional: web3 wallet
);
// Returns: JWT string valid for 7 days
```

### Verify Token

```typescript
import { verifyToken } from '@/lib/auth/jwt';

try {
  const payload = verifyToken(token);
  console.log(payload.userId); // Extract userId
} catch (error) {
  console.log('Invalid token'); // Token expired or invalid
}
```

### Use in Route

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
  
  // payload.userId, payload.email, payload.walletAddress available
}
```

---

## Validation Schemas

### Create Custom Schema

```typescript
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false)
});

// Use in handler
const validation = createPostSchema.safeParse(req.body);
if (!validation.success) {
  return handleValidationError(validation.error);
}
```

### Common Validators

```typescript
// String
z.string().email()
z.string().url()
z.string().uuid()
z.string().regex(/pattern/)
z.string().min(5).max(100)

// Number
z.number().int()
z.number().positive()
z.number().min(0).max(100)

// Date
z.date()
z.string().datetime()

// Array
z.array(z.string())
z.array(z.object({ ... }))

// Object
z.object({ field: z.string() })
z.record(z.string(), z.number())

// Optional/Default
z.string().optional()
z.string().default('value')
z.string().nullable()
```

---

## HTTP Status Codes

| Code | Use Case | Helper |
|------|----------|--------|
| 200 | Success | apiSuccess() |
| 201 | Created | apiSuccess(data, 201) |
| 400 | Bad request | httpErrors.badRequest |
| 401 | Unauthorized | httpErrors.unauthorized |
| 403 | Forbidden | httpErrors.forbidden |
| 404 | Not found | httpErrors.notFound |
| 409 | Conflict (duplicate) | httpErrors.conflict |
| 500 | Server error | httpErrors.serverError |

---

## Pagination Pattern

```typescript
const url = new URL(req.url);
const page = parseInt(url.searchParams.get('page') || '1');
const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '10'), 100);
const skip = (page - 1) * pageSize;

const total = await db.model.count({ where: {...} });
const data = await db.model.findMany({
  where: {...},
  skip,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
});

return NextResponse.json(apiSuccess({
  data,
  pagination: {
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize)
  }
}));
```

---

## Debugging Commands

```bash
# TypeScript check
npm run type-check

# Lint code
npm run lint
npm run lint -- --fix

# Format code
npm run format

# Build test
npm run build

# Run in debug mode
NODE_OPTIONS='--inspect-brk' npm run dev

# Check dependencies
npm ls

# Update all packages
npm update

# Audit security
npm audit
npm audit fix
```

---

## Testing Commands

```bash
# Register test user
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","walletAddress":"0x123...","username":"test","displayName":"Test"}'

# Get auth token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' | jq '.data.token'

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/auth
```

---

## Environment Variables Cheat Sheet

```env
# Required
DATABASE_URL=              # PostgreSQL connection
JWT_SECRET=                # Min 32 chars

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=  # From WalletConnect
NEXT_PUBLIC_TALA_VAULT_ADDRESS=        # Smart contract address
PRIVATE_KEY=               # For contract interactions

# IPFS
NEXT_PUBLIC_PINATA_API_KEY=
NEXT_PUBLIC_PINATA_SECRET_API_KEY=
NEXT_PUBLIC_PINATA_JWT=

# Optional
POLYGONSCAN_API_KEY=       # For block explorer
NODE_ENV=                  # development, production
```

---

## Prisma CLI Commands

```bash
# Generate client
npx prisma generate

# Migration workflows
npx prisma migrate dev --name "add feature"    # Create & apply
npx prisma migrate deploy                       # Apply to prod
npx prisma migrate status                       # Check status
npx prisma migrate reset                        # Reset (⚠️ deletes all)

# Visualization
npx prisma studio                               # Open Prisma Studio
npx prisma db seed                              # Run seeds

# Debugging
npx prisma db execute --stdin < query.sql      # Execute raw SQL
npx prisma validate                             # Validate schema
```

---

## VS Code Keyboard Shortcuts

```
Ctrl+Shift+P    Command palette
Ctrl+F          Find
Ctrl+H          Replace
Ctrl+/          Comment
Shift+Alt+F     Format document
F12             Go to definition
Ctrl+G          Go to line
Ctrl+Shift+L    Select all occurrences
Alt+Up/Down     Move line
Shift+Alt+Up/Down  Duplicate line
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Check status
git status

# Stage changes
git add .
git add file.ts              # Stage specific file

# Commit
git commit -m "feat: description"

# Push
git push origin feature/my-feature

# Create PR on GitHub

# Update from main
git fetch origin
git rebase origin/main       # Or merge

# Clean up
git branch -d feature/my-feature  # Local
git push origin --delete feature/my-feature  # Remote
```

---

## Performance Tips

```typescript
// ❌ Avoid N+1 queries
const users = await db.user.findMany();
for (const user of users) {
  const vaults = await db.vault.findMany({ where: { userId: user.id } });
}

// ✅ Use include/relations
const users = await db.user.findMany({
  include: { vaults: true }
});

// ❌ Select unnecessary fields
const users = await db.user.findMany();

// ✅ Use select for specific fields
const users = await db.user.findMany({
  select: { id: true, email: true }
});

// ❌ No pagination on large datasets
const allUsers = await db.user.findMany();

// ✅ Always paginate
const users = await db.user.findMany({ skip: 0, take: 10 });
```

---

## Security Checklist

- [ ] Never commit `.env.local` or secrets
- [ ] Validate all user input with Zod
- [ ] Use `verifyRequest()` on protected routes
- [ ] Check ownership before operations
- [ ] Hash sensitive data (passwords, keys)
- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET (32+ chars)
- [ ] Log security events
- [ ] Rate limit public endpoints
- [ ] Escape user input in responses

---

## Common Errors & Fixes

| Error | Solution |
|-------|----------|
| `DATABASE_URL is not set` | Add to `.env.local` |
| `JWT token invalid` | Check JWT_SECRET matches |
| `Module not found` | Run `npm install` & `npx prisma generate` |
| `Port 3000 in use` | `lsof -i :3000` then `kill -9 <PID>` |
| `TypeScript errors` | Run `npm run type-check` |
| `Prisma client outdated` | Run `npx prisma generate` |
| `CORS error` | Check headers and CORS config |
| `Infinite loop in hooks` | Add dependencies to useEffect |

---

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Zod Docs](https://zod.dev)
- [JWT Info](https://jwt.io)
- [OWASP Security](https://owasp.org)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Last Updated:** December 15, 2025
**Version:** 1.0.0
