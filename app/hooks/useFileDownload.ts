'use client';

import { useState, useCallback } from 'react';

interface FileDownloadParams {
  vaultId: string;
  fileId: string;
  fileName: string;
  password: string;
}

// Custom error class for vault locked state
export class VaultLockedError extends Error {
  unlockTime: string | null;
  remainingTime: string | null;
  
  constructor(message: string, unlockTime?: string, remainingTime?: string) {
    super(message);
    this.name = 'VaultLockedError';
    this.unlockTime = unlockTime || null;
    this.remainingTime = remainingTime || null;
  }
}

/**
 * Decrypt file using AES-256-GCM (browser-side decryption)
 */
async function decryptFileData(
  encryptedData: ArrayBuffer,
  password: string,
  iv: string,
  salt: string,
  authTag: string
): Promise<Uint8Array> {
  const ALGORITHM = 'AES-GCM';
  const KEY_LENGTH = 32;
  const PBKDF2_ITERATIONS = 100000;

  // Convert hex strings to ArrayBuffers
  const saltBuffer = hexToArrayBuffer(salt);
  const ivBuffer = hexToArrayBuffer(iv);
  const authTagBuffer = hexToArrayBuffer(authTag);

  // Derive key using PBKDF2
  const passwordEncoder = new TextEncoder();
  const passwordBuffer = passwordEncoder.encode(password);

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      hash: 'SHA-256',
      iterations: PBKDF2_ITERATIONS,
    },
    baseKey,
    KEY_LENGTH * 8
  );

  const key = await window.crypto.subtle.importKey(
    'raw',
    derivedBits,
    { name: ALGORITHM },
    false,
    ['decrypt']
  );

  // Combine encrypted data with auth tag for decryption
  const encryptedArray = new Uint8Array(encryptedData);
  const fullEncrypted = new Uint8Array([
    ...encryptedArray,
    ...new Uint8Array(authTagBuffer),
  ]);

  // Decrypt
  try {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: ivBuffer,
      },
      key,
      fullEncrypted
    );
    return new Uint8Array(decrypted);
  } catch (error) {
    throw new Error('Decryption failed: Invalid password or corrupted file');
  }
}

/**
 * Convert hex string to ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

/**
 * Custom hook for file download and decryption
 * Manages download state and progress tracking
 */
export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadAndDecryptFile = useCallback(
    async (params: FileDownloadParams): Promise<void> => {
      const { vaultId, fileId, fileName, password } = params;

      // Validate password
      if (!password || password.trim().length === 0) {
        throw new Error('Password is required for decryption');
      }

      try {
        setIsDownloading(true);
        setProgress(10);

        // Get auth token
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Please sign in to download files');
        }

        // Step 1: Get file metadata from server
        const response = await fetch(`/api/vaults/${vaultId}/files/${fileId}/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const error = await response.json();
          
          // Handle vault locked (423) response - throw custom error
          if (response.status === 423) {
            setIsDownloading(false);
            setProgress(0);
            throw new VaultLockedError(
              error.reason || 'Vault is locked',
              error.unlockTime,
              error.remainingTime
            );
          }
          
          throw new Error(error.error || 'Failed to download file');
        }

        setProgress(30);

        const data = await response.json();
        console.log('[Download] API response:', data);
        const fileMetadata = data.file;

        if (!fileMetadata || !fileMetadata.ipfsHash) {
          console.error('[Download] Invalid file metadata:', fileMetadata);
          throw new Error('Invalid file metadata received');
        }

        console.log('[Download] File metadata:', {
          id: fileMetadata.id,
          fileName: fileMetadata.fileName,
          ipfsHash: fileMetadata.ipfsHash,
          hasEncryption: !!fileMetadata.encryption,
          encryption: fileMetadata.encryption,
        });

        // Step 2: Fetch encrypted file from IPFS gateway
        setProgress(40);
        
        // Try Pinata gateway first, then fallback to public gateway
        const gateways = [
          `https://gateway.pinata.cloud/ipfs/${fileMetadata.ipfsHash}`,
          `https://ipfs.io/ipfs/${fileMetadata.ipfsHash}`,
          `https://cloudflare-ipfs.com/ipfs/${fileMetadata.ipfsHash}`,
        ];

        let encryptedData: ArrayBuffer | null = null;
        let lastError: Error | null = null;

        for (const gatewayUrl of gateways) {
          try {
            const ipfsResponse = await fetch(gatewayUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/octet-stream',
              },
            });

            if (ipfsResponse.ok) {
              encryptedData = await ipfsResponse.arrayBuffer();
              break;
            }
          } catch (err) {
            lastError = err instanceof Error ? err : new Error('Gateway fetch failed');
            console.warn(`Gateway ${gatewayUrl} failed:`, err);
          }
        }

        if (!encryptedData) {
          throw new Error(lastError?.message || 'Failed to download file from IPFS');
        }

        console.log('[Download] IPFS data received, size:', encryptedData.byteLength);
        setProgress(60);

        // Step 3: Decrypt file client-side if encrypted, otherwise download directly
        setProgress(70);
        
        // Check if encryption metadata exists
        const hasEncryption = fileMetadata.encryption?.iv && 
                              fileMetadata.encryption?.salt && 
                              fileMetadata.encryption?.authTag;

        let finalBlob: Blob;

        if (hasEncryption) {
          console.log('[Download] Decrypting file with encryption metadata');
          const decrypted = await decryptFileData(
            encryptedData,
            password,
            fileMetadata.encryption.iv,
            fileMetadata.encryption.salt,
            fileMetadata.encryption.authTag
          );
          console.log('[Download] Decryption successful, size:', decrypted.length);
          finalBlob = new Blob([decrypted.buffer as ArrayBuffer], { type: fileMetadata.mimeType || 'application/octet-stream' });
        } else {
          // File was not encrypted with password, download directly
          console.log('[Download] No encryption metadata, downloading directly');
          finalBlob = new Blob([encryptedData], { type: fileMetadata.mimeType || 'application/octet-stream' });
        }

        setProgress(90);

        // Step 4: Trigger download
        console.log('[Download] Creating download link for:', fileName, 'Size:', finalBlob.size);
        const url = window.URL.createObjectURL(finalBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        console.log('[Download] Triggering download click');
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('[Download] Download triggered successfully');

        setProgress(100);

        // Reset after delay
        setTimeout(() => {
          setProgress(0);
          setIsDownloading(false);
        }, 500);
      } catch (error) {
        console.error('Error downloading file:', error);
        setIsDownloading(false);
        setProgress(0);
        throw error;
      }
    },
    []
  );

  return {
    downloadAndDecryptFile,
    isDownloading,
    progress,
  };
}
