/**
 * File Preview and Thumbnail Service
 * Generates previews and thumbnails for various file types
 * Improves user experience with visual file representation
 */

import { getLogger } from './logger';

const logger = getLogger('FilePreviewService');

export interface PreviewResult {
  type: 'image' | 'document' | 'audio' | 'video' | 'text' | 'archive' | 'unknown';
  preview: string | null; // Data URL or external URL
  thumbnail: string | null;
  icon: string; // Icon name from Lucide
  metadata?: Record<string, unknown>;
}

// File type to icon mapping
const FILE_TYPE_ICONS: Record<string, string> = {
  // Documents
  'application/pdf': 'FileText',
  'application/msword': 'FileText',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'FileText',
  'application/vnd.ms-excel': 'FileText',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'BarChart3',
  'application/vnd.ms-powerpoint': 'Presentation',
  'text/plain': 'FileText',
  'text/csv': 'BarChart3',
  'application/json': 'Code',

  // Images
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'image/gif': 'Image',
  'image/webp': 'Image',
  'image/svg+xml': 'Image',

  // Audio
  'audio/mpeg': 'Music',
  'audio/wav': 'Music',
  'audio/mp4': 'Music',
  'audio/aac': 'Music',

  // Video
  'video/mp4': 'Video',
  'video/mpeg': 'Video',
  'video/quicktime': 'Video',
  'video/webm': 'Video',

  // Archives
  'application/zip': 'Archive',
  'application/x-tar': 'Archive',
  'application/x-rar-compressed': 'Archive',
  'application/x-7z-compressed': 'Archive',
};

/**
 * Get file type icon
 */
export function getFileIcon(mimeType: string): string {
  return FILE_TYPE_ICONS[mimeType] || 'File';
}

/**
 * Generate preview for image files
 */
async function generateImagePreview(
  file: File | Blob,
): Promise<{ preview: string; thumbnail: string }> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        // For images, use the file itself as preview and create thumbnail
        // In production, you'd generate a smaller thumbnail version
        resolve({
          preview: result,
          thumbnail: result, // Could optimize with canvas to reduce size
        });
      };

      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate preview for PDF files
 * Returns first page as image
 */
async function generatePdfPreview(
  file: File | Blob,
): Promise<{ preview: string | null; thumbnail: string | null }> {
  try {
    // In production, use a library like pdf.js to generate preview
    // For now, return null - requires pdf.js library
    logger.debug('PDF preview generation requires pdf.js library');

    return {
      preview: null,
      thumbnail: null,
    };
  } catch (error) {
    logger.error('Failed to generate PDF preview', error instanceof Error ? error : undefined);
    return {
      preview: null,
      thumbnail: null,
    };
  }
}

/**
 * Generate preview for text files
 */
async function generateTextPreview(
  file: File | Blob,
): Promise<{ preview: string | null; metadata: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;

        // Return first 200 characters as preview
        const preview = content.slice(0, 200);
        const lines = content.split('\n').length;

        resolve({
          preview,
          metadata: {
            lines,
            characters: content.length,
            words: content.split(/\s+/).length,
          },
        });
      };

      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };

      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate preview for document files
 */
async function generateDocumentPreview(
  mimeType: string,
): Promise<{ preview: string | null; metadata: Record<string, unknown> }> {
  try {
    // Document preview would require server-side conversion
    // Using services like LibreOffice or Pandoc
    logger.debug('Document preview requires server-side conversion service', { mimeType });

    return {
      preview: null,
      metadata: {
        requiresConversion: true,
      },
    };
  } catch (error) {
    logger.error('Failed to generate document preview', error instanceof Error ? error : undefined);
    return {
      preview: null,
      metadata: {},
    };
  }
}

/**
 * Detect file type category
 */
