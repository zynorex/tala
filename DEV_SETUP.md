# TALA Development Environment Setup

Complete guide for setting up your local development environment.

## Quick Start (5 minutes)

```bash
# Clone and install
git clone <repo-url>
cd tala
npm install

# Setup environment
cp .env.example .env.local

# Database setup
npx prisma generate
npx prisma migrate dev

# Start development
npm run dev

# Visit http://localhost:3000
```

---

## Detailed Setup Steps

### 1. Prerequisites

**Check your system:**

```bash
# Node.js 18+
node --version
# v18.17.0 or higher

# npm 9+
npm --version
# 9.0.0 or higher

# Git
git --version
# git version 2.30.0 or higher

# PostgreSQL (local) or use Prisma Accelerate (cloud)
# Optional if using Prisma Accelerate
```

### 2. Clone Repository

```bash
# Via HTTPS
git clone https://github.com/yourusername/tala.git
cd tala

# Or via SSH
git clone git@github.com:yourusername/tala.git
cd tala
```

### 3. Install Dependencies

```bash
# Install all packages
npm install

# Verify installation
npm list

# Update packages (optional)
npm update
```

**Dependencies installed:**

```
Next.js 16          - React framework
React 19            - UI library
TypeScript          - Type safety
Tailwind CSS        - Styling
Prisma 7            - Database ORM
jsonwebtoken        - JWT auth
Zod                 - Input validation
Wagmi               - Web3 integration
Ethers              - Blockchain library
```

### 4. Configure Environment

**Create `.env.local`:**

```bash
# Copy example
cp .env.example .env.local

# Edit with your values
nano .env.local
# or
code .env.local
```

**Minimal `.env.local`:**

```env
# Database - Choose ONE option:

# Option A: Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/tala"

# Option B: Prisma Accelerate (recommended for dev)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Option C: SQLite (local testing)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="dev-secret-key-at-least-32-characters-long"

# Web3 (get from WalletConnect)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-project-id"
NEXT_PUBLIC_TALA_VAULT_ADDRESS="0x..."
PRIVATE_KEY="your-private-key"

# IPFS/Pinata (get from Pinata.cloud)
NEXT_PUBLIC_PINATA_API_KEY="your-api-key"
NEXT_PUBLIC_PINATA_SECRET_API_KEY="your-secret"
NEXT_PUBLIC_PINATA_JWT="your-jwt"
```

**Generate strong JWT secret:**

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. Setup Database

#### Option A: Local PostgreSQL

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Or (Ubuntu/Debian)
sudo systemctl start postgresql

# Create database
createdb tala

# Set DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/tala"
```

#### Option B: Prisma Accelerate (Recommended)

1. Go to https://accelerate.prisma.io
2. Sign up with GitHub
3. Create new project
4. Copy your DATABASE_URL
5. Set in `.env.local`

#### Option C: Docker PostgreSQL

```bash
# Start PostgreSQL in Docker
docker run --name tala-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tala \
  -p 5432:5432 \
  -d postgres:16

# Verify it's running
docker ps

# DATABASE_URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tala"
```

#### Initialize Prisma

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# View database (optional)
npx prisma studio
```

**Prisma Studio** opens at http://localhost:5555 for visual database management.

### 6. Start Development Server

```bash
# Development mode
npm run dev

# Server starts at http://localhost:3000
# Auto-reload on file changes

# In another terminal, monitor TypeScript
npm run type-check --watch
```

**You should see:**
```
▲ Next.js 16.0.10 (Turbopack)
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.1s
```

### 7. Verify Setup

**Check API is working:**

```bash
# In another terminal
curl http://localhost:3000/api/health

# Or use Postman/Thunder Client

# Test authentication endpoint
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "username": "testuser",
    "displayName": "Test User"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "test@example.com",
    "username": "testuser"
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

## IDE Setup

### VS Code (Recommended)

**Install Extensions:**

1. **ESLint** - `dbaeumer.vscode-eslint`
2. **Prettier** - `esbenp.prettier-vscode`
3. **TypeScript Vue Plugin** - `Vue.volar`
4. **Thunder Client** - `rangav.vscode-thunder-client` (API testing)
5. **REST Client** - `humao.rest-client`
6. **Prisma** - `prisma.prisma`
7. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`

**Settings (`settings.json`):**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "prisma.prismaFmtOnSave": true
}
```

### Terminal Setup

**PowerShell (Windows):**

```powershell
# Install Windows Terminal from Microsoft Store
# Add to $PROFILE
function ll { Get-ChildItem -Force @args }

# Use with conda/nvm for Node version management
```

**Bash/Zsh (macOS/Linux):**

```bash
# Add to ~/.bashrc or ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use nvm to manage Node versions
nvm use 18
```

---

## Database Management

### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name "description"

# View database UI
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Create migration from schema changes
npx prisma migrate dev

# Deploy migrations to production
npx prisma migrate deploy

# Diff schema changes
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-stdin
```

