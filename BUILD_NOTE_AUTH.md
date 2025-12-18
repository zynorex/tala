# Build Note - Auth Implementation

## Issue Found

The NextAuth route handler at `/api/auth/[...nextauth]/route.ts` is conflicting with the existing custom auth endpoints at `/api/auth/route.ts`.

## Solution

NextAuth requires the catch-all route to handle all OAuth callbacks. The old custom endpoints need to be moved:

### Option 1: Keep Both (Recommended)
Move custom endpoints to separate paths:
- `POST /api/users/register` (custom registration)
- `POST /api/auth/custom-login` (custom login)
- `GET /api/auth/me` (get current user)

### Option 2: Use Only NextAuth
Remove `/api/auth/route.ts` entirely and let NextAuth handle all auth.

### Option 3: Reorganize
Keep `/api/auth/route.ts` but ensure it doesn't conflict with NextAuth paths.

## Current Files

```
/api/auth/route.ts                    ← Old custom endpoints (POST, GET, PUT)
/api/auth/[...nextauth]/route.ts     ← NextAuth handler (NEW)
/api/auth/wallet/route.ts             ← Wallet auth endpoint
/api/auth/login/route.ts              ← Login endpoint (old, might be duplicate)
```

## Next Step

Run the build with these files reorganized. The conflict is causing the build to fail.

**Recommendation:** Rename `/api/auth/route.ts` to `/api/users/auth.ts` and update all imports.
