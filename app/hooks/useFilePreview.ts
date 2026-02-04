'use client';

import { useState, useCallback } from 'react';
import { VaultLockedError } from './useFileDownload';

// ============ TYPES ============

interface FilePreviewParams {
  vaultId: string;
  fileId: string;
  fileName: string;
  mimeType: string | null;
  password: string;
}

interface PreviewData {
  url: string;
  blob: Blob;
  mimeType: string;
  fileName: string;
  fileSize: number;
  textContent?: string; // For text-based files
}

type PreviewType = 
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'code'
  | 'text'
  | 'markdown'
  | 'json'
  | 'csv'
  | 'unsupported';

// ============ CONSTANTS ============

// File type mappings
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/ico', 'image/x-icon'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
const AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp3', 'audio/aac', 'audio/flac'];
const PDF_TYPES = ['application/pdf'];
const JSON_TYPES = ['application/json'];
const CSV_TYPES = ['text/csv', 'application/csv'];
const MARKDOWN_TYPES = ['text/markdown', 'text/x-markdown'];
const CODE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.java', '.c', '.cpp', '.h', '.hpp',
  '.cs', '.go', '.rs', '.php', '.swift', '.kt', '.scala', '.vue', '.svelte',
  '.html', '.htm', '.css', '.scss', '.sass', '.less', '.xml', '.yaml', '.yml',
  '.sh', '.bash', '.zsh', '.ps1', '.bat', '.sql', '.graphql', '.prisma',
  '.dockerfile', '.docker', '.env', '.gitignore', '.editorconfig', '.sol'
];
const TEXT_TYPES = ['text/plain', 'text/html', 'text/css', 'text/javascript', 'application/javascript', 'application/xml', 'text/xml'];

// Language detection for syntax highlighting
const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  '.js': 'javascript',
  '.jsx': 'jsx',
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.py': 'python',
  '.rb': 'ruby',
  '.java': 'java',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp',
  '.cs': 'csharp',
  '.go': 'go',
  '.rs': 'rust',
  '.php': 'php',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.scala': 'scala',
  '.vue': 'vue',
  '.svelte': 'svelte',
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.json': 'json',
  '.md': 'markdown',
  '.sh': 'bash',
  '.bash': 'bash',
  '.zsh': 'bash',
  '.ps1': 'powershell',
  '.bat': 'batch',
  '.sql': 'sql',
  '.graphql': 'graphql',
  '.prisma': 'prisma',
  '.dockerfile': 'dockerfile',
  '.docker': 'dockerfile',
  '.env': 'plaintext',
  '.gitignore': 'plaintext',
  '.sol': 'solidity',
  '.txt': 'plaintext',
};

// ============ HELPER FUNCTIONS ============

/**
 * Determine preview type based on MIME type and filename
 */
export function getPreviewType(mimeType: string | null, fileName: string): PreviewType {
  const normalizedMime = mimeType?.toLowerCase() || '';
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();

  // Check MIME types first
  if (IMAGE_TYPES.includes(normalizedMime)) return 'image';
  if (VIDEO_TYPES.includes(normalizedMime)) return 'video';
  if (AUDIO_TYPES.includes(normalizedMime)) return 'audio';
  if (PDF_TYPES.includes(normalizedMime)) return 'pdf';
  if (JSON_TYPES.includes(normalizedMime)) return 'json';
  if (CSV_TYPES.includes(normalizedMime)) return 'csv';
  if (MARKDOWN_TYPES.includes(normalizedMime)) return 'markdown';
  if (TEXT_TYPES.includes(normalizedMime)) return 'text';

  // Check by file extension
  if (CODE_EXTENSIONS.includes(extension)) return 'code';
  if (['.md', '.markdown'].includes(extension)) return 'markdown';
  if (['.json'].includes(extension)) return 'json';
  if (['.csv'].includes(extension)) return 'csv';
  if (['.txt', '.log', '.text'].includes(extension)) return 'text';
  if (['.pdf'].includes(extension)) return 'pdf';

  // Image extensions
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'].includes(extension)) return 'image';
  
  // Video extensions
  if (['.mp4', '.webm', '.ogg', '.mov', '.avi'].includes(extension)) return 'video';
  
  // Audio extensions
  if (['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'].includes(extension)) return 'audio';

  return 'unsupported';
}

/**
 * Get language for syntax highlighting
 */
export function getLanguageFromFileName(fileName: string): string {
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  return EXTENSION_TO_LANGUAGE[extension] || 'plaintext';
}

/**
 * Check if file type supports preview
 */
