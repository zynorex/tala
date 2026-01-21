'use client';

import { useCallback } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Error Handler utility for consistent error handling across the app
 * Provides user-friendly error messages and logging
 */

/**
 * Custom error classes for application-specific errors
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class VaultAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VaultAccessError';
  }
}

export class IPFSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IPFSError';
  }
}

export interface ErrorHandlerConfig {
  logError?: boolean;
  userMessage?: string;
  fallbackMessage?: string;
}

export const ERROR_MESSAGES: Record<string, string> = {
  'User rejected transaction': 'You rejected the transaction. Please try again if you want to proceed.',
  'Network error': 'Network connection error. Please check your internet and try again.',
  'Wallet not connected': 'Please connect your wallet to proceed with this action.',
  'Invalid input': 'Please check your input and try again.',
  'File too large': 'File exceeds maximum size of 500MB.',
  'Invalid encryption key': 'The encryption key provided is invalid or corrupted.',
  'IPFS upload failed': 'Failed to upload file to IPFS. Please try again.',
  'Contract interaction failed': 'Blockchain transaction failed. Please try again.',
  'Decryption failed': 'Failed to decrypt file. Make sure you provided the correct encryption key.',
};

/**
 * Get user-friendly error message from error object or code
 */
export function getUserFriendlyMessage(error: unknown, customMessage?: string): string {
  if (customMessage) return customMessage;

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Check against known error patterns
    for (const [pattern, message] of Object.entries(ERROR_MESSAGES)) {
      if (errorMessage.includes(pattern.toLowerCase())) {
        return message;
      }
    }

    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle errors with consistent logging and user feedback
 */
export function handleError(
  error: unknown,
  context: string,
  config: ErrorHandlerConfig = {}
): string {
  const { logError = true, userMessage } = config;

  // Log error for debugging
  if (logError) {
    console.error(`[${context}]`, error);
  }

  // Get user-friendly message
  const message = getUserFriendlyMessage(error, userMessage);

  return message;
}

/**
 * Validate form inputs with error handling
 */
export function validateInput(
  value: unknown,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: unknown) => boolean;
  }
): { valid: boolean; error?: string } {
  if (rules.required && !value) {
    return { valid: false, error: 'This field is required' };
  }

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return {
        valid: false,
        error: `Minimum length is ${rules.minLength} characters`,
      };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        valid: false,
        error: `Maximum length is ${rules.maxLength} characters`,
      };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return { valid: false, error: 'Invalid format' };
    }
  }

  if (rules.customValidator && !rules.customValidator(value)) {
    return { valid: false, error: 'Validation failed' };
  }

  return { valid: true };
}

/**
 * Safe async function wrapper with error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorContext: string,
  onError?: (error: string) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const message = handleError(error, errorContext);
    onError?.(message);
    return null;
  }
}

