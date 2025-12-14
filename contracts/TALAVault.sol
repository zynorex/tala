// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TALA - Time-locked Asset/Archive Vault
 * @notice Non-custodial time-locked vault system with IPFS integration
 * @dev Stores encrypted content references and manages unlock schedules
 */
contract TALAVault is ReentrancyGuard, Ownable, Pausable {
    // ============ Structs ============
    
    struct Vault {
        address creator;
        string ipfsHash;
        bytes32 encryptedKeyHash;
        uint256 unlockTime;
        uint256 createdAt;
        bool voided;
        string description;
        uint256 fileSize;
    }

    // ============ State Variables ============
    
    mapping(uint256 => Vault) public vaults;
    mapping(address => uint256[]) public userVaults;
    mapping(uint256 => bool) private vaultExists;
    
    uint256 public vaultCounter = 1;
    uint256 public constant MIN_LOCK_DURATION = 1 minutes;
    uint256 public constant MAX_LOCK_DURATION = 365 days * 100; // 100 years
    uint256 public constant MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

    // ============ Events ============
    
    event VaultCreated(
        uint256 indexed vaultId,
        address indexed creator,
        uint256 unlockTime,
        string ipfsHash
    );
    
    event VaultUnlocked(
        uint256 indexed vaultId,
        address indexed accessor,
        uint256 unlockedAt
    );
    
    event VaultVoided(
        uint256 indexed vaultId,
        address indexed creator,
        uint256 voidedAt
    );

    // ============ Errors ============
    
    error InvalidUnlockTime();
    error VaultNotFound();
    error VaultAlreadyVoided();
    error VaultLocked();
    error InvalidIPFSHash();
    error InvalidFileSize();
    error Unauthorized();
    error InvalidDescription();

    // ============ Modifiers ============
    
    modifier vaultNotVoided(uint256 _vaultId) {
        if (!vaultExists[_vaultId]) revert VaultNotFound();
        if (vaults[_vaultId].voided) revert VaultAlreadyVoided();
        _;
    }

    modifier isUnlocked(uint256 _vaultId) {
        if (block.timestamp < vaults[_vaultId].unlockTime) revert VaultLocked();
        _;
    }

    // ============ Core Functions ============
    
    /**
     * @notice Create a new time-locked vault
     * @param _ipfsHash IPFS hash of encrypted content (must be valid CIDv0 or CIDv1)
     * @param _encryptedKeyHash keccak256 hash of encrypted encryption key
     * @param _unlockTime Unix timestamp when vault becomes accessible
     * @param _description Vault description (max 256 chars)
     * @param _fileSize Size of encrypted file in bytes
     */
    function createVault(
        string calldata _ipfsHash,
        bytes32 _encryptedKeyHash,
        uint256 _unlockTime,
        string calldata _description,
        uint256 _fileSize
    ) external nonReentrant whenNotPaused returns (uint256) {
        // Validate inputs
        if (bytes(_ipfsHash).length < 44 || bytes(_ipfsHash).length > 59) {
            revert InvalidIPFSHash();
        }
        if (_unlockTime <= block.timestamp) {
            revert InvalidUnlockTime();
        }
        if (_unlockTime > block.timestamp + MAX_LOCK_DURATION) {
            revert InvalidUnlockTime();
        }
        if (_fileSize == 0 || _fileSize > MAX_FILE_SIZE) {
            revert InvalidFileSize();
        }
        if (bytes(_description).length > 256) {
            revert InvalidDescription();
        }

        uint256 vaultId = vaultCounter;
        vaultCounter++;

        vaults[vaultId] = Vault({
            creator: msg.sender,
            ipfsHash: _ipfsHash,
            encryptedKeyHash: _encryptedKeyHash,
            unlockTime: _unlockTime,
            createdAt: block.timestamp,
            voided: false,
            description: _description,
            fileSize: _fileSize
        });

        vaultExists[vaultId] = true;
        userVaults[msg.sender].push(vaultId);

        emit VaultCreated(vaultId, msg.sender, _unlockTime, _ipfsHash);

        return vaultId;
    }

    /**
     * @notice Access vault contents (only after unlock time)
     * @param _vaultId ID of vault to unlock
     * @return Vault data containing IPFS hash and metadata
     */
    function unlockVault(uint256 _vaultId) 
        external 
        vaultNotVoided(_vaultId) 
        isUnlocked(_vaultId) 
        nonReentrant 
        returns (Vault memory) 
    {
        emit VaultUnlocked(_vaultId, msg.sender, block.timestamp);
        return vaults[_vaultId];
    }

    /**
     * @notice Void/delete a vault (only creator before unlock time)
     * @param _vaultId ID of vault to void
     */
    function voidVault(uint256 _vaultId) external vaultNotVoided(_vaultId) nonReentrant {
        if (vaults[_vaultId].creator != msg.sender) {
            revert Unauthorized();
        }

        vaults[_vaultId].voided = true;

        emit VaultVoided(_vaultId, msg.sender, block.timestamp);
    }

    // ============ View Functions ============
    
    /**
     * @notice Get vault details
     * @param _vaultId ID of vault to retrieve
     */
    function getVault(uint256 _vaultId) 
        external 
        view 
        vaultNotVoided(_vaultId) 
        returns (Vault memory) 
    {
        return vaults[_vaultId];
    }

    /**
     * @notice Get all vaults created by user
     * @param _creator Address of vault creator
     */
    function getUserVaults(address _creator) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userVaults[_creator];
    }

    /**
     * @notice Get vault count for user
     * @param _creator Address of vault creator
     */
    function getUserVaultCount(address _creator) 
        external 
        view 
        returns (uint256) 
    {
        return userVaults[_creator].length;
    }

    /**
     * @notice Check if vault can be unlocked
     * @param _vaultId ID of vault to check
     */
    function canUnlock(uint256 _vaultId) 
        external 
        view 
        returns (bool) 
    {
        if (!vaultExists[_vaultId]) return false;
        if (vaults[_vaultId].voided) return false;
        return block.timestamp >= vaults[_vaultId].unlockTime;
    }

    /**
     * @notice Get time until vault unlock (0 if unlocked)
     * @param _vaultId ID of vault to check
     */
    function getTimeToUnlock(uint256 _vaultId) 
        external 
        view 
        returns (uint256) 
    {
        if (!vaultExists[_vaultId]) return 0;
        if (block.timestamp >= vaults[_vaultId].unlockTime) return 0;
        return vaults[_vaultId].unlockTime - block.timestamp;
    }

    // ============ Admin Functions ============
    
    /**
     * @notice Emergency pause - disable vault creation (but not unlocking)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Resume vault creation
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
