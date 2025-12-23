import { useState, useCallback } from 'react';
import {
  downloadAndDecryptFile,
  completeFileDownload,
  type DownloadOptions,
  type DecryptionResult
} from '@/lib/crypto/file-download';
import { useToast } from './useToast';

export interface FileDownloadState {
  isLoading: boolean;
  progress: number;
  error: string | null;
  isDecrypting: boolean;
  isDownloading: boolean;
}

export interface FileDownloadResult {
  success: boolean;
  data?: DecryptionResult;
  error?: string;
}

/**
 * Custom hook for file download and decryption
 * Handles:
 * - Password validation
 * - Decryption with progress tracking
 * - Error handling
 * - Browser download triggering
 * - Activity logging
 * 
 * @returns Object with download function and state
 */
export function useFileDownload() {
  const { toast } = useToast();
  const [state, setState] = useState<FileDownloadState>({
    isLoading: false,
    progress: 0,
    error: null,
    isDecrypting: false,
    isDownloading: false
  });

  /**
   * Download and decrypt a single file
   * Simple interface for one-off downloads
   */
  const downloadFile = useCallback(
    async (options: DownloadOptions): Promise<FileDownloadResult> => {
      setState({ isLoading: true, progress: 0, error: null, isDecrypting: true, isDownloading: false });

      try {
        // Validate password
        if (!options.password || options.password.trim().length === 0) {
          const error = 'Password is required';
          setState({ isLoading: false, progress: 0, error, isDecrypting: false, isDownloading: false });
          toast(error, 'error');
          return { success: false, error };
        }

        if (options.password.length < 1) {
          const error = 'Password must be at least 1 character';
          setState({ isLoading: false, progress: 0, error, isDecrypting: false, isDownloading: false });
          toast(error, 'error');
          return { success: false, error };
        }

        // Decrypt file
        const result = await downloadAndDecryptFile({
          ...options,
          onProgress: (progress) => {
            setState(prev => ({ ...prev, progress: Math.min(progress, 99) }));
          }
        });

        // Warn if integrity check failed
        if (!result.integrity) {
          toast(
            'Warning: File integrity check failed. File may be corrupted.',
            'warning'
          );
        } else {
          toast('File downloaded successfully!', 'success');
        }

        setState({ isLoading: false, progress: 100, error: null, isDecrypting: false, isDownloading: true });

        // Reset after short delay
        setTimeout(() => {
          setState({ isLoading: false, progress: 0, error: null, isDecrypting: false, isDownloading: false });
        }, 1000);

        return { success: true, data: result };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({ isLoading: false, progress: 0, error: errorMessage, isDecrypting: false, isDownloading: false });
        toast(errorMessage, 'error');
        return { success: false, error: errorMessage };
      }
    },
    [toast]
  );

  /**
   * Complete download flow from IPFS
   * Used in vault detail page
   */
  const downloadFromIPFS = useCallback(
    async (
      ipfsHash: string,
      fileName: string,
      fileHash: string,
      mimeType: string,
      password: string,
      encryptionMetadata: { iv: string; authTag: string; salt: string },
      vaultId: string
    ): Promise<boolean> => {
      setState({ isLoading: true, progress: 0, error: null, isDecrypting: true, isDownloading: false });

      try {
        // Validate password
        if (!password || password.trim().length === 0) {
          const error = 'Password is required for decryption';
          setState({ isLoading: false, progress: 0, error, isDecrypting: false, isDownloading: false });
          toast(error, 'error');
          return false;
        }

        // Perform complete download
        const success = await completeFileDownload(
          ipfsHash,
          fileName,
          fileHash,
          mimeType,
          password,
          encryptionMetadata,
          vaultId,
          (progress) => {
            setState(prev => ({ ...prev, progress: Math.min(progress, 99) }));
          }
        );

        if (success) {
          toast('File downloaded successfully!', 'success');
        }

        setState({ isLoading: false, progress: 100, error: null, isDecrypting: false, isDownloading: true });

        // Reset after delay
        setTimeout(() => {
          setState({ isLoading: false, progress: 0, error: null, isDecrypting: false, isDownloading: false });
        }, 1000);

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
        setState({ isLoading: false, progress: 0, error: errorMessage, isDecrypting: false, isDownloading: false });
        toast(errorMessage, 'error');
        return false;
      }
    },
    [toast]
  );

  /**
   * Reset download state
   */
  const reset = useCallback(() => {
    setState({ isLoading: false, progress: 0, error: null, isDecrypting: false, isDownloading: false });
  }, []);

  return {
    // State
    ...state,

    // Methods
    downloadFile,
    downloadFromIPFS,
    reset,

    // Derived state
    isActive: state.isLoading,
    progressPercent: Math.round(state.progress)
  };
}
