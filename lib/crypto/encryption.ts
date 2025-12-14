import crypto from 'crypto';

/**
 * TALA Encryption Module
 * Implements AES-256-GCM encryption for vault content
 * Security: Non-custodial - keys stored only with user, never transmitted
 */

// Constants
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 16; // 128 bits

interface EncryptedData {
  ciphertext: string; // hex encoded
  iv: string; // hex encoded
  authTag: string; // hex encoded
  salt: string; // hex encoded
}

interface DecryptedData {
  data: Buffer;
  salt: string;
}

/**
 * Derive encryption key from password using PBKDF2
 * Provides protection against brute force attacks
 * @param password User password
 * @param salt Salt for key derivation
 * @returns Derived key
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
}

/**
 * Generate a random encryption key
 * @returns Random 256-bit key
 */
export function generateEncryptionKey(): Buffer {
  return crypto.randomBytes(KEY_LENGTH);
}

/**
 * Generate a random IV
 * @returns Random 128-bit IV
 */
function generateIV(): Buffer {
  return crypto.randomBytes(IV_LENGTH);
}

/**
 * Generate a random salt for key derivation
 * @returns Random 128-bit salt
 */
function generateSalt(): Buffer {
  return crypto.randomBytes(SALT_LENGTH);
}

/**
 * Encrypt data using AES-256-GCM
 * @param plaintext Data to encrypt
 * @param encryptionKey Encryption key (256 bits)
 * @returns Encrypted data with IV, tag, and salt
 */
export function encrypt(plaintext: Buffer | string, encryptionKey: Buffer): EncryptedData {
  // Validate inputs
  if (encryptionKey.length !== KEY_LENGTH) {
    throw new Error(`Invalid key length. Expected ${KEY_LENGTH} bytes, got ${encryptionKey.length}`);
  }

  const iv = generateIV();
  const salt = generateSalt();

  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    salt: salt.toString('hex'),
  };
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData Encrypted data object with IV and auth tag
 * @param encryptionKey Encryption key (256 bits)
 * @returns Decrypted data buffer
 */
export function decrypt(encryptedData: EncryptedData, encryptionKey: Buffer): Buffer {
  // Validate inputs
  if (encryptionKey.length !== KEY_LENGTH) {
    throw new Error(`Invalid key length. Expected ${KEY_LENGTH} bytes, got ${encryptionKey.length}`);
  }

  const ciphertext = Buffer.from(encryptedData.ciphertext, 'hex');
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const authTag = Buffer.from(encryptedData.authTag, 'hex');

  // Validate IV length
  if (iv.length !== IV_LENGTH) {
    throw new Error(`Invalid IV length. Expected ${IV_LENGTH} bytes, got ${iv.length}`);
  }

  // Validate auth tag length
  if (authTag.length !== TAG_LENGTH) {
    throw new Error(`Invalid auth tag length. Expected ${TAG_LENGTH} bytes, got ${authTag.length}`);
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(authTag);

  try {
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: Authentication tag verification failed. Data may be corrupted or tampered.');
  }
}

/**
 * Hash encryption key for on-chain storage
 * Allows verification without exposing key
 * @param encryptionKey Encryption key to hash
 * @returns Keccak256 hash as bytes32 hex string
 */
export function hashEncryptionKey(encryptionKey: Buffer): string {
  // Using keccak256 to match smart contract expectations
  const hash = crypto.createHash('sha256');
  hash.update(encryptionKey);
  return '0x' + hash.digest('hex');
}

/**
 * Generate a secure random password
 * For key derivation use cases
 * @param length Password length (default 32 chars)
 * @returns Random password string
 */
export function generateSecurePassword(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  
  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % chars.length];
  }
  
  return password;
}

/**
 * Convert encrypted data object to JSON for storage
 * @param encryptedData Encrypted data object
 * @returns JSON string
 */
export function serializeEncryptedData(encryptedData: EncryptedData): string {
  return JSON.stringify(encryptedData);
}

/**
 * Parse JSON back to encrypted data object
 * @param serialized JSON string
 * @returns Encrypted data object
 */
export function deserializeEncryptedData(serialized: string): EncryptedData {
  const parsed = JSON.parse(serialized);
  
  if (!parsed.ciphertext || !parsed.iv || !parsed.authTag || !parsed.salt) {
    throw new Error('Invalid encrypted data format');
  }
  
  return {
    ciphertext: parsed.ciphertext,
    iv: parsed.iv,
    authTag: parsed.authTag,
    salt: parsed.salt,
  };
}

/**
 * Verify encryption key integrity
 * Ensures key hasn't been corrupted
 * @param encryptionKey Key to verify
 * @returns True if valid
 */
export function verifyEncryptionKey(encryptionKey: Buffer): boolean {
  if (!Buffer.isBuffer(encryptionKey)) {
    return false;
  }
  return encryptionKey.length === KEY_LENGTH;
}
