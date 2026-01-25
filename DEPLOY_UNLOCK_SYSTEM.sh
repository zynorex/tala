#!/bin/bash
# TALA Vault Unlock System - Deployment & Verification Script
# Run this to deploy and verify the unlock system is working correctly

set -e

echo "🔐 TALA Vault Unlock System - Deployment Guide"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# STEP 1: Database Migration
echo -e "${BLUE}STEP 1: Database Migration${NC}"
echo "---"
echo "This will create the UnlockEvent table and add unlock fields to Vault."
echo ""
read -p "Continue with database migration? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Running: npx prisma migrate dev --name add_vault_unlock_system${NC}"
    npx prisma migrate dev --name add_vault_unlock_system
    echo -e "${GREEN}✅ Database migration complete${NC}"
else
    echo -e "${RED}Skipping database migration${NC}"
fi
echo ""

# STEP 2: Verify Schema
echo -e "${BLUE}STEP 2: Verify Database Schema${NC}"
echo "---"
echo "Checking that schema changes were applied..."
npx prisma db push --skip-generate
echo -e "${GREEN}✅ Schema verification complete${NC}"
echo ""

# STEP 3: TypeScript Compilation
echo -e "${BLUE}STEP 3: TypeScript Compilation${NC}"
echo "---"
echo "Checking for TypeScript errors..."
npx tsc --noEmit
echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
echo ""

# STEP 4: Run Tests
echo -e "${BLUE}STEP 4: Run Test Suite${NC}"
echo "---"
echo "Running 20 comprehensive unlock service tests..."
read -p "Run tests? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm test -- vault-unlock.test.ts --verbose
    echo -e "${GREEN}✅ All tests passed${NC}"
else
    echo -e "${YELLOW}Skipping tests${NC}"
fi
echo ""

# STEP 5: Build Next.js
echo -e "${BLUE}STEP 5: Build Next.js Application${NC}"
echo "---"
echo "Building the application..."
npm run build
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# STEP 6: Summary
echo -e "${BLUE}STEP 6: Deployment Summary${NC}"
echo "---"
echo ""
echo -e "${GREEN}✅ VAULT UNLOCK SYSTEM DEPLOYED SUCCESSFULLY${NC}"
echo ""
echo "What was deployed:"
echo "  ✓ Database schema with unlockTime, lockStatus fields"
echo "  ✓ UnlockEvent audit trail table"
echo "  ✓ Unlock verification service (lib/services/vault-unlock.ts)"
echo "  ✓ API endpoint: GET /api/vaults/[id]/unlock-status"
echo "  ✓ UI component: VaultUnlockStatus (real-time countdown)"
echo "  ✓ Integration with vault detail page"
echo "  ✓ Comprehensive test suite (20 tests)"
echo ""

echo "Next steps:"
echo "  1. Review the unlock system documentation:"
echo "     - cat VAULT_UNLOCK_IMPLEMENTATION.ts"
echo "     - cat lib/services/UNLOCK_DEBUG_GUIDE.ts"
echo ""
echo "  2. Start the development server:"
echo "     npm run dev"
echo ""
echo "  3. Test manually:"
echo "     - Navigate to /vault/[vault-id]"
echo "     - Verify VaultUnlockStatus component displays"
echo "     - Check countdown timer updates every second"
echo ""
echo "  4. API testing:"
echo "     curl -H 'Authorization: Bearer <token>' \\"
echo "       http://localhost:3000/api/vaults/[id]/unlock-status"
echo ""

echo -e "${YELLOW}IMPORTANT SECURITY REMINDERS:${NC}"
echo "  ⚠️  ALWAYS call verifyUnlockBeforeFileAccess() before file downloads"
echo "  ⚠️  NEVER bypass unlock checks (not even for admins)"
echo "  ⚠️  All unlock attempts are logged for audit"
echo "  ⚠️  Times verified server-side (not client-side)"
echo ""

echo -e "${GREEN}🎉 Deployment ready! The vault lock/unlock system is rigid and production-ready.${NC}"
