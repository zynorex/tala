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
        'T.A.L.A. adds three layers that standard storage does not: time locking enforced by smart contracts, end to end encryption performed on your device, and blockchain verification that creates a tamper evident audit trail.'
    },
    {
      question: 'Can T.A.L.A. access my files or encryption keys?',
      answer:
        'No. T.A.L.A. is a non custodial system. Your encryption keys stay on your device. We store only encrypted files and metadata, and only you can decrypt your vaults.'
    },
    {
      question: 'What happens if I lose my encryption key?',
      answer:
        'Encrypted files cannot be recovered without the key. We recommend storing the key in a password manager, keeping a secure backup, and exporting it before deleting your account.'
    },
    {
      question: 'How secure is the blockchain component?',
      answer:
        'T.A.L.A. uses the Polygon network, secured by Ethereum validators. Vault contracts are immutable after deployment, and unlock rules are enforced by cryptographic proofs rather than server policies.'
    },
    {
      question: 'Can someone access my vault before the unlock time?',
      answer:
        'No. The smart contract enforces the unlock time. Before that moment, the vault remains locked for everyone. After unlock time, access depends on the vault ID and the encryption key.'
    },
    {
      question: 'What file types and sizes does T.A.L.A. support?',
      answer:
        'T.A.L.A. supports all file types. Current limits are up to 500 MB per file and up to 5 GB per vault. For best performance, smaller files are recommended.'
    },
    {
      question: 'How much does T.A.L.A. cost?',
      answer:
        'T.A.L.A. offers a free plan and paid tiers for higher limits and advanced features. Vault creation also incurs a small blockchain gas fee paid in MATIC.'
    },
    {
      question: 'Is T.A.L.A. compliant with GDPR, HIPAA, or SOC 2?',
      answer:
        'T.A.L.A. is designed for GDPR compliance. HIPAA and SOC 2 readiness is in progress for enterprise customers. Security audits cover encryption, access controls, and audit logging.'
    },
    {
      question: 'Can I share a vault with someone else?',
      answer:
        'Yes. You can generate shareable links with limited or permanent access. Recipients can decrypt using the key you provide, and access is logged for verification.'
    },
    {
      question: 'What happens when my vault unlocks?',
      answer:
        'At the unlock time, the smart contract marks the vault as available. Files remain encrypted and require the key to decrypt. You receive a notification before the unlock.'
    }
  ];

  const useCases = [
    {
      icon: BookOpen,
      title: 'Education',
      description: 'Exam Security',
      details:
        'Instructors create time locked exam papers. Papers unlock at the scheduled exam time. This prevents early access and replaces trust with cryptographic certainty.',
      color: 'bg-heirlock-yellow',
      example: 'A university publishes 100 exam papers locked until 9:00 AM. At 9:00 AM, all students get access.'
    },
    {
      icon: Target,
      title: 'Governance',
      description: 'Fair Procurement',
      details:
        'Agencies lock contractor bids until the official opening. Bids remain encrypted until the public opening time, improving fairness and auditability.',
      color: 'bg-heirlock-pink',
      example: 'A city publishes an RFP with five bids. At 2:00 PM on opening day, all bids unlock simultaneously.'
    },
    {
      icon: Lightbulb,
      title: 'Legal',
      description: 'Evidence Protection',
      details:
        'Whistleblowers encrypt documents with a future unlock date. Journalists can lock investigations until a publication date while keeping the content private.',
      color: 'bg-heirlock-green',
      example: 'A journalist locks an investigation until publication day. The release cannot be stopped once locked.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Inheritance and Contingency Release',
      details:
        'Users lock sensitive data to unlock at a scheduled time, supporting digital legacy planning without intermediaries.',
      color: 'bg-heirlock-blue',
      example: 'Recovery codes are locked to unlock in five years and release automatically on schedule.'
    }
  ];

  const features = [
    {
      icon: Lock,
      title: 'AES-256-GCM Encryption',
      description:
        'Bank grade encryption used by governments and financial institutions. Files are encrypted locally before upload. Keys never reach our servers. Authenticated encryption detects tampering.'
    },
    {
      icon: Clock,
      title: 'Smart Contract Time Locking',
      description:
        'Unlock times are enforced by immutable blockchain code. This is a cryptographic guarantee and cannot be bypassed.'
    },
    {
      icon: Key,
      title: 'Non Custodial Key Management',
      description:
        'You hold your encryption keys. T.A.L.A. never stores them. Even administrators cannot decrypt your vaults.'
    },
    {
      icon: Globe,
      title: 'IPFS Decentralized Storage',
      description:
        'Files are stored on IPFS, not on T.A.L.A. servers. They are pinned to Pinata nodes for reliability and resilience.'
    },
    {
      icon: Database,
      title: 'Immutable Audit Trail',
      description:
        'Every action is logged on Polygon, including vault creation, file uploads, sharing, and access attempts. This creates a tamper evident record.'
    },
    {
      icon: Zap,
      title: 'Instant Access After Unlock',
      description:
        'Once unlocked, vaults are accessible immediately. There is no approval workflow or manual intervention required.'
    }
  ];

  const howitworks = [
    {
      number: 1,
      title: 'CREATE',
      description: 'Choose a future unlock time and upload files',
      details:
        'Connect your wallet. Set the unlock date and time. Files are encrypted on your device using AES-256-GCM. Your key never leaves your computer.'
    },
    {
      number: 2,
      title: 'LOCK',
      description: 'Smart contract records the vault on the blockchain',
      details:
        'The contract stores the vault ID, creator address, unlock timestamp, and file hashes. Once created, the unlock time cannot be changed.'
    },
    {
      number: 3,
      title: 'WAIT',
      description: 'Time passes. The blockchain enforces the schedule',
      details:
        'You receive notifications 24 hours before unlock. During this period the vault remains locked, files are encrypted, and access is not possible.'
    },
    {
      number: 4,
      title: 'UNLOCK',
      description: 'At the timestamp, the contract changes state automatically',
      details:
        'At the exact time, the contract state changes and the vault becomes accessible. Anyone with the ID can retrieve the encrypted files.'
    },
    {
      number: 5,
      title: 'DECRYPT',
      description: 'Recipients use the encryption key to decrypt files',
      details:
        'Only the encryption key you control can decrypt. You share the key out of band. T.A.L.A. never sees it. Decryption happens on the recipient device.'
    },
    {
      number: 6,
      title: 'VERIFY',
      description: 'The blockchain proves vault history and integrity',
      details:
        'All actions are verifiable on chain, including creator, timestamps, and file hashes. The audit trail cannot be altered.'
    }
  ];

  const securityModel = [
    {
      layer: 'Layer 1: Device Encryption',
      icon: Lock,
      details: 'AES-256-GCM encryption on your device. Keys are never sent to servers. Authenticated encryption prevents tampering.'
    },
    {
      layer: 'Layer 2: Blockchain Lock',
      icon: Shield,
      details: 'The smart contract enforces unlock time. It is immutable and cannot be overridden. This is guaranteed by the Polygon network.'
    },
    {
      layer: 'Layer 3: Decentralized Storage',
      icon: Globe,
      details: 'Files are stored on IPFS, not on centralized servers. Multiple pinned copies reduce dependency on any single host.'
    },
    {
      layer: 'Layer 4: Access Control',
      icon: Key,
      details: 'Wallets prove ownership through cryptographic signatures. No passwords. No credential database. Resistant to guessing attacks.'
    },
    {
      layer: 'Layer 5: Audit Trail',
      icon: Database,
      details: 'All actions are logged on the blockchain. The record is permanent and cannot be altered.'
    }
  ];

  return (
    <main className="min-h-screen bg-cream" onMouseMove={handleMouseMove}>
      {/* HERO SECTION */}
      <section className="bg-heirlock-yellow text-black py-16 md:py-24 px-4 border-b-4 border-black overflow-hidden relative">
        <div className="absolute -top-20 -left-16 w-64 h-64 bg-heirlock-blue border-4 border-black rounded-full opacity-20"></div>
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-heirlock-pink border-4 border-black rounded-full opacity-20"></div>
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
              <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Learn
              </div>
              <h1 className="text-5xl md:text-6xl font-black mt-5 mb-4">
                Learn T.A.L.A.
              </h1>
              <p className="text-lg md:text-xl font-bold text-black mb-6 max-w-2xl">
                A clear guide to time locked vaults, encrypted storage, and blockchain verification.
              </p>
              <p className="text-base text-gray-700 max-w-2xl">
                See how T.A.L.A. provides verifiable security, transparent audit trails, and user-controlled privacy.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-3 py-1 border-2 border-black text-xs font-bold">Clear guidance</span>
                <span className="px-3 py-1 border-2 border-black text-xs font-bold">Verified security</span>
                <span className="px-3 py-1 border-2 border-black text-xs font-bold">Actionable steps</span>
              </div>
            </div>

            <div className="border-4 border-black bg-white text-black rounded-xl p-6 shadow-brutal">
              <p className="text-xs font-black uppercase tracking-widest text-gray-700">Learning Path</p>
              <div className="mt-4 space-y-4">
                <div className="border-2 border-black rounded-lg p-4 bg-heirlock-yellow/40">
                  <p className="text-sm font-black">Start Here</p>
                  <p className="text-xs text-gray-700 mt-1">What T.A.L.A. is and why time locks matter.</p>
                </div>
                <div className="border-2 border-black rounded-lg p-4 bg-heirlock-blue/40">
                  <p className="text-sm font-black">Security Stack</p>
                  <p className="text-xs text-gray-700 mt-1">Encryption, blockchain, IPFS, and audit trails.</p>
                </div>
                <div className="border-2 border-black rounded-lg p-4 bg-heirlock-green/40">
                  <p className="text-sm font-black">Real World Use</p>
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
              <p className="text-sm text-gray-700 mt-2">Unlock rules live on chain and cannot be bypassed.</p>
            </div>
            <div className="border-2 border-black rounded-lg p-4 bg-heirlock-yellow/40">
              <p className="text-sm font-black">User-Controlled</p>
              <p className="text-sm text-gray-700 mt-2">Keys stay with you. We never see your data.</p>
            </div>
            <div className="border-2 border-black rounded-lg p-4 bg-heirlock-green/40">
              <p className="text-sm font-black">Auditability</p>
              <p className="text-sm text-gray-700 mt-2">Every action is recorded and independently verifiable.</p>
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
              A transparent authority for time locked data, built on encryption, smart contracts, and decentralized storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="micro-card border-4 border-black bg-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4">T.A.L.A. Stands For</h3>
              <p className="text-lg font-bold text-black">
                <strong>T</strong>ransparent <strong>A</strong>uthority <strong>L</strong>ocked <strong>A</strong>ssurance
              </p>
              <p className="text-sm text-gray-700 mt-4">
                A blockchain based system where time, encryption, and cryptography replace trust in institutions.
              </p>
            </div>

            <div className="micro-card border-4 border-black bg-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-4">Core Promise</h3>
              <p className="text-black font-bold">
                Lock sensitive data with guaranteed unlock times<br />
                Encrypt with keys only you control<br />
                Verify integrity through blockchain audit trails
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
                    <span className="text-black font-medium">Time lock guarantees</span>
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
            <h3 className="text-2xl font-black text-black mb-4">The Timeline Guarantee</h3>
            <p className="text-black font-bold mb-4">
              Unlock time is fixed and cannot be changed.
            </p>
            <div className="space-y-2 text-black font-medium">
              <p>• Unlock time is stored by smart contract</p>
              <p>• The creator cannot modify the schedule</p>
              <p>• T.A.L.A. cannot override the contract</p>
              <p>• Early access is not possible</p>
              <p>• Access begins only at the exact timestamp</p>
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
            <h3 className="text-2xl font-black mb-4">What This Means</h3>
            <ul className="space-y-2 font-bold">
              <li>• Even if T.A.L.A. servers are compromised, files remain encrypted</li>
              <li>• Even if a node fails, IPFS storage remains accessible</li>
              <li>• If a wallet is lost, the vault stays locked until the scheduled time</li>
              <li>• The audit trail remains immutable and verifiable</li>
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
            REAL WORLD USE CASES
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
            Clear answers to common questions about time locks, encryption, and blockchain verification.
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
            Choose a path below. Each step is focused on clarity, speed, and security.
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
              <p className="font-bold mb-6 transition-all duration-500 hover:text-white">Review the documentation and understand the architecture.</p>
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
              <p className="font-bold mb-6 transition-all duration-500 hover:text-white">Create your first vault with the free tier. No credit card required.</p>
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
              <p className="font-bold mb-6 transition-all duration-500 hover:text-white">Retrieve and decrypt vaults with the secure access portal.</p>
              <Link href="/access-portal">
                <button className="w-full px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  Access Portal <ChevronRight className="w-4 h-4 transition-transform hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-heirlock-blue border-4 border-white p-8 shadow-brutal text-center">
            <h3 className="text-3xl font-black mb-4">Questions?</h3>
            <p className="text-lg font-bold mb-6">Review the FAQ or reach out directly. We are here to help.</p>
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
              <div className="text-5xl font-black text-heirlock-yellow flex-shrink-0">T</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Time Locking</h3>
                <p className="text-black font-medium">
                  Unlock times are enforced by immutable smart contracts. This replaces institutional trust with cryptographic certainty.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-5xl font-black text-heirlock-green flex-shrink-0">E</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Encryption</h3>
                <p className="text-black font-medium">
                  AES-256-GCM encryption with keys you control. T.A.L.A. cannot decrypt your vaults.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-5xl font-black text-heirlock-blue flex-shrink-0">B</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Blockchain</h3>
                <p className="text-black font-medium">
                  Polygon records all actions immutably. Audit trails cannot be altered or deleted.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-5xl font-black text-heirlock-pink flex-shrink-0">D</div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Decentralized</h3>
                <p className="text-black font-medium">
                  IPFS storage, blockchain enforcement, and wallet authentication reduce single points of failure.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-black text-white border-4 border-black p-8 shadow-brutal text-center">
            <h3 className="text-3xl font-black mb-4">The Bottom Line</h3>
            <p className="text-xl font-bold mb-4">
              T.A.L.A. replaces institutional trust with verifiable cryptography.
            </p>
            <p className="text-lg font-bold text-heirlock-yellow">
              Verified. Immutable. Transparent.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
