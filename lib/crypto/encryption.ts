import crypto from 'crypto';

/**
 * TALA Encryption Module - Enterprise Grade
 * Implements AES-256-GCM encryption with advanced security features
 * 
 * Security Standards:
 * - AES-256-GCM authenticated encryption
 * - PBKDF2 key derivation (100,000 iterations)
 * - SHA-256 hashing
 * - Cryptographically secure random generation
 * - Non-custodial: Keys stored only with user, never transmitted
 * - Tamper detection via authentication tags
 */

// Constants
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits (enhanced)
const PBKDF2_ITERATIONS = 100000; // Enterprise standard
const PBKDF2_DIGEST = 'sha256';

interface EncryptedData {
  ciphertext: string; // hex encoded
  iv: string; // hex encoded
  authTag: string; // hex encoded
  salt: string; // hex encoded
  version: string; // encryption version
  timestamp: number; // encryption timestamp
  algorithm: string; // algorithm used
}

interface DecryptedData {
  data: Buffer;
  salt: string;
  metadata: {
    encryptedAt: number;
    algorithm: string;
  };
}

interface FileEncryptionResult {
  encryptedData: EncryptedData;
  fileHash: string; // SHA-256 hash of original file
  fileSize: number; // Original file size
  encryptedSize: number; // Encrypted data size
}

/**
 * Derive encryption key from password using PBKDF2
 * Enterprise-grade key derivation with 100,000 iterations
 * Resistant to brute force and rainbow table attacks
 * 
 * @param password User password/passphrase
 * @param salt Salt for key derivation (should be random)
 * @returns Derived 256-bit encryption key
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  if (!password || password.length === 0) {
    throw new Error('Password cannot be empty');
  }
  
  if (salt.length !== SALT_LENGTH) {
    throw new Error(`Invalid salt length. Expected ${SALT_LENGTH} bytes, got ${salt.length}`);
  }

  return crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    PBKDF2_DIGEST
  );
}

/**
 * Generate a cryptographically secure random encryption key
 * Suitable for direct file encryption without password
 * 
 * @returns Random 256-bit key
 */
export function generateEncryptionKey(): Buffer {
  return crypto.randomBytes(KEY_LENGTH);
}

/**
 * Generate a random Initialization Vector
 * Critical for security - must be unique for each encryption
 * 
 * @returns Random 128-bit IV
 */
function generateIV(): Buffer {
  return crypto.randomBytes(IV_LENGTH);
}

/**
 * Generate cryptographically secure random salt
 * Used for key derivation from passwords
 * 
 * @returns Random 256-bit salt
 */
function generateSalt(): Buffer {
  return crypto.randomBytes(SALT_LENGTH);
}

/**
 * Encrypt data using AES-256-GCM
 * Provides authenticated encryption (confidentiality + authenticity)
 * 
 * Features:
 * - 256-bit AES encryption
 * - GCM mode for authenticated encryption
 * - Random IV generated per encryption
 * - Authentication tag for tamper detection
 * 
 * @param plaintext Data to encrypt (Buffer or string)
 * @param encryptionKey Encryption key (must be 256 bits)
 * @returns Encrypted data object with metadata
 */
export function encrypt(plaintext: Buffer | string, encryptionKey: Buffer): EncryptedData {
  // Validate inputs
  if (!encryptionKey || encryptionKey.length !== KEY_LENGTH) {
    throw new Error(`Invalid key length. Expected ${KEY_LENGTH} bytes, got ${encryptionKey?.length || 0}`);
  }

  if (!plaintext) {
    throw new Error('Plaintext cannot be empty');
  }

  // Generate fresh IV and salt for each encryption
  const iv = generateIV();
  const salt = generateSalt();
  
  // Convert string to buffer if needed
  const data = typeof plaintext === 'string' ? Buffer.from(plaintext, 'utf8') : plaintext;

  // Create cipher and encrypt
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    salt: salt.toString('hex'),
    version: '2.0',
    timestamp: Date.now(),
    algorithm: ALGORITHM,
  };
}

/**
 * Decrypt data using AES-256-GCM
 * Verifies authentication tag before decryption
 * 
 * @param encryptedData Encrypted data object
 * @param encryptionKey Encryption key (must be 256 bits)
 * @returns Decrypted data buffer with metadata
 * @throws Error if authentication tag verification fails (tampering detected)
 */
