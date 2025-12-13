'use client';

import { Code, Lock, Shield, Zap, CheckCircle, GitBranch, ExternalLink, Copy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SmartContracts() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const contracts = [
    {
      name: "T.A.L.A. Vault",
      description: "Main contract handling paper storage, time-locks, and access control.",
      address: "0x1234567890123456789012345678901234567890",
      network: "Polygon Amoy",
      verified: true,
      features: ["Time-Lock Logic", "Encryption Verification", "Access Control"],
    },
    {
      name: "Oracle Keeper",
      description: "Oracle contract monitoring time-locks and triggering automatic unlocks.",
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      network: "Polygon Amoy",
      verified: true,
      features: ["Time Monitoring", "Automatic Triggers"],
    },
    {
      name: "Student Access Token",
      description: "NFT-based access token proving student right to access papers.",
      address: "0xfedcbafedcbafedcbafedcbafedcbafedcbafed",
      network: "Polygon Amoy",
      verified: true,
      features: ["NFT Minting", "Verification"],
    },
  ];

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Smart <br />
              Contracts
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Auditable, open-source contracts securing exam papers with blockchain.
            </p>
          </div>
        </div>
      </section>

      {/* Security Badge */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="border-4 border-black bg-white p-8 shadow-brutal flex items-center gap-4">
            <CheckCircle className="w-10 h-10 text-heirlock-green flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Audited & Verified</h3>
              <p className="text-gray-700">
                All contracts have been audited by leading security firms. Fully open source on GitHub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contracts */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-green">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Deployed Contracts</h2>
          <div className="space-y-6">
            {contracts.map((contract, index) => (
              <div
                key={index}
                className="border-4 border-heirlock-green bg-black p-8 shadow-brutal"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Code className="w-6 h-6 text-heirlock-green" />
                      <h3 className="text-2xl font-bold text-white">{contract.name}</h3>
                      {contract.verified && (
                        <span className="px-3 py-1 bg-heirlock-green text-black text-xs font-bold rounded">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{contract.description}</p>
                  </div>
                  <Shield className="w-8 h-8 text-heirlock-green flex-shrink-0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Contract Address</p>
                    <div className="flex items-center gap-2 bg-black p-3 rounded border-2 border-heirlock-green/50">
                      <code className="text-xs font-mono text-gray-300 flex-1 break-all">{contract.address}</code>
                      <button
                        onClick={() => copyAddress(contract.address)}
                        className="text-heirlock-green hover:text-heirlock-green flex-shrink-0"
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
                    <p className="text-sm text-gray-400 mb-2">Network</p>
                    <div className="bg-black p-3 rounded border-2 border-heirlock-green/50 font-bold text-white">
                      {contract.network}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-3">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {contract.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-heirlock-green/20 text-heirlock-green text-xs font-bold rounded">
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

      {/* Resources */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="#"
              className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <GitBranch className="w-8 h-8 text-heirlock-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Source Code</h3>
              <p className="text-gray-700 text-sm mb-4">
                Review all smart contract source code on GitHub.
              </p>
              <div className="flex items-center gap-2 text-heirlock-green font-bold">
                View Code <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            <a
              href="#"
              className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Shield className="w-8 h-8 text-heirlock-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Audit Report</h3>
              <p className="text-gray-700 text-sm mb-4">
                Full security audit from certified auditors.
              </p>
              <div className="flex items-center gap-2 text-heirlock-green font-bold">
                Download PDF <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            <a
              href="#"
              className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Zap className="w-8 h-8 text-heirlock-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Gas Analytics</h3>
              <p className="text-gray-700 text-sm mb-4">
                See average gas costs and optimization.
              </p>
              <div className="flex items-center gap-2 text-heirlock-green font-bold">
                View Analytics <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Integrate with T.A.L.A.
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Use our contracts in your own applications. Full API documentation available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/documentation/api-reference">
              <button className="px-8 py-3 bg-black text-heirlock-green font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
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
    </main>
  );
}
