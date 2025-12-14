export const TALA_VAULT_ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_ipfsHash', type: 'string' },
      { internalType: 'bytes32', name: '_encryptedKeyHash', type: 'bytes32' },
      { internalType: 'uint256', name: '_unlockTime', type: 'uint256' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'uint256', name: '_fileSize', type: 'uint256' },
    ],
    name: 'createVault',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_vaultId', type: 'uint256' }],
    name: 'voidVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_vaultId', type: 'uint256' }],
    name: 'unlockVault',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'string', name: 'ipfsHash', type: 'string' },
          { internalType: 'bytes32', name: 'encryptedKeyHash', type: 'bytes32' },
          { internalType: 'uint256', name: 'unlockTime', type: 'uint256' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'bool', name: 'voided', type: 'bool' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'fileSize', type: 'uint256' },
        ],
        internalType: 'struct TALAVault.Vault',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_vaultId', type: 'uint256' }],
    name: 'getVault',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'string', name: 'ipfsHash', type: 'string' },
          { internalType: 'bytes32', name: 'encryptedKeyHash', type: 'bytes32' },
          { internalType: 'uint256', name: 'unlockTime', type: 'uint256' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'bool', name: 'voided', type: 'bool' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'fileSize', type: 'uint256' },
        ],
        internalType: 'struct TALAVault.Vault',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_creator', type: 'address' }],
    name: 'getUserVaults',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_creator', type: 'address' }],
    name: 'getUserVaultCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_vaultId', type: 'uint256' }],
    name: 'canUnlock',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_vaultId', type: 'uint256' }],
    name: 'getTimeToUnlock',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'vaultId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'unlockTime', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'ipfsHash', type: 'string' },
    ],
    name: 'VaultCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'vaultId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'accessor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'unlockedAt', type: 'uint256' },
    ],
    name: 'VaultUnlocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'vaultId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'voidedAt', type: 'uint256' },
    ],
    name: 'VaultVoided',
    type: 'event',
  },
] as const;

// Contract deployment configuration
export const TALA_VAULT_CONFIG = {
  // This will be set after deployment
  contractAddress: (process.env.NEXT_PUBLIC_TALA_VAULT_ADDRESS || '0x') as `0x${string}`,
  
  // Polygon Amoy testnet
  chainId: 80002,
  chainName: 'Polygon Amoy',
  
  // Limits from contract
  MIN_LOCK_DURATION: 60, // 1 minute
  MAX_LOCK_DURATION: 365 * 24 * 60 * 60 * 100, // 100 years
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500 MB
  
  // UI constants
  MIN_LOCK_HOURS: 0.016, // 1 minute in hours
  MAX_LOCK_YEARS: 100,
};

// Error messages mapping
export const VAULT_ERRORS = {
  InvalidUnlockTime: 'Unlock time must be in the future and not exceed 100 years',
  VaultNotFound: 'Vault not found',
  VaultAlreadyVoided: 'Vault has been voided and cannot be accessed',
  VaultLocked: 'Vault is still locked. Come back after the unlock date',
  InvalidIPFSHash: 'Invalid IPFS hash format',
  InvalidFileSize: 'File size must be between 1 byte and 500 MB',
  Unauthorized: 'Only the vault creator can perform this action',
  InvalidDescription: 'Description cannot exceed 256 characters',
} as const;

// Success messages
export const VAULT_SUCCESS = {
  VaultCreated: 'Vault created successfully!',
  VaultUnlocked: 'Vault unlocked successfully!',
  VaultVoided: 'Vault voided successfully!',
} as const;
