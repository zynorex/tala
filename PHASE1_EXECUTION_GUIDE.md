# PHASE 1 EXECUTION GUIDE
## Complete Critical Blockers Fix - High Standards Implementation

**Completion Target**: March 14, 2026 Launch  
**Status**: ACTIVE IMPLEMENTATION  
**Quality Standard**: Production-Grade, Zero Technical Debt  

---

## 📋 PHASE 1 OVERVIEW

PHASE 1 fixes 5 critical blockers that prevent the platform from functioning:

1. **Database Setup** - Ensure all tables exist and schema is correct
2. **Smart Contract Verification** - Verify contract is deployed and working
3. **Authentication Fix** - Complete Web3 wallet authentication system
4. **File Upload Validation** - Secure file uploads with encryption and quotas
5. **IPFS Upload/Download** - Complete encrypted file storage system

---

## ✅ COMPLETED IMPLEMENTATIONS

### Step 1: Database Verification ✓
- **File**: `lib/phase1/verify-database.ts`
- **Purpose**: Check all 6 required tables exist and are properly configured
- **Tables Verified**:
  - User (authentication & profile)
  - Vault (encrypted storage containers)
  - VaultFile (file metadata & encryption keys)
  - ActivityLog (audit trail)
  - Exam (exam management)
  - ExamProctor (exam supervision)

**Run Command**:
```bash
npx ts-node lib/phase1/verify-database.ts
```

**Expected Output**:
```
✓ Connected to database
✓ All 6 tables exist
✓ Foreign keys configured
✓ No migration errors
Status: DATABASE VERIFIED ✅
```

---

### Step 2: Smart Contract Verification ✓
- **File**: `lib/phase1/verify-contract.ts`
- **Purpose**: Verify TALAVault contract is deployed and functional
- **Checks**:
  - Contract deployed at configured address
  - Owner/admin access working
  - Time-lock mechanism active
  - Reentrancy protection enabled
  - Fund management functions accessible
  - Encryption support available

**Run Command**:
```bash
npx hardhat run lib/phase1/verify-contract.ts --network amoy
```

**Expected Output**:
```
✓ Connected to Polygon Amoy
✓ Contract deployed at: 0x...
✓ Owner verified
✓ Time-lock: 48 hours
✓ Reentrancy guard active
Status: CONTRACT VERIFIED ✅
```

---

### Step 3: Authentication Fix ✓
- **Files**:
  - `lib/auth/signature-verify.ts` - Signature verification service
  - `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
  - `app/api/auth/check-admin/route.ts` - Admin authorization endpoint

**Key Features Implemented**:
1. **Wallet Signature Verification**
   - Signs message with wallet
   - Verifies signature validity
   - Prevents replay attacks
   - Message age validation (5 min default)

2. **Web3 Authentication Flow**
   - User connects wallet
   - Signs message with private key
   - Signature verified on backend
   - JWT session created
   - User stored in database

3. **Admin Authorization**
   - Check user role: `GET /api/auth/check-admin`
   - Returns: `{isAdmin, userId, role}`
   - Session required
   - Used to protect admin routes

**Test Authentication**:
```bash
# 1. Get session
curl http://localhost:3000/api/auth/session

# 2. Check admin status
curl http://localhost:3000/api/auth/check-admin \
  -H "Cookie: [session-cookie]"

# 3. Try to access admin page
curl http://localhost:3000/admin \
  -H "Cookie: [session-cookie]"
```

**Expected Behavior**:
- Unauthenticated requests return 401
- Authenticated requests include user info
- Admins can access protected routes
- Non-admins get 403 Forbidden

---

### Step 4: File Upload Validation ✓
- **File**: `app/api/vaults/upload/route.ts`
- **Purpose**: Secure file uploads with 8-layer validation

**Security Layers**:
1. **Authentication** - Verify user is logged in
2. **File Validation** - Check extensions, MIME types, malware patterns
3. **Vault Verification** - Confirm vault exists and user owns it
4. **Storage Quota** - Check if user has space available
5. **File Encryption** - Encrypt before upload (AES-256-GCM)
6. **IPFS Upload** - Store on IPFS via Pinata
7. **Database Record** - Store metadata in VaultFile table
8. **Activity Logging** - Record action for audit trail

**Dangerous File Types Blocked**:
- `.exe`, `.dll`, `.bat`, `.cmd`, `.com` (Windows executables)
- `.sh`, `.bash`, `.zsh` (Shell scripts)
- `.app`, `.deb` (Package managers)
- `.zip`, `.rar`, `.tar.gz` (Archives) - optional based on policy

**Storage Quotas**:
```
Free Plan:
  - 5 GB storage
  - 10 GB bandwidth/month

