'use client';

import { Lock, Shield, Code, Zap, Globe, Briefcase, FileText, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function About() {
  const problems = [
    {
      icon: AlertCircle,
      title: "Reliance on Authorized Personnel",
      description: "Traditional systems depend on human gatekeepers-principals, administrators, custodians. Every person is a vulnerability."
    },
    {
      icon: AlertCircle,
      title: "Humans Are Corruptible",
      description: "Bribery, coercion, blackmail, simple negligence. No amount of policy can eliminate human weakness."
    },
    {
      icon: AlertCircle,
      title: "No Mathematical Guarantee",
      description: "There is currently no cryptographic method to ensure a file remains secret until a specific block timestamp. That changes today."
    }
  ];

  const solutions = [
    {
      title: "The Vault (IPFS)",
      icon: Lock,
      description: "Decentralized, immutable storage for the encrypted payload. Files live on a distributed network, not on our servers. We cannot access them, and neither can hackers."
    },
    {
      title: "The Key (AES-256)",
      icon: Code,
      description: "Military-grade client-side encryption. The raw file never touches any server. It is encrypted on your device before upload. Only the ciphertext touches the internet."
    },
    {
      title: "The Lock (Smart Contract)",
      icon: Shield,
      description: "A Polygon Smart Contract enforces a mathematical time-lock. If Block Time < Exam Time, the decryption key is cryptographically impossible to retrieve. Math, not trust."
    }
  ];

  const techStack = [
    { name: "Next.js 14", description: "App Router & Server Actions for modern fullstack development" },
    { name: "Polygon Amoy", description: "EVM-compatible, low-cost, production-grade blockchain security" },
    { name: "RainbowKit + Wagmi", description: "Wallet-based identity and Web3 authentication" },
    { name: "Crypto-JS", description: "AES-256 encryption standards, trusted by enterprises" },
    { name: "Pinata", description: "Enterprise IPFS gateway for reliable decentralized storage" }
  ];

  const futureUses = [
    {
      title: "Governance",
      description: "Seal tender bids until the official opening ceremony. Cryptographic guarantees that no premature disclosure occurs.",
      icon: Briefcase
    },
    {
      title: "Legal",
      description: "Digital wills, testamentary documents, and sealed orders that unlock only upon death verification or specific legal events.",
      icon: FileText
    },
    {
      title: "Whistleblowing",
      description: "Time-stamped evidence protection. Leak evidence now, but have it cryptographically verified to be from a specific moment in time.",
      icon: AlertCircle
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero / Identity Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-block border-4 border-black px-4 py-2 bg-black">
              <h1 className="text-4xl md:text-6xl font-black text-heirlock-green">T.A.L.A.</h1>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight">
              Tamper-proof Automated Locking Algorithm
            </h2>
            <div className="inline-block border-4 border-black px-4 py-3 bg-black">
              <p className="text-lg md:text-2xl font-bold text-heirlock-green">
                "Trust is Code."
              </p>
            </div>
            <p className="text-xl md:text-2xl text-black font-bold leading-relaxed max-w-3xl">
              Replacing human trust with cryptographic truth to secure India's critical documents.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              The Failure of Centralized Trust
            </h2>
            <div className="h-2 w-32 bg-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {problems.map((problem, idx) => {
              const Icon = problem.icon;
              return (
                <div
                  key={idx}
                  className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <Icon className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-3">{problem.title}</h3>
                  <p className="text-black leading-relaxed">{problem.description}</p>
                </div>
              );
            })}
          </div>

          <div className="border-4 border-black bg-black p-8">
            <p className="text-yellow-300 text-lg md:text-xl font-bold leading-relaxed">
              Today, there is no cryptographic mechanism to guarantee that a digital file remains secret until a specific moment in time. Every "secure" exam system relies on the assumption that authorized personnel will behave ethically. T.A.L.A. eliminates that assumption.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-12 md:py-20 bg-heirlock-blue border-b-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              The Solution: Hybrid Architecture
            </h2>
            <div className="h-2 w-32 bg-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {solutions.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <div
                  key={idx}
                  className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <div className="inline-block p-3 bg-heirlock-blue border-4 border-black mb-4">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-4">{solution.title}</h3>
                  <p className="text-black text-lg leading-relaxed">{solution.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 border-4 border-black bg-white p-8">
            <h3 className="text-2xl font-black text-black mb-4">The Math</h3>
            <div className="space-y-3 text-black">
              <p className="text-lg">
                <span className="font-bold">1. User encrypts file with AES-256 on their device.</span> The raw plaintext never leaves the client.
              </p>
              <p className="text-lg">
                <span className="font-bold">2. Encrypted file (ciphertext) is uploaded to IPFS.</span> Immutable, distributed, permanent.
              </p>
              <p className="text-lg">
                <span className="font-bold">3. AES decryption key is locked in a Smart Contract.</span> The contract contains the logic:
              </p>
              <div className="bg-black border-2 border-black p-4 mt-4">
                <code className="text-yellow-300 font-mono text-sm leading-relaxed block whitespace-pre-wrap break-words">
                  {`IF block.timestamp < examTime THEN revert("Not yet")\nELSE return(decryptionKey)`}
                </code>
              </div>
              <p className="text-lg mt-4">
                <span className="font-bold">4. At exam time, the key automatically unlocks.</span> Students can decrypt and download their papers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              Industrial Grade Technology
            </h2>
            <div className="h-2 w-32 bg-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {techStack.map((tech, idx) => (
              <div key={idx} className="border-4 border-black bg-white p-6 shadow-brutal">
                <h3 className="text-xl font-bold text-black mb-2">{tech.name}</h3>
                <p className="text-black">{tech.description}</p>
              </div>
            ))}
          </div>

          <div className="border-4 border-black bg-heirlock-yellow p-8">
            <p className="text-black text-lg font-bold leading-relaxed">
              Every component is chosen for production-grade security and reliability. No shortcuts. No experimental protocols. The stack that powers T.A.L.A. is trusted by enterprises and audited by top security firms.
            </p>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-12 md:py-20 bg-heirlock-pink border-b-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              Beyond Exams: A Universal Protocol for Trustless Secrecy
            </h2>
            <div className="h-2 w-32 bg-black"></div>
          </div>

          <p className="text-lg text-black mb-12 leading-relaxed">
            T.A.L.A. is not just for exam papers. The underlying architecture is a universal solution for any scenario where information must remain secret until a specific moment in time. Here are the next frontiers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {futureUses.map((use, idx) => {
              const Icon = use.icon;
              return (
                <div
                  key={idx}
                  className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <Icon className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-3">{use.title}</h3>
                  <p className="text-black leading-relaxed">{use.description}</p>
                </div>
              );
            })}
          </div>

          <div className="border-4 border-black bg-black p-8">
            <p className="text-pink-300 text-lg font-bold leading-relaxed">
              T.A.L.A. is the infrastructure for a world where secrets are mathematically enforced, not socially promised. Where trust is replaced by code. Where the question "Can I trust this person?" becomes "Can I trust this cryptographic proof?"
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="border-4 border-black bg-white p-8 shadow-brutal">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">Our Commitment</h2>
            <p className="text-lg md:text-xl text-black leading-relaxed mb-4">
              We are building infrastructure for a world where exam integrity is mathematically guaranteed. Where no administrator, no state official, no hacker can compromise the sanctity of the exam process. Where every student has equal access to fair assessment.
            </p>
            <p className="text-lg md:text-xl text-black leading-relaxed">
              This is not just technology. This is a revolution in how we approach trust, secrecy, and accountability in India's education system.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-8">
            Ready to Secure Your Institution?
          </h2>
          <Link href="/create-vault">
            <button className="px-8 py-4 bg-black text-heirlock-green font-bold border-4 border-black text-lg shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Deploy T.A.L.A. Now →
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