export function detectFileCategory(
  mimeType: string,
): 'image' | 'document' | 'audio' | 'video' | 'text' | 'archive' | 'unknown' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';

  if (
    mimeType.includes('pdf') ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('powerpoint')
  ) {
    return 'document';
  }

  if (mimeType.includes('text')) return 'text';

  if (
    mimeType.includes('zip') ||
    mimeType.includes('tar') ||
    mimeType.includes('rar') ||
    mimeType.includes('7z')
  ) {
    return 'archive';
  }

  return 'unknown';
}

/**
 * Generate preview for any file
 * Supports images, text, and basic document detection
 */
export async function generatePreview(
  file: File | Blob,
  mimeType: string,
): Promise<PreviewResult> {
  try {
    const category = detectFileCategory(mimeType);
    const icon = getFileIcon(mimeType);

    logger.debug('Generating preview', { fileName: file instanceof File ? file.name : 'blob', category });

    let preview: string | null = null;
    let thumbnail: string | null = null;
    let metadata: Record<string, unknown> | undefined;

    switch (category) {
      case 'image': {
        const result = await generateImagePreview(file);
        preview = result.preview;
        thumbnail = result.thumbnail;
        break;
      }

      case 'text': {
        const result = await generateTextPreview(file);
        preview = result.preview;
        metadata = result.metadata;
        break;
      }

      case 'document': {
        if (mimeType.includes('pdf')) {
          const result = await generatePdfPreview(file);
          preview = result.preview;
          thumbnail = result.thumbnail;
        } else {
          const result = await generateDocumentPreview(mimeType);
          preview = result.preview;
          metadata = result.metadata;
        }
        break;
      }

      case 'audio':
      case 'video':
      case 'archive':
      case 'unknown':
      default:
        // These require special handling or are not previewed
        logger.debug('No preview available for file category', { category });
        break;
    }

    return {
      type: category,
      preview,
      thumbnail,
      icon,
      metadata,
    };
  } catch (error) {
    logger.error('Preview generation failed', error instanceof Error ? error : undefined);

    return {
      type: 'unknown',
      preview: null,
      thumbnail: null,
      icon: 'File',
    };
  }
}

/**
 * Generate thumbnails for multiple files
 */
export async function generateThumbnails(
  files: (File | Blob)[],
  mimeTypes: string[],
): Promise<PreviewResult[]> {
  try {
    const results = await Promise.allSettled(
      files.map((file, index) => generatePreview(file, mimeTypes[index] || 'application/octet-stream')),
    );

    return results.map((result) =>
      result.status === 'fulfilled'
        ? result.value
        : {
            type: 'unknown' as const,
            preview: null,
            thumbnail: null,
            icon: 'File',
          },
    );
  } catch (error) {
    logger.error('Thumbnail generation failed', error instanceof Error ? error : undefined);
    return [];
  }
}

/**
 * Extract metadata from file
 */
export async function extractMetadata(
  file: File,
  mimeType: string,
): Promise<Record<string, unknown>> {
  try {
    const metadata: Record<string, unknown> = {
      fileName: file.name,
      fileSize: file.size,
      mimeType,
      lastModified: new Date(file.lastModified).toISOString(),
    };

    // For images, extract dimensions
    if (mimeType.startsWith('image/')) {
      const img = new Image();
      const url = URL.createObjectURL(file);

      metadata.dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve({ width: 0, height: 0 });
        };
        img.src = url;
      });
    }

    return metadata;
  } catch (error) {
    logger.error('Metadata extraction failed', error instanceof Error ? error : undefined);
    return {
      fileName: file.name,
      fileSize: file.size,
      mimeType,
    };
  }
}

/**
 * Check if file type supports preview
 */
export function supportsPreview(mimeType: string): boolean {
  const category = detectFileCategory(mimeType);
  return ['image', 'text'].includes(category);
}

/**
 * Get file display name with size
 */
export function formatFileInfo(fileName: string, sizeBytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  let size = sizeBytes;
  let sizeIndex = 0;

  while (size >= 1024 && sizeIndex < sizes.length - 1) {
    size /= 1024;
    sizeIndex++;
  }

  return `${fileName} (${size.toFixed(2)} ${sizes[sizeIndex]})`;
}
