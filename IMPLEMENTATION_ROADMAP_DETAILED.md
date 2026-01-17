# IMPLEMENTATION ROADMAP - ZERO-ISSUES PATH

**Target:** 100% Production Ready - Zero Issues  
**Timeline:** 56 days (Jan 17 - Mar 14, 2026)  
**Strategy:** Fix blockers first, then build features, then perfect with testing

---

## 🎯 PHASE 1: FIX CRITICAL BLOCKERS (Jan 17-31) - 14 Days
**Goal:** Make app functional end-to-end  
**Must Complete Before:** Moving to Phase 2

### STEP 1: DATABASE SETUP (Day 1-2) ⏱️ 4-6 hours
**Why First:** Everything depends on database

```bash
# 1. Verify database connection
echo "Check DATABASE_URL in .env.local"

# 2. Apply migrations
npx prisma migrate deploy

# 3. Verify tables exist
npx prisma studio  # Visual database browser

# 4. Seed test data (optional)
npx prisma db seed
```

**Success Criteria:**
- ✅ All tables created (User, Vault, VaultFile, ActivityLog, etc.)
- ✅ No foreign key errors
- ✅ Can view data in Prisma Studio
- ✅ No migration errors in logs

**Files Involved:**
- `prisma/schema.prisma`
- `prisma/migrations/*`
- `.env.local` (DATABASE_URL must be set)

---

### STEP 2: SMART CONTRACT VERIFICATION (Day 2-3) ⏱️ 6-8 hours
**Why:** Blockchain time-locking is core feature

```bash
# 1. Check deployed contract on Polygon Amoy
# Visit: https://amoy.polygonscan.com/
# Search for contract address

# 2. Run tests locally
npx hardhat test

# 3. Verify contract functions
# - Constructor: Sets owner
# - createVault: Can create vaults
# - releaseVault: Time-lock works
# - accessLog: Records access
# - setPausable: Emergency pause works

# 4. Test on testnet
npx hardhat run scripts/deploy.js --network amoy
```

**Success Criteria:**
- ✅ Contract deployed on Polygon Amoy
- ✅ All tests pass (test-phase2.js)
- ✅ Time-lock mechanism works
- ✅ No Reentrancy vulnerabilities
- ✅ Owner can pause/unpause

**Files Involved:**
- `contracts/TALAVault.sol`
- `test-phase2.js`
- `hardhat.config.js`
- `scripts/deploy.js`

---

### STEP 3: AUTHENTICATION FIX (Day 3-5) ⏱️ 8-10 hours
**Why:** Cannot use app without authentication

**Current Issues to Fix:**
1. Session validation broken
2. Wallet signature verification incomplete
3. Token expiration not handled
4. Multi-address switching breaks auth

**Implementation:**

```typescript
// 1. Fix NextAuth configuration
// File: app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Web3",
      credentials: {
        address: { label: "Wallet Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature || !credentials?.message) {
          throw new Error("Missing credentials");
        }

        // Verify signature
        const isValid = await verifySignature(
          credentials.address,
          credentials.message,
          credentials.signature
        );

        if (!isValid) {
          throw new Error("Invalid signature");
        }

        // Get or create user
        let user = await db.user.findUnique({
          where: { walletAddress: credentials.address.toLowerCase() },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              walletAddress: credentials.address.toLowerCase(),
              plan: "free",
            },
          });
        }

        return {
          id: user.id,
          name: user.walletAddress,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 2. Implement signature verification
// File: lib/auth/signature-verify.ts

import { ethers } from "ethers";

export async function verifySignature(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch {
    return false;
  }
}

// 3. Fix useAdminAuth hook
// File: app/hooks/useAdminAuth.ts

export function useAdminAuth() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      checkAdminStatus();
    }
  }, [session?.user?.id, status]);

  const checkAdminStatus = async () => {
    const res = await fetch("/api/auth/check-admin", {
      headers: {
        "X-User-ID": session!.user!.id,
      },
    });
    
    if (res.ok) {
      const data = await res.json();
      setIsAdmin(data.isAdmin);
    }
  };

  return { isAdmin, isLoading: status === "loading" };
}
```