export function isPreviewSupported(mimeType: string | null, fileName: string): boolean {
  return getPreviewType(mimeType, fileName) !== 'unsupported';
}

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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

  const saltBuffer = hexToArrayBuffer(salt);
  const ivBuffer = hexToArrayBuffer(iv);
  const authTagBuffer = hexToArrayBuffer(authTag);

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

  const encryptedArray = new Uint8Array(encryptedData);
  const fullEncrypted = new Uint8Array([
    ...encryptedArray,
    ...new Uint8Array(authTagBuffer),
  ]);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGORITHM, iv: ivBuffer },
      key,
      fullEncrypted
    );
    return new Uint8Array(decrypted);
  } catch {
    throw new Error('Decryption failed: Invalid password or corrupted file');
  }
}

// ============ MAIN HOOK ============

/**
 * Custom hook for file preview with decryption support
 */
export function useFilePreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  /**
   * Load and decrypt file for preview
   */
  const loadPreview = useCallback(
    async (params: FilePreviewParams): Promise<PreviewData> => {
      const { vaultId, fileId, fileName, mimeType, password } = params;

      if (!password || password.trim().length === 0) {
        throw new Error('Password is required for decryption');
      }

      try {
        setIsLoading(true);
        setError(null);
        setProgress(5);

        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Please sign in to preview files');
        }

        // Step 1: Get file metadata
        setProgress(10);
        const response = await fetch(`/api/vaults/${vaultId}/files/${fileId}/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 423) {
            throw new VaultLockedError(
              errorData.reason || 'Vault is locked',
              errorData.unlockTime,
              errorData.remainingTime
            );
          }
          
          throw new Error(errorData.error || 'Failed to load file');
        }

        setProgress(25);
        const data = await response.json();
        const fileMetadata = data.file;

        if (!fileMetadata?.ipfsHash) {
          throw new Error('Invalid file metadata');
        }

        // Step 2: Fetch from IPFS
        setProgress(35);
        const gateways = [
          `https://gateway.pinata.cloud/ipfs/${fileMetadata.ipfsHash}`,
          `https://ipfs.io/ipfs/${fileMetadata.ipfsHash}`,
          `https://cloudflare-ipfs.com/ipfs/${fileMetadata.ipfsHash}`,
        ];

        let encryptedData: ArrayBuffer | null = null;
        for (const gatewayUrl of gateways) {
          try {
            const ipfsResponse = await fetch(gatewayUrl);
            if (ipfsResponse.ok) {
              encryptedData = await ipfsResponse.arrayBuffer();
              break;
            }
          } catch {
            continue;
          }
        }

        if (!encryptedData) {
          throw new Error('Failed to fetch file from IPFS');
        }

        setProgress(60);

        // Step 3: Decrypt
        const hasEncryption = fileMetadata.encryption?.iv && 
                              fileMetadata.encryption?.salt && 
                              fileMetadata.encryption?.authTag;

        let fileData: Uint8Array;
        if (hasEncryption) {
          setProgress(70);
          fileData = await decryptFileData(
            encryptedData,
            password,
            fileMetadata.encryption.iv,
            fileMetadata.encryption.salt,
            fileMetadata.encryption.authTag
          );
        } else {
          fileData = new Uint8Array(encryptedData);
        }

        setProgress(85);

        // Step 4: Create blob and URL
        const effectiveMimeType = mimeType || fileMetadata.mimeType || 'application/octet-stream';
        // Convert Uint8Array to ArrayBuffer for Blob compatibility
        const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength) as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: effectiveMimeType });
        const url = URL.createObjectURL(blob);

        // Step 5: Extract text content for text-based files
        let textContent: string | undefined;
        const previewType = getPreviewType(effectiveMimeType, fileName);
        
        if (['code', 'text', 'markdown', 'json', 'csv'].includes(previewType)) {
          try {
            const decoder = new TextDecoder('utf-8');
            textContent = decoder.decode(fileData);
          } catch {
            // If decoding fails, leave textContent undefined
          }
        }

        setProgress(100);

        const result: PreviewData = {
          url,
          blob,
          mimeType: effectiveMimeType,
          fileName,
          fileSize: fileData.length,
          textContent,
        };

        setPreviewData(result);
        
        setTimeout(() => {
          setProgress(0);
          setIsLoading(false);
        }, 300);

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load preview';
        setError(errorMessage);
        setIsLoading(false);
        setProgress(0);
        throw err;
      }
    },
    []
  );

  /**
   * Clear preview data and revoke URL
   */
  const clearPreview = useCallback(() => {
    if (previewData?.url) {
      URL.revokeObjectURL(previewData.url);
    }
    setPreviewData(null);
    setError(null);
    setProgress(0);
  }, [previewData]);

  /**
   * Download the previewed file
   */
  const downloadFromPreview = useCallback(() => {
    if (!previewData) return;

    const link = document.createElement('a');
    link.href = previewData.url;
    link.download = previewData.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [previewData]);

  return {
    loadPreview,
    clearPreview,
    downloadFromPreview,
    isLoading,
    progress,
    error,
    previewData,
  };
}
