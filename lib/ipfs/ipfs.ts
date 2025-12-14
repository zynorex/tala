/**
 * TALA IPFS Integration
 * Manages encrypted file upload/download from IPFS
 * Uses Pinata as default provider (can be switched to local node)
 */

const IPFS_PROVIDERS = {
  PINATA: 'https://api.pinata.cloud',
  IPFS_IO: 'https://gateway.ipfs.io',
} as const;

interface IPFSUploadResponse {
  ipfsHash: string;
  size: number;
  timestamp: number;
}

interface IPFSDownloadResponse {
  data: Buffer;
  size: number;
}

/**
 * Validate IPFS hash format
 * Supports both CIDv0 (Qm...) and CIDv1 (bafy...)
 */
function validateIPFSHash(hash: string): boolean {
  // CIDv0: starts with Qm and is 46 chars (base58)
  const cidv0Regex = /^Qm[a-zA-Z0-9]{44}$/;
  
  // CIDv1: starts with bafy and variable length (base32)
  const cidv1Regex = /^bafy[a-z2-7]{50,}$/;
  
  return cidv0Regex.test(hash) || cidv1Regex.test(hash);
}

/**
 * Upload encrypted file to IPFS via Pinata
 * @param encryptedFile Encrypted file data
 * @param filename Original filename (metadata only)
 * @param description File description
 * @returns IPFS hash and metadata
 */
export async function uploadToIPFS(
  encryptedFile: Buffer,
  filename: string,
  description: string
): Promise<IPFSUploadResponse> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const apiSecret = process.env.PINATA_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Pinata credentials not configured');
  }

  try {
    const formData = new FormData();
    const blob = new Blob([encryptedFile], { type: 'application/octet-stream' });
    formData.append('file', blob, filename);

    // Add metadata
    const pinataMetadata = {
      name: filename,
      keyvalues: {
        description: description,
        app: 'tala-vault',
        encrypted: 'true',
        timestamp: new Date().toISOString(),
      },
    };
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

    const response = await fetch(`${IPFS_PROVIDERS.PINATA}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const data = (await response.json()) as any;

    return {
      ipfsHash: data.IpfsHash,
      size: encryptedFile.length,
      timestamp: Date.now(),
    };
  } catch (error) {
    throw new Error(`IPFS upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Download encrypted file from IPFS
 * @param ipfsHash IPFS hash of file
 * @returns File data and size
 */
export async function downloadFromIPFS(ipfsHash: string): Promise<IPFSDownloadResponse> {
  if (!validateIPFSHash(ipfsHash)) {
    throw new Error('Invalid IPFS hash format');
  }

  try {
    // Try Pinata gateway first
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      data: buffer,
      size: buffer.length,
    };
  } catch (error) {
    // Fallback to public IPFS gateway
    try {
      const fallbackResponse = await fetch(`${IPFS_PROVIDERS.IPFS_IO}/ipfs/${ipfsHash}`, {
        method: 'GET',
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback gateway failed: ${fallbackResponse.statusText}`);
      }

      const arrayBuffer = await fallbackResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        data: buffer,
        size: buffer.length,
      };
    } catch (fallbackError) {
      throw new Error(
        `IPFS download failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

/**
 * Pin file permanently to Pinata
 * Ensures file availability
 */
export async function pinFileIPFS(ipfsHash: string): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const apiSecret = process.env.PINATA_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn('Pinata credentials not available for pinning');
    return false;
  }

  if (!validateIPFSHash(ipfsHash)) {
    throw new Error('Invalid IPFS hash format');
  }

  try {
    const response = await fetch(
      `${IPFS_PROVIDERS.PINATA}/pinning/pinByHash`,
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
            },
          },
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Failed to pin file:', error);
    return false;
  }
}

/**
 * Get file metadata from IPFS
 * Returns size and availability info
 */
export async function getIPFSFileInfo(ipfsHash: string): Promise<{ size: number; available: boolean }> {
  if (!validateIPFSHash(ipfsHash)) {
    throw new Error('Invalid IPFS hash format');
  }

  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}?meta=1`, {
      method: 'HEAD',
    });

    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;

    return {
      size,
      available: response.ok,
    };
  } catch (error) {
    return {
      size: 0,
      available: false,
    };
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
