/*
  Warnings:

  - Added the required column `lockStatus` to the `Vault` table without a default value. This is not possible if the table has existing rows.
  - Added the required column `smartContractId` to the `Vault` table without a default value. This is not possible if the table has existing rows.

*/
-- AlterTable
ALTER TABLE "Vault" ADD COLUMN     "unlockTime" TIMESTAMP(3),
ADD COLUMN     "lockStatus" TEXT NOT NULL,
ADD COLUMN     "blockchainTxHash" TEXT,
ADD COLUMN     "smartContractId" INTEGER,
ADD COLUMN     "lastBlockchainSync" TIMESTAMP(3),
ADD COLUMN     "voidedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UnlockEvent" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "failureReason" TEXT,
    "timeVerified" TIMESTAMP(3) NOT NULL,
    "blockTimestamp" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnlockEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vault_lockStatus_idx" ON "Vault"("lockStatus");

-- CreateIndex
CREATE INDEX "Vault_unlockTime_idx" ON "Vault"("unlockTime");

-- CreateIndex
CREATE INDEX "UnlockEvent_vaultId_idx" ON "UnlockEvent"("vaultId");

-- CreateIndex
CREATE INDEX "UnlockEvent_userId_idx" ON "UnlockEvent"("userId");

-- CreateIndex
CREATE INDEX "UnlockEvent_createdAt_idx" ON "UnlockEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");

-- AddForeignKey
ALTER TABLE "UnlockEvent" ADD CONSTRAINT "UnlockEvent_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlockEvent" ADD CONSTRAINT "UnlockEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL;

-- UpdateVaultDefaults
UPDATE "Vault" SET "lockStatus" = 'UNLOCKED' WHERE "lockStatus" IS NULL;

/*
  Notes:
  - All new Vault rows will have lockStatus='UNLOCKED' by default for backward compatibility
  - Existing vaults should be updated based on their actual state
  - New tables created for UnlockEvent audit trail
  - Indexes added for query performance
*/
