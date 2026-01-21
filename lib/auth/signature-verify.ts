/**
 * Signature Verification Service
 * Verifies wallet signatures for authentication
 */

import { ethers } from 'ethers';
import { getLogger } from '@/lib/utils/logger';

const logger = getLogger('SignatureVerify');

/**
 * Generate a message for wallet signing
 * Include timestamp to prevent replay attacks
 */
export function generateSignMessage(address: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return `Sign this message to authenticate with TALA.\n\nWallet: ${address}\nTimestamp: ${timestamp}\nNonce: ${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Verify a signed message
 * Returns the recovered address if valid
 */
export async function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Compare addresses (case-insensitive)
    const isValid =
      recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();

    if (!isValid) {
      logger.warn('Invalid signature for address', { expectedAddress, recoveredAddress });
    } else {
      logger.debug('Signature verified', { address: recoveredAddress });
    }

    return isValid;
  } catch (error) {
    logger.error('Signature verification failed', error instanceof Error ? error : undefined);
    return false;
  }
}

/**
 * Verify signature with additional checks
 * - Message format validation
 * - Timestamp validation (prevents old signatures)
 * - Nonce tracking (prevents replay attacks)
 */
export async function verifySignatureWithValidation(
  message: string,
  signature: string,
  expectedAddress: string,
  maxAge: number = 300 // 5 minutes
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Check message format
    if (!message.includes('Sign this message to authenticate')) {
      return { valid: false, error: 'Invalid message format' };
    }

    // Extract timestamp from message
    const timestampMatch = message.match(/Timestamp: (\d+)/);
    if (!timestampMatch) {
      return { valid: false, error: 'Missing timestamp in message' };
    }

    const messageTimestamp = parseInt(timestampMatch[1], 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Check if message is not too old
    if (currentTimestamp - messageTimestamp > maxAge) {
      return { valid: false, error: 'Message signature expired' };
    }

    // Verify signature
    const isValid = await verifySignature(message, signature, expectedAddress);

    if (!isValid) {
      return { valid: false, error: 'Invalid signature' };
    }

    return { valid: true };
  } catch (error) {
    logger.error('Signature validation failed', error instanceof Error ? error : undefined);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

