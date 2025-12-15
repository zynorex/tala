import { z } from 'zod';

// User Schemas
export const createUserSchema = z.object({
  email: z.string().email().optional(),
  walletAddress: z.string().optional(),
  username: z.string().min(3).max(50).optional(),
  displayName: z.string().min(1).max(100).optional(),
}).refine(
  (data) => data.email || data.walletAddress,
  { message: 'Either email or walletAddress must be provided' }
);

export const updateUserSchema = z.object({
  userId: z.string().cuid('User ID must be valid'),
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

// Vault Schemas
export const createVaultSchema = z.object({
  userId: z.string().cuid('User ID must be valid'),
  name: z.string().min(1).max(255, 'Vault name must be less than 255 characters'),
  description: z.string().max(1000).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // Note: file is handled separately as FormData
});

export const updateVaultSchema = z.object({
  userId: z.string().cuid('User ID must be valid'),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
});

export const deleteVaultSchema = z.object({
  userId: z.string().cuid('User ID must be valid'),
});

// Query Schemas
export const vaultListQuerySchema = z.object({
  userId: z.string().cuid('User ID must be valid'),
});

export const vaultDetailQuerySchema = z.object({
  userId: z.string().cuid('User ID must be valid'),
});

// File validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'text/csv',
];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  return { valid: true };
}

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateVaultInput = z.infer<typeof createVaultSchema>;
export type UpdateVaultInput = z.infer<typeof updateVaultSchema>;
export type DeleteVaultInput = z.infer<typeof deleteVaultSchema>;
