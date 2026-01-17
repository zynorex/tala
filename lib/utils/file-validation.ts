/**
 * File Validation Service
 * Validates file types, sizes, and security properties
 * Prevents malicious file uploads and enforces compliance
 */

import { getLogger } from './logger';

const logger = getLogger('FileValidationService');

// Maximum file size: 500MB
export const MAX_FILE_SIZE = 500 * 1024 * 1024;

// Minimum file size: 1 byte
export const MIN_FILE_SIZE = 1;

// Allowed MIME types for different file categories
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/rtf',
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/tiff',
  ],
  archives: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/x-tar',
  ],
  all: [] // Populated below
};

// Flatten all MIME types
ALLOWED_MIME_TYPES.all = Object.values(ALLOWED_MIME_TYPES).flat().filter(Boolean);

// Dangerous file extensions that should be rejected
export const DANGEROUS_EXTENSIONS = [
  'exe', 'bat', 'cmd', 'com', 'pif', 'scr', // Windows executables
  'app', 'deb', 'rpm', // Unix executables
  'sh', 'bash', 'ps1', // Scripts
  'js', 'vbs', 'jar', // Code that can execute
  'html', 'htm', 'mhtml', // Web files with scripts
  'swf', 'fla', // Flash (old vulnerability)
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
  fileInfo?: {
    size: number;
    mimeType: string;
    extension: string;
    name: string;
  };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Validate file size
 */
function validateFileSize(size: number): { valid: boolean; error?: string } {
  if (size < MIN_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be at least ${MIN_FILE_SIZE} byte`,
    };
  }

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate file extension
 */
function validateFileExtension(filename: string): { valid: boolean; warning?: string } {
  const extension = getFileExtension(filename);

  if (!extension) {
    return {
      valid: true,
      warning: 'File has no extension. Make sure it is the correct file type.',
    };
  }

  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      warning: `File type '.${extension}' is not allowed for security reasons`,
    };
  }

  return { valid: true };
}

/**
 * Validate MIME type
 */
function validateMimeType(mimeType: string, strict: boolean = false): { valid: boolean; warning?: string } {
  if (!mimeType) {
    return {
      valid: !strict,
      warning: 'MIME type not detected. File may be corrupted or invalid.',
    };
  }

  if (!ALLOWED_MIME_TYPES.all.includes(mimeType)) {
    if (strict) {
      return {
        valid: false,
        warning: `MIME type '${mimeType}' is not in the allowed list`,
      };
    }
    return {
      valid: true,
      warning: `MIME type '${mimeType}' is uncommon. Verify file integrity.`,
    };
  }

  return { valid: true };
}

/**
 * Check for common malware patterns in file content
 */
function checkForMalwarePatterns(buffer: Buffer): { safe: boolean; patterns: string[] } {
  const patterns: string[] = [];

  // Check for common executable headers
  if (buffer.length > 2) {
    const header = buffer.slice(0, 4);

    // MZ header (Windows executable)
    if (header[0] === 0x4d && header[1] === 0x5a) {
      patterns.push('Windows executable header detected');
    }

    // ELF header (Linux executable)
    if (header[0] === 0x7f && header[1] === 0x45 && header[2] === 0x4c && header[3] === 0x46) {
      patterns.push('Linux executable header detected');
    }

    // Mach-O header (macOS executable)
    if ((header[0] === 0xfe && header[1] === 0xed && header[2] === 0xfa) ||
        (header[0] === 0xca && header[1] === 0xfe && header[2] === 0xba)) {
      patterns.push('macOS executable header detected');
    }
  }

  // Check for embedded scripts in PDF
  if (buffer.toString('utf-8', 0, 50).includes('%PDF')) {
    const content = buffer.toString('utf-8');
    if (content.includes('/JavaScript') || content.includes('/OpenAction') || content.includes('/AA')) {
      patterns.push('PDF with embedded scripts detected');
    }
  }

  return {
    safe: patterns.length === 0,
    patterns,
  };
}

/**
 * Comprehensive file validation
 * Checks file size, extension, MIME type, and content
 */
export function validateFile(
  filename: string,
  buffer: Buffer,
  mimeType: string,
  options: {
    strict?: boolean;
    allowExecutables?: boolean;
    scanForMalware?: boolean;
  } = {}
): FileValidationResult {
  const { strict = false, allowExecutables = false, scanForMalware = true } = options;

  logger.debug('Validating file', { filename, size: buffer.length, mimeType });

  // Check file size
  const sizeCheck = validateFileSize(buffer.length);
  if (!sizeCheck.valid) {
    return {
      valid: false,
      error: sizeCheck.error,
    };
  }

  // Check file extension
  const extensionCheck = validateFileExtension(filename);
  if (!extensionCheck.valid && !allowExecutables) {
    return {
      valid: false,
      error: extensionCheck.warning,
    };
  }

  // Check MIME type
  const mimeCheck = validateMimeType(mimeType, strict);
  if (!mimeCheck.valid) {
    return {
      valid: false,
      error: mimeCheck.warning,
    };
  }

  // Scan for malware patterns
  const warnings: string[] = [];
  if (scanForMalware) {
    const malwareCheck = checkForMalwarePatterns(buffer);
    if (!malwareCheck.safe) {
      if (strict || !allowExecutables) {
        return {
          valid: false,
          error: `Suspicious file content detected: ${malwareCheck.patterns.join(', ')}`,
        };
      }
      warnings.push(...malwareCheck.patterns);
    }
  }

  // Collect any warnings
  if (extensionCheck.warning) warnings.push(extensionCheck.warning);
  if (mimeCheck.warning && mimeCheck.valid) warnings.push(mimeCheck.warning);

  logger.info('File validation passed', { filename, size: buffer.length });

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    fileInfo: {
      size: buffer.length,
      mimeType,
      extension: getFileExtension(filename),
      name: filename,
    },
  };
}

/**
 * Validate multiple files at once
 */
export function validateFiles(
  files: Array<{ filename: string; buffer: Buffer; mimeType: string }>,
  options?: any
): { valid: boolean; results: FileValidationResult[] } {
  const results = files.map((file) =>
    validateFile(file.filename, file.buffer, file.mimeType, options)
  );

  const allValid = results.every((r) => r.valid);

  return {
    valid: allValid,
    results,
  };
}
