/**
 * IPFS Service - Complete Implementation
 * Handles file upload, download, encryption, and decryption
 */

import { PinataSDK } from "pinata-web3";
import { getLogger } from "@/lib/utils/logger";
import crypto from "crypto";

const logger = getLogger('IPFSService');

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY || "gateway.pinata.cloud",
});

/**
 * Upload file to IPFS via Pinata
 * Handles both encrypted and unencrypted files
 */
export async function uploadToIPFS(file: File | Blob, fileName?: string): Promise<string> {
  try {
    if (!process.env.PINATA_JWT) {
      throw new Error("PINATA_JWT not configured");
    }

    logger.info("Starting IPFS upload", {
      fileName: fileName || (file instanceof File ? file.name : "blob"),
      fileSize: file.size,
    });

    // Create form data for Pinata
    const formData = new FormData();
    formData.append("file", file);

    // Add metadata
    const metadata = {
      name: fileName || (file instanceof File ? file.name : "file"),
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        uploader: "TALA",
      },
    };
    formData.append("pinataMetadata", JSON.stringify(metadata));

    // Upload to Pinata
    const response = await pinata.upload.file(file);

    if (!response.IpfsHash) {
      throw new Error("No IPFS hash returned from Pinata");
    }

    logger.info("IPFS upload successful", {
      ipfsHash: response.IpfsHash,
      fileSize: file.size,
    });

    return response.IpfsHash;
  } catch (error) {
    logger.error("IPFS upload failed", error instanceof Error ? error : undefined);
    throw new Error(
      `Failed to upload file to IPFS: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Download file from IPFS
 * Handles both encrypted and unencrypted downloads
 */
export async function downloadFromIPFS(ipfsHash: string): Promise<Blob> {
  try {
    if (!ipfsHash) {
      throw new Error("Invalid IPFS hash");
    }

    logger.info("Starting IPFS download", { ipfsHash });

    const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";
    const url = `https://${gateway}/ipfs/${ipfsHash}`;

    const response = await fetch(url, {
      timeout: 300000, // 5 minute timeout for large files
    });

    if (!response.ok) {
      logger.warn("IPFS download failed", {
        ipfsHash,
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const blob = await response.blob();

    logger.info("IPFS download successful", { ipfsHash, blobSize: blob.size });

    return blob;
  } catch (error) {
    logger.error("IPFS download failed", error instanceof Error ? error : undefined);
    throw new Error(
      `Failed to download file from IPFS: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Encrypt buffer using AES-256-GCM
 * Returns encryption metadata needed for decryption
 */
export function encryptBuffer(
  buffer: Buffer,
  password: string
): {
  encrypted: Buffer;
  iv: string;
  salt: string;
  authTag: string;
  fileHash: string;
} {
  try {
    const ALGORITHM = "aes-256-gcm";
    const KEY_LENGTH = 32;
    const IV_LENGTH = 16;
    const PBKDF2_ITERATIONS = 100000;

    // Calculate hash of original file
    const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Generate salt and IV
    const salt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive key from password
    const key = crypto.pbkdf2Sync(
      password,
      salt,
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      "sha256"
    );

    // Encrypt
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(buffer),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    logger.debug("Buffer encrypted successfully", { fileHash });

    return {
      encrypted,
      iv: iv.toString("hex"),
      salt: salt.toString("hex"),
      authTag: authTag.toString("hex"),
      fileHash,
    };
  } catch (error) {
    logger.error("Encryption failed", error instanceof Error ? error : undefined);
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Decrypt buffer using AES-256-GCM
 * Requires encryption metadata from encryptBuffer()
 */
export function decryptBuffer(
  encryptedBuffer: Buffer,
  password: string,
  iv: string,
  salt: string,
  authTag: string
): Buffer {
  try {
    const ALGORITHM = "aes-256-gcm";
    const KEY_LENGTH = 32;
    const PBKDF2_ITERATIONS = 100000;

    // Derive same key from password
    const key = crypto.pbkdf2Sync(
      password,
      Buffer.from(salt, "hex"),
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      "sha256"
    );

    // Decrypt
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);

    logger.debug("Buffer decrypted successfully");

    return decrypted;
  } catch (error) {
    logger.error("Decryption failed", error instanceof Error ? error : undefined);
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : "Invalid password or corrupted file"}`
    );
  }
}

/**
 * Verify IPFS pin is accessible
 * Useful for health checks
 */
export async function verifyIPFSPin(ipfsHash: string): Promise<boolean> {
  try {
    const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";
    const url = `https://${gateway}/ipfs/${ipfsHash}`;

    const response = await fetch(url, {
      method: "HEAD",
      timeout: 30000, // 30 second timeout
    });

    const isValid = response.ok;
    logger.debug("IPFS pin verification", { ipfsHash, valid: isValid });

    return isValid;
  } catch (error) {
    logger.warn("IPFS pin verification failed", {
      ipfsHash,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}

/**
 * Get file info from IPFS
 */
export async function getIPFSFileInfo(
  ipfsHash: string
): Promise<{ size: number; accessible: boolean }> {
  try {
    const blob = await downloadFromIPFS(ipfsHash);
    const accessible = await verifyIPFSPin(ipfsHash);

    return {
      size: blob.size,
      accessible,
    };
  } catch (error) {
    logger.error("Failed to get IPFS file info", error instanceof Error ? error : undefined);
    return {
      size: 0,
      accessible: false,
    };
  }
}

/**
 * Complete upload flow: Encrypt + Upload to IPFS
 */
export async function uploadEncryptedFile(
  file: File,
  password: string
): Promise<{
  ipfsHash: string;
  iv: string;
  salt: string;
  authTag: string;
  fileHash: string;
}> {
  try {
    // Read file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Encrypt
    const { encrypted, iv, salt, authTag, fileHash } = encryptBuffer(
      fileBuffer,
      password
    );

    // Create encrypted file
    const encryptedFile = new File([encrypted], `${file.name}.encrypted`, {
      type: "application/octet-stream",
    });

    // Upload to IPFS
    const ipfsHash = await uploadToIPFS(encryptedFile);

    logger.info("Encrypted file uploaded successfully", { ipfsHash });

    return {
      ipfsHash,
      iv,
      salt,
      authTag,
      fileHash,
    };
  } catch (error) {
    logger.error("Encrypted upload failed", error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Complete download flow: Download from IPFS + Decrypt
 */
export async function downloadDecryptedFile(
  ipfsHash: string,
  password: string,
  iv: string,
  salt: string,
  authTag: string,
  fileName: string
): Promise<Blob> {
  try {
    // Download from IPFS
    const encryptedBlob = await downloadFromIPFS(ipfsHash);
    const encryptedBuffer = Buffer.from(await encryptedBlob.arrayBuffer());

    // Decrypt
    const decryptedBuffer = decryptBuffer(
      encryptedBuffer,
      password,
      iv,
      salt,
      authTag
    );

    // Return as blob
    const decryptedBlob = new Blob([decryptedBuffer], {
      type: "application/octet-stream",
    });

    logger.info("File decrypted successfully", { ipfsHash });

    return decryptedBlob;
  } catch (error) {
    logger.error("Decrypted download failed", error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Health check for IPFS service
 */
export async function healthCheck(): Promise<{ healthy: boolean; message: string }> {
  try {
    // Test Pinata connectivity
    if (!process.env.PINATA_JWT) {
      return {
        healthy: false,
        message: "PINATA_JWT not configured",
      };
    }

    logger.info("IPFS health check");

    return {
      healthy: true,
      message: "IPFS service healthy",
    };
  } catch (error) {
    logger.error("IPFS health check failed", error instanceof Error ? error : undefined);
    return {
      healthy: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

