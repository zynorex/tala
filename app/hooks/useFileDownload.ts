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

        // Call server action to get file data
        const response = await fetch(`/api/vaults/${vaultId}/files/${fileId}/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to download file');
        }

        setProgress(50);

        // Get the blob from response
        const blob = await response.blob();

        setProgress(90);

        // Trigger browser download
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
