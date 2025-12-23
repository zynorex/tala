/**
 * TALA IPFS Integration - Production Ready
 * Manages encrypted file upload/download from IPFS
 * Uses Pinata as primary provider with fallback to IPFS.io gateway
 * 
 * Security Features:
 * - Validates all IPFS hashes before operations
 * - Implements retry logic with exponential backoff
 * - Proper error handling and logging
 * - Size validation before upload
 * - Pinata-specific file management (pin/unpin)
 */

const IPFS_PROVIDERS = {
  PINATA_API: 'https://api.pinata.cloud',
  PINATA_GATEWAY: 'https://gateway.pinata.cloud',
  IPFS_IO: 'https://gateway.ipfs.io',
} as const;

// Configuration constants
const MAX_UPLOAD_SIZE = 500 * 1024 * 1024; // 500 MB
const UPLOAD_TIMEOUT = 300000; // 5 minutes
const DOWNLOAD_TIMEOUT = 120000; // 2 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Start with 1 second

interface IPFSUploadResponse {
  ipfsHash: string;
  size: number;
  timestamp: number;
  gateway: string;
}

interface IPFSDownloadResponse {
  data: Buffer;
  size: number;
  source: 'pinata' | 'ipfs.io';
}

interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

interface PinataError {
  error: string;
  statusCode: number;
}

/**
 * Validate IPFS hash format
 * Supports both CIDv0 (Qm...) and CIDv1 (bafy...)
 * CIDv0: 46 chars starting with Qm
 * CIDv1: Variable length starting with bafy, bafk, etc
 */
function validateIPFSHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  
  // CIDv0: exactly 46 chars, starts with Qm, base58 alphabet
  const cidv0Regex = /^Qm[a-zA-Z0-9]{44}$/;
  
  // CIDv1: starts with baf (bafy, bafk, etc), variable length, base32
  const cidv1Regex = /^baf[a-z2-7]{50,}$/;
  
  return cidv0Regex.test(hash) || cidv1Regex.test(hash);
}

/**
 * Validate Pinata API credentials
 */
function validatePinataCredentials(): { apiKey: string; apiSecret: string } {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

  if (!apiKey || !apiSecret) {
    throw new Error('Pinata credentials not configured. Set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_SECRET_API_KEY');
  }

  return { apiKey, apiSecret };
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delayMs = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return retryWithBackoff(fn, retries - 1, delayMs * 2);
  }
}

/**
 * Upload encrypted file to IPFS via Pinata
 * Implements comprehensive validation, retry logic, and error handling
 * 
 * @param encryptedFile Encrypted file data as Buffer
 * @param filename Original filename (for metadata only)
 * @param description File description (max 256 chars)
 * @param fileHash SHA-256 hash of original file (for verification)
 * @returns IPFS hash, size, and metadata
 * @throws Error if upload fails after retries or validation fails
 */