export function decrypt(encryptedData: EncryptedData, encryptionKey: Buffer): DecryptedData {
  // Validate inputs
  if (!encryptionKey || encryptionKey.length !== KEY_LENGTH) {
    throw new Error(`Invalid key length. Expected ${KEY_LENGTH} bytes, got ${encryptionKey?.length || 0}`);
  }

  if (!encryptedData || !encryptedData.ciphertext) {
    throw new Error('Invalid encrypted data');
  }

  // Convert hex strings back to buffers
  const ciphertext = Buffer.from(encryptedData.ciphertext, 'hex');
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const authTag = Buffer.from(encryptedData.authTag, 'hex');
  const salt = Buffer.from(encryptedData.salt, 'hex');

  // Validate IV length
  if (iv.length !== IV_LENGTH) {
    throw new Error(`Invalid IV length. Expected ${IV_LENGTH} bytes, got ${iv.length}`);
  }

  // Validate auth tag length
  if (authTag.length !== TAG_LENGTH) {
    throw new Error(`Invalid auth tag length. Expected ${TAG_LENGTH} bytes, got ${authTag.length}`);
  }

  // Create decipher and verify authentication
  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(authTag);

  try {
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    
    return {
      data: decrypted,
      salt: encryptedData.salt,
      metadata: {
        encryptedAt: encryptedData.timestamp,
        algorithm: encryptedData.algorithm,
      },
    };
  } catch (error) {
    throw new Error(
      'Decryption failed: Authentication tag verification failed. ' +
      'Data may be corrupted, tampered with, or encrypted with a different key.'
    );
  }
}

/**
 * Encrypt a file with metadata
 * Suitable for vault file storage
 * 
 * @param fileBuffer File content as buffer
 * @param encryptionKey Encryption key
 * @returns Encryption result with file hash and sizes
 */
export function encryptFile(fileBuffer: Buffer, encryptionKey: Buffer): FileEncryptionResult {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error('File cannot be empty');
  }

  // Calculate file hash before encryption
  const fileHash = calculateFileHash(fileBuffer);
  const fileSize = fileBuffer.length;

  // Encrypt the file
  const encryptedData = encrypt(fileBuffer, encryptionKey);
  const encryptedSize = Buffer.from(encryptedData.ciphertext, 'hex').length;

  return {
    encryptedData,
    fileHash,
    fileSize,
    encryptedSize,
  };
}

/**
 * Encrypt file using password-based key derivation
 * Uses PBKDF2 to derive key from password for client-side decryption
 * 
 * @param fileBuffer File content as buffer
 * @param password User password for encryption
 * @returns Encryption result with metadata needed for decryption
 */
export function encryptFileWithPassword(fileBuffer: Buffer, password: string): FileEncryptionResult {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error('File cannot be empty');
  }
  
  if (!password || password.trim().length === 0) {
    throw new Error('Password cannot be empty');
  }

  // Generate fresh salt for this encryption
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  // Derive key from password using PBKDF2
  const encryptionKey = deriveKey(password, salt);

  // Calculate file hash before encryption
  const fileHash = calculateFileHash(fileBuffer);
  const fileSize = fileBuffer.length;

  // Generate IV for encryption
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher and encrypt
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const encryptedData: EncryptedData = {
    ciphertext: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    salt: salt.toString('hex'),
    version: '2.0',
    timestamp: Date.now(),
    algorithm: ALGORITHM,
  };

  const encryptedSize = encrypted.length;

  return {
    encryptedData,
    fileHash,
    fileSize,
    encryptedSize,
  };
}

/**
 * Decrypt a file and verify integrity
 * 
 * @param encryptedData Encrypted file data
 * @param encryptionKey Encryption key
 * @returns Decrypted file buffer
 */
export function decryptFile(encryptedData: EncryptedData, encryptionKey: Buffer): Buffer {
  const decrypted = decrypt(encryptedData, encryptionKey);
  return decrypted.data;
}

/**
 * Calculate SHA-256 hash of file
 * Used for integrity verification
 * 
 * @param fileBuffer File content
 * @returns SHA-256 hash as hex string
 */
export function calculateFileHash(fileBuffer: Buffer): string {
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
}

