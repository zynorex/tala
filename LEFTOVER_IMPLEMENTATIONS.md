# TALA — Leftover & Incomplete Implementations Audit

> **Generated:** February 15, 2026  
> **Scope:** Full project scan — API routes, services, UI pages, smart contracts, config  
> **Total Issues Found:** 60+

---

## Table of Contents

1. [P0 — Critical / Broken Functionality](#p0--critical--broken-functionality)
2. [P1 — Security Vulnerabilities](#p1--security-vulnerabilities)
3. [P2 — Stub / Placeholder Implementations](#p2--stub--placeholder-implementations)
4. [P3 — Missing Features & Integrations](#p3--missing-features--integrations)
5. [P4 — UI/UX Incomplete Items](#p4--uiux-incomplete-items)
6. [P5 — Code Quality & Cleanup](#p5--code-quality--cleanup)
7. [Full Checklist Summary](#full-checklist-summary)

---

## P0 — Critical / Broken Functionality

### 1. File Download Returns Empty Data
- **File:** `app/api/vaults/[id]/files/[fileId]/route.ts` (Line ~118)
- **Issue:** Server-side file decryption is a placeholder. Downloads always return a 0-byte file:
  ```typescript
  decryptedBuffer = Buffer.from(''); // Placeholder
  ```
- **Impact:** Users cannot download any files from their vaults via the server-side route.
- **Fix:** Implement proper decryption using the imported `decryptFile` function (currently imported but unused).

### 2. Unencrypted Files Uploaded to IPFS
- **File:** `lib/services/vault.ts` (Lines ~159-162)
- **Issue:** `addFileToVault()` encrypts data but then uploads the **original unencrypted buffer** to IPFS instead of the encrypted version:
  ```typescript
  const encryptedData = encryption.encrypt(input.file.buffer, encryptionKey);
  const ipfsResult = await ipfs.uploadToIPFS(input.file.buffer, ...); // WRONG — should use encryptedData
  ```
- **Impact:** All files stored on IPFS are in plaintext — the core security promise is broken.

### 3. Vault ID Always Returns 0
- **File:** `lib/contracts/vault-service.ts` (Line ~197)
- **Issue:** After `createVault()`, the returned `vaultId` is hardcoded to `0`:
  ```typescript
  return { vaultId: 0, transactionHash: hash };
  ```
- **Impact:** All vaults get mapped to ID 0 in the database. Need to parse `VaultCreated` event from the transaction receipt.

### 4. Deploy Script References Wrong Contract
- **File:** `scripts/deploy.js` (Lines ~35-42)
- **Issue:** Deploys **`NilVault.sol`** and sets **`NEXT_PUBLIC_NIL_VAULT_ADDRESS`**, but the project uses **`TALAVault.sol`** and **`NEXT_PUBLIC_TALA_VAULT_ADDRESS`**.
- **Impact:** Deployment script is completely non-functional for the current codebase.

### 5. Login Endpoint Issues JWT Without Password Verification
- **File:** `app/api/auth/login/route.ts` (Lines ~27-44)
- **Issue:** POST accepts email/wallet and returns JWT **without verifying any password or signature**:
  ```typescript
  const user = await db.user.findFirst({ where: { ... } });
  const token = generateToken(user.id, ...); // No password check!
  ```
- **Impact:** Anyone knowing a user's email can authenticate as that user.

### 6. Admin Login Uses Mock Token
- **File:** `app/api/admin/login/route.ts` (Lines ~19-20)
- **Issue:** Admin auth token is a trivially decodable base64 string:
  ```typescript
  const token = Buffer.from(`${adminId}:${Date.now()}`).toString('base64');
  ```
- **Impact:** Admin authentication provides zero security. Plaintext password comparison with env vars, no rate limiting.

### 7. Real Vault Creation Is Disabled
- **File:** `app/components/CreateVaultForm.tsx` (Lines ~1256-1279)
- **Issue:** Submit button is `disabled={form.isSubmitting || !demoMode}`. Non-demo vault creation shows "Coming Soon".
- **Impact:** Users cannot create real vaults — only demo mode works.

---

## P1 — Security Vulnerabilities

### 8. Hardcoded Fallback JWT Secret
- **File:** `lib/auth/jwt.ts` (Line ~4)
- **Issue:** `const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'`
- **Fix:** Throw an error if `JWT_SECRET` is not set instead of using a fallback.

### 9. Share Link Leaks Vault Key Hash
- **File:** `app/api/shares/[token]/route.ts` (Line ~134)
- **Issue:** GET response includes `keyHash: share.vault.keyHash`, exposing the vault password hash to anyone with the share link.
- **Fix:** Remove `keyHash` from the share response.

### 10. Pinata API Secrets Exposed Client-Side
- **File:** `lib/ipfs/ipfs.ts` (Lines ~78-79)
- **Issue:** Uses `NEXT_PUBLIC_PINATA_API_KEY` and `NEXT_PUBLIC_PINATA_SECRET_API_KEY` — the `NEXT_PUBLIC_` prefix exposes these to the browser.
- **Fix:** Move IPFS operations to server-side API routes; remove `NEXT_PUBLIC_` prefix from secret keys.

### 11. Wallet Auth Always Returns Null
- **File:** `lib/auth/auth.ts` (Line ~18)
- **Issue:** `authorize()` callback always returns `null`, meaning NextAuth Credentials-based wallet login never succeeds.
- **Fix:** Implement proper wallet signature verification in the authorize callback.

### 12. CSRF Enforcement Only in Production
- **File:** `middleware.ts` (Lines ~231-235)
- **Issue:** CSRF tokens only enforced in production. `generateCSRFToken()` is defined but never integrated into the response flow.
- **Fix:** Wire CSRF token generation into responses and enforce in all environments.

### 13. Input Sanitization Never Applied
- **File:** `lib/security/secure-api-handler.ts` (Lines ~123-133)
- **Issue:** `request.json()` is consumed for sanitization but the sanitized body is never forwarded to the handler.
- **Fix:** Pass sanitized body through context or a wrapper.

### 14. Missing Rate Limiting on Critical Endpoints
- **Files:** `app/api/auth/login/route.ts`, `app/api/auth/wallet/route.ts`, `app/api/admin/login/route.ts`, `app/api/shares/[token]/files/[fileId]/route.ts`
- **Issue:** No rate limiting on authentication and file access endpoints.
- **Fix:** Apply rate limiter middleware to all auth and sensitive endpoints.

---

## P2 — Stub / Placeholder Implementations

### 15. Status API Is Entirely Fake
- **File:** `app/api/status/route.ts`
- **Issue:** All service statuses, incidents, response times, and uptime percentages are algorithmically generated from timestamps. No real health checks.
- **Fix:** Implement real health checks for database, IPFS, blockchain RPC, and auth services.

### 16. Health Endpoint Checks Are No-Ops
- **File:** `app/api/health/route.ts` (Lines ~130-155)
- **Issue:** Authentication and file-upload health checks always report "ok" without actually testing anything.

### 17. Unlock Vault Never Verifies Password
- **File:** `lib/services/vault.ts` (Lines ~219-247)
- **Issue:** `unlockVault()` accepts a password but never verifies it against the stored hash. Always returns `true`.

### 18. IPFS File Deletion Is a No-Op
- **File:** `lib/utils/file-cleanup.ts` (Lines ~55-64)
- **Issue:** `deleteFromIPFS()` logs but never calls Pinata's unpin API:
  ```typescript
  async function deleteFromIPFS(ipfsHash: string): Promise<boolean> {
    return true; // Never actually deletes
  }
  ```

### 19. File Deduplication Finds But Doesn't Fix
- **File:** `lib/utils/file-cleanup.ts` (Lines ~207-218)
- **Issue:** Finds duplicate files but `spaceFreed` always remains `0`. No actual deduplication happens.

### 20. File Integrity Verification Is Fake
- **File:** `lib/utils/file-cleanup.ts` (Lines ~258-262)
- **Issue:** Doesn't download files from IPFS or verify hashes — just increments a counter.

### 21. PDF/Document Preview Returns Null
- **File:** `lib/utils/file-preview.ts` (Lines ~99-108)
- **Issue:** `generatePdfPreview()` always returns `{ preview: null, thumbnail: null }`.

### 22. Encryption Metadata Stored In-Memory
- **File:** `lib/utils/metadata-service.ts` (Lines ~66-67)
- **Issue:** All metadata in a `Map<>` — lost on every restart. No Prisma `EncryptionMetadata` model exists.

### 23. Mock Prisma Client Missing Models
- **File:** `lib/prisma.ts` (Lines ~16-27)
- **Issue:** When `DATABASE_URL` is unset, the mock client is missing `vaultFile`, `unlockEvent`, `account`, `session`, `apiKey`, `vaultShare` models.

### 24. Placeholder IPFS Hash in Blockchain Transaction
- **File:** `app/components/CreateVaultForm.tsx` (Line ~529)
- **Issue:** Uses `QmPlaceholder0000000000000000000000000000000000` as IPFS hash for the blockchain TX. Comment says "Will be updated after upload" but **no update call exists**.

### 25. User Plan System Not Implemented
- **File:** `app/api/vaults/upload/route.ts` (Lines ~162-163)
- **Issue:** `const userPlan = "free"` — hardcoded. No plan/billing system exists.

### 26. Pagination Argument Order Mismatch
- **File:** `lib/auth/api-response.ts` vs `lib/admin/handlers.ts`
- **Issue:** `apiPaginated()` function signature has different parameter order than how callers invoke it — produces wrong pagination metadata.

### 27. Storage Quota Recording Bug
- **File:** `lib/utils/storage-quota.ts` (Lines ~119-125)
- **Issue:** Uses function callback in Prisma `updateMany` `data` field, which is invalid and will throw at runtime.

### 28. `decryptFileData()` Defined But Never Called
- **File:** `app/api/vaults/[id]/files/[fileId]/download/route.ts` (Lines ~24-48)
- **Issue:** Server-side decrypt function exists but the route returns metadata for client-side decryption instead. Architectural confusion with duplicate download endpoints.

---

## P3 — Missing Features & Integrations

### 29. Billing/Subscription System
- **Referenced in:** `app/pricing/page.tsx`
- **Status:** All pricing tiers show "Coming Soon". No Stripe/payment integration. No user plan model in schema.

### 30. Newsletter/Email Collection
- **Files:** `app/components/Footer.tsx`, `app/launch/page.tsx`, `app/blog/page.tsx`
- **Status:** Email forms exist but submissions are discarded. No email service (Mailchimp, SendGrid, etc.) integrated.

### 31. Contact Form Backend
- **File:** `app/contact/page.tsx`
- **Status:** Server component with `<form>` — no submit handler, no API endpoint, no email delivery.

### 32. Blog CMS Integration
- **Files:** `app/blog/page.tsx`, `app/blog/[id]/page.tsx`
- **Status:** All blog content is hardcoded in a single object with static HTML strings. No CMS, no database storage, no admin editor.

### 33. Real Case Studies
- **File:** `app/case-studies/page.tsx`
- **Status:** All case studies are fabricated (IIT Delhi, Delhi High Court, NEET, etc.) with fictional quotes and names.

### 34. Smart Contract Verification Page
- **File:** `app/smart-contracts/page.tsx`
- **Status:** Displays fake contract addresses (`0x1234567890...`), false "VERIFIED" badges, and fabricated audit claims. Resource links point to `#`.

### 35. Social Media Links
- **File:** `app/components/Footer.tsx` (Lines ~62-66)
- **Status:** Links go to generic `https://twitter.com`, `https://github.com`, `https://linkedin.com` — not TALA's actual profiles.

### 36. Admin User Management (Full CRUD)
- **Files:** `app/api/admin/users/route.ts`, `app/api/admin/users/[id]/route.ts`
- **Status:** Only GET (list) and DELETE exist. Missing: view user details, update roles, block/unblock users.

### 37. Custom RPC Configuration
- **File:** `config/wagmi.ts` (Lines ~10-11)
- **Status:** Uses default public RPCs with no custom URLs. Public RPCs are rate-limited for production.

### 38. In-Memory Rate Limiting (Not Production-Ready)
- **Files:** `lib/middleware/rate-limit.ts`, `middleware.ts`
- **Status:** Rate limit store is an in-memory object. Won't work across serverless/multi-process deployments. Needs Redis or similar.

### 39. In-Memory CSRF Token Store
- **File:** `lib/security/security-utils.ts`
- **Status:** CSRF tokens in a static `Map`. Won't survive restarts or work in serverless.

### 40. Dual IPFS Implementations
- **Files:** `lib/ipfs/ipfs.ts` (raw Pinata REST API) vs `lib/ipfs/ipfs-complete.ts` (Pinata SDK)
- **Status:** Two competing implementations. Different parts of the codebase import from different files. Need to consolidate.

### 41. Blockchain Unlock Verification
- **File:** `lib/services/UNLOCK_DEBUG_GUIDE.ts` (Line ~287)
- **Status:** TODO: Add contract verification phase for vault unlock status.

### 42. `voidVault` On-Chain Time Restriction
- **File:** `contracts/TALAVault.sol`
- **Status:** `voidVault()` has no on-chain check for `block.timestamp < unlockTime`. Client-side enforcement exists but contract doesn't enforce it.

---

## P4 — UI/UX Incomplete Items

### 43. Pricing Page — All CTAs Disabled
- **File:** `app/pricing/page.tsx`
- **Lines:** ~236-239, ~437-438
- **Issue:** All pricing buttons show "Coming Soon" with `disabled` + `cursor-not-allowed`.

### 44. Launch Announcement Modal
- **File:** `app/components/LaunchAnnouncementModal.tsx`
- **Issue:** Shows "Coming Soon!" to every new visitor. Needs to be removed or updated for production launch.

### 45. Duplicate Pages (Access Portal = Student)
- **Files:** `app/access-portal/page.tsx` and `app/student/page.tsx`
- **Issue:** Identical components with the same content. One is redundant.

### 46. "Connect Wallet" Buttons Without Handlers
- **Files:** `app/access-portal/page.tsx`, `app/student/page.tsx`
- **Issue:** CTA buttons have no `onClick` handler — clicking does nothing.

### 47. Links Pointing to `#`
| File | Line | Link Text |
|------|------|-----------|
| `app/smart-contracts/page.tsx` | ~148 | "Source Code" |
| `app/smart-contracts/page.tsx` | ~162 | "Audit Report" |
| `app/smart-contracts/page.tsx` | ~176 | "Gas Analytics" |
| `app/profile/page.tsx` | ~742 | "View API Documentation →" |
| `app/contact/page.tsx` | ~40 | "Location" |

### 48. Dashboard Pages Use localStorage Instead of API
| Page | Issue |
|------|-------|
| `app/dashboard/analytics/page.tsx` | Reads vaults from `localStorage.getItem('vaults')` |
| `app/dashboard/activity/page.tsx` | Reads activities from localStorage |
| `app/dashboard/security/page.tsx` | Reads security settings from localStorage; generates backup phrases with `Math.random()` (not crypto-secure) |
| `app/profile/page.tsx` | Profile + API keys stored/loaded from localStorage only |

### 49. SecurityMetrics Hardcoded
- **File:** `app/components/SecurityMetrics.tsx` (Lines ~14-17)
- **Issue:** Security score hardcoded to `98`, encryption to `'AES-256-GCM'`, backup to `'Not configured'`.

### 50. Audio Visualizer Placeholder
- **File:** `app/components/FilePreviewModal.tsx` (Line ~443)
- **Issue:** Audio player shows a static circle + music icon instead of an actual visualizer.

### 51. "Notify Me" Button on Launch Page
- **File:** `app/launch/page.tsx` (Line ~87)
- **Issue:** Hero "Notify Me" button has no `onClick` handler.

### 52. Documentation Page Links to Generic GitHub
- **File:** `app/documentation/page.tsx` (Line ~80)
- **Issue:** "Open source" link points to `https://github.com` instead of the actual repo.

---

## P5 — Code Quality & Cleanup

### 53. Extensive `console.log` in Production Code
| File | Count |
|------|-------|
| `app/components/CreateVaultForm.tsx` | 15+ calls with emoji prefixes |
| `app/components/VaultsList.tsx` | Debug logging on vault load |
| `app/vault/[id]/page.tsx` | Password submit debug logs |
| `app/components/VaultUnlockStatus.tsx` | Auth token debug logs |
| `app/api/auth/generate-token/route.ts` | 7 console.log statements |

### 54. Dead/Unused Files
| File | Reason |
|------|--------|
| `lib/crypto/file-download.ts` | Only exports interfaces/constants, no executable code |
| `lib/phase1/verify-database.ts` | References non-existent `Exam`/`ExamProctor` tables |
| `lib/phase1/verify-contract.ts` | Imports non-existent `typechain-types` directory |
| `app/api/admin/route.ts` | Redundant dispatcher — App Router handles sub-routes automatically |

### 55. Hardhat Config Non-Standard Property
- **File:** `hardhat.config.js`
- **Issue:** `type: "http"` on network configs is not a standard Hardhat option.

### 56. GET Files Endpoint Returns Deleted Files
- **File:** `app/api/vaults/[id]/files/route.ts` (Line ~310)
- **Issue:** GET doesn't filter by `isActive` — returns soft-deleted files alongside active ones.

### 57. Missing `EncryptionMetadata` Prisma Model
- **File:** `prisma/schema.prisma`
- **Issue:** Referenced in `metadata-service.ts` but model doesn't exist in schema.

### 58. TypeScript Build Skips Type Checking
- **File:** `next.config.ts` (Line ~122)
- **Issue:** `ignoreBuildErrors: true` — TypeScript errors are silently ignored during builds.

### 59. Vault POST Creates Empty File Metadata
- **File:** `app/api/vaults/route.ts` (Line ~90)
- **Issue:** Vaults created with `fileHash: ''`, `fileName: ''`, `fileSize: 0` — no mechanism to update these after file upload.

### 60. Admin Auth Uses localStorage
- **File:** `app/hooks/useAdminAuth.ts`
- **Issue:** Admin tokens stored in `localStorage` — insecure for admin sessions.

---

## Full Checklist Summary

| # | Priority | Category | Issue | Status |
|---|----------|----------|-------|--------|
| 1 | **P0** | API | File download returns empty data | ⬜ TODO |
| 2 | **P0** | Security | Unencrypted files uploaded to IPFS | ⬜ TODO |
| 3 | **P0** | Blockchain | Vault ID always returns 0 | ⬜ TODO |
| 4 | **P0** | Deploy | Deploy script references wrong contract | ⬜ TODO |
| 5 | **P0** | Auth | Login issues JWT without password check | ⬜ TODO |
| 6 | **P0** | Auth | Admin login uses mock base64 token | ⬜ TODO |
| 7 | **P0** | UI | Real vault creation disabled (demo only) | ⬜ TODO |
| 8 | **P1** | Security | Hardcoded fallback JWT secret | ⬜ TODO |
| 9 | **P1** | Security | Share link leaks vault key hash | ⬜ TODO |
| 10 | **P1** | Security | Pinata secrets exposed client-side | ⬜ TODO |
| 11 | **P1** | Auth | Wallet auth always returns null | ⬜ TODO |
| 12 | **P1** | Security | CSRF not enforced / not wired | ⬜ TODO |
| 13 | **P1** | Security | Input sanitization never applied | ⬜ TODO |
| 14 | **P1** | Security | Missing rate limiting on auth endpoints | ⬜ TODO |
| 15 | **P2** | API | Status API returns fake data | ⬜ TODO |
| 16 | **P2** | API | Health checks are no-ops | ⬜ TODO |
| 17 | **P2** | Service | Unlock vault never verifies password | ⬜ TODO |
| 18 | **P2** | Service | IPFS file deletion is a no-op | ⬜ TODO |
| 19 | **P2** | Service | File deduplication doesn't fix duplicates | ⬜ TODO |
| 20 | **P2** | Service | File integrity verification is fake | ⬜ TODO |
| 21 | **P2** | Service | PDF preview returns null | ⬜ TODO |
| 22 | **P2** | Service | Encryption metadata in-memory only | ⬜ TODO |
| 23 | **P2** | DB | Mock Prisma client missing models | ⬜ TODO |
| 24 | **P2** | Blockchain | Placeholder IPFS hash never updated | ⬜ TODO |
| 25 | **P2** | Feature | User plan system not implemented | ⬜ TODO |
| 26 | **P2** | Bug | Pagination argument order mismatch | ⬜ TODO |
| 27 | **P2** | Bug | Storage quota runtime error | ⬜ TODO |
| 28 | **P2** | API | decryptFileData defined but never called | ⬜ TODO |
| 29 | **P3** | Feature | Billing/subscription system | ⬜ TODO |
| 30 | **P3** | Feature | Newsletter/email collection backend | ⬜ TODO |
| 31 | **P3** | Feature | Contact form backend | ⬜ TODO |
| 32 | **P3** | Feature | Blog CMS integration | ⬜ TODO |
| 33 | **P3** | Content | Real case studies needed | ⬜ TODO |
| 34 | **P3** | Content | Smart contract page has fake addresses | ⬜ TODO |
| 35 | **P3** | Content | Social media links generic | ⬜ TODO |
| 36 | **P3** | API | Admin user CRUD incomplete | ⬜ TODO |
| 37 | **P3** | Config | Custom RPC URLs needed | ⬜ TODO |
| 38 | **P3** | Infra | Rate limiting needs Redis/persistent store | ⬜ TODO |
| 39 | **P3** | Infra | CSRF tokens need persistent store | ⬜ TODO |
| 40 | **P3** | Refactor | Consolidate dual IPFS implementations | ⬜ TODO |
| 41 | **P3** | Blockchain | Unlock verification from contract | ⬜ TODO |
| 42 | **P3** | Contract | voidVault time restriction on-chain | ⬜ TODO |
| 43 | **P4** | UI | Pricing CTAs disabled | ⬜ TODO |
| 44 | **P4** | UI | Launch modal shows Coming Soon | ⬜ TODO |
| 45 | **P4** | UI | Duplicate access-portal/student pages | ⬜ TODO |
| 46 | **P4** | UI | Connect Wallet buttons have no handler | ⬜ TODO |
| 47 | **P4** | UI | Links pointing to # | ⬜ TODO |
| 48 | **P4** | UI | Dashboard uses localStorage not API | ⬜ TODO |
| 49 | **P4** | UI | SecurityMetrics hardcoded values | ⬜ TODO |
| 50 | **P4** | UI | Audio visualizer placeholder | ⬜ TODO |
| 51 | **P4** | UI | Notify Me button no handler | ⬜ TODO |
| 52 | **P4** | UI | Documentation links to generic GitHub | ⬜ TODO |
| 53 | **P5** | Cleanup | Remove console.log from production code | ⬜ TODO |
| 54 | **P5** | Cleanup | Remove dead/unused files | ⬜ TODO |
| 55 | **P5** | Config | Hardhat non-standard property | ⬜ TODO |
| 56 | **P5** | Bug | GET files returns deleted files | ⬜ TODO |
| 57 | **P5** | Schema | Missing EncryptionMetadata model | ⬜ TODO |
| 58 | **P5** | Config | TypeScript build skips type checking | ⬜ TODO |
| 59 | **P5** | API | Vault POST creates empty file metadata | ⬜ TODO |
| 60 | **P5** | Security | Admin auth uses localStorage | ⬜ TODO |

---

## Recommended Fix Order

### Phase 1 — Security & Core Functionality (P0 + P1)
Fix items **1-14** first. These are blockers for any real usage:
- Fix file encryption upload (item 2)
- Fix file decryption download (item 1)
- Fix vault ID extraction from events (item 3)
- Fix deploy script (item 4)
- Secure all auth endpoints (items 5, 6, 8, 11, 14)
- Fix API key exposure (item 10)
- Wire CSRF + input sanitization (items 12, 13)

### Phase 2 — Service Layer Completeness (P2)
Fix items **15-28**. These make the backend actually functional:
- Real status/health endpoints
- Password verification on unlock
- IPFS cleanup on delete
- Persistent encryption metadata
- Plan system foundation

### Phase 3 — Feature Completeness (P3)
Fix items **29-42**. These complete the product offering:
- Billing integration
- Email/newsletter backend
- Blog CMS
- Admin full CRUD
- Production infrastructure (Redis rate limiting, CSRF)

### Phase 4 — UI Polish (P4)
Fix items **43-52**. Visual and interaction fixes:
- Remove Coming Soon where features are ready
- Wire up dead buttons
- Consolidate duplicate pages
- Connect dashboard to real API data

### Phase 5 — Code Quality (P5)
Fix items **53-60**. Cleanup and hardening:
- Remove debug logging
- Delete dead files
- Fix build configuration
- Schema alignment
