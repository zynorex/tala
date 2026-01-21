import { Server, Database, Lock, Upload, Unlock } from 'lucide-react';

export const metadata = {
  title: 'Architecture - T.A.L.A. Docs',
  description: 'System architecture and the hybrid model behind T.A.L.A.',
};

export default function ArchitecturePage() {
  const triangle = [
    {
      title: 'Client (User)',
      description: 'Generates ephemeral AES keys. Encrypts locally before upload.',
      icon: Lock,
    },
    {
      title: 'IPFS (Storage)',
      description: 'Stores encrypted PDF blobs permanently. Immutable and decentralized.',
      icon: Database,
    },
    {
      title: 'Polygon (Logic)',
      description: 'Stores the encryption key and enforces the time-lock smart contract.',
      icon: Server,
    },
  ];

  const workflow = [
    {
      step: '1. ENCRYPT',
      icon: Lock,
      title: 'Select & Encrypt',
      description: 'User selects a PDF file and generates a unique AES-256 encryption key on their device. The file is encrypted locally before leaving the browser.',
    },
    {
      step: '2. UPLOAD',
      icon: Upload,
      title: 'Upload to IPFS',
      description: 'The encrypted file is sent to Pinata (IPFS). The system receives an immutable IPFS hash. The hash and encrypted key are stored on Polygon blockchain.',
    },
    {
      step: '3. LOCK',
      icon: Lock,
      title: 'Deploy Contract',
      description: 'Smart contract receives custody of the decryption key. Mathematical impossibility of early access. Even creators cannot bypass the time-lock.',
    },
    {
      step: '4. UNLOCK',
      icon: Unlock,
      title: 'Auto Release',
      description: 'At T-Minus Zero, the blockchain releases the key automatically. Students decrypt in their browser. Instant access guaranteed.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="border-b-4 border-black pb-8">
        <h1 className="text-6xl font-black text-black mb-4 font-mono">
          THE HYBRID MODEL
        </h1>
        <div className="bg-white border-3 border-black p-6 shadow-brutal">
          <p className="text-lg font-bold text-black">
            T.A.L.A. combines three distinct systems—Client, IPFS, and Blockchain—to create a trustless, decentralized time-locking mechanism. No single entity controls the data or the release mechanism.
          </p>
        </div>
      </section>

      {/* Triangle of Trust */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          TRIANGLE OF TRUST
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {triangle.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border-4 border-black p-8 shadow-brutal hover:translate-y-[-6px] transition-all duration-200"
              >
                <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black mb-3">{item.title}</h3>
                <p className="text-gray-700 font-medium leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Workflow */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          THE WORKFLOW
        </h2>
        <div className="space-y-4">
          {workflow.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border-3 border-black p-6 shadow-brutal hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-black text-white px-3 py-2 rounded font-black text-sm font-mono whitespace-nowrap">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black text-black mb-2">{item.title}</h4>
                    <p className="text-gray-700 font-medium leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Flow Diagram */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          DATA FLOW
        </h2>
        <div className="bg-black border-4 border-black text-white p-8 shadow-brutal font-mono text-sm overflow-x-auto">
          <pre>{`User Device
    │
    ├─→ [AES-256 Encryption Key Generated]
    │
    ├─→ [PDF File Encrypted Locally]
    │
    └─→ Upload to IPFS (Pinata)
           │
           ├─→ [Immutable IPFS Hash: QmXxxx...]
           │
           └─→ Submit to Smart Contract
                  │
                  ├─→ [Store IPFS Hash]
                  ├─→ [Store Encrypted Key]
                  ├─→ [Set Unlock Timestamp]
                  │
                  └─→ [⏱️ TIME-LOCK ACTIVATED]
                         │
                         └─→ [At unlock time → Return key to user]
                                │
                                └─→ [User decrypts in browser]`}</pre>
        </div>
      </section>

      {/* Key Properties */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          KEY PROPERTIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-500 border-4 border-black p-6 shadow-brutal">
            <h3 className="text-xl font-black text-white mb-2 font-mono">NON-CUSTODIAL</h3>
            <p className="text-white font-medium">
              We never store encryption keys. Your data remains yours. Zero central point of failure.
            </p>
          </div>
          <div className="bg-orange-500 border-4 border-black p-6 shadow-brutal">
            <h3 className="text-xl font-black text-white mb-2 font-mono">IMMUTABLE</h3>
            <p className="text-white font-medium">
              Once locked on blockchain, no one—not even T.A.L.A.—can modify or delete the record.
            </p>
          </div>
          <div className="bg-orange-500 border-4 border-black p-6 shadow-brutal">
            <h3 className="text-xl font-black text-white mb-2 font-mono">TRUSTLESS</h3>
            <p className="text-white font-medium">
              Mathematical certainty, not human promises. Code enforces the time-lock, not policies.
            </p>
          </div>
          <div className="bg-orange-500 border-4 border-black p-6 shadow-brutal">
            <h3 className="text-xl font-black text-white mb-2 font-mono">DECENTRALIZED</h3>
            <p className="text-white font-medium">
              IPFS stores data globally. Polygon runs on thousands of validators. No single server.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

