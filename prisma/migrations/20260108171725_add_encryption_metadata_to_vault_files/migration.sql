-- AlterTable
ALTER TABLE "VaultFile" ADD COLUMN     "encryptionAuthTag" TEXT,
ADD COLUMN     "encryptionIV" TEXT,
ADD COLUMN     "encryptionSalt" TEXT;