### Database Backup

```bash
# PostgreSQL backup
pg_dump tala > backup.sql

# PostgreSQL restore
psql tala < backup.sql

# SQLite backup
cp dev.db dev.db.backup
```

---

## Testing Setup

### Create Test File

```typescript
// __tests__/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Authentication', () => {
  let authToken: string;

  beforeAll(async () => {
    // Setup
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should register user', async () => {
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
  });
});
```

### Run Tests

```bash
# Install Jest
npm install --save-dev jest @jest/globals

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## API Testing

### Using cURL

```bash
# Variables
TOKEN="your-jwt-token"
BASE_URL="http://localhost:3000"

# Register
curl -X POST $BASE_URL/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com",...}'

# Login
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com"}'

# Get profile
curl -X GET $BASE_URL/api/auth \
  -H "Authorization: Bearer $TOKEN"

# List vaults
curl -X GET "$BASE_URL/api/vaults?page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Using REST Client Extension

Create `api.http`:

```http
### Variables
@baseUrl = http://localhost:3000
@token = your-jwt-token

### Register User
POST {{baseUrl}}/api/auth
Content-Type: application/json

{
  "email": "user@example.com",
  "walletAddress": "0x...",
  "username": "testuser",
  "displayName": "Test User"
}

### Login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com"
}

### Get Profile
GET {{baseUrl}}/api/auth
Authorization: Bearer {{token}}

### List Vaults
GET {{baseUrl}}/api/vaults?page=1&pageSize=10
Authorization: Bearer {{token}}

### Create Vault
POST {{baseUrl}}/api/vaults
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "My Vault",
  "description": "Personal files",
  "password": "strongPassword123"
}
```

Click "Send Request" on each block to test.

### Using Postman

1. **Create Collection:**
   - Name: TALA API
   - Create environment with:
     - `baseUrl`: `http://localhost:3000`
     - `token`: (leave empty, will be set by login)

2. **Create Requests:**
   - POST /api/auth - Register
   - POST /api/auth/login - Login
   - GET /api/auth - Get profile
   - POST /api/vaults - Create vault
   - GET /api/vaults - List vaults

3. **Add Test Script to Login:**
   ```javascript
   pm.environment.set("token", pm.response.json().data.token);
   ```

---

## Debugging

### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

Start with debugging:

```bash
node --inspect-brk ./node_modules/.bin/next dev
```

### Chrome DevTools

```bash
# Start with inspect mode
npm run dev

# Visit chrome://inspect in Chrome
# Click "inspect" next to Node process
```

### Logging

```typescript
// Good logging
console.log('[auth]', 'Token generated:', { userId, exp });

// Debug mode
if (process.env.DEBUG) {
  console.log('[debug]', 'Prisma query:', query);
}

// Production logging
import pino from 'pino';
const logger = pino();
logger.info({ event: 'vault_created', vaultId });
```

---

## Performance Optimization

### Development Tips

```bash
# Build analysis
npm run build
# Check build output size

# Performance profiling
npm run dev -- --hostname 127.0.0.1 --port 3000

# Memory usage
node --max-old-space-size=4096 node_modules/.bin/next dev
```

### Code Profiling

```typescript
// Profile function
const profileFn = async (fn: () => Promise<T>, name: string) => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  console.log(`[${name}] ${duration.toFixed(2)}ms`);
  return result;
};

// Usage
await profileFn(() => getPrisma().user.findMany(), 'List users');
```

---

## Troubleshooting Setup

### "npm: command not found"

```bash
# Install Node.js from https://nodejs.org
# Or use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### "DATABASE_URL is not set"

```bash
# Check .env.local exists
ls -la .env.local

# Verify DATABASE_URL
grep DATABASE_URL .env.local

# If not set, add it
echo 'DATABASE_URL="postgresql://..."' >> .env.local
```

### "Port 3000 already in use"

```bash
# macOS/Linux - Find process
lsof -i :3000

# Windows - Find process
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### "Module not found: '@/lib/prisma'"

```bash
# Regenerate Prisma
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "TypeScript errors"

```bash
# Check TypeScript
npm run type-check

# Fix errors
npm run lint -- --fix

# Rebuild
npm run build
```

---

## Git Setup

### Configure Git

```bash
# Set user
git config user.name "Your Name"
git config user.email "your@email.com"

# Global config
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Create Feature Branch

```bash
# Create and switch to branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "feat: description"

# Push to origin
git push origin feature/your-feature

# Create pull request on GitHub
```

---

## Next Steps

1. ✅ Setup development environment
2. 📖 Read [DEVELOPER_DOCS.md](DEVELOPER_DOCS.md)
3. 📚 Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. 🔧 Make first changes
5. 🧪 Test your changes
6. 📝 Commit with meaningful messages
7. 🚀 Push to feature branch
8. 🔄 Create pull request

---

**Last Updated:** December 15, 2025
**Version:** 1.0.0