Pro Plan:
  - 100 GB storage
  - 500 GB bandwidth/month

Enterprise Plan:
  - Unlimited storage
  - Unlimited bandwidth
```

**Test File Upload**:
```bash
# 1. Create test file
echo "Test content" > test.pdf

# 2. Upload file
curl -X POST http://localhost:3000/api/vaults/upload \
  -H "Cookie: [session-cookie]" \
  -F "file=@test.pdf" \
  -F "vaultId=vault-123" \
  -F "encryptionPassword=myPassword123"

# 3. Expected response
{
  "success": true,
  "fileId": "file-123",
  "ipfsHash": "QmXxxx...",
  "encryption": {
    "iv": "hex-string",
    "salt": "hex-string",
    "authTag": "hex-string"
  },
  "fileHash": "sha256-hash"
}
```

**Error Responses**:
- `401 Unauthorized` - No session
- `400 Bad Request` - Missing fields or dangerous file type
- `403 Forbidden` - Vault not found or no access
- `413 Payload Too Large` - Quota exceeded
- `500 Server Error` - Upload/IPFS error

---

### Step 5: IPFS Upload/Download ✓
- **File**: `lib/ipfs/ipfs-complete.ts`
- **Purpose**: Complete encrypted file storage with IPFS

**Features**:
1. **File Encryption** - AES-256-GCM with PBKDF2 key derivation
2. **IPFS Upload** - Store via Pinata with metadata
3. **File Download** - Retrieve and decrypt from IPFS
4. **Encryption Metadata**:
   - Salt: 32 random bytes
   - IV: 16 random bytes
   - Auth Tag: GCM authentication tag
   - File Hash: SHA-256 of original
5. **Health Checks** - Verify IPFS pin accessibility

**IPFS Functions**:
```typescript
// Encrypt and upload file
const result = await uploadEncryptedFile(file, password);
// Returns: {ipfsHash, iv, salt, authTag, fileHash}

// Download and decrypt file
const blob = await downloadDecryptedFile(
  ipfsHash, password, iv, salt, authTag, fileName
);

// Verify pin is accessible
const accessible = await verifyIPFSPin(ipfsHash);

// Get file info
const info = await getIPFSFileInfo(ipfsHash);
// Returns: {size, accessible}
```

**Environment Variables Required**:
```
PINATA_JWT=your-jwt-key
PINATA_GATEWAY=gateway.pinata.cloud
```

**Test IPFS**:
```bash
# 1. Test encryption
npm run test lib/ipfs/ipfs-complete.ts

# 2. Manual test in Next.js API route
# Create /app/api/test-ipfs/route.ts and call uploadEncryptedFile()