/**
 * Verify file integrity by comparing hashes
 * 
 * @param fileBuffer File content
 * @param expectedHash Expected SHA-256 hash
 * @returns True if hashes match
 */
export function verifyFileIntegrity(fileBuffer: Buffer, expectedHash: string): boolean {
  const calculatedHash = calculateFileHash(fileBuffer);
  return calculatedHash === expectedHash;
}

/**
 * Hash encryption key for on-chain storage/verification
 * Allows verification without exposing the actual key
 * 
 * @param encryptionKey Encryption key to hash
 * @returns SHA-256 hash as hex string
 */
export function hashEncryptionKey(encryptionKey: Buffer): string {
  const hash = crypto.createHash('sha256');
  hash.update(encryptionKey);
  return '0x' + hash.digest('hex');
}

/**
 * Generate a cryptographically secure password
 * Enterprise-grade random password generation
 * 
 * Includes uppercase, lowercase, numbers, and special characters
 * 
 * @param length Password length (default 32 characters)
 * @returns Random secure password string
 */
export function generateSecurePassword(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_=+';
  const charsetLength = charset.length;
  let password = '';

  // Ensure at least one of each type for strength
  const chars = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'abcdefghijklmnopqrstuvwxyz'.split(''),
    '0123456789'.split(''),
    '!@#$%^&*-_=+'.split(''),
  ];

  // Add one char from each category
  let result = '';
  for (const charSet of chars) {
    result += charSet[Math.floor(Math.random() * charSet.length)];
  }

  // Fill remaining length with random chars
  for (let i = result.length; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charsetLength);
    result += charset[randomIndex];
  }

  // Shuffle the password
  return result.split('').sort(() => crypto.randomInt(-1, 2)).join('');
}

/**
 * Serialize encrypted data for storage/transmission
 * Converts encrypted data object to JSON string
 * 
 * @param encryptedData Encrypted data object
 * @returns JSON string representation
 */
export function serializeEncryptedData(encryptedData: EncryptedData): string {
  return JSON.stringify(encryptedData);
}

/**
 * Deserialize encrypted data from JSON
 * Validates structure before returning
 * 
 * @param serialized JSON string
 * @returns Encrypted data object
 * @throws Error if format is invalid
 */
export function deserializeEncryptedData(serialized: string): EncryptedData {
  try {
    const parsed = JSON.parse(serialized);

    // Validate required fields
    const requiredFields = ['ciphertext', 'iv', 'authTag', 'salt'];
    for (const field of requiredFields) {
      if (!parsed[field] || typeof parsed[field] !== 'string') {
        throw new Error(`Missing or invalid field: ${field}`);
      }
    }

    return {
      ciphertext: parsed.ciphertext,
      iv: parsed.iv,
      authTag: parsed.authTag,
      salt: parsed.salt,
      version: parsed.version || '2.0',
      timestamp: parsed.timestamp || Date.now(),
      algorithm: parsed.algorithm || ALGORITHM,
    };
  } catch (error) {
    throw new Error(`Failed to deserialize encrypted data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify encryption key integrity
 * Ensures key is valid and hasn't been corrupted
 * 
 * @param encryptionKey Key to verify
 * @returns True if valid 256-bit key
 */
export function verifyEncryptionKey(encryptionKey: Buffer): boolean {
  if (!Buffer.isBuffer(encryptionKey)) {
    return false;
  }
  return encryptionKey.length === KEY_LENGTH;
}

/**
 * Get encryption constants for reference
 * @returns Object with security parameters
 */
export function getEncryptionConstants() {
  return {
    algorithm: ALGORITHM,
    keyLength: KEY_LENGTH,
    keyLengthBits: KEY_LENGTH * 8,
    ivLength: IV_LENGTH,
    ivLengthBits: IV_LENGTH * 8,
    tagLength: TAG_LENGTH,
    saltLength: SALT_LENGTH,
    pbkdf2Iterations: PBKDF2_ITERATIONS,
    pbkdf2Digest: PBKDF2_DIGEST,
  };
}
/**
 * Generate encryption key (alias for generateEncryptionKey)
 */
export function generateKey(): Buffer {
  return generateEncryptionKey();
}

/**
 * Web Crypto API wrapper for browser-based encryption
 * Uses SubtleCrypto for secure key generation
 */
export async function generateKeyWebCrypto(): Promise<CryptoKey> {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
  return key;
}
