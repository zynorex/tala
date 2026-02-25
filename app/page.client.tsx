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
import PageSkeleton from './components/PageSkeleton';
import ScrollFadeIn from './components/ScrollFadeIn';

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
  return <PageSkeleton />;
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

function TypewriterText({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(active ? '' : text);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }

    let index = 0;
    setDisplay('');
    const timer = setInterval(() => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [active, text]);

  return (
    <span className={className}>
      {display}
      {active && display.length < text.length && (
        <span className="inline-block w-2 animate-pulse">|</span>
      )}
    </span>
  );
}

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

export default function HomeClient() {
  useMicroInteractions();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimelineIndex((prev) => (prev + 1) % journeyTimeline.length);
    }, 3800);
    return () => clearInterval(interval);
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
            <h1 className="text-5xl md:6xl font-black text-black leading-tight">
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
              {heroHighlights.map((stat, idx) => (
                <ScrollFadeIn key={stat.label} delay={idx * 0.2}>
                  <div className="border-4 border-black bg-white p-4 shadow-brutal">
                    <div className="text-3xl font-black text-black">{stat.value}</div>
                    <p className="text-sm font-bold text-gray-700">{stat.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{stat.detail}</p>
                  </div>
                </ScrollFadeIn>
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
                <ScrollFadeIn key={step.title} delay={idx * 0.15}>
                  <div className="grid grid-cols-[72px_1fr] gap-4 items-start">
                    <div className="relative flex flex-col items-center">
                      <span className="font-black text-xs border-2 border-black px-3 py-1 bg-heirlock-yellow text-black z-10 min-w-[56px] text-center">
                        {step.badge}
                      </span>
                      {idx < journeyTimeline.length - 1 && (
                        <span
                          className="absolute top-10 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-black"
                          aria-hidden
                        />
                      )}
                    </div>
                    <div
                      className={`border-2 border-black p-3 shadow-brutal transition-all ${
                        idx === activeTimelineIndex ? 'bg-heirlock-yellow/30' : 'bg-white'
                      }`}
                    >
                      <p className="text-sm font-black text-gray-700 uppercase">{step.title}</p>
                      <p className="text-black font-bold">
                        <TypewriterText
                          text={step.description}
                          active={idx === activeTimelineIndex}
                        />
                      </p>
                      <p className="text-xs text-gray-600">
                        <TypewriterText
                          text={step.detail}
                          active={idx === activeTimelineIndex}
                        />
                      </p>
                    </div>
                  </div>
                </ScrollFadeIn>
              ))}
            </div>
            <div className="border-4 border-black bg-black text-heirlock-yellow px-4 py-3 font-mono text-sm">
              [ polygon amoy ] • block height synced • gas 0.01 gwei • status: operational
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden>
          <div className="absolute -left-10 top-10 w-64 h-64 bg-heirlock-yellow rounded-full mix-blend-multiply blur-3xl" />
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-heirlock-blue rounded-full mix-blend-multiply blur-3xl" />
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-black text-gray-700 uppercase">Who we serve</p>
              <h2 className="text-4xl font-black text-black">One protocol, many workflows</h2>
              <p className="text-lg text-gray-800 font-medium max-w-3xl">
                Education boards, government procurement desks, legal aid groups, and estates teams use T.A.L.A. to remove early-access risk. Same rails, different deadlines.
              </p>
            </div>
            <div className="border-4 border-black bg-black text-heirlock-yellow px-5 py-4 font-mono text-sm shadow-brutal">
              OTPs fail. Passwords leak. Cryptographic unlocks do not depend on good behavior.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((use) => {
              const Icon = use.icon;
              return (
                <div key={use.title} className="border-4 border-black bg-cream p-5 shadow-brutal flex flex-col gap-3 micro-card">
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8 text-black" />
                    <h3 className="text-xl font-black text-black leading-tight">{use.title}</h3>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed flex-1">{use.summary}</p>
                  <p className="text-xs font-bold text-gray-700">{use.impact}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm font-black text-gray-700 uppercase">Why leaks persist</p>
            <h2 className="text-4xl font-black text-black">Humans are the attack surface</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {narrativeBlocks.map((block) => (
                <div key={block.title} className="border-4 border-black bg-white p-4 shadow-brutal h-full">
                  <p className="text-sm font-black text-gray-700 uppercase mb-2">{block.title}</p>
                  <p className="text-sm text-gray-800 leading-relaxed">{block.body}</p>
                </div>
              ))}
            </div>
            <div className="border-4 border-black bg-black text-heirlock-yellow px-4 py-3 font-mono text-sm">
              Code treats every actor the same. No bribes. No pressure. No manual loopholes.
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-brutal flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <h3 className="text-2xl font-black text-black">Proof-first stack</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {securityLayers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <div key={layer.title} className="border-2 border-black bg-cream p-3 flex gap-3">
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-black text-black">{layer.title}</p>
                      <p className="text-xs text-gray-700">{layer.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white border-b-4 border-black">
        <div className="container mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-black text-gray-700 uppercase">Blueprint</p>
              <h2 className="text-4xl font-black text-black">Layers you can audit</h2>
            </div>
            <Link href="/docs/architecture" className="text-sm font-bold underline text-black">View architecture</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blueprint.map((layer) => {
              const Icon = layer.icon;
              return (
                <div key={layer.title} className="border-4 border-black bg-cream p-5 shadow-brutal flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <h3 className="text-xl font-black text-black">{layer.title}</h3>
                  </div>
                  <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
                    {layer.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <p className="text-sm font-black text-gray-700 uppercase">Trust signals</p>
            <h2 className="text-4xl font-black text-black">Telemetry from pilots</h2>
            <p className="text-sm text-gray-800">Real numbers from current pilots and synthetic drills.</p>
            <div className="grid grid-cols-2 gap-4">
              {trustSignals.map((signal) => (
                <div key={signal.label} className="border-4 border-black bg-white p-4 shadow-brutal">
                  <p className="text-3xl font-black text-black">{signal.value}</p>
                  <p className="text-sm font-bold text-gray-700">{signal.label}</p>
                  <p className="text-xs text-gray-600">{signal.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-brutal space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6" />
              <h3 className="text-2xl font-black text-black">Who can verify?</h3>
            </div>
            <p className="text-sm text-gray-800">Anyone with the on-chain tx hash and the CID can verify unlock proofs. No dashboards required.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {proofRail.map((entity) => (
                <div key={entity.name} className="border-2 border-black bg-cream p-3 flex items-center justify-between">
                  <div>
                    <p className="font-black text-black">{entity.name}</p>
                    <p className="text-xs text-gray-700">{entity.note}</p>
                  </div>
                  <span className="font-mono text-xs text-gray-600">✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-black text-gray-700 uppercase">Pricing</p>
              <h2 className="text-4xl font-black text-black">Start with pilots</h2>
            </div>
            <Link href="/pricing" className="text-sm font-bold underline text-black">See full pricing</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className={`border-4 border-black ${tier.accent} p-6 shadow-brutal flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-black">{tier.name}</h3>
                  <p className="text-lg font-black text-black">{tier.price}</p>
                </div>
                <ul className="text-sm text-gray-800 list-disc list-inside space-y-1 flex-1">
                  {tier.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link href={tier.cta.href} className="inline-flex items-center gap-2 font-black text-sm text-black bg-white border-3 border-black px-4 py-3 shadow-brutal w-max">
                  {tier.cta.label} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white border-b-4 border-black">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm font-black text-gray-700 uppercase">Frequently asked</p>
            <h2 className="text-4xl font-black text-black">Answers we give in procurement calls</h2>
            <p className="text-sm text-gray-800">If you need a longer packet, head to the Procurement Pack or Trust Center.</p>
            <Link href="/procurement" className="inline-flex items-center gap-2 font-black text-sm text-black underline">Procurement Pack <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <div key={item.q} className="border-4 border-black bg-cream p-4 shadow-brutal">
                <p className="text-sm font-black text-black">{item.q}</p>
                <p className="text-sm text-gray-700 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-heirlock-blue border-b-4 border-black">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-sm font-black text-black uppercase">Ready to test?</p>
            <h2 className="text-4xl font-black text-black">Create a vault and simulate unlocks</h2>
            <p className="text-sm text-black">Start with a small pilot. Validate on staging. Mirror on production when your reviewers approve.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/create-vault" className="inline-flex items-center justify-center gap-2 font-black text-lg text-heirlock-yellow bg-black border-4 border-black px-8 py-4 shadow-brutal">
                Launch Vault <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/integrations" className="inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-white border-4 border-black px-8 py-4 shadow-brutal">
                View Integrations
              </Link>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-brutal space-y-4">
            <div className="flex items-center gap-3">
              <Unlock className="w-6 h-6" />
              <h3 className="text-2xl font-black text-black">Launch flow</h3>
            </div>
            <ol className="space-y-3 list-decimal list-inside text-sm text-gray-800">
              <li>Encrypt your payload locally.</li>
              <li>Set unlock timestamp; contract records the checksum.</li>
              <li>Distribute the CID + tx hash to reviewers.</li>
              <li>Watch the unlock proof emit on-chain at the scheduled time.</li>
            </ol>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border-2 border-black bg-cream p-3">
                <p className="text-xs font-bold text-gray-700 uppercase">Latency</p>
                <p className="text-lg font-black text-black">~2s webhook dispatch</p>
              </div>
              <div className="border-2 border-black bg-cream p-3">
                <p className="text-xs font-bold text-gray-700 uppercase">Auditability</p>
                <p className="text-lg font-black text-black">On-chain + IPFS references</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
