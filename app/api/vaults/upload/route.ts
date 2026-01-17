/**
 * File Upload API Route - PHASE 1 IMPROVED
 * Handles file uploads with validation, quota checking, and IPFS storage
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/prisma";
import { validateFile } from "@/lib/utils/file-validation";
import { canUserUpload, recordBandwidthUsage } from "@/lib/utils/storage-quota";
import { uploadToIPFS } from "@/lib/ipfs/ipfs";
import { getLogger } from "@/lib/utils/logger";
import { NextRequest } from "next/server";
import crypto from "crypto";

const logger = getLogger('FileUpload');

interface UploadResponse {
  success: boolean;
  fileId?: string;
  ipfsHash?: string;
  error?: string;
  warnings?: string[];
}

export async function POST(req: NextRequest): Promise<Response> {
  const startTime = Date.now();

  try {
    // 1. Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      logger.warn("Upload attempt: No authentication");
      return Response.json<UploadResponse>(
        { success: false, error: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    logger.info("Upload started", { userId });

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const vaultId = formData.get("vaultId") as string;
    const encryptionPassword = formData.get("encryptionPassword") as string;

    if (!file) {
      logger.warn("Upload failed: No file provided", { userId });
      return Response.json<UploadResponse>(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!vaultId) {
      logger.warn("Upload failed: No vaultId provided", { userId });
      return Response.json<UploadResponse>(
        { success: false, error: "No vault ID provided" },
        { status: 400 }
      );
    }

    logger.debug("Received file", {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      vaultId,
    });

    // 3. Verify vault belongs to user
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      select: { userId: true, isActive: true, name: true },
    });

    if (!vault || vault.userId !== userId) {
      logger.warn("Upload failed: Unauthorized vault access", { userId, vaultId });
      return Response.json<UploadResponse>(
        { success: false, error: "Vault not found or unauthorized" },
        { status: 403 }
      );
    }

    if (!vault.isActive) {
      logger.warn("Upload failed: Vault not active", { userId, vaultId });
      return Response.json<UploadResponse>(
        { success: false, error: "This vault is inactive" },
        { status: 400 }
      );
    }

    // 4. Validate file (security checks)
    logger.info("Validating file", { fileName: file.name });
    const validation = await validateFile(file, true); // strict mode

    if (!validation.valid) {
      logger.warn("Upload failed: File validation failed", {
        userId,
        fileName: file.name,
        error: validation.error,
      });
      return Response.json<UploadResponse>(
        {
          success: false,
          error: validation.error,
          warnings: validation.warnings,
        },
        { status: 400 }
      );
    }

    // 5. Get user plan and check storage quota
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    const userPlan = user?.plan || "free";
    logger.info("Checking storage quota", { userId, userPlan, fileSize: file.size });

    const canUpload = await canUserUpload(userId, file.size, userPlan);

    if (!canUpload) {
      logger.warn("Upload failed: Storage quota exceeded", {
        userId,
        userPlan,
        fileSize: file.size,
      });
      return Response.json<UploadResponse>(
        {
          success: false,
          error: `Storage quota exceeded. You have used your ${userPlan} plan's limit. Upgrade your plan to continue.`,
        },
        { status: 413 }
      );
    }

    // 6. Read file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 7. Calculate original file hash
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 8. Encrypt file (AES-256-GCM)
    let encryptedBuffer = fileBuffer;
    let encryptionMetadata = {
      iv: "",
      salt: "",
      authTag: "",
      passwordHash: "",
    };

    if (encryptionPassword && encryptionPassword.length >= 8) {
      const ALGORITHM = 'aes-256-gcm';
      const KEY_LENGTH = 32;
      const IV_LENGTH = 16;
      const PBKDF2_ITERATIONS = 100000;

      const salt = crypto.randomBytes(32);
      const iv = crypto.randomBytes(IV_LENGTH);
      const key = crypto.pbkdf2Sync(encryptionPassword, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');

      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      encryptedBuffer = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
      const authTag = cipher.getAuthTag();

      encryptionMetadata = {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        authTag: authTag.toString('hex'),
        passwordHash: crypto.createHash('sha256').update(encryptionPassword).digest('hex'),
      };

      logger.debug("File encrypted", { fileName: file.name });
    }

    // 9. Upload encrypted file to IPFS
    logger.info("Uploading to IPFS", { fileName: file.name, fileSize: encryptedBuffer.length });
    let ipfsHash: string;

    try {
      // Create a File object for IPFS
      const encryptedFile = new File([encryptedBuffer], `${file.name}.encrypted`, {
        type: "application/octet-stream",
      });
      
      ipfsHash = await uploadToIPFS(encryptedFile);
      logger.info("IPFS upload successful", { ipfsHash, fileName: file.name });
    } catch (error) {
      logger.error("IPFS upload failed", error instanceof Error ? error : undefined);
      return Response.json<UploadResponse>(
        { success: false, error: "Failed to upload file to storage. Please try again." },
        { status: 500 }
      );
    }

    // 10. Save file record to database
    logger.info("Creating file record", { ipfsHash, vaultId });
    const vaultFile = await db.vaultFile.create({
      data: {
        vaultId,
        fileName: file.name,
        ipfsHash,
        fileSize: file.size,
        fileSizeBytes: file.size,
        mimeType: file.type || "application/octet-stream",
        fileHash,
        encryptionIV: encryptionMetadata.iv,
        encryptionSalt: encryptionMetadata.salt,
        encryptionAuthTag: encryptionMetadata.authTag,
        uploadedAt: new Date(),
      },
    });

    // 11. Record bandwidth usage
    logger.info("Recording bandwidth usage", { userId, bytes: file.size });
    await recordBandwidthUsage(userId, file.size);

    // 12. Log activity
    await db.activityLog.create({
      data: {
        userId,
        type: "FILE_UPLOADED",
        description: `Uploaded ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        metadata: {
          vaultId,
          fileId: vaultFile.id,
          fileName: file.name,
          fileSize: file.size,
          ipfsHash,
        },
      },
    });

    const duration = Date.now() - startTime;
    logger.info("Upload completed successfully", {
      userId,
      fileId: vaultFile.id,
      duration: `${duration}ms`,
    });

    return Response.json<UploadResponse>(
      {
        success: true,
        fileId: vaultFile.id,
        ipfsHash,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Upload error", error instanceof Error ? error : undefined);

    return Response.json<UploadResponse>(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during upload",
      },
      { status: 500 }
    );
  }
}