export async function uploadToIPFS(
  encryptedFile: Buffer,
  filename: string,
  description: string,
  fileHash?: string
): Promise<IPFSUploadResponse> {
  // Validate inputs
  if (!encryptedFile || encryptedFile.length === 0) {
    throw new Error('Encrypted file cannot be empty');
  }

  if (encryptedFile.length > MAX_UPLOAD_SIZE) {
    throw new Error(`File size ${encryptedFile.length} exceeds maximum ${MAX_UPLOAD_SIZE}`);
  }

  if (!filename || filename.trim().length === 0) {
    throw new Error('Filename cannot be empty');
  }

  if (description && description.length > 256) {
    throw new Error('Description cannot exceed 256 characters');
  }

  const { apiKey, apiSecret } = validatePinataCredentials();

  try {
    // Prepare FormData with encryption metadata
    const formData = new FormData();
    const blob = new Blob([Buffer.isBuffer(encryptedFile) ? encryptedFile.toString('binary') : encryptedFile], { type: 'application/octet-stream' });
    formData.append('file', blob, filename);

    // Add comprehensive Pinata metadata
    const pinataMetadata = {
      name: filename,
      keyvalues: {
        description: description || 'TALA encrypted vault file',
        app: 'tala-vault',
        encrypted: 'true',
        fileHash: fileHash || '', // Original file hash for verification
        uploadedAt: new Date().toISOString(),
        version: '1',
      },
    };
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

    // Upload with retry logic
    const uploadFn = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

      try {
        const response = await fetch(
          `${IPFS_PROVIDERS.PINATA_API}/pinning/pinFileToIPFS`,
          {
            method: 'POST',
            headers: {
              pinata_api_key: apiKey,
              pinata_secret_api_key: apiSecret,
            },
            body: formData,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = (await response.json()) as PinataError;
          throw new Error(
            `Pinata upload failed (${response.status}): ${error.error || response.statusText}`
          );
        }

        const data = (await response.json()) as PinataUploadResponse;
        
        return {
          ipfsHash: data.IpfsHash,
          size: encryptedFile.length,
          timestamp: Date.now(),
          gateway: IPFS_PROVIDERS.PINATA_GATEWAY,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    return await retryWithBackoff(uploadFn);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`IPFS upload failed: ${message}`);
  }
}

/**
 * Download encrypted file from IPFS
 * Tries Pinata gateway first, falls back to IPFS.io
 * Implements retry logic and comprehensive error handling
 * 
 * @param ipfsHash IPFS hash of encrypted file
 * @returns File data, size, and source gateway
 * @throws Error if download fails on all gateways
 */
export async function downloadFromIPFS(ipfsHash: string): Promise<IPFSDownloadResponse> {
  if (!validateIPFSHash(ipfsHash)) {
    throw new Error(`Invalid IPFS hash format: ${ipfsHash}`);
  }

  // Try Pinata gateway first (fastest for Pinata uploads)
  try {
    const data = await retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT);

      try {
        const response = await fetch(
          `${IPFS_PROVIDERS.PINATA_GATEWAY}/ipfs/${ipfsHash}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/octet-stream',
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
          data: buffer,
          size: buffer.length,
          source: 'pinata' as const,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }, 2); // Max 2 retries for Pinata

    return data;
  } catch (pinataError) {
    console.warn(`Pinata download failed, trying IPFS.io: ${pinataError}`);

    // Fallback to public IPFS gateway
    try {
      const data = await retryWithBackoff(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT);

        try {
          const response = await fetch(
            `${IPFS_PROVIDERS.IPFS_IO}/ipfs/${ipfsHash}`,
            {
              method: 'GET',
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          return {
            data: buffer,
            size: buffer.length,
            source: 'ipfs.io' as const,
          };
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      }, 2); // Max 2 retries for IPFS.io

      return data;
    } catch (ipfsError) {
      throw new Error(
        `IPFS download failed on all gateways. Pinata: ${pinataError}, IPFS.io: ${ipfsError}`
      );
    }
  }
}

/**
 * Unpin file from Pinata (cleanup when deleting vault)
 * Removes file from Pinata storage to free resources
 * 
 * @param ipfsHash IPFS hash to unpin
 * @returns Success status
 */
export async function unpinFileFromIPFS(ipfsHash: string): Promise<boolean> {
  if (!validateIPFSHash(ipfsHash)) {
    throw new Error(`Invalid IPFS hash format: ${ipfsHash}`);
  }

  try {
    const { apiKey, apiSecret } = validatePinataCredentials();

    const unpinFn = async () => {
      const response = await fetch(
        `${IPFS_PROVIDERS.PINATA_API}/pinning/unpin/${ipfsHash}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
          },
        }
      );

      if (!response.ok) {
        const error = (await response.json()) as PinataError;
        throw new Error(
          `Pinata unpin failed (${response.status}): ${error.error || response.statusText}`
        );
      }

      return true;
    };

    return await retryWithBackoff(unpinFn, 2);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to unpin ${ipfsHash}: ${message}`);
    // Don't throw - unpinning is a cleanup operation and shouldn't fail main flow
    return false;
  }
}

/**
 * Pin file permanently to Pinata
 * Ensures file availability and persistence
 * Useful for important vault backups
 * 
 * @param ipfsHash IPFS hash to pin
 * @returns Success status
 */
export async function pinFileToIPFS(ipfsHash: string): Promise<boolean> {
  if (!validateIPFSHash(ipfsHash)) {
    throw new Error(`Invalid IPFS hash format: ${ipfsHash}`);
  }

  try {
    const { apiKey, apiSecret } = validatePinataCredentials();

    const pinFn = async () => {
      const response = await fetch(
        `${IPFS_PROVIDERS.PINATA_API}/pinning/pinByHash`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
          },
          body: JSON.stringify({
            hashToPin: ipfsHash,
            pinataMetadata: {
              name: `pinned-${ipfsHash}`,
              keyvalues: {
                app: 'tala-vault',
                pinnedAt: new Date().toISOString(),
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const error = (await response.json()) as PinataError;
        throw new Error(
          `Pinata pin failed (${response.status}): ${error.error || response.statusText}`
        );
      }

      return true;
    };

    return await retryWithBackoff(pinFn, 2);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to pin ${ipfsHash}: ${message}`);
    return false;
  }
}

/**
 * Get file metadata from Pinata
 * Returns size and availability info
 * 
 * @param ipfsHash IPFS hash
 * @returns File size and availability status
 */
export async function getIPFSFileInfo(
  ipfsHash: string
): Promise<{ size: number; available: boolean; source: 'pinata' | 'ipfs.io' }> {
  if (!validateIPFSHash(ipfsHash)) {
    throw new Error(`Invalid IPFS hash format: ${ipfsHash}`);
  }

  // Try Pinata first
  try {
    const response = await fetch(
      `${IPFS_PROVIDERS.PINATA_GATEWAY}/ipfs/${ipfsHash}?meta=1`,
      {
        method: 'HEAD',
        headers: {
          Accept: 'application/octet-stream',
        },
      }
    );

    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;

    if (response.ok) {
      return { size, available: true, source: 'pinata' };
    }
  } catch (error) {
    console.warn('Pinata metadata check failed', error);
  }

  // Fallback to IPFS.io
  try {
    const response = await fetch(
      `${IPFS_PROVIDERS.IPFS_IO}/ipfs/${ipfsHash}?meta=1`,
      {
        method: 'HEAD',
      }
    );

    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;

    return { size, available: response.ok, source: 'ipfs.io' };
  } catch (error) {
    return { size: 0, available: false, source: 'ipfs.io' };
  }
}

/**
 * Generate IPFS gateway URL
 * @param ipfsHash IPFS hash
 * @param gateway Gateway provider (default: pinata)
 */
export function getIPFSGatewayURL(
  ipfsHash: string,
  gateway: 'pinata' | 'ipfs.io' = 'pinata'
): string {
  if (!validateIPFSHash(ipfsHash)) {
    throw new Error('Invalid IPFS hash format');
  }

  if (gateway === 'ipfs.io') {
    return `${IPFS_PROVIDERS.IPFS_IO}/ipfs/${ipfsHash}`;
  }

  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}
