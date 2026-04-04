import { Code } from "lucide-react";

export const metadata = {
  title: "Smart contract | T.A.L.A. Docs",
  description: "Reference for the TimeLockedVault contract used by T.A.L.A.",
};

const stateVars = [
  {
    name: "vaults",
    type: "mapping(uint256 => Vault)",
    note: "Stores every vault by identifier. Public for verification.",
  },
  {
    name: "vaultCounter",
    type: "uint256",
    note: "Monotonic id generator for new vaults.",
  },
  {
    name: "owner",
    type: "address",
    note: "Contract owner allowed to run administrative routines such as pausing or upgrades if configured.",
  },
];

const errorCodes = [
  { code: "E01", label: "VAULT_LOCKED", desc: "Unlock time has not arrived." },
  { code: "E02", label: "VAULT_NOT_FOUND", desc: "Requested vault id does not exist." },
  { code: "E03", label: "VAULT_VOIDED", desc: "Vault was destroyed and cannot return a key." },
  { code: "E04", label: "UNAUTHORIZED", desc: "Caller lacks permission for the action." },
];

export default function SmartContractPage() {
  return (
    <main className="space-y-12">
      <section className="space-y-4 border-b-4 border-black pb-8">
        <h1 className="text-5xl md:text-6xl font-black text-black">TimeLockedVault reference</h1>
        <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
          <p className="text-lg font-semibold text-black/85">
            Use this reference to inspect data structures, state variables, primary functions, and emitted events. Copy the snippets into audits or internal reviews.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Code className="h-6 w-6" />
          <h2 className="text-3xl font-black">Vault structure</h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border-4 border-black bg-black p-8 font-mono text-sm text-heirlock-yellow shadow-brutal">
          <pre>{`struct Vault {
    string ipfsHash;        // Encrypted file location
    string encryptedKey;    // AES 256 key, sealed
    uint256 unlockTime;     // Unix time for release
    address creator;        // Creator address
    bool isVoided;          // True when destroyed
    uint256 createdAt;      // Block time of creation
}`}</pre>
        </div>
        <p className="text-sm font-semibold text-black/75">Each vault is addressed by a numeric id. The mapping is public so anyone can verify inputs against contract state.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-black">State variables</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stateVars.map((item) => (
            <div key={item.name} className="rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
              <p className="font-mono text-orange-600 font-black">{item.type}</p>
              <p className="text-sm font-black text-black">{item.name}</p>
              <p className="text-sm text-black/75">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-black">Primary functions</h2>

        <div className="space-y-6">
          <div className="rounded-2xl border-4 border-black bg-white p-8 shadow-brutal">
            <span className="mb-4 inline-block rounded-lg bg-black px-4 py-2 font-mono text-sm font-black text-white">createVault</span>
            <div className="mb-4 overflow-x-auto rounded border-2 border-black bg-gray-100 p-4 font-mono text-sm">
              <pre>{`function createVault(
    string memory ipfsHash,
    string memory encryptedKey,
    uint256 unlockTime
) public returns (uint256)`}</pre>
            </div>
            <ul className="space-y-2 text-sm text-black/80">
              <li><strong>Purpose:</strong> Create a new vault and store inputs on chain.</li>
              <li><strong>Parameters:</strong> ipfsHash (CID), encryptedKey (AES 256 key), unlockTime (Unix time).</li>
              <li><strong>Returns:</strong> Numeric vault id.</li>
              <li><strong>Emits:</strong> VaultCreated with id, creator, and unlock time.</li>
            </ul>
          </div>

          <div className="rounded-2xl border-4 border-black bg-white p-8 shadow-brutal">
            <span className="mb-4 inline-block rounded-lg bg-black px-4 py-2 font-mono text-sm font-black text-white">unlockVault</span>
            <div className="mb-4 overflow-x-auto rounded border-2 border-black bg-gray-100 p-4 font-mono text-sm">
              <pre>{`function unlockVault(uint256 vaultId)
    public
    view
    returns (string memory)`}</pre>
            </div>
            <ul className="space-y-2 text-sm text-black/80">
              <li><strong>Purpose:</strong> Return the encrypted key when the unlock time has passed.</li>
              <li><strong>Reverts:</strong> If the vault is missing, not yet ready, or has been voided.</li>
              <li><strong>Read only:</strong> No gas heavy state changes; callers can check readiness without extra cost.</li>
            </ul>
          </div>

          <div className="rounded-2xl border-4 border-black bg-white p-8 shadow-brutal">
            <span className="mb-4 inline-block rounded-lg bg-black px-4 py-2 font-mono text-sm font-black text-white">voidVault</span>
            <div className="mb-4 overflow-x-auto rounded border-2 border-black bg-gray-100 p-4 font-mono text-sm">
              <pre>{`function voidVault(uint256 vaultId)
    public
    onlyCreator`}</pre>
            </div>
            <ul className="space-y-2 text-sm text-black/80">
              <li><strong>Purpose:</strong> Destroy a vault before release when policy demands invalidation.</li>
              <li><strong>Access:</strong> Only the creator can void. Sets isVoided to true.</li>
              <li><strong>Emits:</strong> VaultVoided with id and creator.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-black">Error codes</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {errorCodes.map((item) => (
            <div key={item.code} className="rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
              <div className="font-mono font-black text-orange-600">{item.code}</div>
              <p className="font-black text-black">{item.label}</p>
              <p className="text-sm text-black/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 pb-12">
        <h2 className="text-3xl font-black">Events</h2>
        <div className="space-y-4">
          {[
            `event VaultCreated(
    uint256 indexed vaultId,
    address indexed creator,
    uint256 unlockTime
);`,
            `event VaultUnlocked(
    uint256 indexed vaultId,
    address indexed caller
);`,
            `event VaultVoided(
    uint256 indexed vaultId,
    address indexed creator
);`,
          ].map((evt, idx) => (
            <div key={idx} className="overflow-x-auto rounded-2xl border-4 border-black bg-black p-6 font-mono text-sm text-heirlock-yellow shadow-brutal">
              <pre>{evt}</pre>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

