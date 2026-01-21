import { Code2, Database, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { DevDocSection } from '@/app/docs/dev-doc-section';

export const metadata = {
  title: 'Documentation - T.A.L.A.',
  description: 'Developer documentation for T.A.L.A. - Decentralized Time-Capsule Protocol',
};

const techStack = [
  { icon: Code2, label: 'Next.js', description: 'React Framework' },
  { icon: Database, label: 'Polygon', description: 'Blockchain' },
  { icon: Zap, label: 'IPFS', description: 'Decentralized Storage' },
  { icon: Shield, label: 'Wagmi', description: 'Web3 Integration' },
];

export default function DocsHub() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="border-b-4 border-black pb-8">
        <h1 className="text-6xl md:text-7xl font-black text-black mb-6 font-mono">
          DEVELOPER DOCS
        </h1>
        <div className="bg-white border-3 border-black p-6 shadow-brutal">
          <p className="text-lg font-bold text-black leading-relaxed">
            T.A.L.A. is a decentralized protocol for time-locking sensitive data. This documentation covers the architecture, smart contracts, security models, and development setup. Everything you need to understand and work with the vault.
          </p>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="space-y-4">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          TECH STACK
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={idx}
                className="bg-white border-3 border-black p-6 shadow-brutal hover:translate-y-[-4px] transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-500 p-2 rounded">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black text-black text-lg font-mono">{tech.label}</h3>
                </div>
                <p className="text-sm text-gray-700 font-medium">{tech.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Developer Documentation Sections */}
      <section className="space-y-4">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          DEV DOCS REFERENCE
        </h2>
        <p className="text-gray-700 font-bold mb-6">
          Click any section below to expand code examples, API patterns, and setup guides.
        </p>
        <DevDocSection />
      </section>

      {/* Additional Documentation */}
      <section className="space-y-4">
        <h2 className="text-4xl font-black text-black font-mono border-b-4 border-black pb-4">
          DEEP DIVE DOCS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/docs/architecture">
            <div className="bg-white border-4 border-black p-8 shadow-brutal cursor-pointer hover:translate-y-[-6px] transition-all duration-200 group">
              <h3 className="text-2xl font-black text-black mb-3 group-hover:text-orange-600 transition-colors">
                Architecture
              </h3>
              <p className="text-gray-700 font-medium mb-4">
                Learn about the hybrid model and how T.A.L.A. combines Client, IPFS, and Blockchain.
              </p>
              <div className="text-orange-600 font-black">→ READ</div>
            </div>
          </Link>

          <Link href="/docs/smart-contract">
            <div className="bg-white border-4 border-black p-8 shadow-brutal cursor-pointer hover:translate-y-[-6px] transition-all duration-200 group">
              <h3 className="text-2xl font-black text-black mb-3 group-hover:text-orange-600 transition-colors">
                Smart Contract API
              </h3>
              <p className="text-gray-700 font-medium mb-4">
                Solidity reference for TimeLockedVault.sol with function signatures and error codes.
              </p>
              <div className="text-orange-600 font-black">→ READ</div>
            </div>
          </Link>

          <Link href="/docs/security">
            <div className="bg-white border-4 border-black p-8 shadow-brutal cursor-pointer hover:translate-y-[-6px] transition-all duration-200 group">
              <h3 className="text-2xl font-black text-black mb-3 group-hover:text-orange-600 transition-colors">
                Security Model
              </h3>
              <p className="text-gray-700 font-medium mb-4">
                Threat analysis, encryption standards, and attack vectors. AES-256-GCM security model.
              </p>
              <div className="text-orange-600 font-black">→ READ</div>
            </div>
          </Link>

          <Link href="/">
            <div className="bg-white border-4 border-black p-8 shadow-brutal cursor-pointer hover:translate-y-[-6px] transition-all duration-200 group">
              <h3 className="text-2xl font-black text-black mb-3 group-hover:text-orange-600 transition-colors">
                Back to Home
              </h3>
              <p className="text-gray-700 font-medium mb-4">
                Return to the main landing page and explore the platform.
              </p>
              <div className="text-orange-600 font-black">→ GO</div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

