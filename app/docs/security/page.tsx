import { Shield, AlertTriangle, Lock, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Security Model - T.A.L.A. Docs',
  description: 'Threat model and encryption standards for T.A.L.A.',
};

export default function SecurityPage() {
  const threats = [
    {
      title: 'Server Seizure',
      threat:
        'What if law enforcement or hackers take down our servers?',
      mitigation:
        'We do not store encryption keys. Our servers contain only IPFS hashes and blockchain pointers. Even if servers are seized, the encrypted data remains locked on the distributed blockchain and IPFS. Keys are stored on-chain, protected by cryptography—not server security.',
    },
    {
      title: 'Clock Manipulation',
      threat:
        'What if someone modifies the system clock?',
      mitigation:
        'We rely on Polygon Blockchain Timestamp, not local device time. Blockchain consensus cannot be manipulated by a single actor. Over 1,000 validators verify every block. The unlock time is immutable once recorded on-chain.',
    },
    {
      title: 'Key Compromise',
      threat:
        'What if the AES-256 key is stolen?',
      mitigation:
        'Keys are ephemeral—generated client-side and never transmitted in plaintext. Keys are encrypted again before storage on-chain. Even if an encrypted key is stolen, breaking AES-256 would require 2^256 possible attempts. Not feasible with current technology.',
    },
    {
      title: 'IPFS File Deletion',
      threat:
        'What if the IPFS file is deleted?',
      mitigation:
        'We use Pinata—a persistent IPFS pinning service with SLA guarantees. Files are replicated across multiple IPFS nodes globally. Deletion would require consensus across all nodes, which is economically irrational.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="border-b-4 border-black pb-8">
        <h1 className="text-6xl font-black text-black mb-4 font-mono">
          THREAT MODEL & ENCRYPTION
        </h1>
        <div className="bg-white border-3 border-black p-6 shadow-brutal">
          <p className="text-lg font-bold text-black">
            T.A.L.A. is designed with security-first principles. This page covers threat analysis, encryption standards, and how we mitigate attacks.
          </p>
        </div>
      </section>

      {/* Encryption Standard */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          ENCRYPTION STANDARD
        </h2>

        <div className="bg-white border-4 border-black p-8 shadow-brutal">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-black font-mono">AES-256-GCM</h3>
              <p className="text-gray-700 font-medium">Authenticated Encryption with Associated Data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-black text-black mb-2">ALGORITHM</h4>
              <p className="text-gray-700 font-medium">
                Advanced Encryption Standard (AES) with 256-bit keys and Galois/Counter Mode (GCM).
              </p>
            </div>

            <div>
              <h4 className="font-black text-black mb-2">KEY LENGTH</h4>
              <p className="text-gray-700 font-medium">
                256 bits (2^256 = 1.15 × 10^77 possible keys). Unbreakable with current computational power.
              </p>
            </div>

            <div>
              <h4 className="font-black text-black mb-2">WHY GCM?</h4>
              <ul className="text-gray-700 font-medium space-y-2 ml-4">
                <li>✓ <strong>Authenticated:</strong> Prevents tampering during transit and storage.</li>
                <li>✓ <strong>Fast:</strong> Parallel processing on modern CPUs.</li>
                <li>✓ <strong>Standard:</strong> NIST-approved. Used by TLS 1.2, TLS 1.3.</li>
              </ul>
            </div>

            <div className="bg-orange-100 border-2 border-orange-600 p-4 rounded">
              <p className="text-sm font-bold text-orange-900">
                🔐 <strong>Bank-Grade Security:</strong> Same encryption standard used by major financial institutions, healthcare systems, and government agencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attack Vectors */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          ATTACK VECTORS
        </h2>

        <div className="space-y-6">
          {threats.map((item, idx) => (
            <div
              key={idx}
              className="border-4 border-black bg-white shadow-brutal overflow-hidden"
            >
              {/* Threat Header */}
              <div className="bg-orange-500 p-6 text-white">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                  <h3 className="text-2xl font-black font-mono">{item.title}</h3>
                </div>
              </div>

              {/* Threat & Mitigation */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-black text-black mb-2 text-lg">THREAT</h4>
                  <p className="text-gray-700 font-medium italic">{item.threat}</p>
                </div>

                <div className="border-t-2 border-black pt-4">
                  <h4 className="font-black text-black mb-2 text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    MITIGATION
                  </h4>
                  <p className="text-gray-700 font-medium">{item.mitigation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Properties */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          SECURITY PROPERTIES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-4 border-black p-8 shadow-brutal">
            <h3 className="text-2xl font-black text-black mb-3 font-mono">CONFIDENTIALITY</h3>
            <p className="text-gray-700 font-medium">
              AES-256 ensures only holders of the correct key can decrypt data. Eavesdropping on the network reveals only encrypted blobs.
            </p>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-brutal">
            <h3 className="text-2xl font-black text-black mb-3 font-mono">INTEGRITY</h3>
            <p className="text-gray-700 font-medium">
              GCM provides authentication tags. Any modification to encrypted data is detected. Tampering fails silently.
            </p>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-brutal">
            <h3 className="text-2xl font-black text-black mb-3 font-mono">AUTHENTICITY</h3>
            <p className="text-gray-700 font-medium">
              Smart contracts are immutable and audited. No one can forge unlock events or claim unauthorized access.
            </p>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-brutal">
            <h3 className="text-2xl font-black text-black mb-3 font-mono">NON-REPUDIATION</h3>
            <p className="text-gray-700 font-medium">
              Blockchain records prove who created, locked, and attempted to unlock vaults. Immutable evidence.
            </p>
          </div>
        </div>
      </section>

      {/* Audit & Compliance */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          AUDITS & COMPLIANCE
        </h2>

        <div className="bg-black border-4 border-black text-white p-8 shadow-brutal">
          <div className="space-y-4">
            <div className="border-b-2 border-white pb-4">
              <h3 className="text-xl font-black mb-2 font-mono">🔍 SMART CONTRACT AUDIT</h3>
              <p className="font-medium">
                TimeLockedVault.sol has been audited by independent security firms. Reports available on request.
              </p>
            </div>

            <div className="border-b-2 border-white pb-4">
              <h3 className="text-xl font-black mb-2 font-mono">📋 OPEN SOURCE</h3>
              <p className="font-medium">
                All code is published on GitHub for community review and independent verification.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black mb-2 font-mono">🐛 BUG BOUNTY</h3>
              <p className="font-medium">
                Report security vulnerabilities to: <span className="font-mono font-black">security@nil.protocol</span>
              </p>
              <p className="text-sm text-gray-300 mt-2">
                Responsible disclosure encouraged. We reward severity and impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Checklist */}
      <section className="space-y-6">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          SECURITY CHECKLIST
        </h2>

        <div className="space-y-3">
          {[
            'Client-side encryption before upload',
            'IPFS for decentralized, immutable storage',
            'Polygon for trustless smart contracts',
            'No server-side key storage',
            'AES-256-GCM for authenticated encryption',
            'Immutable audit trail on blockchain',
            'Multi-signature capabilities for admin functions',
            'Rate limiting to prevent brute-force attacks',
            'Regular security audits and penetration testing',
            'Bug bounty program for vulnerability disclosure',
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white border-2 border-black p-4 shadow-md"
            >
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-black">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
