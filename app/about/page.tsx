'use client';

import { Lock, Shield, Code, Zap, Globe, Briefcase, FileText, AlertCircle, CheckCircle, BookOpen, Gavel, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function About() {
  const coreProblems = [
    {
      icon: AlertCircle,
      title: "Centralized Human Access",
      description: "Every exam paper, government tender, and sealed evidence sits on a server protected by passwords and policies. All of these depend on human integrity."
    },
    {
      icon: AlertCircle,
      title: "If a Human CAN, They WILL",
      description: "Whether through greed, coercion, or negligence, humans will eventually compromise systems they have access to. There is no policy that can prevent this."
    },
    {
      icon: AlertCircle,
      title: "No Cryptographic Guarantee",
      description: "Until now, there has been no practical mechanism to mathematically guarantee that a file remains secret until a specific moment in time."
    }
  ];

  const hybridArchitecture = [
    {
      title: "The Vault (IPFS)",
      icon: Lock,
      description: "Decentralized, immutable storage for the encrypted payload (Exam papers, Sealed Bids, Legal Wills). Files live on a distributed network, not on our servers. We cannot access them, and neither can hackers."
    },
    {
      title: "The Key (AES-256)",
      icon: Code,
      description: "Client-side encryption using military-grade standards. The raw data never touches any server. It is encrypted on your device before upload. Only the ciphertext touches the internet."
    },
    {
      title: "The Lock (Smart Contract)",
      icon: Shield,
      description: "A Polygon Smart Contract enforces a strict mathematical time-lock. If Block Time < Unlock Time, the decryption key is cryptographically impossible to retrieve. Math, not trust."
    }
  ];

  const techStack = [
    { 
      name: "Next.js 14", 
      description: "App Router & Server Actions for modern fullstack development",
      icon: Code
    },
    { 
      name: "Polygon Amoy", 
      description: "EVM Security & Transparency. Cost-efficient, production-grade blockchain",
      icon: Shield
    },
    { 
      name: "RainbowKit + Wagmi", 
      description: "Wallet-Based Identity. No passwords. Just your blockchain address.",
      icon: Lock
    },
    { 
      name: "Crypto-JS", 
      description: "AES-256 Standards. Same encryption used by Military and Banks.",
      icon: Zap
    },
    { 
      name: "Pinata", 
      description: "Enterprise IPFS gateway. Immutable, distributed storage.",
      icon: Globe
    }
  ];

  const threePillars = [
    {
      title: "Education",
      subtitle: "Stopping Leaks in NEET/UGC Exams",
      description: "Exam papers are the heartbeat of fair assessment. TALA ensures that papers reach students at the exact moment intended. No premature access. No leaks. Just trust in mathematics.",
      icon: BookOpen,
      color: "bg-heirlock-yellow"
    },
    {
      title: "Governance",
      subtitle: "Preventing Corruption in Tenders",
      description: "Government bids for roads, bridges, schools—all of these are sealed in traditional processes that depend on human honesty. TALA seals tenders cryptographically until the official opening ceremony.",
      icon: Briefcase,
      color: "bg-heirlock-pink"
    },
    {
      title: "Justice",
      subtitle: "Securing Whistleblower Evidence & Digital Wills",
      description: "Sensitive legal documents, whistleblower evidence, and testamentary records need absolute confidentiality until the right moment. TALA guarantees cryptographic permanence.",
      icon: Gavel,
      color: "bg-heirlock-green"
    }
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero / Identity Section */}
      <section className="bg-heirlock-green py-12 md:py-20 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6 md:space-y-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-black mb-4">TALA</h1>
              <div className="h-2 w-24 bg-black"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight">
              Non-Intervenable Integrity-Locked Ledger.
            </h2>
            <div className="border-4 border-black bg-black p-6 inline-block shadow-brutal">
              <p className="text-2xl md:text-3xl font-black text-heirlock-green">
                "Trust is Code."
              </p>
            </div>
            <p className="text-lg md:text-2xl font-bold text-black leading-relaxed max-w-3xl">
              To replace fallible human trust with cryptographic truth across India's Education, Governance, and Legal sectors.
            </p>
          </div>
        </div>
      </section>

      {/* The Core Problem Section */}
      <section className="py-12 md:py-20 px-4 bg-cream">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              The Human Factor
            </h2>
            <p className="text-lg text-black font-bold leading-relaxed">
              Paper leaks, tender rigging, and evidence tampering. What do they have in common?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {coreProblems.map((problem, idx) => {
              const Icon = problem.icon;
              return (
                <div
                  key={idx}
                  className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-brutal-lg transition-all"
                >
                  <Icon className="w-10 h-10 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-3">{problem.title}</h3>
                  <p className="text-black leading-relaxed text-base">{problem.description}</p>
                </div>
              );
            })}
          </div>

          <div className="border-4 border-black bg-black p-8 md:p-10 shadow-brutal">
            <p className="text-white text-lg md:text-xl font-bold leading-relaxed">
              <span className="text-heirlock-yellow">"If a human CAN open the file early, they eventually WILL."</span> Whether through greed, coercion, or negligence. TALA removes the human option entirely. No admin, no official, no hacker can access the data before the blockchain timestamp permits it.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-12 md:py-20 px-4 bg-heirlock-blue border-y-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              The Solution: Hybrid Architecture
            </h2>
            <p className="text-lg text-black font-bold">Three layers. One unbreakable chain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {hybridArchitecture.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div
                  key={idx}
                  className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-brutal-lg transition-all"
                >
                  <div className="bg-heirlock-blue border-4 border-black w-14 h-14 flex items-center justify-center mb-4 shadow-brutal">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-3">{layer.title}</h3>
                  <p className="text-black leading-relaxed">{layer.description}</p>
                </div>
              );
            })}
          </div>

          <div className="border-4 border-black bg-white p-8 md:p-10 shadow-brutal">
            <h3 className="text-3xl font-black text-black mb-8">How It Works (The Math)</h3>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-heirlock-blue border-4 border-black w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-black shadow-brutal">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-1">Encrypt on Client</h4>
                  <p className="text-black">User encrypts file with AES-256 on their device. The raw plaintext never leaves the client.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-heirlock-blue border-4 border-black w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-black shadow-brutal">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-1">Store on IPFS</h4>
                  <p className="text-black">Encrypted file (ciphertext) is uploaded to IPFS. Immutable, distributed, permanent. Content hash ensures the file cannot be altered.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-heirlock-blue border-4 border-black w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-black shadow-brutal">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-1">Lock in Smart Contract</h4>
                  <p className="text-black">AES decryption key is locked in a Polygon Smart Contract. The contract enforces strict logic:</p>
                  <div className="bg-black border-2 border-black p-4 mt-3 rounded">
                    <code className="text-heirlock-yellow font-mono text-sm">
                      IF block.timestamp {"<"} unlockTime {"\n"}
                      THEN revert("Not yet") {"\n"}
                      ELSE return(decryptionKey)
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-heirlock-blue border-4 border-black w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-black shadow-brutal">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-1">Auto-Unlock</h4>
                  <p className="text-black">At exam time, the key automatically unlocks on the blockchain. Students can now decrypt and download their papers. No human approval needed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 md:py-20 px-4 bg-cream">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              Industrial-Grade Technology
            </h2>
            <p className="text-lg text-black font-bold">Every component chosen for production security and reliability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={idx} className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-brutal-lg transition-all">
                  <div className="flex items-start gap-4">
                    <Icon className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-black mb-2">{tech.name}</h3>
                      <p className="text-black text-sm md:text-base">{tech.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-4 border-black bg-heirlock-yellow p-8 shadow-brutal">
            <p className="text-black text-lg font-bold leading-relaxed">
              No shortcuts. No experimental protocols. The stack that powers TALA is trusted by enterprises, audited by security firms, and battle-tested in production.
            </p>
          </div>
        </div>
      </section>

      {/* The Vision: Three Pillars */}
      <section className="py-12 md:py-20 px-4 bg-cream border-t-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
              One Protocol, Three Pillars
            </h2>
            <p className="text-lg text-black font-bold">TALA is not just for exams. It's a universal solution for any moment that demands cryptographic truth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {threePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className={`${pillar.color} border-4 border-black p-8 shadow-brutal hover:shadow-brutal-lg transition-all`}>
                  <Icon className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-3xl font-black text-black mb-1">{pillar.title}</h3>
                  <h4 className="text-sm font-bold text-gray-700 mb-4">{pillar.subtitle}</h4>
                  <p className="text-black leading-relaxed text-base">{pillar.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 border-4 border-black bg-black p-8 md:p-10 shadow-brutal">
            <p className="text-white text-lg md:text-xl font-bold leading-relaxed">
              <span className="text-heirlock-green">TALA is infrastructure for a world where secrets are mathematically enforced, not socially promised.</span> Where the question "Can I trust this person?" becomes "Can I verify this cryptographic proof?"
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Commitment */}
      <section className="py-12 md:py-20 px-4 bg-heirlock-pink border-y-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="border-4 border-black bg-white p-8 md:p-12 shadow-brutal">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">Our Mission</h2>
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-black leading-relaxed font-bold">
                To replace fallible human trust with cryptographic truth across India's Education, Governance, and Legal sectors.
              </p>
              <p className="text-base md:text-lg text-black leading-relaxed">
                We are building infrastructure where exam integrity is mathematically guaranteed. Where no administrator, no state official, no hacker can compromise the sanctity of the process. Where every student has equal access to fair assessment. Where every tender is sealed until the official moment. Where every piece of sensitive evidence is cryptographically protected.
              </p>
              <p className="text-base md:text-lg text-black leading-relaxed">
                This is not just technology. This is a revolution in how India approaches trust, secrecy, and accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
            Ready to Secure Your Institution?
          </h2>
          <p className="text-lg text-black mb-8 font-bold max-w-2xl mx-auto">
            Join institutions that trust mathematics over humans. Deploy TALA today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-vault">
              <button className="px-8 py-4 bg-black text-white font-black border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2">
                Create Free Vault <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/documentation">
              <button className="px-8 py-4 bg-white text-black font-black border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2">
                Read Documentation <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

