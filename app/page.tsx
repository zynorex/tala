'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Gavel,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Zap,
  CheckCircle,
  ChevronRight,
  Code,
  Database,
  Globe,
  User,
  Timer,
  Layers,
  HardDrive,
  Laptop,
  Server,
  Radar,
  Fingerprint,
  FileKey,
} from 'lucide-react';

function useMicroInteractions() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floaty {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
        100% { transform: translateY(0px); }
      }

      @keyframes swipe {
        0% { transform: translateX(-10px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }

      .micro-sheen {
        position: relative;
        overflow: hidden;
      }

      .micro-sheen::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25), transparent 70%);
        transform: translateX(-100%);
        transition: transform 0.6s ease;
      }

      .micro-sheen:hover::after {
        transform: translateX(100%);
      }

      .micro-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .micro-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
      }

      .micro-grid {
        position: relative;
      }

      .micro-grid::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
        background-size: 20px 20px;
        pointer-events: none;
        z-index: 0;
      }

      .micro-grid > * {
        position: relative;
        z-index: 1;
      }

      .micro-pulse {
        animation: floaty 3s ease-in-out infinite;
      }

      .micro-swipe {
        animation: swipe 0.8s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

function SkeletonLoader() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-gradient-to-br from-heirlock-yellow to-heirlock-blue py-14 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-16 w-3/4 bg-white/50" />
            <div className="h-8 w-2/4 bg-white/40" />
            <div className="h-20 w-full bg-white/40" />
          </div>
        </div>
      </section>
      <section className="py-16 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-48 bg-white/60 border-4 border-black" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const heroHighlights = [
  {
    label: 'Pilot exam windows',
    value: '~184',
    detail: 'based on current tamper-resistant delivery tests',
  },
  {
    label: 'Active tender rounds',
    value: '~62',
    detail: 'procurement unlocks running in sandboxes',
  },
  {
    label: 'Evidence capsules queued',
    value: '~310',
    detail: 'legal disclosures tracked with verifiable clocks',
  },
];

const proofRail = [
  { name: 'IIT Delhi', note: 'Exam Cell' },
  { name: 'Rajasthan DoE', note: 'Tender Sandbox' },
  { name: 'Legal Aid Forum', note: 'Evidence Lab' },
  { name: 'DefTech', note: 'Zero-Trust Ops' },
];

const narrativeBlocks = [
  {
    title: 'Leaks escalate every season',
    body: 'Dozens of confirmed paper leaks have been reported over the last five years. Each one reroutes entire academic calendars and erodes public trust.',
  },
  {
    title: 'Paper locks fail because people fail',
    body: 'Passwords get shared. Pen drives get swapped. Legal envelopes arrive early. When humans guard secrets, bribery wins.',
  },
  {
    title: 'Code-as-lawmaker',
    body: 'T.A.L.A. references the decryption key through a Polygon smart contract. Until the unlock timestamp, the system is designed so neither admins nor our infrastructure can read that file.',
  },
];

const useCases = [
  {
    icon: BookOpen,
    title: 'Education | Exam Cells',
    summary: 'Upload question papers, choose the unlock minute, broadcast proof. Students verify timing before scribbling the first word.',
    impact: 'Helps reduce last-minute cancellations and retests caused by manual leaks.',
  },
  {
    icon: Briefcase,
    title: 'Public Procurement',
    summary: 'Seal bids for metro, defense, or infra projects. When the timer hits zero, every bidder unlocks simultaneously.',
    impact: 'Helps deter insider trading and midnight revisions in government tenders.',
  },
  {
    icon: Gavel,
    title: 'Legal & Investigations',
    summary: 'Whistleblowers and journalists package evidence with future-dated releases. Courts receive immutable audit trails.',
    impact: 'Supports publication plans while protecting the source until the planned release.',
  },
  {
    icon: Shield,
    title: 'Digital Assets & Estates',
    summary: 'Store seed phrases, passwords, or mission files with delayed unlock for teams or families.',
    impact: 'Supports succession planning without involving custodians or lawyers.',
  },
];

const journeyTimeline = [
  {
    badge: 'T-72H',
    title: 'Create Capsule',
    description: 'File encrypted on-device with AES-256-GCM. Metadata hashed client-side.',
    detail: 'Design keeps plaintext on-device during normal operation.',
  },
  {
    badge: 'T-48H',
    title: 'Sign & Commit',
    description: 'Wallet signs the unlock schedule, contract records checksum, and IPFS pin occurs.',
    detail: 'Validators attest that clock skew stays within agreed tolerances.',
  },
  {
    badge: 'T-00H',
    title: 'Unlock Moment',
    description: 'Smart contract flips state, release proof emitted, recipients notified instantly.',
    detail: 'Still encrypted—only holders of the key material can decrypt.',
  },
  {
    badge: 'T+05M',
    title: 'Audit Trail Forever',
    description: 'Public verifiers read on-chain log + IPFS CID for compliance reports.',
    detail: 'The resulting audit trail outlives any human administrator.',
  },
];

const blueprint = [
  {
    icon: Laptop,
    title: 'Client Vault Studio',
    bullets: ['Hardware-backed key derivation', 'Zero-knowledge checksum display', 'Realtime unlock simulator for stakeholders'],
  },
  {
    icon: Server,
    title: 'Smart Contract Spine',
    bullets: ['Polygon Amoy + mainnet ready', 'Deterministic unlock math', 'Automatic incident webhooks to SIEM'],
  },
  {
    icon: HardDrive,
    title: 'Storage Mesh',
    bullets: ['IPFS pinning across 4 regions', 'Chunk-level redundancy', 'No-cost retrieval via gateway partners'],
  },
  {
    icon: Radar,
    title: 'Monitoring + Evidence',
    bullets: ['Integrity beacons every 5 minutes', 'SOC dashboard with tamper alerts', 'API for external audit firms'],
  },
];

const securityLayers = [
  {
    icon: ShieldCheck,
    title: 'Proof-first encryption',
    description: 'AES-256-GCM with PBKDF2-SHA256 (150K iterations) and per-vault salts. Each encryption run is designed to emit verifiable proofs.',
  },
  {
    icon: Fingerprint,
    title: 'Identity-agnostic access',
    description: 'Wallet signatures + passphrase shards. Avoids email resets, centralized admins, and “trust me” links.',
  },
  {
    icon: FileKey,
    title: 'Non-custodial key flow',
    description: 'Custody splits between creator, contract, and optional escrow. We avoid storing full keys.',
  },
  {
    icon: Code,
    title: 'Transparent audits',
    description: 'Open-source contracts, published gas traces, and third-party reports available inside dashboard.',
  },
];

const trustSignals = [
  {
    label: 'Vaults orchestrated',
    value: '2,418',
    detail: 'Pilot telemetry across education, defense, legal trials',
  },
  {
    label: 'Data sealed',
    value: '847 GB',
    detail: 'Internal sharded + mirrored storage measurements',
  },
  {
    label: 'Synthetic leak attempts blocked',
    value: '126',
    detail: 'Caught by anomaly monitors during testing',
  },
  {
    label: 'Uptime tracked',
    value: '99.9%',
    detail: 'Polygon SLA verified via monthly reports',
  },
];

const faqs = [
  {
    q: 'Can anyone accelerate the timer once it is set?',
    a: 'Unlock timestamps are encoded in immutable smart contracts, and the system is built so neither T.A.L.A. nor the vault creator can shorten the wait period after confirmation.',
  },
  {
    q: 'Where are my files before they unlock?',
    a: 'Encrypted shards live on IPFS nodes we orchestrate plus community pinning partners. Without the decryption key, they remain unreadable.',
  },
  {
    q: 'What if Polygon goes down?',
    a: 'Redundant watchers replicate unlock proofs to secondary rollups. If Polygon stalls, unlock proofs are replayed as soon as finality resumes.',
  },
  {
    q: 'Do recipients need wallets?',
    a: 'Creators can share read-only unlock links secured by passphrases. Wallets are required only for capsule authors and auditors.',
  },
];

const pricingTiers = [
  {
    name: 'Field Pilot',
    price: 'Free',
    accent: 'bg-white',
    bullets: ['Up to 25 vaults', 'Single faculty/team wallet', 'Shared audit dashboard', 'Email incident digests'],
    cta: { label: 'Launch Pilot', href: '/create-vault' },
  },
  {
    name: 'Civic Grid',
    price: '$499 /mo',
    accent: 'bg-heirlock-yellow',
    bullets: ['Unlimited vaults', 'Multi-wallet organizations', 'Webhook + API access', 'Priority security reviews'],
    cta: { label: 'Talk to Sales', href: '/pricing' },
  },
  {
    name: 'Sovereign',
    price: 'Custom',
    accent: 'bg-heirlock-pink',
    bullets: ['Air-gapped deployments', 'On-prem IPFS clusters', 'Dedicated compliance desk', 'Joint incident playbooks'],
    cta: { label: 'Schedule Briefing', href: 'mailto:support@usetala.in' },
  },
];

export default function Home() {
  useMicroInteractions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-gradient-to-br from-heirlock-yellow via-white to-heirlock-blue border-b-4 border-black py-14 md:py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black bg-white border-4 border-black px-4 py-2 shadow-brutal">
              Zero-trust time capsules
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-black leading-tight">
              Secure sensitive drops today.
              <br />
              Release them when your process requires.
            </h1>
            <p className="text-lg md:text-xl text-gray-800 font-medium">
              T.A.L.A. is a trustless release prototype built for Indian exam, tender, and evidence workflows.
              Files remain encrypted end-to-end, clocks are anchored to chain events, and each unlock produces on-chain proof material.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create-vault" className="micro-sheen inline-flex items-center justify-center gap-2 font-black text-lg text-heirlock-yellow bg-black border-4 border-black px-8 py-4 shadow-brutal">
                Launch Vault <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/documentation" className="inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-white border-4 border-black px-8 py-4 shadow-brutal">
                Explore Docs <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {heroHighlights.map((stat) => (
                <div key={stat.label} className="border-4 border-black bg-white p-4 shadow-brutal">
                  <div className="text-3xl font-black text-black">{stat.value}</div>
                  <p className="text-sm font-bold text-gray-700">{stat.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-white shadow-brutal p-6 flex flex-col gap-6 micro-grid relative">
            <div>
              <p className="font-black text-sm text-gray-600 uppercase tracking-widest">Dynamic timeline</p>
              <h2 className="text-3xl font-black text-black">Every unlock is pre-written in code</h2>
            </div>
            <div className="space-y-4">
              {journeyTimeline.map((step, idx) => (
                <div key={step.title} className="flex items-stretch gap-4">
                  <div className="relative flex flex-col items-center px-1">
                    <span className="font-black text-xs border-2 border-black px-3 py-1 bg-heirlock-yellow text-black z-10">
                      {step.badge}
                    </span>
                    {idx < journeyTimeline.length - 1 && (
                      <span className="absolute top-12 bottom-0 w-0.5 bg-black" aria-hidden />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-700 uppercase">{step.title}</p>
                    <p className="text-black font-bold">{step.description}</p>
                    <p className="text-xs text-gray-600">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-4 border-black bg-black text-heirlock-yellow px-4 py-3 font-mono text-sm">
              [ polygon amoy ] • block height synced • gas 0.01 gwei • status: operational
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden>
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </section>

      <section className="py-8 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-black text-gray-600 uppercase tracking-widest">Proof rail</p>
            <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-800">
              {proofRail.map((org) => (
                <span key={org.name} className="inline-flex flex-col">
                  <span>{org.name}</span>
                  <span className="text-xs text-gray-500">{org.note}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-black text-white">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {narrativeBlocks.map((block) => (
            <div key={block.title} className="micro-card border-4 border-heirlock-green bg-black p-6 shadow-brutal">
              <h3 className="text-2xl font-black mb-3">{block.title}</h3>
              <p className="text-sm text-gray-200 leading-relaxed">{block.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-cream">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="font-black text-sm uppercase tracking-widest text-gray-600">Capabilities</p>
              <h2 className="text-4xl md:text-5xl font-black text-black">One protocol, four battlefields</h2>
            </div>
            <Link href="/how-it-works" className="inline-flex items-center gap-2 font-black text-black border-3 border-black px-5 py-3 bg-white">
              See architecture <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="micro-card border-4 border-black bg-white p-6 shadow-brutal flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <h3 className="text-xl font-black text-black">{item.title}</h3>
                  </div>
                  <p className="text-black font-medium">{item.summary}</p>
                  <p className="text-sm text-gray-600">Impact: {item.impact}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-heirlock-blue">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <p className="font-black text-sm uppercase tracking-widest text-black">Journey</p>
              <h2 className="text-4xl md:text-5xl font-black text-black">Time-lock storyboard</h2>
            </div>
            <p className="text-black font-medium md:w-1/2">
              A four-phase ritual that stakeholders can audit before, during, and after an unlock window. Every phase is accompanied by a verifiable hash.
            </p>
          </div>
          <div className="space-y-6">
            {journeyTimeline.map((step, idx) => (
              <div key={step.title} className="micro-card border-4 border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm border-2 border-black px-3 py-1 bg-yellow-200">{step.badge}</span>
                  <h3 className="text-2xl font-black text-black">{step.title}</h3>
                </div>
                <div className="flex-1">
                  <p className="text-black font-bold">{step.description}</p>
                  <p className="text-sm text-gray-600">{step.detail}</p>
                </div>
                <span className="text-sm text-gray-500 font-mono">#{(idx + 1).toString().padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <p className="font-black text-sm uppercase tracking-widest text-gray-600">Blueprint</p>
              <h2 className="text-4xl md:text-5xl font-black text-black">What ships with T.A.L.A.</h2>
            </div>
            <p className="text-gray-700 font-medium md:w-1/2">
              We do not sell slide decks. You get operational software, monitoring hooks, and a playbook your compliance team can actually run.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprint.map((block) => {
              const Icon = block.icon;
              return (
                <div key={block.title} className="micro-card border-4 border-black bg-cream p-6 shadow-brutal flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <h3 className="text-xl font-black text-black">{block.title}</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {block.bullets.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="font-black">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-heirlock-yellow">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p className="font-black text-sm uppercase tracking-widest text-black">Security promise</p>
              <h2 className="text-4xl md:text-5xl font-black text-black">Defense-inspired protections</h2>
            </div>
            <p className="text-black font-medium md:w-1/2">
              Every control is verifiable. Bring your auditors—we show our math.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityLayers.map((layer) => {
              const Icon = layer.icon;
              return (
                <div key={layer.title} className="micro-card border-4 border-black bg-white p-6 shadow-brutal">
                  <Icon className="w-10 h-10 mb-4" />
                  <h3 className="text-2xl font-black text-black mb-2">{layer.title}</h3>
                  <p className="text-sm text-gray-700">{layer.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-cream">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p className="font-black text-sm uppercase tracking-widest text-gray-600">Telemetry</p>
              <h2 className="text-4xl md:text-5xl font-black text-black">Pilot telemetry, shared publicly</h2>
            </div>
            <Link href="/status" className="inline-flex items-center gap-2 font-black text-black border-3 border-black px-5 py-3 bg-white">
              View live status <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {trustSignals.map((signal) => (
              <div key={signal.label} className="micro-card border-4 border-black bg-white p-6 shadow-brutal text-center">
                <div className="text-3xl font-black text-black">{signal.value}</div>
                <p className="font-bold text-gray-700">{signal.label}</p>
                <p className="text-xs text-gray-600">{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p className="font-black text-sm uppercase tracking-widest text-gray-600">Questions</p>
              <h2 className="text-4xl md:text-5xl font-black text-black">Operational clarity</h2>
            </div>
            <Link href="/faq" className="inline-flex items-center gap-2 font-black text-black border-3 border-black px-5 py-3 bg-cream">
              View full FAQ <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="micro-card border-4 border-black bg-cream p-6 shadow-brutal">
                <h3 className="text-xl font-black text-black mb-2">{item.q}</h3>
                <p className="text-sm text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-cream">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="font-black text-sm uppercase tracking-widest text-gray-600">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black text-black">Start with a pilot. Scale to sovereignty.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className={`micro-card border-4 border-black ${tier.accent} p-6 shadow-brutal flex flex-col`}>
                <div>
                  <p className="font-black text-sm uppercase tracking-widest text-gray-700">{tier.name}</p>
                  <p className="text-3xl font-black text-black mt-2">{tier.price}</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 flex-1">
                  {tier.bullets.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="font-black">+</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.cta.href} className="mt-6 inline-flex items-center justify-center gap-2 font-black text-black border-3 border-black px-4 py-3 bg-white">
                  {tier.cta.label} <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-black text-white">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <p className="font-black text-sm uppercase tracking-widest text-heirlock-green">Final call</p>
          <h2 className="text-4xl md:text-5xl font-black">Bring math-grade assurance to your next release.</h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Connect a wallet, spin up a pilot vault in three minutes, and show your stakeholders the future of secure disclosure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create-vault" className="micro-sheen inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-heirlock-yellow border-4 border-black px-8 py-4 shadow-brutal">
              Create Vault <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-white border-4 border-black px-8 py-4 shadow-brutal">
              View Demo Dashboard <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-400">Audits, docs, and SOC evidence available on request.</p>
        </div>
      </section>
    </main>
  );
}
