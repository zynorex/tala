import { Code } from 'lucide-react';

export const metadata = {
  title: 'Smart Contract API - T.A.L.A. Docs',
  description: 'Solidity reference for TimeLockedVault smart contract',
};

export default function SmartContractPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="border-b-4 border-black pb-8">
        <h1 className="text-6xl font-black text-black mb-4 font-mono">
          SOLIDITY REFERENCE
        </h1>
        <div className="bg-white border-3 border-black p-6 shadow-brutal">
          <p className="text-lg font-bold text-black">
            Complete API reference for <span className="font-mono bg-gray-200 px-2 py-1">TimeLockedVault.sol</span>. Learn the data structures, functions, and error codes.
          </p>
        </div>
      </section>

      {/* Data Structure */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          DATA STRUCTURE
        </h2>
        <div className="bg-black border-4 border-black text-heirlock-yellow p-8 shadow-brutal font-mono text-sm overflow-x-auto">
          <pre>{`struct Vault {
    string ipfsHash;          // IPFS address of encrypted file
    string encryptedKey;      // AES-256 key (encrypted)
    uint256 unlockTime;       // Unix timestamp for release
    address creator;          // Who created this vault
    bool isVoided;            // Emergency destruction flag
    uint256 createdAt;        // Timestamp of creation
}`}</pre>
        </div>
        <p className="text-gray-700 font-medium">
          Each vault is a unique instance identified by a <span className="font-mono bg-gray-200 px-2 py-1">vaultId</span>. The mapping stores all active vaults.
        </p>
      </section>

      {/* State Variables */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          STATE VARIABLES
        </h2>
        <div className="space-y-4">
          <div className="bg-white border-3 border-black p-6 shadow-brutal">
            <code className="font-mono font-black text-orange-600 block mb-2">
              mapping(uint256 =&gt; Vault) public vaults
            </code>
            <p className="text-gray-700 font-medium">
              Maps vaultId to Vault struct. Public for verification.
            </p>
          </div>
          <div className="bg-white border-3 border-black p-6 shadow-brutal">
            <code className="font-mono font-black text-orange-600 block mb-2">
              uint256 public vaultCounter
            </code>
            <p className="text-gray-700 font-medium">
              Auto-incrementing ID for new vaults.
            </p>
          </div>
          <div className="bg-white border-3 border-black p-6 shadow-brutal">
            <code className="font-mono font-black text-orange-600 block mb-2">
              address public owner
            </code>
            <p className="text-gray-700 font-medium">
              Contract owner for admin functions.
            </p>
          </div>
        </div>
      </section>

      {/* Functions */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          FUNCTIONS
        </h2>

        {/* createVault */}
        <div className="bg-white border-4 border-black p-8 shadow-brutal">
          <div className="bg-black text-white px-4 py-2 rounded-lg mb-4 font-mono font-black text-sm inline-block">
            CREATE_VAULT
          </div>
          <div className="bg-gray-100 border-2 border-black p-4 font-mono text-sm mb-4 overflow-x-auto">
            <pre>{`function createVault(
    string memory ipfsHash,
    string memory encryptedKey,
    uint256 unlockTime
) public returns (uint256)`}</pre>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-black text-black mb-1">DESCRIPTION</h4>
              <p className="text-gray-700 font-medium">Creates a new time-locked vault and stores it on the blockchain.</p>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">PARAMETERS</h4>
              <ul className="text-gray-700 font-medium space-y-1 ml-4">
                <li>• <span className="font-mono">ipfsHash</span>: IPFS address of encrypted file</li>
                <li>• <span className="font-mono">encryptedKey</span>: AES-256 key (encrypted)</li>
                <li>• <span className="font-mono">unlockTime</span>: Unix timestamp when key can be retrieved</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">RETURNS</h4>
              <p className="text-gray-700 font-medium"><span className="font-mono">vaultId</span>: Unique identifier for this vault</p>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">EMITS</h4>
              <p className="text-gray-700 font-medium"><span className="font-mono">VaultCreated(vaultId, msg.sender, unlockTime)</span></p>
            </div>
          </div>
        </div>

        {/* unlockVault */}
        <div className="bg-white border-4 border-black p-8 shadow-brutal">
          <div className="bg-black text-white px-4 py-2 rounded-lg mb-4 font-mono font-black text-sm inline-block">
            UNLOCK_VAULT
          </div>
          <div className="bg-gray-100 border-2 border-black p-4 font-mono text-sm mb-4 overflow-x-auto">
            <pre>{`function unlockVault(uint256 vaultId)
    public
    view
    returns (string memory)`}</pre>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-black text-black mb-1">DESCRIPTION</h4>
              <p className="text-gray-700 font-medium">Returns the encryption key ONLY if the current timestamp has reached the unlock time.</p>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">PARAMETERS</h4>
              <p className="text-gray-700 font-medium ml-4">• <span className="font-mono">vaultId</span>: ID of the vault to unlock</p>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">RETURNS</h4>
              <p className="text-gray-700 font-medium"><span className="font-mono">encryptedKey</span>: The decryption key (if unlocked)</p>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">REVERTS IF</h4>
              <ul className="text-gray-700 font-medium space-y-1 ml-4">
                <li>• Vault does not exist</li>
                <li>• Current time &lt; unlock time (E01)</li>
                <li>• Vault has been voided (E03)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* voidVault */}
        <div className="bg-white border-4 border-black p-8 shadow-brutal">
          <div className="bg-black text-white px-4 py-2 rounded-lg mb-4 font-mono font-black text-sm inline-block">
            VOID_VAULT
          </div>
          <div className="bg-gray-100 border-2 border-black p-4 font-mono text-sm mb-4 overflow-x-auto">
            <pre>{`function voidVault(uint256 vaultId)
    public
    onlyCreator`}</pre>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-black text-black mb-1">DESCRIPTION</h4>
              <p className="text-gray-700 font-medium">Emergency function to destroy a vault (before it unlocks).</p>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">ACCESS</h4>
              <p className="text-gray-700 font-medium">Only the vault creator can call this function.</p>
            </div>
            <div>
              <h4 className="font-black text-black mb-1">EFFECT</h4>
              <p className="text-gray-700 font-medium">Sets <span className="font-mono">isVoided = true</span>. The vault can no longer be unlocked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Error Codes */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          ERROR CODES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border-3 border-black p-6 shadow-brutal">
            <div className="font-mono font-black text-orange-600 mb-2">E01</div>
            <h4 className="font-black text-black mb-1">VAULT_LOCKED</h4>
            <p className="text-gray-700 font-medium text-sm">
              Unlock time has not been reached yet.
            </p>
          </div>
          <div className="bg-white border-3 border-black p-6 shadow-brutal">
            <div className="font-mono font-black text-orange-600 mb-2">E02</div>
            <h4 className="font-black text-black mb-1">VAULT_NOT_FOUND</h4>
            <p className="text-gray-700 font-medium text-sm">
              Vault ID does not exist.
            </p>
          </div>
          <div className="bg-white border-3 border-black p-6 shadow-brutal">
            <div className="font-mono font-black text-orange-600 mb-2">E03</div>
            <h4 className="font-black text-black mb-1">VAULT_VOIDED</h4>
            <p className="text-gray-700 font-medium text-sm">
              Vault has been destroyed and cannot be unlocked.
            </p>
          </div>
          <div className="bg-white border-3 border-black p-6 shadow-brutal">
            <div className="font-mono font-black text-orange-600 mb-2">E04</div>
            <h4 className="font-black text-black mb-1">UNAUTHORIZED</h4>
            <p className="text-gray-700 font-medium text-sm">
              Only the creator can void a vault.
            </p>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          EVENTS
        </h2>
        <div className="space-y-4">
          <div className="bg-black border-4 border-black text-heirlock-yellow p-6 shadow-brutal font-mono text-sm overflow-x-auto">
            <pre>{`event VaultCreated(
    uint256 indexed vaultId,
    address indexed creator,
    uint256 unlockTime
);`}</pre>
          </div>
          <div className="bg-black border-4 border-black text-heirlock-yellow p-6 shadow-brutal font-mono text-sm overflow-x-auto">
            <pre>{`event VaultUnlocked(
    uint256 indexed vaultId,
    address indexed caller
);`}</pre>
          </div>
          <div className="bg-black border-4 border-black text-heirlock-yellow p-6 shadow-brutal font-mono text-sm overflow-x-auto">
            <pre>{`event VaultVoided(
    uint256 indexed vaultId,
    address indexed creator
);`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
