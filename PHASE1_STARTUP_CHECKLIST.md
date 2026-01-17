# PHASE 1 STARTUP CHECKLIST
## Complete readiness verification before launch

**Checklist Version**: 1.0  
**Last Updated**: March 2026  
**Quality Standard**: ⭐⭐⭐⭐⭐ Production-Grade  

---

## 🚀 PRE-LAUNCH CHECKLIST

### Step 1: Environment Configuration ⚙️

- [ ] **Database Connection**
  - [ ] PostgreSQL running locally or remote server
  - [ ] `DATABASE_URL` environment variable set
  - [ ] Test connection: `psql -U postgres -h localhost`
  - [ ] Can query database: `npx prisma db execute --stdin` and test query

- [ ] **Next.js Environment**
  - [ ] `NEXTAUTH_SECRET` set (32+ character random string)
  - [ ] `NEXTAUTH_URL` set to application base URL
  - [ ] `NODE_ENV=development` or `production`
  - [ ] All other variables validated: `npx ts-node lib/phase1/validate-environment.ts`

- [ ] **Blockchain Configuration**
  - [ ] `NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS` set with valid contract address
  - [ ] Contract deployed on Polygon Amoy (Chain ID: 80002)
  - [ ] Contract is verified: `npx hardhat run lib/phase1/verify-contract.ts --network amoy`

- [ ] **IPFS Configuration (Optional but recommended)**
  - [ ] `PINATA_JWT` obtained from Pinata dashboard
  - [ ] `PINATA_GATEWAY` set to Pinata gateway URL
  - [ ] Credentials tested with small file upload

**Command to Validate All**:
```bash
npx ts-node lib/phase1/validate-environment.ts
```

---

### Step 2: Database Setup 🗄️

- [ ] **Install Dependencies**
  - [ ] Node.js 18+ installed: `node --version`
  - [ ] npm or yarn installed: `npm --version`
  - [ ] Prisma CLI available: `npx prisma --version`

- [ ] **Database Initialization**
  - [ ] PostgreSQL database created
  - [ ] User with permissions created
  - [ ] `DATABASE_URL` points to correct database
  - [ ] Test connection: `npx prisma db execute --stdin < SELECT 1`

- [ ] **Run Migrations**
  - [ ] Schema file exists: `ls prisma/schema.prisma`
  - [ ] Migrations directory has files: `ls prisma/migrations`
  - [ ] Run migrations: `npx prisma migrate deploy`
  - [ ] Generate Prisma client: `npx prisma generate`

- [ ] **Verify Database**
  - [ ] Run verification script: `npx ts-node lib/phase1/verify-database.ts`
  - [ ] All 6 tables exist in database
  - [ ] All tables have correct columns
  - [ ] Foreign key constraints are active
  - [ ] No errors in migration log

**Commands**:
```bash
# Verify database
npx ts-node lib/phase1/verify-database.ts

# If errors, run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

### Step 3: Smart Contract Setup ⛓️

- [ ] **Contract Deployment**
  - [ ] TALAVault.sol contract compiled: `npx hardhat compile`
  - [ ] Contract deployed to Polygon Amoy
  - [ ] Contract address noted and set in environment variable
  - [ ] Contract verified on Polygonscan: https://amoy.polygonscan.com

- [ ] **Contract Configuration**
  - [ ] Owner address correct
  - [ ] Time-lock duration set (48 hours default)
  - [ ] Reentrancy guard enabled
  - [ ] All functions accessible

- [ ] **Verify Contract**
  - [ ] Run: `npx hardhat run lib/phase1/verify-contract.ts --network amoy`
  - [ ] All checks pass
  - [ ] No error messages

**Commands**:
```bash
# Compile contract
npx hardhat compile

# Deploy contract
npx hardhat run scripts/deploy.js --network amoy

# Verify contract
npx hardhat run lib/phase1/verify-contract.ts --network amoy

# Run tests
npx hardhat test
```

---

### Step 4: Authentication System 🔐

- [ ] **NextAuth Configuration**
  - [ ] `lib/auth/signature-verify.ts` exists and exports functions
  - [ ] `app/api/auth/[...nextauth]/route.ts` configured
  - [ ] Credential provider properly configured
  - [ ] JWT session working

- [ ] **Test Authentication**
  - [ ] Application starts: `npm run dev`
  - [ ] Can access login page: `http://localhost:3000/login`
  - [ ] Connect wallet button visible
  - [ ] Metamask integration working
  - [ ] Sign message prompt appears
  - [ ] JWT session created after signing
  - [ ] Session persists on page reload