**New API Route Needed:**
```typescript
// app/api/auth/check-admin/route.ts

import { db } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-ID");
  
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  return Response.json({
    isAdmin: user?.role === "admin",
  });
}
```

**Success Criteria:**
- ✅ Can sign in with wallet
- ✅ Session persists on page reload
- ✅ Switching wallets logs out old user
- ✅ Admin role verified from database
- ✅ Protected routes redirect to login
- ✅ No auth errors in console

**Files to Modify:**
- `app/api/auth/[...nextauth]/route.ts`
- `app/hooks/useAdminAuth.ts`
- `lib/auth/signature-verify.ts` (create new)
- `app/api/auth/check-admin/route.ts` (create new)
- `.env.local` - Add NEXTAUTH_SECRET

---

### STEP 4: FILE UPLOAD VALIDATION (Day 5-6) ⏱️ 4-6 hours
**Why:** Security critical + blocks storage quota

**Integration:**

```typescript
// app/api/vaults/upload/route.ts

import { validateFile } from "@/lib/utils/file-validation";
import { canUserUpload, recordBandwidthUsage } from "@/lib/utils/storage-quota";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // 1. Validate file
    const validation = await validateFile(file, true);
    if (!validation.valid) {
      return Response.json(
        { error: validation.error, warnings: validation.warnings },
        { status: 400 }
      );
    }

    // 2. Check storage quota
    const userPlan = (await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    }))?.plan || "free";

    if (!await canUserUpload(session.user.id, file.size, userPlan)) {
      return Response.json(
        { error: "Storage quota exceeded. Please upgrade your plan." },
        { status: 413 }
      );
    }

    // 3. Upload to IPFS
    const ipfsHash = await uploadToIPFS(file);

    // 4. Save to database
    const vaultFile = await db.vaultFile.create({
      data: {
        vaultId: formData.get("vaultId") as string,
        fileName: file.name,
        ipfsHash,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    // 5. Record bandwidth usage
    await recordBandwidthUsage(session.user.id, file.size);

    return Response.json({ success: true, ipfsHash });

  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
```

**Success Criteria:**
- ✅ File validation rejects dangerous files
- ✅ Quota enforcement works
- ✅ Bandwidth is tracked
- ✅ Files uploaded to IPFS
- ✅ No validation bypass via API

**Files to Modify:**
- `app/api/vaults/upload/route.ts`
- `app/api/vaults/[id]/download/route.ts`

---

### STEP 5: IPFS UPLOAD/DOWNLOAD (Day 6-7) ⏱️ 6-8 hours
**Why:** Core storage feature

```typescript
// lib/ipfs/ipfs.ts - Complete implementation

import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
});

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // Encrypt file before upload
    const encryptedBuffer = await encryptFile(file);
    const encryptedBlob = new Blob([encryptedBuffer], { type: "application/octet-stream" });
    const encryptedFile = new File([encryptedBlob], file.name);

    // Upload to Pinata
    const response = await pinata.upload.file(encryptedFile);
    
    console.log("✅ File uploaded to IPFS:", response.IpfsHash);
    return response.IpfsHash;
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

export async function downloadFromIPFS(ipfsHash: string): Promise<Blob> {
  try {
    // Download from Pinata gateway
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("File not found on IPFS");
    }

    const encryptedBuffer = await response.arrayBuffer();
    
    // Decrypt file after download
    const decryptedBuffer = await decryptFile(new Uint8Array(encryptedBuffer));
    
    return new Blob([decryptedBuffer], { type: "application/octet-stream" });
  } catch (error) {
    console.error("IPFS download failed:", error);
    throw new Error("Failed to download file from IPFS");
  }
}

export async function verifyIPFSPin(ipfsHash: string): Promise<boolean> {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
      method: "HEAD",
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

**Environment Variables Needed:**
```
PINATA_JWT=<your_pinata_jwt>
PINATA_GATEWAY=gateway.pinata.cloud
```

**Success Criteria:**
- ✅ Files upload to Pinata IPFS
- ✅ Files encrypted before upload
- ✅ Files can be downloaded
- ✅ Files decrypted after download
- ✅ Large files work (50MB+)
- ✅ IPFS pin verification works

---

## 🏁 END OF PHASE 1 CHECKLIST

Before moving to Phase 2, verify:

- [ ] Database: All tables exist, no errors
- [ ] Blockchain: Contract deployed, all tests pass
- [ ] Auth: Can sign in/out, sessions persist
- [ ] Upload: File validation enforced
- [ ] Storage: Quotas enforced
- [ ] IPFS: Files upload/download encrypted
- [ ] No console errors on main flows
- [ ] Can create vault → upload file → see in dashboard

**Estimated Completion:** Jan 31, 2026

---

## 🎨 PHASE 2: BUILD MISSING FEATURES (Feb 1-21) - 21 Days
**Goal:** Complete all user-facing features

### STEP 6: FILE CLEANUP SCHEDULER (Feb 1-2) ⏱️ 3-4 hours

```typescript
// lib/cron/cleanup.ts

