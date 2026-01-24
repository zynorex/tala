'use client';

import { useState, useCallback } from 'react';
import { useToast } from './useToast';

interface FileDownloadParams {
  vaultId: string;
  fileId: string;
  fileName: string;
  password: string;
}

/**
 * Decrypt file using AES-256-GCM (browser-side decryption)
 */
async function decryptFileData(
  encryptedHex: string,
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
  const encryptedBuffer = hexToArrayBuffer(encryptedHex);
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
  const fullEncrypted = new Uint8Array([
    ...new Uint8Array(encryptedBuffer),
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
  const { toast } = useToast();
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
          throw new Error(error.error || 'Failed to download file');
        }

        setProgress(30);

        const data = await response.json();
        const fileMetadata = data.file;

        if (!fileMetadata || !fileMetadata.ipfsHash) {
          throw new Error('Invalid file metadata received');
        }

        // Step 2: Fetch encrypted file from IPFS (simulated)
        // In production, this would be: https://gateway.pinata.cloud/ipfs/QmHash
        // For now, we simulate by storing base64 in localStorage
        const encryptedKey = `encrypted_file_${fileId}`;
        const storedEncrypted = localStorage.getItem(encryptedKey);

        if (!storedEncrypted) {
          throw new Error('Encrypted file data not found');
        }

        setProgress(60);

        // Decode base64 to hex
        const binaryString = atob(storedEncrypted);
        let encryptedHex = '';
        for (let i = 0; i < binaryString.length; i++) {
          encryptedHex += ('0' + binaryString.charCodeAt(i).toString(16)).slice(-2);
        }

        // Step 3: Decrypt file client-side
        setProgress(70);
        const decrypted = await decryptFileData(
          encryptedHex,
          password,
          fileMetadata.encryption.iv,
          fileMetadata.encryption.salt,
          fileMetadata.encryption.authTag
        );

        setProgress(90);

        // Step 4: Trigger download
        const blob = new Blob([decrypted.buffer as ArrayBuffer], { type: fileMetadata.mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

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
