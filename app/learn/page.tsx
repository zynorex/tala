'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Shield,
  Zap,
  BookOpen,
  Users,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Globe,
  Server,
  Code,
  Clock,
  Key,
  Database,
  AlertCircle,
  Lightbulb,
  Target,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ScrollRevealElement {
  id: string;
  isVisible: boolean;
}

export default function LearnPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observers = new Map();

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set([...prev, entry.target.id]));
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe all elements with data-reveal attribute
    if (typeof document !== 'undefined') {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'What makes T.A.L.A. different from traditional cloud storage?',
      answer:
        'T.A.L.A. adds three critical layers traditional storage lacks: (1) Time-locking—your data cannot be accessed until a specific moment, enforced by immutable smart contracts; (2) End-to-end encryption—files are encrypted client-side before leaving your device, keys never reach our servers; (3) Blockchain verification—all actions are recorded on an immutable ledger, creating an audit trail that cannot be altered or deleted.'
    },
    {
      question: 'Can T.A.L.A. access my files or encryption keys?',
      answer:
        'No. T.A.L.A. operates as a non-custodial system. Your encryption keys never leave your device. We store only encrypted files and metadata. Even our team cannot decrypt your vaults—only you can, using your private encryption key. This is mathematically guaranteed by AES-256-GCM encryption.'
    },
    {
      question: 'What happens if I lose my encryption key?',
      answer:
        'Your encrypted files cannot be recovered without your key. This is intentional and ensures security. We recommend: (1) Store your key in a password manager; (2) Back up your key securely; (3) Use our key export feature before deleting your account. T.A.L.A. cannot recover lost keys, even with administrative access.'
    },
    {
      question: 'How secure is the blockchain component?',
      answer:
        'T.A.L.A. uses the Polygon network, a layer-2 blockchain secured by Ethereum validators. All vault contracts are immutable once deployed. Unlock times and deletion permissions are enforced by cryptographic proofs, not our servers. Even if T.A.L.A. disappeared, your vaults would remain unlockable at their scheduled times.'
    },
    {
      question: 'Can someone access my vault before the unlock time?',
      answer:
        'No. The smart contract enforces the unlock time cryptographically. Before the unlock time: (1) Even you cannot access it; (2) T.A.L.A. cannot override it; (3) No one can delete it (if you locked it); (4) The blockchain ensures this is mathematically impossible to bypass. After unlock time, the vault becomes readable to anyone with access.'
    },
    {
      question: 'What file types and sizes does T.A.L.A. support?',
      answer:
        'T.A.L.A. supports any file type (documents, images, videos, code, databases, archives, etc.). File size limits: Single file up to 500MB, total vault up to 5GB. Recommended for documents (under 100MB) for best performance. Larger files work but may take longer to encrypt/upload.'
    },
    {
      question: 'How much does T.A.L.A. cost?',
      answer:
        'T.A.L.A. uses tiered pricing: Free tier includes 1 vault, 100MB storage. Premium tier ($9.99/month) includes 10 vaults, 10GB storage. Enterprise tier includes unlimited vaults, 500GB storage, API access, and dedicated support. Blockchain gas fees (for vault creation) are paid in MATIC tokens on Polygon.'
    },
    {
      question: 'Is T.A.L.A. compliant with GDPR/HIPAA/SOC2?',
      answer:
        'T.A.L.A. is designed for GDPR compliance: (1) Users own their data; (2) Data deletion is permanent; (3) No tracking; (4) Users have full data export. HIPAA/SOC2 compliance is in progress for enterprise customers. Security audit (9.2/10 score) covers cryptographic implementations, access controls, and audit logging.'
    },
    {
      question: 'Can I share a vault with someone else?',
      answer:
        'Yes. You can generate shareable links with time-limited access or permanent access. Recipients can decrypt using the key you provide. Shared vaults can be read-only or allow file uploads. All access is logged and traceable via the blockchain audit trail.'
    },
    {
      question: 'What happens when my vault unlocks?',
      answer:
        'When unlock time is reached: (1) Smart contract state changes to "unlocked"; (2) Anyone with the vault ID can access it; (3) Creator can still delete it (configurable); (4) All files remain encrypted—decryption requires the encryption key. You receive a notification 24 hours before unlock.'
    }
  ];

  const useCases = [
    {
      icon: BookOpen,
      title: 'Education',
      description: 'Exam Security',
      details:
        'Professors create time-locked exam papers. Papers unlock automatically at the scheduled exam time (e.g., 10:00 AM sharp on test day). No early leaks, no delays. Replaces trust with mathematical certainty.',
      color: 'bg-heirlock-yellow',
      example: 'University publishes 100 exam papers, locked until 9:00 AM. At 9:00 AM exactly, all students get simultaneous access. Impossible to access early.'
    },
    {
      icon: Target,
      title: 'Governance',
      description: 'Fair Procurement',
      details:
        'Government agencies lock sealed contractor bids until official opening. All bids remain encrypted until the public opening ceremony. Corruption-proof tendering.',
      color: 'bg-heirlock-pink',
      example: 'City publishes RFP with 5 contractors bidding. All bids locked. At 2:00 PM on opening day, they unlock simultaneously. Everyone sees results at the same moment.'
    },
    {
      icon: Lightbulb,
      title: 'Legal',
      description: 'Evidence Protection',
      details:
        'Whistleblowers encrypt sensitive documents with a future unlock date. If anything happens to them, the evidence auto-releases. Journalists lock investigations until publication date.',
      color: 'bg-heirlock-green',
      example: 'Journalist writes expose, locks it until publication date. If arrested, the article auto-publishes. Prevents suppression. Cannot be stopped once locked.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Inheritance & Dead Mans Switch',
      details:
        'Users lock sensitive data (passwords, documents, keys) to unlock in case of death. Digital legacy that auto-releases when scheduled unlock time arrives.',
      color: 'bg-heirlock-blue',
      example: 'CEO locks recovery codes set to unlock in 5 years. If they pass away, company gets access exactly on schedule. Fully automated, no intermediaries needed.'
    }
  ];

  const features = [
    {
      icon: Lock,
      title: 'AES-256-GCM Encryption',
      description:
        'Military-grade encryption used by governments and banks. Every file encrypted locally before upload. Keys never touch our servers. Authenticated encryption detects tampering.'
    },
    {
      icon: Clock,
      title: 'Smart Contract Time-Locking',
      description:
        'Unlock times enforced by immutable blockchain code. Not a timer—a cryptographic guarantee. Impossible to access early, override, or circumvent. Mathematically certain.'
    },
    {
      icon: Key,
      title: 'Non-Custodial Key Management',
      description:
        'You hold your encryption keys. T.A.L.A. never stores them. Even our admins cannot decrypt your vaults. Complete privacy. Complete control. Complete responsibility.'
    },
    {
      icon: Globe,
      title: 'IPFS Decentralized Storage',
      description:
        'Files stored on IPFS (InterPlanetary File System), not on T.A.L.A. servers. Pinned to Pinata nodes for reliability. Survives server failures. Censorship-resistant.'
    },
    {
      icon: Database,
      title: 'Immutable Audit Trail',
      description:
        'Every action logged on Polygon blockchain: vault creation, file uploads, sharing, access attempts. Tamper-proof record. Transparent accountability.'
    },
    {
      icon: Zap,
      title: 'Instant Decentralized Access',
      description:
        'No approval process. Once unlocked, vaults are accessible immediately. No rate limits. No denial of service. Peer-to-peer powered, not centralized servers.'
    }
  ];

  const howitworks = [
    {
      number: 1,
      title: 'CREATE',
      description: 'You choose a future unlock time and upload files',
      details:
        'Connect your wallet. Set unlock date/time. Files are encrypted on your device using AES-256-GCM. Your key never leaves your computer. You remain in complete control.'
    },
    {
      number: 2,
      title: 'LOCK',
      description: 'Smart contract records the vault on blockchain',
      details:
        'Contract stores: vault ID, creator address, unlock timestamp, file hashes. Once created, unlock time cannot be changed by anyone. Enforced cryptographically.'
    },
    {
      number: 3,
      title: 'WAIT',
      description: 'Time passes. Blockchain counts down. You stay notified',
      details:
        'You receive notifications 24 hours before unlock. During this time: vault remains locked, files encrypted, access impossible. Time-lock is absolute.'
    },
    {
      number: 4,
      title: 'UNLOCK',
      description: 'Timestamp reached. Smart contract changes state automatically',
      details:
        'Blockchain reaches exact unlock time. Contract state flips. Vault becomes accessible. Anyone with the ID can now retrieve your encrypted files.'
    },
    {
      number: 5,
      title: 'DECRYPT',
      description: 'Recipients use encryption key to decrypt files',
      details:
        'Only encryption key (which you control) can decrypt. You share key out-of-band (email, Signal, in-person). T.A.L.A. never sees it. Decryption happens on recipient device.'
    },
    {
      number: 6,
      title: 'VERIFY',
      description: 'Blockchain proves vault history and integrity',
      details:
        'All actions verifiable on-chain: who created it, when, from where, all file hashes. Tamper-proof record. Audit trail cannot be deleted or altered. Permanent transparency.'
    }
  ];

  const securityModel = [
    {
      layer: 'Layer 1: Device Encryption',
      icon: Lock,
      details: 'AES-256-GCM encryption on your device. Keys never sent to servers. Authenticated encryption prevents tampering.'
    },
    {
      layer: 'Layer 2: Blockchain Lock',
      icon: Shield,
      details: 'Smart contract enforces unlock time. Immutable. Cannot be overridden. Cryptographically guaranteed by Polygon network.'
    },
    {
      layer: 'Layer 3: Decentralized Storage',
      icon: Globe,
      details: 'Files on IPFS, not on centralized servers. Multiple pinned copies. Survives server failures. Censorship-resistant.'
    },
    {
      layer: 'Layer 4: Access Control',
      icon: Key,
      details: 'Wallets prove ownership via cryptographic signatures. No passwords. No databases. Impossible to guess or brute-force.'
    },
    {
      layer: 'Layer 5: Audit Trail',
      icon: Database,
      details: 'All actions logged on blockchain. Permanent record. Cannot be altered. Complete transparency. Accountability guaranteed.'
    }
  ];

  return (
    <main className="min-h-screen bg-cream" onMouseMove={handleMouseMove}>
      {/* HERO SECTION */}
      <section className="bg-black text-white py-16 md:py-24 px-4 border-b-4 border-heirlock-yellow overflow-hidden relative">
        <div className="absolute -top-20 -left-16 w-64 h-64 bg-heirlock-blue border-4 border-heirlock-yellow rounded-full opacity-20"></div>
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-heirlock-pink border-4 border-heirlock-yellow rounded-full opacity-20"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div
              data-reveal
              id="hero-text"
              className={`transition-all duration-1000 transform ${
                visibleElements.has('hero-text')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-heirlock-yellow text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Learn
              </div>
              <h1 className="text-5xl md:text-6xl font-black mt-5 mb-4">
                Learn T.A.L.A.
              </h1>
              <p className="text-lg md:text-xl font-bold text-heirlock-yellow mb-6 max-w-2xl">
                Your complete guide to time-locked vaults, end-to-end encryption, and blockchain security.
              </p>
              <p className="text-base text-gray-300 max-w-2xl">
                Understand how T.A.L.A. delivers mathematical certainty, immutable audit trails, and non-custodial privacy.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-3 py-1 border-2 border-heirlock-yellow text-xs font-bold">No hype</span>
                <span className="px-3 py-1 border-2 border-heirlock-yellow text-xs font-bold">No fluff</span>
                <span className="px-3 py-1 border-2 border-heirlock-yellow text-xs font-bold">Only proof</span>
              </div>
            </div>

            <div className="border-4 border-heirlock-yellow bg-white text-black rounded-xl p-6 shadow-brutal">
              <p className="text-xs font-black uppercase tracking-widest text-gray-700">Learning Path</p>
              <div className="mt-4 space-y-4">
                <div className="border-2 border-black rounded-lg p-4 bg-heirlock-yellow/40">
                  <p className="text-sm font-black">Start Here</p>
                  <p className="text-xs text-gray-700 mt-1">What T.A.L.A. is and why time-locks matter.</p>
                </div>
                <div className="border-2 border-black rounded-lg p-4 bg-heirlock-blue/40">
                  <p className="text-sm font-black">Security Stack</p>
                  <p className="text-xs text-gray-700 mt-1">Encryption, blockchain, IPFS, and audit trails.</p>
                </div>
                <div className="border-2 border-black rounded-lg p-4 bg-heirlock-green/40">
                  <p className="text-sm font-black">Real-world Use</p>
                  <p className="text-xs text-gray-700 mt-1">Education, governance, legal, and safety.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-b-4 border-black py-10 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-black rounded-lg p-4 bg-heirlock-blue/30">
              <p className="text-sm font-black">Mathematical Trust</p>
              <p className="text-sm text-gray-700 mt-2">Unlock rules live on-chain and cannot be bypassed.</p>
            </div>
            <div className="border-2 border-black rounded-lg p-4 bg-heirlock-yellow/40">
              <p className="text-sm font-black">Non-Custodial</p>
              <p className="text-sm text-gray-700 mt-2">Keys stay with you. We never see your data.</p>
            </div>
            <div className="border-2 border-black rounded-lg p-4 bg-heirlock-green/40">
              <p className="text-sm font-black">Auditability</p>
              <p className="text-sm text-gray-700 mt-2">Every action recorded, immutable, and verifiable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS TALA SECTION */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black">
              WHAT IS T.A.L.A.?
            </h2>
            <p className="text-black font-bold max-w-xl">
              A transparent authority for time-locked data. Built on encryption, smart contracts, and decentralized storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="micro-card border-4 border-black bg-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4">T.A.L.A. Stands For</h3>
              <p className="text-lg font-bold text-black">
                <strong>T</strong>ransparent <strong>A</strong>uthority <strong>L</strong>ocked <strong>A</strong>ssurance
              </p>
              <p className="text-sm text-gray-700 mt-4">
                A blockchain-based system where time, encryption, and cryptography replace trust in institutions.
              </p>
            </div>

            <div className="micro-card border-4 border-black bg-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4">Core Promise</h3>
              <p className="text-black font-bold">
                📜 Lock sensitive data with guaranteed unlock times<br />
                🔐 Encrypt with keys only you control<br />
                ✅ Verify integrity via blockchain audit trails
              </p>
            </div>

            <div className="micro-card border-4 border-black bg-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4">Key Difference</h3>
              <p className="text-black font-bold">
                Traditional Systems: Trust institutions
              </p>
              <p className="text-black font-bold mt-2 text-heirlock-yellow">
                T.A.L.A.: Trust mathematics
              </p>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-brutal">
            <h3 className="text-3xl font-black text-black mb-6">The Problem We Solve</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                  <span className="text-red-500">✗</span> TRADITIONAL SYSTEMS
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-red-500 font-black">✗</span>
                    <span className="text-black font-medium">Depend on institutional trust</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-black">✗</span>
                    <span className="text-black font-medium">Servers can be hacked</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-black">✗</span>
                    <span className="text-black font-medium">Audit trails can be altered</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-black">✗</span>
                    <span className="text-black font-medium">Early access possible</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-black">✗</span>
                    <span className="text-black font-medium">Single point of failure</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-black text-heirlock-green mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" /> T.A.L.A. APPROACH
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-heirlock-green flex-shrink-0" />
                    <span className="text-black font-medium">Mathematical certainty</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-heirlock-green flex-shrink-0" />
                    <span className="text-black font-medium">Blockchain enforces rules</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-heirlock-green flex-shrink-0" />
                    <span className="text-black font-medium">Immutable audit trail</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-heirlock-green flex-shrink-0" />
                    <span className="text-black font-medium">Time-lock guarantees</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-heirlock-green flex-shrink-0" />
                    <span className="text-black font-medium">Decentralized & resilient</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 md:py-24 px-4 bg-white border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black">
              HOW T.A.L.A. WORKS
            </h2>
            <p className="text-gray-700 font-bold max-w-xl">
              Six steps, zero shortcuts. Everything is enforced by math, not by policy.
            </p>
          </div>

          <div className="space-y-6">
            {howitworks.map((step, idx) => (
              <div key={idx} className="border-4 border-black bg-white shadow-brutal">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-black text-white p-6 md:p-8 flex items-center justify-center md:w-32 border-r-4 border-black">
                    <div className="text-center">
                      <div className="text-5xl font-black">{step.number}</div>
                      <div className="text-sm font-bold mt-2">{step.title}</div>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-2xl font-black text-black mb-2">{step.description}</h3>
                    <p className="text-black font-medium">{step.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-heirlock-blue border-4 border-black p-8 shadow-brutal">
            <h3 className="text-2xl font-black text-black mb-4">⏱️ The Timeline Guarantee</h3>
            <p className="text-black font-bold mb-4">
              Your vault unlock is locked in. Nothing can change it:
            </p>
            <div className="space-y-2 text-black font-medium">
              <p>• Set unlock time: Locked by smart contract</p>
              <p>• You cannot change it: Immutable code</p>
              <p>• T.A.L.A. cannot override: Decentralized enforcement</p>
              <p>• Hackers cannot accelerate: Blockchain protects</p>
              <p>• Only time can unlock: After exact timestamp</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY LAYERS SECTION */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-pink border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black">
              SECURITY ARCHITECTURE
            </h2>
            <p className="text-black font-bold max-w-xl">
              Five overlapping layers protect every vault. Compromise one, four still stand.
            </p>
          </div>

          <div className="space-y-4">
            {securityModel.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div key={idx} className="border-4 border-black bg-white p-6 shadow-brutal">
                  <div className="flex gap-4 items-start">
                    <div className="bg-black text-white p-3 rounded-none border-2 border-black">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-black mb-2">{layer.layer}</h3>
                      <p className="text-black font-medium">{layer.details}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-black text-white border-4 border-black p-8 shadow-brutal">
            <h3 className="text-2xl font-black mb-4">🔒 What This Means</h3>
            <ul className="space-y-2 font-bold">
              <li>✅ Even if T.A.L.A. servers are hacked: Files remain encrypted</li>
              <li>✅ Even if blockchain is compromised: IPFS storage survives</li>
              <li>✅ Even if you lose your wallet: Vault remains locked until scheduled time</li>
              <li>✅ Even if all this fails: Immutable audit trail proves what happened</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-green border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black">
              CORE FEATURES EXPLAINED
            </h2>
            <p className="text-black font-bold max-w-xl">
              Each feature is designed to remove human trust and replace it with cryptographic guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="micro-card border-4 border-black bg-white p-8 shadow-brutal">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-black text-white p-3 rounded-none border-2 border-black">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-black">{feature.title}</h3>
                  </div>
                  <p className="text-black font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-16 md:py-24 px-4 bg-white border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-12">
            REAL-WORLD USE CASES
          </h2>

          <div className="space-y-8">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <div 
                  key={idx} 
                  data-reveal
                  id={`usecase-${idx}`}
                  onMouseEnter={() => setHoveredCard(`usecase-${idx}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`border-4 border-black ${useCase.color} p-8 shadow-brutal transition-all duration-500 transform ${
                    hoveredCard === `usecase-${idx}` 
                      ? 'scale-105 shadow-2xl -translate-y-2' 
                      : ''
                  } ${
                    visibleElements.has(`usecase-${idx}`)
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-[-50px]'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`transition-all duration-500 ${
                      hoveredCard === `usecase-${idx}`
                        ? 'rotate-12 scale-125'
                        : ''
                    }`}>
                      <Icon className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                    </div>
                    <div>
                      <h3 className={`text-3xl font-black text-black transition-all duration-500 ${
                        hoveredCard === `usecase-${idx}`
                          ? 'text-heirlock-blue'
                          : ''
                      }`}>{useCase.title}</h3>
                      <p className="text-lg font-bold text-black mt-1 transition-all duration-500 hover:translate-x-2">{useCase.description}</p>
                    </div>
                  </div>

                  <p className="text-black font-medium mb-6 transition-all duration-500 hover:text-heirlock-blue">{useCase.details}</p>

                  <div className={`bg-white border-2 border-black p-4 transition-all duration-500 ${
                    hoveredCard === `usecase-${idx}`
                      ? 'border-4 border-heirlock-blue'
                      : ''
                  }`}>
                    <p className="text-sm font-bold text-gray-600 mb-2">REAL EXAMPLE:</p>
                    <p className="text-black font-bold">{useCase.example}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECHNICAL DEEP DIVE */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-blue border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-12">
            TECHNICAL DEEP DIVE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
                <Code className="w-6 h-6" /> Encryption
              </h3>
              <ul className="space-y-3 text-black font-medium">
                <li><strong>Algorithm:</strong> AES-256-GCM (NIST approved)</li>
                <li><strong>Key Size:</strong> 256-bit (2^256 possible keys)</li>
                <li><strong>Authentication:</strong> Galois/Counter Mode detects tampering</li>
                <li><strong>IV:</strong> 128-bit random per file (no key reuse)</li>
                <li><strong>Key Derivation:</strong> PBKDF2, 100,000 iterations</li>
                <li><strong>Implementation:</strong> Node.js crypto module</li>
              </ul>
            </div>

            <div className="bg-white border-4 border-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6" /> Blockchain
              </h3>
              <ul className="space-y-3 text-black font-medium">
                <li><strong>Network:</strong> Polygon (Layer-2)</li>
                <li><strong>Contract:</strong> Solidity smart contracts</li>
                <li><strong>Finality:</strong> ~2 seconds per block</li>
                <li><strong>Gas Cost:</strong> ~0.1 MATIC per vault creation</li>
                <li><strong>Security:</strong> Ethereum validator consensus</li>
                <li><strong>Events:</strong> All state changes logged on-chain</li>
              </ul>
            </div>

            <div className="bg-white border-4 border-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6" /> Decentralized Storage
              </h3>
              <ul className="space-y-3 text-black font-medium">
                <li><strong>Protocol:</strong> IPFS (InterPlanetary File System)</li>
                <li><strong>Pinning:</strong> Pinata primary, IPFS.io fallback</li>
                <li><strong>Redundancy:</strong> Multiple pinned copies</li>
                <li><strong>Retrieval:</strong> Content-addressed, hash-verified</li>
                <li><strong>Durability:</strong> 99.9% uptime SLA</li>
                <li><strong>Cost:</strong> ~$0.01 per GB per month</li>
              </ul>
            </div>

            <div className="bg-white border-4 border-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
                <Server className="w-6 h-6" /> Infrastructure
              </h3>
              <ul className="space-y-3 text-black font-medium">
                <li><strong>Framework:</strong> Next.js 15 (TypeScript)</li>
                <li><strong>Database:</strong> PostgreSQL 15</li>
                <li><strong>Authentication:</strong> NextAuth.js + Web3 wallets</li>
                <li><strong>Hosting:</strong> Vercel edge network</li>
                <li><strong>API:</strong> REST + WebSocket for real-time</li>
                <li><strong>CDN:</strong> Cloudflare for DDoS protection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-black font-bold max-w-3xl mb-10">
            Clear answers to the most common questions about time-locking, encryption, and the blockchain guarantees behind T.A.L.A.
          </p>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div 
                key={idx} 
                data-reveal
                id={`faq-${idx}`}
                className={`border-4 border-black bg-white shadow-brutal transition-all duration-500 transform ${
                  visibleElements.has(`faq-${idx}`)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                } hover:shadow-2xl`}
                style={{
                  transitionDelay: `${idx * 100}ms`
                }}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className={`w-full p-6 flex items-center justify-between transition-all duration-300 ${
                    expandedFAQ === idx 
                      ? 'bg-heirlock-yellow' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <h3 className={`text-lg font-black text-left transition-all duration-300 ${
                    expandedFAQ === idx
                      ? 'text-black scale-105'
                      : 'text-black'
                  }`}>{item.question}</h3>
                  <ChevronDown
                    className={`w-6 h-6 text-black transition-all duration-500 flex-shrink-0 ${
                      expandedFAQ === idx ? 'rotate-180 scale-125' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="border-t-4 border-black p-6 bg-gray-50 animate-fadeIn">
                    <p className="text-black font-medium leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GETTING STARTED SECTION */}
      <section className="py-16 md:py-24 px-4 bg-black text-white border-b-4 border-heirlock-green relative overflow-hidden">
        <div className="absolute -top-16 right-10 w-56 h-56 bg-heirlock-green border-4 border-heirlock-green rounded-full opacity-15"></div>
        <div className="container mx-auto max-w-5xl relative">
          <div className="inline-flex items-center gap-2 bg-heirlock-green text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Start Secure
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            READY TO GET STARTED?
          </h2>
          <p className="text-gray-200 font-bold max-w-3xl mb-10">
            Pick a path below. Each step is built for clarity, speed, and security.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div 
              data-reveal
              id="cta-1"
              onMouseEnter={() => setHoveredCard('cta-1')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-heirlock-yellow text-black border-4 border-black p-8 shadow-brutal transition-all duration-500 transform ${
                hoveredCard === 'cta-1' 
                  ? 'scale-105 -translate-y-3 shadow-2xl' 
                  : ''
              } ${
                visibleElements.has('cta-1')
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            >
              <h3 className="text-2xl font-black mb-4 transition-all duration-500 hover:text-white">Step 1: Learn More</h3>
              <p className="font-bold mb-6 transition-all duration-500 hover:text-white">Dive deeper into our documentation and understand the architecture.</p>
              <Link href="/documentation">
                <button className="w-full px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  Documentation <ChevronRight className="w-4 h-4 transition-transform hover:translate-x-1" />
                </button>
              </Link>
            </div>

            <div 
              data-reveal
              id="cta-2"
              onMouseEnter={() => setHoveredCard('cta-2')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-heirlock-pink text-black border-4 border-black p-8 shadow-brutal transition-all duration-500 transform ${
                hoveredCard === 'cta-2' 
                  ? 'scale-105 -translate-y-3 shadow-2xl' 
                  : ''
              } ${
                visibleElements.has('cta-2')
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            >
              <h3 className="text-2xl font-black mb-4 transition-all duration-500 hover:text-white">Step 2: Try It Free</h3>
              <p className="font-bold mb-6 transition-all duration-500 hover:text-white">Create your first vault with our free tier. No credit card required.</p>
              <Link href="/create-vault">
                <button className="w-full px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  Create Vault <ChevronRight className="w-4 h-4 transition-transform hover:translate-x-1" />
                </button>
              </Link>
            </div>

            <div 
              data-reveal
              id="cta-3"
              onMouseEnter={() => setHoveredCard('cta-3')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-heirlock-green text-black border-4 border-black p-8 shadow-brutal transition-all duration-500 transform ${
                hoveredCard === 'cta-3' 
                  ? 'scale-105 -translate-y-3 shadow-2xl' 
                  : ''
              } ${
                visibleElements.has('cta-3')
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            >
              <h3 className="text-2xl font-black mb-4 transition-all duration-500 hover:text-white">Step 3: Access Portal</h3>
              <p className="font-bold mb-6 transition-all duration-500 hover:text-white">Retrieve and decrypt your vaults with the secure access portal.</p>
              <Link href="/access-portal">
                <button className="w-full px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  Access Portal <ChevronRight className="w-4 h-4 transition-transform hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-heirlock-blue border-4 border-white p-8 shadow-brutal text-center">
            <h3 className="text-3xl font-black mb-4">Questions?</h3>
            <p className="text-lg font-bold mb-6">Check our FAQ or reach out directly. We're here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq">
                <button className="px-8 py-3 bg-white text-black font-bold border-4 border-white hover:bg-black hover:text-white transition-all">
                  FAQ
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-white text-black font-bold border-4 border-white hover:bg-black hover:text-white transition-all">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KEY TAKEAWAYS */}
      <section className="py-16 md:py-24 px-4 bg-white border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-12">
            KEY TAKEAWAYS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-5xl font-black text-heirlock-yellow flex-shrink-0">📜</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Time-Locking</h3>
                <p className="text-black font-medium">
                  Unlock times are enforced by immutable smart contracts, not timers. Mathematical certainty replaces institutional trust.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-5xl font-black text-heirlock-green flex-shrink-0">🔐</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Encryption</h3>
                <p className="text-black font-medium">
                  AES-256-GCM encryption with keys you control. Even T.A.L.A. cannot decrypt your vaults.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-5xl font-black text-heirlock-blue flex-shrink-0">⛓️</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Blockchain</h3>
                <p className="text-black font-medium">
                  Polygon network records all actions immutably. Audit trails cannot be altered or deleted.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-5xl font-black text-heirlock-pink flex-shrink-0">🌐</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Decentralized</h3>
                <p className="text-black font-medium">
                  IPFS storage, blockchain enforcement, wallet authentication. No single point of failure.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-black text-white border-4 border-black p-8 shadow-brutal text-center">
            <h3 className="text-3xl font-black mb-4">The Bottom Line</h3>
            <p className="text-xl font-bold mb-4">
              T.A.L.A. replaces trust in institutions with trust in mathematics.
            </p>
            <p className="text-lg font-bold text-heirlock-yellow">
              Guaranteed. Immutable. Transparent.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