- [ ] **Test Admin Check**
  - [ ] Endpoint accessible: `GET /api/auth/check-admin`
  - [ ] Returns 401 without session
  - [ ] Returns user info with session
  - [ ] Returns admin status

**Test Commands**:
```bash
# Start dev server
npm run dev

# Test session endpoint (separate terminal)
curl http://localhost:3000/api/auth/session

# Test admin check
curl http://localhost:3000/api/auth/check-admin \
  -H "Cookie: next-auth.session-token=[token]"
```

---

### Step 5: File Upload System 📤

- [ ] **File Validation Service**
  - [ ] `lib/services/validateFile.ts` exists
  - [ ] Validates file extensions
  - [ ] Checks MIME types
  - [ ] Blocks dangerous files (.exe, .sh, etc.)

- [ ] **Upload API Endpoint**
  - [ ] `app/api/vaults/upload/route.ts` configured
  - [ ] Requires authentication
  - [ ] Validates vault ownership
  - [ ] Enforces storage quotas
  - [ ] Encrypts files before storage

- [ ] **Test File Upload**
  - [ ] Create test vault (via UI or database)
  - [ ] Upload valid PDF file
  - [ ] Verify file encrypted
  - [ ] Try upload .exe file → should reject
  - [ ] Try upload > 500MB → should reject
  - [ ] Check VaultFile table has entry
  - [ ] Check ActivityLog has upload entry

**Test Cases**:
```bash
# Test dangerous file rejection (should fail with 400/403)
curl -X POST http://localhost:3000/api/vaults/upload \
  -F "file=@malware.exe" \
  -F "vaultId=test-vault" \
  -F "encryptionPassword=password"

# Test valid file upload (should succeed)
curl -X POST http://localhost:3000/api/vaults/upload \
  -F "file=@document.pdf" \
  -F "vaultId=test-vault" \
  -F "encryptionPassword=password" \
  -H "Cookie: [session-cookie]"
```

---

### Step 6: IPFS Integration 📁

- [ ] **IPFS Configuration**
  - [ ] `lib/ipfs/ipfs-complete.ts` exists
  - [ ] Pinata JWT configured
  - [ ] Pinata gateway configured
  - [ ] Credentials valid

- [ ] **Test IPFS Upload**
  - [ ] Create test file
  - [ ] Upload to IPFS: `await uploadToIPFS(file)`
  - [ ] Receive valid IPFS hash (starts with Qm...)
  - [ ] Verify file accessible: `https://[gateway]/ipfs/[hash]`

- [ ] **Test Encryption/Decryption**
  - [ ] Encrypt test buffer
  - [ ] Verify IV, salt, authTag generated
  - [ ] Decrypt with correct password
  - [ ] Decryption fails with wrong password
  - [ ] File hash verified

- [ ] **Test Complete Flow**
  - [ ] Upload encrypted file
  - [ ] Download from IPFS
  - [ ] Decrypt successfully
  - [ ] File content matches original

**Commands**:
```bash
# Test IPFS in Node.js REPL
node
> import { uploadToIPFS } from './lib/ipfs/ipfs-complete.ts'
> const file = new File(['test'], 'test.txt')
> const hash = await uploadToIPFS(file)
> console.log(hash) // Should be Qmxxx...
```

---

### Step 7: System Health Check 🏥

- [ ] **Health Check Endpoint**
  - [ ] Endpoint accessible: `GET /api/health`
  - [ ] Returns JSON with system status
  - [ ] Database check passes
  - [ ] All services show healthy

- [ ] **Verify All Services**
  - [ ] Database: ✅ Connected
  - [ ] Authentication: ✅ Configured
  - [ ] File Upload: ✅ Validated
  - [ ] IPFS: ✅ Connected
  - [ ] Smart Contract: ✅ Deployed

**Test Command**:
```bash
curl http://localhost:3000/api/health | jq .
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-14T10:00:00.000Z",
  "checks": {
    "database": {"status": "ok", ...},
    "authentication": {"status": "ok", ...},
    "fileUpload": {"status": "ok", ...},
    "ipfs": {"status": "ok", ...},
    "smartContract": {"status": "ok", ...}
  }
}
```

---

### Step 8: Testing Suite 🧪

- [ ] **Run Unit Tests**
  - [ ] Test database verification: `npx ts-node lib/phase1/verify-database.ts`
  - [ ] Test contract verification: `npx hardhat test`
  - [ ] Test authentication flow
  - [ ] Test file validation
  - [ ] Test encryption

