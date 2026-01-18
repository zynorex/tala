/**
 * NIL Validation Utilities
 * Comprehensive input validation for security
 */

export const validators = {
  /**
   * Validate IPFS hash format
   */
  ipfsHash: (hash: string): { valid: boolean; error?: string } => {
    if (!hash) {
      return { valid: false, error: 'IPFS hash is required' };
    }

    // CIDv0: Qm... (46 chars)
    const cidv0Regex = /^Qm[a-zA-Z0-9]{44}$/;
    // CIDv1: bafy... (variable length)
    const cidv1Regex = /^bafy[a-z2-7]{50,}$/;

    if (!cidv0Regex.test(hash) && !cidv1Regex.test(hash)) {
      return { valid: false, error: 'Invalid IPFS hash format' };
    }

    return { valid: true };
  },

  /**
   * Validate file size
   */
  fileSize: (size: number, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } => {
    if (size <= 0) {
      return { valid: false, error: 'File size must be greater than 0' };
    }

    if (size > maxSize) {
      return { valid: false, error: `File size exceeds maximum of ${(maxSize / 1024 / 1024).toFixed(0)}MB` };
    }

    return { valid: true };
  },

  /**
   * Validate unlock timestamp
   */
  unlockTime: (
    unlockTime: number,
    minDuration: number = 60,
    maxDuration: number = 365 * 24 * 60 * 60 * 100
  ): { valid: boolean; error?: string } => {
    const now = Math.floor(Date.now() / 1000);

    if (unlockTime <= now) {
      return { valid: false, error: 'Unlock time must be in the future' };
    }

    const duration = unlockTime - now;

    if (duration < minDuration) {
      return { valid: false, error: `Minimum lock duration is ${minDuration / 60} minutes` };
    }

    if (duration > maxDuration) {
      return { valid: false, error: 'Maximum lock duration exceeded (100 years)' };
    }

    return { valid: true };
  },

  /**
   * Validate description
   */
  description: (description: string): { valid: boolean; error?: string } => {
    if (!description) {
      return { valid: false, error: 'Description is required' };
    }

    if (description.length > 256) {
      return { valid: false, error: 'Description cannot exceed 256 characters' };
    }

    // Check for common XSS patterns
    const xssPatterns = /<script|<iframe|<img|<svg|javascript:|onerror|onclick/i;
    if (xssPatterns.test(description)) {
      return { valid: false, error: 'Description contains invalid characters' };
    }

    return { valid: true };
  },

  /**
   * Validate encryption key
   */
  encryptionKey: (key: Buffer | string): { valid: boolean; error?: string } => {
    if (!key) {
      return { valid: false, error: 'Encryption key is required' };
    }

    const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;

    if (keyBuffer.length !== 32) {
      return { valid: false, error: 'Encryption key must be 256 bits (32 bytes)' };
    }

    return { valid: true };
  },

  /**
   * Validate password strength
   */
  passwordStrength: (password: string): { valid: boolean; error?: string; strength: 'weak' | 'medium' | 'strong' } => {
    if (!password || password.length === 0) {
      return { valid: false, error: 'Password is required', strength: 'weak' };
    }

    if (password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let checks = 0;

    if (/[a-z]/.test(password)) checks++;
    if (/[A-Z]/.test(password)) checks++;
    if (/[0-9]/.test(password)) checks++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) checks++;

    if (password.length >= 12 && checks >= 3) {
      strength = 'strong';
    } else if (checks >= 2) {
      strength = 'medium';
    }

    if (checks < 2) {
      return {
        valid: false,
        error: 'Password must contain uppercase, lowercase, numbers, and special characters',
        strength,
      };
    }

    return { valid: true, strength };
  },

  /**
   * Validate Ethereum address
   */
  ethereumAddress: (address: string): { valid: boolean; error?: string } => {
    if (!address) {
      return { valid: false, error: 'Address is required' };
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return { valid: false, error: 'Invalid Ethereum address format' };
    }

    return { valid: true };
  },

  /**
   * Validate vault ID
   */
  vaultId: (id: any): { valid: boolean; error?: string } => {
    const vaultId = Number(id);

    if (!Number.isInteger(vaultId) || vaultId <= 0) {
      return { valid: false, error: 'Invalid vault ID' };
    }

    return { valid: true };
  },

  /**
   * Validate email
   */
  email: (email: string): { valid: boolean; error?: string } => {
    if (!email) {
      return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
  },
};

/**
 * Batch validate multiple fields
 */
export function validateVaultCreation(data: {
  ipfsHash: string;
  fileSize: number;
  unlockTime: number;
  description: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const ipfsValidation = validators.ipfsHash(data.ipfsHash);
  if (!ipfsValidation.valid) {
    errors.ipfsHash = ipfsValidation.error || 'Invalid IPFS hash';
  }

  const sizeValidation = validators.fileSize(data.fileSize);
  if (!sizeValidation.valid) {
    errors.fileSize = sizeValidation.error || 'Invalid file size';
  }

  const timeValidation = validators.unlockTime(data.unlockTime);
  if (!timeValidation.valid) {
    errors.unlockTime = timeValidation.error || 'Invalid unlock time';
  }

  const descValidation = validators.description(data.description);
  if (!descValidation.valid) {
    errors.description = descValidation.error || 'Invalid description';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