# 3. Verify file on Pinata dashboard
# https://app.pinata.cloud/pinata/
```

---

## 🧪 TESTING & VERIFICATION

### Run All Phase 1 Tests
```bash
# Automated testing suite
npm run test -- lib/phase1/testing-utils.ts
```

**Tests Included**:
- ✅ Authentication flow
- ✅ Database connectivity
- ✅ File validation
- ✅ IPFS connectivity
- ✅ Encryption/decryption
- ✅ Storage quota enforcement

### Manual Testing Checklist

**Database**:
- [ ] Run `npx ts-node lib/phase1/verify-database.ts`
- [ ] All 6 tables exist
- [ ] No migration errors
- [ ] Can create test user

**Authentication**:
- [ ] Connect Metamask wallet
- [ ] Sign message in console
- [ ] JWT session created
- [ ] Session persists on page reload
- [ ] Admin status returns correctly

**File Upload**:
- [ ] Upload valid PDF → succeeds
- [ ] Upload .exe file → rejected
- [ ] Upload > 500MB → rejected
- [ ] Storage quota enforced
- [ ] IPFS hash returned
- [ ] Activity logged

**IPFS**:
- [ ] File encrypted with AES-256-GCM
- [ ] Encrypted file uploaded to IPFS
- [ ] File downloaded from IPFS
- [ ] Decryption succeeds with correct password
- [ ] Wrong password causes decryption to fail
- [ ] File hash matches original

**Smart Contract**:
- [ ] Contract deployed on Polygon Amoy
- [ ] Owner verified
- [ ] Time-lock active (48 hours)
- [ ] Reentrancy guard enabled
- [ ] All functions accessible

---

## 📊 SUCCESS CRITERIA

PHASE 1 is complete when:

✅ **Database**
- All 6 tables exist in PostgreSQL
- Schema matches Prisma schema
- No migration errors
- Foreign keys configured correctly

✅ **Authentication**
- Users can sign in with wallet
- JWT sessions created and persist
- Admin role checking works
- Account blocking prevents access

✅ **File Uploads**
- Dangerous files rejected
- Storage quotas enforced
- Files encrypted before storage
- IPFS hash returned
- Activity logged

✅ **IPFS Storage**
- Files encrypted with AES-256-GCM
- Stored on IPFS via Pinata
- Retrieved and decrypted successfully
- File integrity verified via hash

✅ **Smart Contracts**
- Deployed on Polygon Amoy
- All functions accessible
- Time-lock mechanism working
- Reentrancy protection active

✅ **Code Quality**
- TypeScript strict mode
- No type errors
- Comprehensive error handling
- Detailed logging throughout
- Production-grade standards

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying Phase 1 to production:

### Pre-Deployment
- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Smart contract deployed
- [ ] IPFS keys valid

### Deployment
- [ ] Deploy to staging first
- [ ] Run full test suite on staging
- [ ] Test with real users if possible
- [ ] Monitor logs for errors
- [ ] Deploy to production
- [ ] Monitor error rates

### Post-Deployment
- [ ] Verify all endpoints working
- [ ] Check database integrity
- [ ] Monitor storage usage
- [ ] Monitor IPFS bandwidth
- [ ] Check transaction costs

---

## 🔧 TROUBLESHOOTING

### Database Connection Failed
```bash
# Check connection string
echo $DATABASE_URL

# Verify PostgreSQL is running
psql -U postgres -h localhost

# Run migrations
npx prisma migrate deploy

# Verify database
npx ts-node lib/phase1/verify-database.ts
```

### Contract Not Found
```bash
# Check contract address
echo $NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS

# Verify on Polygon Amoy
# https://amoy.polygonscan.com/address/[ADDRESS]

# Redeploy if needed
npx hardhat run scripts/deploy.js --network amoy
```

### Authentication Not Working
```bash
# Clear session
# Delete cookies from browser

# Check NextAuth config
cat app/api/auth/[...nextauth]/route.ts

# Verify signature verification
npx ts-node -e "
  import { verifySignature } from '@/lib/auth/signature-verify';
  // Test signature verification
"
```

### IPFS Upload Failed
```bash
# Check Pinata credentials
echo $PINATA_JWT
echo $PINATA_GATEWAY

# Test IPFS connectivity
# Create small file and upload via /api/test-ipfs

# Check Pinata dashboard
# https://app.pinata.cloud/
```

---

## 📈 NEXT STEPS

After PHASE 1 Complete:

### PHASE 2: Feature Implementation (Feb 1-21)
- Admin dashboard fully functional
- User profile management
- Vault analytics
- File preview generation
- Activity log UI

### PHASE 3: Testing & Perfection (Feb 22-Mar 7)
- Comprehensive testing
- Performance optimization
- Security audit
- Bug fixes
- Edge case handling

### PHASE 4: Launch Preparation (Mar 7-14)
- Final QA
- Marketing setup
- Documentation
- Support preparation
- Launch day execution

---

## 📞 SUPPORT

If you encounter issues:

1. **Check logs**: `npx ts-node lib/phase1/verify-database.ts`
2. **Review error messages**: Look for `ERROR` in console
3. **Check environment**: `echo $VARIABLE_NAME`
4. **Test manually**: Use curl/Postman to test endpoints
5. **Read documentation**: Check comments in source files

---

**Status**: PHASE 1 ACTIVE IMPLEMENTATION  
**Last Updated**: March 2026  
**Quality Standard**: ⭐⭐⭐⭐⭐ Production-Grade  

---