import { scheduleCleanup } from "@/lib/utils/file-cleanup";

export async function runDailyCleanup() {
  console.log("🧹 Starting daily cleanup...");
  const stats = await scheduleCleanup();
  console.log("✅ Cleanup complete:", stats);
}

// Option A: Using node-cron
import cron from "node-cron";

// Run at 2 AM daily
cron.schedule("0 2 * * *", async () => {
  await runDailyCleanup();
});

// Option B: Using Next.js API route + external scheduler
// app/api/cron/cleanup/route.ts

export async function POST(req: Request) {
  // Verify request from cron service
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await runDailyCleanup();
  return Response.json({ success: true });
}

// Call from: Vercel Cron, GitHub Actions, or external service
```

---

### STEP 7: DASHBOARD STORAGE METRICS (Feb 2-4) ⏱️ 4-6 hours

```typescript
// app/components/StorageMetrics.tsx

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HardDrive, AlertTriangle, TrendingUp } from "lucide-react";

interface QuotaInfo {
  storageUsed: number;
  storageQuota: number;
  bandwidthUsed: number;
  bandwidthQuota: number;
  percentageUsed: number;
  upgradeNeeded: boolean;
}

export default function StorageMetrics() {
  const { data: session } = useSession();
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchQuota();
    }
  }, [session]);

  const fetchQuota = async () => {
    const res = await fetch("/api/quota/info", {
      headers: { "X-User-ID": session!.user!.id },
    });
    const data = await res.json();
    setQuota(data);
    setLoading(false);
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Storage */}
      <div className="border-4 border-black bg-cream p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            <h3 className="font-black">Storage</h3>
          </div>
          <span className="text-sm font-bold">
            {formatBytes(quota?.storageUsed || 0)} / {formatBytes(quota?.storageQuota || 0)}
          </span>
        </div>
        <div className="w-full bg-gray-300 border-2 border-black h-3 rounded-sm overflow-hidden">
          <div
            className={`h-full transition-all ${
              quota && quota.percentageUsed > 90 ? "bg-red-500" : "bg-heirlock-green"
            }`}
            style={{ width: `${Math.min(quota?.percentageUsed || 0, 100)}%` }}
          />
        </div>
        {quota?.upgradeNeeded && (
          <div className="mt-2 flex items-center gap-2 bg-yellow-100 p-2 border-2 border-black">
            <AlertTriangle className="w-4 h-4 text-yellow-700" />
            <p className="text-xs font-bold">Upgrade to increase storage</p>
          </div>
        )}
      </div>

      {/* Bandwidth */}
      <div className="border-4 border-black bg-cream p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-black">Bandwidth (Today)</h3>
          </div>
          <span className="text-sm font-bold">
            {formatBytes(quota?.bandwidthUsed || 0)} / {quota?.bandwidthQuota === Infinity ? "Unlimited" : formatBytes(quota?.bandwidthQuota || 0)}
          </span>
        </div>
        {quota?.bandwidthQuota !== Infinity && (
          <div className="w-full bg-gray-300 border-2 border-black h-3 rounded-sm overflow-hidden">
            <div
              className="h-full bg-heirlock-blue transition-all"
              style={{
                width: `${Math.min((quota?.bandwidthUsed || 0) / (quota?.bandwidthQuota || 1) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

**New API Route:**
```typescript
// app/api/quota/info/route.ts

import { db } from "@/lib/prisma";
import { getStorageMetrics, getBandwidthMetrics } from "@/lib/utils/storage-quota";

export async function GET(req: Request) {
  const userId = req.headers.get("X-User-ID");

  const user = await db.user.findUnique({
    where: { id: userId || "" },
  });

  const storage = await getStorageMetrics(userId!, user?.plan || "free");
  const bandwidth = await getBandwidthMetrics(userId!, user?.plan || "free");

  return Response.json({
    storageUsed: storage.totalUsed,
    storageQuota: storage.quota,
    bandwidthUsed: bandwidth.usedToday,
    bandwidthQuota: bandwidth.dailyQuota,
    percentageUsed: storage.percentageUsed,
    upgradeNeeded: storage.overQuota,
  });
}
```

---

### STEP 8: ERROR HANDLING & BOUNDARIES (Feb 4-6) ⏱️ 5-6 hours

```typescript
// app/components/ErrorBoundary.tsx - Enhanced version

"use client";

import React, { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);
    
    // Send to error tracking service
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry.captureException(error, { contexts: { errorInfo } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="border-4 border-black bg-cream p-6 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h1 className="font-black text-lg">Something went wrong</h1>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-heirlock-blue border-2 border-black px-4 py-2 font-bold hover:bg-heirlock-blue/80 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Add to all critical API routes:**
```typescript
// Wrap all async handlers with error handling

export async function POST(req: Request) {
  try {
    // ... your code
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

### STEP 9: ADMIN AUTHORIZATION (Feb 6-7) ⏱️ 3-4 hours

```typescript
// lib/middleware/admin-auth.ts - Create new middleware

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function withAdminAuth(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return handler(req);
  };
}

// Usage in admin API routes:
// app/api/admin/users/route.ts

import { withAdminAuth } from "@/lib/middleware/admin-auth";

export const POST = withAdminAuth(async (req) => {
  // Only admins reach here
  // ... admin logic
});
```

**Protect admin routes:**
```typescript
// app/admin/page.tsx

"use client";

import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import { Loader } from "lucide-react";

export default function AdminPage() {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div>
      {/* Admin dashboard */}
    </div>
  );
}
```

---

## 🧪 PHASE 3: TESTING & PERFECTION (Feb 22-Mar 7) - 14 Days
**Goal:** Zero issues, 100% reliability

### STEP 10: UNIT TESTS (Feb 22-24) ⏱️ 6-8 hours

```typescript
// __tests__/utils/file-validation.test.ts

import { validateFile } from "@/lib/utils/file-validation";

describe("File Validation", () => {
  it("should accept valid PDF", async () => {
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });

  it("should reject .exe files", async () => {
    const file = new File(["MZ..."], "virus.exe", { type: "application/x-msdownload" });
    const result = await validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("not allowed");
  });

  it("should reject files > 500MB", async () => {
    const largeBuffer = new ArrayBuffer(600 * 1024 * 1024);
    const file = new File([largeBuffer], "huge.zip");
    const result = await validateFile(file);
    expect(result.valid).toBe(false);
  });

  it("should detect malware patterns", async () => {
    const malwareHeader = Buffer.from([0x4d, 0x5a]); // MZ header
    const file = new File([malwareHeader], "malware.bin");
    const result = await validateFile(file, true); // strict mode
    expect(result.warnings).toBeDefined();
  });
});

// __tests__/utils/storage-quota.test.ts

import { getStorageMetrics, canUserUpload } from "@/lib/utils/storage-quota";

describe("Storage Quotas", () => {
  it("should calculate storage metrics correctly", async () => {
    const metrics = await getStorageMetrics("test-user", "free");
    expect(metrics.quota).toBe(100 * 1024 * 1024); // 100MB
    expect(metrics.percentageUsed).toBeGreaterThanOrEqual(0);
  });

  it("should prevent upload when quota exceeded", async () => {
    const canUpload = await canUserUpload("test-user", 150 * 1024 * 1024, "free");
    expect(canUpload).toBe(false);
  });

  it("should allow unlimited upload for enterprise", async () => {
    const canUpload = await canUserUpload("test-user", 2 * 1024 * 1024 * 1024, "enterprise");
    expect(canUpload).toBe(true);
  });
});
```

Run tests:
```bash
npm run test
# Should see: All tests pass ✅
```

---

### STEP 11: INTEGRATION TESTS (Feb 24-26) ⏱️ 6-8 hours

```typescript
// __tests__/api/vault-creation.test.ts

import { POST } from "@/app/api/vaults/create/route";

describe("Vault Creation API", () => {
  it("should create vault with valid input", async () => {
    const request = new Request("http://localhost:3000/api/vaults/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": "test-user-id",
      },
      body: JSON.stringify({
        name: "Test Vault",
        description: "Test description",
        unlockDate: "2026-02-01",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.vaultId).toBeDefined();
  });

  it("should reject invalid unlock date", async () => {
    const request = new Request("http://localhost:3000/api/vaults/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": "test-user-id",
      },
      body: JSON.stringify({
        name: "Test Vault",
        unlockDate: "2020-01-01", // Past date
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("should enforce storage quota", async () => {
    // Create vault
    // Try to upload file exceeding quota
    // Should fail with 413 error
  });
});
```

---

### STEP 12: E2E TESTS (Feb 26-28) ⏱️ 6-8 hours

```typescript
// __tests__/e2e/vault-workflow.test.ts

import { test, expect } from "@playwright/test";

test.describe("Complete Vault Workflow", () => {
  test("should create, upload, and unlock vault", async ({ page }) => {
    // 1. Sign in
    await page.goto("/");
    await page.click("text=Connect Wallet");
    // ... wallet connection flow ...

    // 2. Create vault
    await page.goto("/create-vault");
    await page.fill('input[placeholder="Vault Name"]', "Test Vault");
    await page.fill('input[type="file"]', "/path/to/test.pdf");
    
    // Verify preview appears
    await expect(page.locator("text=Preview")).toBeVisible();
    
    // 3. Set unlock date
    await page.fill('input[type="date"]', "2026-02-01");
    
    // 4. Submit
    await page.click("text=Create Vault");
    await expect(page.locator("text=Vault created successfully")).toBeVisible();

    // 5. View in dashboard
    await page.goto("/dashboard");
    await expect(page.locator("text=Test Vault")).toBeVisible();
  });

  test("should handle file upload errors", async ({ page }) => {
    // Try to upload .exe file
    // Should show error message
    
    // Try to upload > 50MB
    // Should show file too large error
  });
});
```

---

### STEP 13: SECURITY AUDIT (Feb 28 - Mar 3) ⏱️ 4-6 hours

```bash
# 1. Check for common vulnerabilities
npm audit

# Fix any vulnerabilities
npm audit fix

# 2. Scan dependencies
npx snyk test

# 3. Check for hardcoded secrets
npm run secrets:scan

# 4. OWASP Top 10 checklist:
# [ ] Injection attacks - Use parameterized queries (Prisma does this)
# [ ] Broken authentication - NextAuth configured correctly
# [ ] Sensitive data exposure - HTTPS enforced, encryption used
# [ ] XML External Entities - Not applicable
# [ ] Broken access control - Admin auth implemented
# [ ] Security misconfiguration - Review .env, headers
# [ ] Cross-site scripting (XSS) - React escapes by default
# [ ] Insecure deserialization - Validate all JSON
# [ ] Using components with known vulnerabilities - npm audit
# [ ] Insufficient logging - Add monitoring
```

---

### STEP 14: MOBILE & BROWSER TESTING (Mar 3-5) ⏱️ 6-8 hours

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Mobile Chrome (Android)

Test flows:
- ✅ Wallet connection
- ✅ File upload with preview
- ✅ Vault creation
- ✅ Dashboard view
- ✅ File download

Fix issues:
- ✅ Touch targets >= 44x44px
- ✅ No horizontal scroll
- ✅ Text readable on mobile
- ✅ Responsive images

---

### STEP 15: PERFORMANCE OPTIMIZATION (Mar 5-7) ⏱️ 4-6 hours

```bash
# Test performance
npx lighthouse https://tala.ai

# Optimize images
npm run optimize:images

# Check bundle size
npm run analyze:bundle

# Performance targets:
# - Lighthouse score: > 90
# - First Contentful Paint: < 1.5s
# - Time to Interactive: < 3.5s
# - Cumulative Layout Shift: < 0.1
```

---

## 🎉 FINAL PHASE: LAUNCH PREP (Mar 7-14) - 7 Days

### STEP 16: PRODUCTION DEPLOYMENT (Mar 7-8)

```bash
# 1. Set environment variables
# .env.production:
# - DATABASE_URL (production database)
# - NEXTAUTH_URL (production domain)
# - NEXTAUTH_SECRET (new secure secret)
# - PINATA_JWT (production API key)
# - Polygon RPC endpoint
# - All other keys

# 2. Build production bundle
npm run build

# 3. Deploy to Vercel / your hosting
vercel deploy --prod

# 4. Verify deployment
curl https://tala.ai/api/health

# 5. Run smoke tests in production
npm run test:smoke --env=production
```

---

### STEP 17: MONITORING & ALERTS (Mar 8-10)

```typescript
// Setup error tracking, uptime monitoring
// Recommend: Sentry, Datadog, New Relic

// app/middleware.ts - Add monitoring
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const response = NextResponse.next();
  const duration = Date.now() - startTime;

  // Log slow requests
  if (duration > 1000) {
    console.warn(`Slow request: ${request.nextUrl.pathname} (${duration}ms)`);
  }

  return response;
}

// Alert thresholds:
// - Error rate > 1% → Alert
// - Response time > 2s → Alert  
// - Database down → Critical alert
```

---

### STEP 18: DOCUMENTATION & COMMUNICATION (Mar 10-12)

```markdown
# Create/Update:
- [ ] API documentation (OpenAPI/Swagger)
- [ ] User guide (how to create vault)
- [ ] Security guide (what we protect)
- [ ] FAQ updates
- [ ] Changelog
- [ ] Status page
- [ ] Support contact info

# Communicate:
- [ ] Email to early users
- [ ] Blog post on launch
- [ ] Social media posts
- [ ] Press release (if applicable)
- [ ] Slack/Discord update
```

---

### STEP 19: GO/NO-GO DECISION (Mar 12-13)

**Launch Readiness Checklist:**

```
CRITICAL SYSTEMS:
[ ] Database: 100% uptime, backups configured
[ ] Blockchain: Contract verified, mainnet ready
[ ] Authentication: 0 failed logins in staging
[ ] File Upload: 0 failures in load testing
[ ] IPFS: 0 failed uploads, redundancy verified

SECURITY:
[ ] No critical vulnerabilities
[ ] Secrets not in codebase
[ ] HTTPS enforced everywhere
[ ] Rate limiting enabled
[ ] DDoS protection configured

FEATURES:
[ ] All CRITICAL items completed
[ ] All HIGH PRIORITY items completed
[ ] Dashboard working
[ ] Quotas enforced
[ ] File preview working
[ ] Admin panel secured

TESTING:
[ ] Unit tests: 90%+ pass rate
[ ] Integration tests: 100% pass rate
[ ] E2E tests: Critical flows pass
[ ] Performance: Lighthouse > 90
[ ] Mobile: Works on iOS + Android

MONITORING:
[ ] Error tracking enabled
[ ] Uptime monitoring enabled
[ ] Log aggregation enabled
[ ] Alerts configured
[ ] On-call process defined

LAUNCH:
[ ] Marketing ready
[ ] Support team trained
[ ] FAQ prepared
[ ] Status page ready
[ ] Runbook for incidents created
```

**If any checkbox is unchecked:** DELAY LAUNCH (do not launch with blockers)

---

### STEP 20: LAUNCH! 🚀 (Mar 14)

```bash
# Final checks
npm run build
npm run test
vercel deploy --prod

# Verify endpoints
curl https://tala.ai/
curl https://tala.ai/api/health
curl https://tala.ai/sitemap.xml

# Monitor for 24 hours
# - Check error rates
# - Monitor database load
# - Check IPFS upload success
# - Monitor user registrations
# - Track support tickets

# If issues appear:
# 1. Assess severity
# 2. Hotfix or rollback
# 3. Communicate to users
# 4. Root cause analysis
```

---

## 📊 COMPLETION TRACKING

| Phase | Dates | Days | Status | Priority |
|-------|-------|------|--------|----------|
| **Phase 1: Blockers** | Jan 17-31 | 14 | Critical | MUST DO |
| **Phase 2: Features** | Feb 1-21 | 21 | Critical | MUST DO |
| **Phase 3: Testing** | Feb 22-Mar 7 | 14 | Critical | MUST DO |
| **Phase 4: Launch** | Mar 7-14 | 7 | Critical | MUST DO |

**Total: 56 days**

---

## ⚠️ IF YOU GET BEHIND SCHEDULE

**If at Feb 14 and not done with Phase 1:**
- Reduce Phase 2 scope
- Skip nice-to-have tests
- Soft launch to closed beta
- Plan for post-launch patches

**If at Feb 28 and not done with Phase 2:**
- Delay official launch to March 28
- Focus on security testing only
- Launch with minimum viable features
- Plan Phase 3 for post-launch

**If at Mar 7 and testing not complete:**
- Do NOT launch
- Critical security/stability issues remain
- Risk of data loss, user harm
- Delay to April 14 minimum

---

## 🎯 SUCCESS METRICS

After following this roadmap, you should have:

✅ **Zero Critical Issues**
- No authentication failures
- No file upload failures
- No data loss
- No security vulnerabilities

✅ **100% Feature Completeness**
- All landing pages working
- All APIs validated
- All quotas enforced
- All file operations encrypted

✅ **Perfect Code Quality**
- Unit test coverage: 80%+
- All tests passing
- No console errors
- No TypeScript errors
- No ESLint warnings

✅ **Production Ready**
- Monitoring enabled
- Backups configured
- Incident response plan
- Runbooks created
- Team trained

---

## 📞 IF YOU GET STUCK

**For authentication issues:**
- Check NextAuth docs
- Verify NEXTAUTH_SECRET is set
- Test signature verification locally
- Check session storage

**For IPFS issues:**
- Verify PINATA_JWT is correct
- Test upload to Pinata directly
- Check gateway connectivity
- Verify encryption/decryption

**For database issues:**
- Run `npx prisma studio`
- Check migration status
- Verify connection string
- Check permissions

**For blockchain issues:**
- Verify contract on Amoy PolygonScan
- Check Hardhat network config
- Test with ethers.js directly
- Verify gas limits

---

## 🚦 NEXT IMMEDIATE ACTIONS

**TODAY (Jan 17):**
1. [ ] Start database setup (STEP 1)
2. [ ] Verify smart contract (STEP 2)
3. [ ] Assign team members to each step

**TOMORROW (Jan 18):**
1. [ ] Finish database migrations
2. [ ] Begin authentication fix (STEP 3)

**This Week (Jan 17-24):**
1. [ ] Complete all Phase 1 critical blockers
2. [ ] Have working app by Jan 24

**Target:** By Jan 31, app should be 100% functional end-to-end

---

**Good luck! You've got this! 💪**

Follow this roadmap step-by-step, don't skip any phase, and you'll have a perfect 100% product ready for launch.
