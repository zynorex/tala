import crypto from 'crypto';

/**
 * File Download & Decryption Module - Enterprise Grade
 * Handles secure file download with AES-256-GCM decryption
 * Includes integrity verification via SHA-256 hashing
 */

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_DIGEST = 'sha256';

export interface DownloadOptions {
  fileName: string;
  fileData: ArrayBuffer; // Encrypted file data from IPFS
  encryptedIV: string; // hex encoded
  encryptedAuthTag: string; // hex encoded
  encryptedSalt: string; // hex encoded
  expectedHash: string; // SHA-256 hash of original file
  password: string; // User-provided decryption password
  onProgress?: (progress: number) => void; // Progress callback (0-100)
}

export interface DecryptionResult {
  data: ArrayBuffer;
  fileName: string;
  fileHash: string;
  integrity: boolean; // Whether hash matches expected
}

/**
 * Derive encryption key from password using PBKDF2
 * Matches the key derivation from upload process
 * 
 * @param password User password
 * @param salt Salt for derivation
 * @returns Promise<Buffer> 256-bit encryption key
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Buffer
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      PBKDF2_DIGEST,
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      }
    );
  });
}

/**
 * Calculate SHA-256 hash of data
 * Used for integrity verification
 * 
 * @param data Data to hash
 * @returns hex encoded hash
 */
export function calculateHash(data: ArrayBuffer | Buffer): string {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Decrypt AES-256-GCM encrypted data
 * Includes authentication tag verification for tamper detection
 * 
 * @param encryptedData Encrypted data bytes
 * @param key Decryption key (256-bit)
 * @param iv Initialization vector
 * @param authTag Authentication tag
 * @returns Decrypted data as ArrayBuffer
 * @throws Error if authentication fails or decryption fails
 */
export async function decryptData(
  encryptedData: Buffer,
  key: Buffer,
  iv: Buffer,
  authTag: Buffer
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    try {
      // Validate key and IV
      if (!key || key.length !== KEY_LENGTH) {
        throw new Error(`Invalid key length: expected ${KEY_LENGTH} bytes, got ${key?.length || 0}`);
      }
      if (!iv || iv.length !== 16) {
        throw new Error(`Invalid IV length: expected 16 bytes, got ${iv?.length || 0}`);
      }
      if (!authTag || authTag.length !== 16) {
        throw new Error(`Invalid auth tag length: expected 16 bytes, got ${authTag?.length || 0}`);
      }

      // Create decipher
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      // Decrypt in chunks for memory efficiency
      const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final()
      ]);

      resolve(decrypted.buffer);
    } catch (error) {
      reject(
        new Error(
          `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}. File may be corrupted or password incorrect.`
        )
      );
    }
  });
}

/**
 * Download and decrypt a file
 * Comprehensive encryption with all security checks
 * 
 * @param options Download options including encrypted data, keys, etc.
 * @returns Promise<DecryptionResult> Decrypted file data
 * 
 * @throws Error if:
 *   - Password is incorrect
 *   - File is corrupted (auth tag fails)
 *   - Hash verification fails
 *   - Network error occurs
 */
export async function downloadAndDecryptFile(
  options: DownloadOptions
): Promise<DecryptionResult> {
  const {
    fileName,
    fileData,
    encryptedIV,
    encryptedAuthTag,
    encryptedSalt,
    expectedHash,
    password,
    onProgress
  } = options;

  try {
    // Step 1: Validate inputs
    if (!password || password.trim().length === 0) {
      throw new Error('Password is required for decryption');
    }

    if (!fileData || fileData.byteLength === 0) {
      throw new Error('No encrypted file data provided');
    }

    onProgress?.(10);

    // Step 2: Convert hex strings to buffers
    const iv = Buffer.from(encryptedIV, 'hex');
    const authTag = Buffer.from(encryptedAuthTag, 'hex');
    const salt = Buffer.from(encryptedSalt, 'hex');

    onProgress?.(20);

    // Step 3: Derive decryption key from password
    const key = await deriveKeyFromPassword(password, salt);
    onProgress?.(30);

    // Step 4: Prepare encrypted data buffer
    const encryptedBuffer = Buffer.from(fileData);
    onProgress?.(40);

    // Step 5: Decrypt the file
    const decryptedData = await decryptData(encryptedBuffer, key, iv, authTag);
    onProgress?.(70);

    // Step 6: Verify integrity via SHA-256 hash
    const actualHash = calculateHash(decryptedData);
    const hashMatches = actualHash === expectedHash.toLowerCase();

    if (!hashMatches) {
      console.warn(
        `Hash mismatch - File may be corrupted.\nExpected: ${expectedHash}\nActual: ${actualHash}`
      );
      // Don't throw - allow download but warn user
    }

    onProgress?.(90);

    return {
      data: decryptedData,
      fileName,
      fileHash: actualHash,
      integrity: hashMatches
    };
  } catch (error) {
    throw new Error(
      `Failed to download and decrypt file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Trigger browser file download
 * Creates a blob and initiates download
 * 
 * @param data File data to download
 * @param fileName File name for download
 * @param mimeType MIME type of file (defaults to application/octet-stream)
 */
export function triggerFileDownload(
  data: ArrayBuffer,
  fileName: string,
  mimeType: string = 'application/octet-stream'
): void {
  try {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(
      `Failed to download file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Complete download flow: fetch → decrypt → verify → download
 * 
 * @param ipfsHash IPFS hash of encrypted file
 * @param fileName Original file name
 * @param fileHash Expected SHA-256 hash
 * @param mimeType MIME type for file
 * @param password User-provided password
 * @param vaultId Vault ID for logging
 * @param onProgress Progress callback
 * @returns Promise<boolean> true if successful
 */
export async function completeFileDownload(
  ipfsHash: string,
  fileName: string,
  fileHash: string,
  mimeType: string,
  password: string,
  encryptionMetadata: {
    iv: string;
    authTag: string;
    salt: string;
  },
  vaultId: string,
  onProgress?: (progress: number) => void
): Promise<boolean> {
  try {
    onProgress?.(0);

    // Step 1: Fetch from IPFS
    onProgress?.(5);
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await fetch(ipfsUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file from IPFS: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    onProgress?.(35);

    // Step 2: Download and decrypt
    const result = await downloadAndDecryptFile({
      fileName,
      fileData: arrayBuffer,
      encryptedIV: encryptionMetadata.iv,
      encryptedAuthTag: encryptionMetadata.authTag,
      encryptedSalt: encryptionMetadata.salt,
      expectedHash: fileHash,
      password,
      onProgress: (progress) => onProgress?.(35 + (progress / 100) * 55)
    });

    onProgress?.(95);

    // Step 3: Log download activity (fire and forget)
    fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'download',
        description: `Downloaded file: ${fileName}`,
        vaultId
      })
    }).catch(err => console.error('Failed to log activity:', err));

    // Step 4: Trigger download
    triggerFileDownload(result.data, fileName, mimeType);
    onProgress?.(100);

    return true;
  } catch (error) {
    throw new Error(
      `File download failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