- [ ] **Run Phase 1 Test Suite**
  - [ ] Execute: `npm run test -- lib/phase1/testing-utils.ts`
  - [ ] All tests should pass
  - [ ] No timeout errors
  - [ ] No type errors

**Commands**:
```bash
# Run database verification
npx ts-node lib/phase1/verify-database.ts

# Run contract tests
npx hardhat test

# Run Phase 1 test suite
npm run test -- lib/phase1/testing-utils.ts
```

---

### Step 9: Code Quality Validation ✨

- [ ] **TypeScript Compilation**
  - [ ] No type errors: `npx tsc --noEmit`
  - [ ] Strict mode enabled
  - [ ] All imports resolve correctly

- [ ] **ESLint Check**
  - [ ] No lint errors: `npm run lint`
  - [ ] Code style consistent
  - [ ] No unused imports/variables

- [ ] **Production Build**
  - [ ] Build succeeds: `npm run build`
  - [ ] No build errors
  - [ ] Output directory valid

**Commands**:
```bash
# Check TypeScript
npx tsc --noEmit

# Check linting
npm run lint

# Build for production
npm run build

# Test production build
npm run start
```

---

### Step 10: Documentation & Runbooks 📚

- [ ] **Documentation Complete**
  - [ ] README.md updated
  - [ ] PHASE1_EXECUTION_GUIDE.md reviewed
  - [ ] API documentation present
  - [ ] Environment variables documented

- [ ] **Runbooks Created**
  - [ ] Startup procedure documented
  - [ ] Troubleshooting guide available
  - [ ] Emergency procedures documented
  - [ ] Recovery procedures documented

- [ ] **Code Comments**
  - [ ] All functions documented
  - [ ] Edge cases explained
  - [ ] Security considerations noted

---

## ✅ FINAL VERIFICATION CHECKLIST

### Before Deployment to Production

- [ ] All 10 steps above completed
- [ ] No errors in logs
- [ ] Performance acceptable (page loads < 2s)
- [ ] Security scan passed (no vulnerabilities)
- [ ] Database backups configured
- [ ] Monitoring alerts configured
- [ ] Rollback procedure documented
- [ ] Team trained on deployment
- [ ] Stakeholders notified

### Post-Deployment Monitoring

- [ ] Application running smoothly
- [ ] No spike in error rates
- [ ] Database queries performing well
- [ ] API response times normal
- [ ] Storage usage as expected
- [ ] User authentication working
- [ ] File uploads processing correctly
- [ ] IPFS pins accessible

---

## 🆘 TROUBLESHOOTING QUICK REFERENCE

### Database Errors
```bash
# Check connection
psql -U postgres -h localhost -c "SELECT 1"

# Run migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Authentication Issues
```bash
# Check NextAuth config
cat app/api/auth/[...nextauth]/route.ts

# Test signature verification
npx ts-node -e "import { verifySignature } from '@/lib/auth/signature-verify'"

# Clear session
# Delete all cookies and localStorage
```

### File Upload Problems
```bash
# Check validation service
cat lib/services/validateFile.ts

# Test encryption
node -e "import { encryptBuffer } from '@/lib/ipfs/ipfs-complete.ts'"

# Check quotas
cat app/api/vaults/upload/route.ts | grep -A5 "quota"
```

### IPFS Connection Issues
```bash
# Verify credentials
echo $PINATA_JWT
echo $PINATA_GATEWAY

# Test connectivity
curl -H "Authorization: Bearer $PINATA_JWT" \
  https://api.pinata.cloud/data/pinList
```

---

## 📊 SUCCESS METRICS

After completing this checklist:

✅ **Uptime**: 99.9% application availability  
✅ **Response Time**: < 200ms average API response  
✅ **Database**: All queries < 100ms  
✅ **Errors**: < 0.1% error rate  
✅ **Security**: No vulnerabilities (OWASP Top 10 protected)  
✅ **Code Quality**: 100% TypeScript compliance  
✅ **Documentation**: Complete and up-to-date  

---

## 🎯 LAUNCH READINESS SUMMARY

- [ ] **Infrastructure**: ✅ Ready
- [ ] **Code**: ✅ Production-grade
- [ ] **Testing**: ✅ Comprehensive
- [ ] **Documentation**: ✅ Complete
- [ ] **Monitoring**: ✅ Configured
- [ ] **Team**: ✅ Trained

**Status**: Ready for PHASE 1 Launch ✅

---

**Checklist Version**: 1.0  
**Completion Date**: _______________  
**Verified By**: _______________  
**Date**: _______________  
