'use client';

import { Code, Lock, Shield, Zap, CheckCircle, GitBranch, ExternalLink, Copy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SmartContracts() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const contracts = [
    {
      name: "T.A.L.A. Vault",
      description: "Primary vault logic orchestrating time-locks, access control, and on-chain proofs.",
      address: "0x1234567890123456789012345678901234567890",
      network: "Polygon Amoy",
      verified: true,
      lastAudit: "Jan 2026",
      deployBlock: "8,219,441",
      features: ["Time-Lock Logic", "Encryption Proofs", "Role Governance", "Emergency Pauses"],
    },
    {
      name: "Oracle Keeper",
      description: "Keeper contract verifying timestamps and triggering deterministic unlocks.",
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      network: "Polygon Amoy",
      verified: true,
      lastAudit: "Jan 2026",
      deployBlock: "8,219,455",
      features: ["Clock Drift Guards", "Release Triggers", "Watcher Attestations"],
    },
    {
      name: "Access Token",
      description: "Permission token for release recipients with role-weighted voting guards.",
      address: "0xfedcbafedcbafedcbafedcbafedcbafedcbafed",
      network: "Polygon Amoy",
      verified: true,
      lastAudit: "Jan 2026",
      deployBlock: "8,219,470",
      features: ["NFT Minting", "Signature Grants", "Audit Trails"],
    },
  ];

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cream">
        <section className="relative overflow-hidden border-b-4 border-black bg-[radial-gradient(circle_at_20%_20%,#B7FFB7_0%,#e8ffe8_35%,#ffffff_70%)] pt-24 pb-14">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="h-6 w-40 bg-black/10 rounded-full shimmer" />
            <div className="mt-6 h-16 w-2/3 bg-black/10 rounded-lg shimmer" />
            <div className="mt-4 h-6 w-1/2 bg-black/10 rounded-lg shimmer" />
          </div>
        </section>
        <section className="container mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-4 border-black bg-white p-6 shadow-brutal">
              <div className="h-6 w-24 bg-black/10 rounded shimmer" />
              <div className="mt-4 h-4 w-full bg-black/10 rounded shimmer" />
              <div className="mt-3 h-4 w-5/6 bg-black/10 rounded shimmer" />
              <div className="mt-6 h-10 w-full bg-black/10 rounded shimmer" />
            </div>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <section className="relative overflow-hidden border-b-4 border-black bg-[radial-gradient(circle_at_20%_20%,#B7FFB7_0%,#e8ffe8_35%,#ffffff_70%)] pt-24 pb-14">
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute -left-20 top-10 h-60 w-60 rounded-full bg-heirlock-green/40 blur-3xl" />
          <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-heirlock-blue/30 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-end">
            <div className="space-y-5 max-w-2xl">
              <p className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-[0.35em] text-black bg-white border-4 border-black px-4 py-2 shadow-brutal">
                Contract Control Room
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-black leading-tight">
                Smart Contracts
                <span className="block text-lg md:text-xl font-mono text-black/70 mt-3">deterministic unlocks • verifiable proofs • zero manual override</span>
              </h1>
              <p className="text-lg text-gray-800 font-medium">
                T.A.L.A. contracts are engineered for auditability. Every unlock step is recorded, replayable, and signed by the chain.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-xs">
                  <span className="inline-block h-2 w-2 rounded-full bg-heirlock-green animate-pulse" />
                  Polygon Amoy synced
                </span>
                <span className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-xs">
                  last audit: Jan 2026
                </span>
              </div>
            </div>
            <div className="border-4 border-black bg-black text-heirlock-yellow px-5 py-4 font-mono text-sm shadow-brutal scanline">
              [ chain log ] 98 blocks verified • 0 forced overrides • gas 0.01 gwei
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-4 border-black bg-white p-6 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all micro-card">
              <Shield className="w-7 h-7 text-black" />
              <h3 className="mt-4 text-xl font-black">Audited & Verified</h3>
              <p className="text-sm text-gray-700">Independent reviews published with remediation notes and gas diffs.</p>
            </div>
            <div className="border-4 border-black bg-white p-6 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all micro-card">
              <Lock className="w-7 h-7 text-black" />
              <h3 className="mt-4 text-xl font-black">Immutable Schedules</h3>
              <p className="text-sm text-gray-700">Unlock windows cannot be accelerated once committed on-chain.</p>
            </div>
            <div className="border-4 border-black bg-white p-6 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all micro-card">
              <Zap className="w-7 h-7 text-black" />
              <h3 className="mt-4 text-xl font-black">Gas Optimized</h3>
              <p className="text-sm text-gray-700">Critical paths are optimized for predictable, low-latency operations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-black border-y-4 border-black">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-black text-heirlock-yellow uppercase tracking-[0.35em]">Deployment registry</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">Deployed Contracts</h2>
            </div>
            <div className="text-xs font-mono text-heirlock-yellow border-2 border-heirlock-yellow px-3 py-2">
              registry hash: 0x9c9d...a31f
            </div>
          </div>
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <div
                key={contract.name}
                className="border-4 border-heirlock-yellow bg-black p-6 md:p-8 shadow-brutal contract-card"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Code className="w-6 h-6 text-heirlock-yellow" />
                      <h3 className="text-2xl font-black text-white">{contract.name}</h3>
                      {contract.verified && (
                        <span className="px-3 py-1 bg-heirlock-yellow text-black text-xs font-black">VERIFIED</span>
                      )}
                    </div>
                    <p className="text-gray-300 max-w-2xl">{contract.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-7 h-7 text-heirlock-yellow" />
                    <div className="text-xs font-mono text-heirlock-yellow">audit: {contract.lastAudit}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="md:col-span-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-heirlock-yellow/70 mb-2">Contract Address</p>
                    <div className="flex items-center gap-3 border-2 border-heirlock-yellow/60 px-3 py-2">
                      <code className="text-xs font-mono text-gray-200 flex-1 break-all">{contract.address}</code>
                      <button
                        onClick={() => copyAddress(contract.address)}
                        className="text-heirlock-yellow hover:text-white transition-colors"
                        aria-label="Copy contract address"
                      >
                        {copiedAddress === contract.address ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-heirlock-yellow/70 mb-2">Network</p>
                    <div className="border-2 border-heirlock-yellow/60 px-3 py-2 font-bold text-white">{contract.network}</div>
                    <p className="mt-2 text-xs text-heirlock-yellow/70 font-mono">deploy block {contract.deployBlock}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-heirlock-yellow/70 mb-3">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {contract.features.map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-heirlock-yellow/10 text-heirlock-yellow text-xs font-bold">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-3">
          <a
            href="#"
            className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all micro-card"
          >
            <GitBranch className="w-8 h-8 text-black mb-4" />
            <h3 className="text-xl font-black mb-3">Source Code</h3>
            <p className="text-gray-700 text-sm mb-4">Review every commit, tag, and deployment hash.</p>
            <div className="flex items-center gap-2 text-black font-bold">View Code <ExternalLink className="w-4 h-4" /></div>
          </a>
          <a
            href="#"
            className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all micro-card"
          >
            <Shield className="w-8 h-8 text-black mb-4" />
            <h3 className="text-xl font-black mb-3">Audit Report</h3>
            <p className="text-gray-700 text-sm mb-4">Coverage map, severity breakdown, remediation timeline.</p>
            <div className="flex items-center gap-2 text-black font-bold">Download PDF <ExternalLink className="w-4 h-4" /></div>
          </a>
          <a
            href="#"
            className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all micro-card"
          >
            <Zap className="w-8 h-8 text-black mb-4" />
            <h3 className="text-xl font-black mb-3">Gas Analytics</h3>
            <p className="text-gray-700 text-sm mb-4">Track mean execution cost and watcher overhead.</p>
            <div className="flex items-center gap-2 text-black font-bold">View Analytics <ExternalLink className="w-4 h-4" /></div>
          </a>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-heirlock-yellow border-t-4 border-black">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-5">Integrate with T.A.L.A.</h2>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            Plug the contracts into your own release workflows. API references and deployment scripts stay public.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/documentation/api-reference">
              <button className="px-8 py-3 bg-black text-heirlock-yellow font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                API Reference
              </button>
            </Link>
            <Link href="/">
              <button className="px-8 py-3 bg-white text-black font-bold border-4 border-black hover:bg-black hover:text-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contract-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .contract-card:hover {
          transform: translate3d(4px, 4px, 0);
          box-shadow: none;
        }
        .scanline {
          position: relative;
          overflow: hidden;
        }
        .scanline::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
          animation: scan 3.8s linear infinite;
        }
        .micro-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%);
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes scan {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </main>
  );
}

