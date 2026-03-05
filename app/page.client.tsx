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
    descriptions: [
      'File encrypted on-device with AES-256-GCM. Metadata hashed client-side.',
      'Key material never leaves the device. Payload sealed before it moves.',
      'Client-side sealing prevents plaintext from touching the network.',
      'Capsule assembly completes locally with per-vault salts.',
      'Encryption completes before transport, no server-side plaintext.',
    ],
    details: [
      'Design keeps plaintext on-device during normal operation.',
      'Only ciphertext and proofs leave the machine.',
      'Local sealing removes server-side exposure windows.',
      'Metadata fingerprints are generated on the client.',
      'No plaintext storage, no recovery key held by T.A.L.A.',
    ],
  },
  {
    badge: 'T-48H',
    title: 'Sign & Commit',
    descriptions: [
      'Wallet signs the unlock schedule, contract records checksum, and IPFS pin occurs.',
      'Unlock plan is signed, hashed, and anchored on-chain.',
      'Smart contract stamps the schedule and verifies integrity.',
      'Signed commits prevent silent edits after approval.',
      'Network pins ciphertext once the commit is finalized.',
    ],
    details: [
      'Validators attest that clock skew stays within agreed tolerances.',
      'Consensus keeps time drift inside the policy window.',
      'Watcher nodes verify schedule integrity and liveness.',
      'Audit watchers flag any chain reorg anomalies.',
      'Commit receipts are verifiable by external auditors.',
    ],
  },
  {
    badge: 'T-00H',
    title: 'Unlock Moment',
    descriptions: [
      'Smart contract flips state, release proof emitted, recipients notified instantly.',
      'On-chain state changes trigger the unlock broadcast.',
      'Proof of release is emitted and listeners are notified.',
      'Recipients receive alerts the second the state flips.',
      'Unlock is deterministic, no manual approvals required.',
    ],
    details: [
      'Still encrypted—only holders of the key material can decrypt.',
      'Ciphertext remains sealed without the key fragments.',
      'No key, no access even after release proofs.',
      'Decryption requires the holder-approved key material.',
      'Release does not expose plaintext, only signals readiness.',
    ],
  },
  {
    badge: 'T+05M',
    title: 'Audit Trail Forever',
    descriptions: [
      'Public verifiers read on-chain log + IPFS CID for compliance reports.',
      'Auditors replay the chain log against the sealed CID.',
      'Compliance teams can verify every event post-release.',
      'Proof trail is durable across networks and vendors.',
      'Verification requires no T.A.L.A. involvement.',
    ],
    details: [
      'The resulting audit trail outlives any human administrator.',
      'Evidence survives staff turnover and vendor changes.',
      'Logs are tamper-evident, replayable, and time-stamped.',
      'Audit history remains intact even if apps change.',
      'Chain proofs persist as long as the network does.',
    ],
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
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

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

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % 5);
    }, 2200);
    return () => clearInterval(phraseInterval);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-cream border-b-8 border-black pt-20 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-black selection:text-heirlock-yellow min-h-[90vh] flex items-center">
        {/* Background shapes */}
        <div className="absolute top-10 left-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-heirlock-pink border-4 border-black rounded-none mix-blend-multiply blur-sm opacity-80 animate-pulse transform rotate-12"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-heirlock-blue border-4 border-black rounded-full mix-blend-multiply blur-sm opacity-80"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjA4Ii8+PC9zdmc+')] opacity-60 pointer-events-none z-0"></div>

        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
          
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            {/* Flairs */}
            <div className="absolute -top-12 -left-4 md:-top-16 md:-left-8 z-20">
              <div className="bg-heirlock-yellow text-black border-4 border-black px-4 py-2 font-black uppercase text-lg md:text-xl transform -rotate-6 shadow-[6px_6px_0_0_#000]">
                v2.0 PROTOCOL
              </div>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter text-black leading-[0.85] mb-8 drop-shadow-sm w-full">
              <span className="inline-block transform hover:-translate-y-2 transition-transform">TRUST</span><br />
              <span className="inline-block transform hover:-translate-y-2 transition-transform bg-black text-white px-2 md:px-4 border-4 border-black mt-2 lg:mt-4 shadow-[8px_8px_0_0_#BAE1FF]">IS CODE.</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl font-bold border-l-8 border-heirlock-blue pl-6 py-2 mb-10 text-black/80 max-w-2xl leading-tight bg-white/50 backdrop-blur-sm shadow-[4px_4px_0_0_#000]">
              Zero-trust time capsules for Indian exam, tender, and evidence workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 md:gap-6 mb-12">
              <Link href="/create-vault" className="flex-1 text-center font-black text-xl lg:text-2xl text-white bg-black border-4 border-black px-6 py-5 shadow-[8px_8px_0_0_#FFB3BA] hover:shadow-[12px_12px_0_0_#FFB3BA] hover:-translate-y-1 transition-all uppercase tracking-wider group">
                <span className="flex items-center justify-center gap-3">
                  LAUNCH VAULT <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                </span>
              </Link>
              <Link href="/documentation" className="flex-1 text-center font-black text-xl lg:text-2xl text-black bg-white border-4 border-black px-6 py-5 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 hover:bg-heirlock-yellow transition-all uppercase tracking-wider group">
                <span className="flex items-center justify-center gap-3">
                  EXPLORE DOCS <BookOpen className="w-8 h-8 group-hover:rotate-12 transition-transform" strokeWidth={3} />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-auto">
              {heroHighlights.map((stat, idx) => (
                <ScrollFadeIn key={stat.label} delay={idx * 0.2}>
                  <div className="border-4 border-black bg-white p-5 md:p-6 shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] hover:-translate-y-1 transition-all group cursor-default">
                    <div className="text-4xl lg:text-5xl font-black text-black mb-2 group-hover:text-heirlock-pink transition-colors">{stat.value}</div>
                    <p className="text-sm md:text-base font-black text-black uppercase leading-tight">{stat.label}</p>
                  </div>
                </ScrollFadeIn>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-10 lg:mt-0 xl:scale-105 xl:origin-left">
            <div className="absolute -inset-2 md:-inset-4 bg-heirlock-green border-4 border-black transform rotate-2 md:rotate-3 shadow-[12px_12px_0_0_#000] z-0 hidden sm:block"></div>
            
            <div className="border-4 border-black bg-white p-4 md:p-6 lg:p-8 relative z-10 flex flex-col micro-grid shadow-[8px_8px_0_0_#000] sm:shadow-none">
              <div className="mb-4 md:mb-5 border-b-4 border-black pb-3">
                <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 font-black uppercase text-[10px] md:text-xs mb-2 shadow-[4px_4px_0_0_#BAE1FF]">
                  <div className="w-2.5 h-2.5 bg-heirlock-red border border-white animate-pulse"></div>
                  Dynamic Timeline
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-black uppercase tracking-tight leading-[0.95]">Every unlock<br/>pre-written<br/>in code.</h2>
              </div>
              
              <div className="flex flex-col gap-4 pt-1">
                {journeyTimeline.map((step, idx) => (
                  <ScrollFadeIn key={step.title} delay={idx * 0.15}>
                    <div className="grid grid-cols-[56px_1fr] md:grid-cols-[64px_1fr] gap-3 items-start group">
                      <div className="relative flex flex-col items-center">
                        <span className={`font-black text-[10px] md:text-xs border-4 border-black py-1 w-full text-center transition-transform duration-300 z-10 ${idx === activeTimelineIndex ? 'bg-heirlock-yellow text-black transform rotate-3 scale-110 shadow-[4px_4px_0_0_#000]' : 'bg-white text-black'}`}>
                          {step.badge}
                        </span>
                        {idx < journeyTimeline.length - 1 && (
                          <span
                            className={`absolute top-8 bottom-[-16px] left-1/2 -translate-x-1/2 w-1.5 transition-colors ${idx < activeTimelineIndex ? 'bg-black' : 'bg-black/10'}`}
                            aria-hidden
                          />
                        )}
                      </div>
                      <div
                        className={`border-4 border-black p-2.5 md:p-3 transition-all duration-300 ${
                          idx === activeTimelineIndex ? 'bg-heirlock-yellow translate-x-1 shadow-[4px_4px_0_0_#000]' : 'bg-white group-hover:bg-cream'
                        }`}
                      >
                        <p className="text-sm md:text-base font-black text-black uppercase mb-1">{step.title}</p>
                        <div className="border-l-4 border-black pl-2 min-h-[32px] flex flex-col justify-center">
                          <p className="text-black font-bold text-[11px] md:text-xs leading-tight">
                            <TypewriterText
                              text={
                                idx === activeTimelineIndex
                                  ? step.descriptions[activePhraseIndex]
                                  : step.descriptions[0]
                              }
                              active={idx === activeTimelineIndex}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
              
              <div className="mt-5 border-4 border-black bg-black text-heirlock-green px-3 py-2 font-mono text-[10px] tracking-widest font-bold text-center uppercase flex justify-between shadow-[4px_4px_0_0_#FFFACD] shrink-0">
                <span>[ AMOY ]</span>
                <span>SYNCED</span>
                <span>0.01 GWEI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 border-b-8 border-black bg-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-heirlock-yellow border-b-8 border-l-8 border-black"></div>
        <div className="container mx-auto max-w-7xl space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:items-end md:justify-between border-b-8 border-black pb-8">
            <div className="space-y-4 max-w-4xl">
              <span className="inline-block bg-black text-white px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#BAE1FF]">
                Deployment Sectors
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-black uppercase leading-tight tracking-tighter">One Protocol.<br/>Many Workflows.</h2>
              <p className="text-xl md:text-2xl text-black font-bold max-w-3xl leading-snug">
                Education boards, public procurement desks, legal firms, and asset managers use T.A.L.A. to eliminate early access execution risks. The underlying rails remain identical.
              </p>
            </div>
            <div className="border-4 border-black bg-heirlock-pink text-black px-6 py-5 font-bold text-lg shadow-[8px_8px_0_0_#000] rotate-2 max-w-sm">
              "Cryptographic unlocks do not depend on good behavior. They depend on math."
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((use) => {
              const Icon = use.icon;
              return (
                <div key={use.title} className="border-4 border-black bg-cream p-8 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-2 transition-all flex flex-col gap-5 group cursor-default">
                  <div className="w-16 h-16 bg-black flex items-center justify-center border-4 border-black group-hover:bg-heirlock-yellow transition-colors rotate-[-3deg]">
                    <Icon className="w-8 h-8 text-white group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase leading-none">{use.title}</h3>
                  <p className="text-base text-black font-bold leading-relaxed flex-1 border-l-4 border-black pl-3">{use.summary}</p>
                  <div className="bg-black text-white p-3 text-sm font-bold uppercase">
                    Outcome: {use.impact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 bg-black border-b-8 border-black text-white relative overflow-hidden">
        {/* Background Grids for dark section */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          <div className="lg:col-span-5 space-y-8">
            <span className="inline-block bg-white text-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#FFB3BA]">
              Vulnerability Analysis
            </span>
            <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Humans Are The<br/>Attack Surface.</h2>
            <div className="space-y-6">
              {narrativeBlocks.map((block) => (
                <div key={block.title} className="border-4 border-white bg-dark p-6 shadow-[8px_8px_0_0_#FFFACD]">
                  <p className="text-xl font-black text-heirlock-yellow uppercase mb-3 px-2 bg-white/10 inline-block">{block.title}</p>
                  <p className="text-lg text-white font-medium leading-relaxed">{block.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="border-4 border-white bg-black p-8 md:p-12 shadow-[12px_12px_0_0_#BAE1FF] relative">
              
              <div className="absolute -top-6 -right-6 bg-heirlock-red text-white border-4 border-white px-4 py-2 font-black uppercase text-xl transform rotate-6 z-10">
                ARCHITECTURE
              </div>

              <div className="flex items-center gap-4 mb-10 border-b-4 border-white pb-6">
                <Shield className="w-12 h-12 text-heirlock-green" />
                <h3 className="text-4xl font-black text-white uppercase tracking-tight">Proof First Stack</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {securityLayers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <div key={layer.title} className="border-4 border-white bg-white/5 p-5 flex flex-col gap-4 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 bg-white text-black flex items-center justify-center border-2 border-white">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-white uppercase mb-2">{layer.title}</p>
                        <p className="text-sm text-gray-300 font-bold leading-relaxed">{layer.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 bg-cream border-b-8 border-black relative">
        <div className="container mx-auto max-w-7xl space-y-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-8 border-black pb-8">
            <div>
              <span className="inline-block bg-heirlock-yellow text-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] mb-4">
                Architecture Blueprint
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">Layers You<br/>Can Audit.</h2>
            </div>
            <Link href="/docs/architecture" className="inline-flex items-center gap-2 font-black text-xl text-black bg-white border-4 border-black px-6 py-4 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all uppercase">
              View Architecture <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blueprint.map((layer) => {
              const Icon = layer.icon;
              return (
                <div key={layer.title} className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] flex flex-col gap-5 hover:bg-black transition-colors duration-300 group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cream text-black flex items-center justify-center border-4 border-black group-hover:bg-heirlock-yellow group-hover:border-black transition-colors duration-300">
                      <Icon className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl font-black text-black group-hover:text-white uppercase leading-tight transition-colors duration-300">{layer.title}</h3>
                  </div>
                  <ul className="text-base font-bold list-none space-y-3 flex-1 mt-4">
                    {layer.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span className="w-2 h-2 mt-2 bg-black border border-black group-hover:border-heirlock-yellow group-hover:bg-heirlock-yellow shrink-0 transition-colors duration-300"></span>
                        <span className="text-black group-hover:text-gray-100 transition-colors duration-300">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 bg-heirlock-yellow border-b-8 border-black">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8">
            <span className="inline-block bg-black text-white px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#FFFACD]">
              Trust Signals
            </span>
            <h2 className="text-6xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">Telemetry<br/>From Pilots.</h2>
            <p className="text-xl text-black font-bold border-l-8 border-black pl-4">Real numbers from current deployments and synthetic drills.</p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              {trustSignals.map((signal) => (
                <div key={signal.label} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000]">
                  <p className="text-4xl md:text-5xl font-black text-black mb-2">{signal.value}</p>
                  <p className="text-sm font-black text-black uppercase">{signal.label}</p>
                  <p className="text-xs text-gray-700 font-bold mt-2 leading-tight">{signal.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border-4 border-black bg-white p-8 md:p-12 shadow-[12px_12px_0_0_#000] h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-heirlock-blue border-4 border-black flex items-center justify-center">
                  <Database className="w-8 h-8 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="text-4xl font-black text-black uppercase tracking-tight">Who Can Verify?</h3>
              </div>
              <p className="text-xl text-black font-bold mb-10 border-b-4 border-black pb-8">Anyone with the chain transaction hash and the CID can verify unlock proofs. No dashboard required.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-auto">
                {proofRail.map((entity) => (
                  <div key={entity.name} className="border-4 border-black bg-cream p-4 flex items-center justify-between hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all">
                    <div>
                      <p className="font-black text-black text-xl uppercase">{entity.name}</p>
                      <p className="text-sm text-gray-700 font-bold">{entity.note}</p>
                    </div>
                    <div className="w-8 h-8 bg-black text-heirlock-green flex items-center justify-center border-2 border-black font-bold">✓</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 bg-white border-b-8 border-black relative overflow-hidden">
        <div className="container mx-auto max-w-7xl space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-8 border-black pb-8">
            <div>
              <span className="inline-block bg-heirlock-blue text-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] mb-4">
                Operations Scale
              </span>
              <h2 className="text-6xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">Start With<br/>Pilots.</h2>
            </div>
            <Link href="/pricing" className="inline-flex items-center gap-2 font-black text-xl text-white bg-black border-4 border-black px-6 py-4 shadow-[6px_6px_0_0_#BAE1FF] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#BAE1FF] transition-all uppercase">
              See Full Pricing <ChevronRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className={`border-4 border-black ${tier.accent} p-8 md:p-10 shadow-[10px_10px_0_0_#000] flex flex-col gap-6 relative group overflow-hidden`}>
                <div className="flex items-center justify-between border-b-4 border-black pb-6">
                  <h3 className="text-3xl font-black text-black uppercase">{tier.name}</h3>
                  <p className="text-2xl font-black text-black bg-white border-4 border-black px-3 py-1 -rotate-2">{tier.price}</p>
                </div>
                <ul className="text-lg font-bold text-black flex-1 space-y-4 z-10 relative">
                  {tier.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" strokeWidth={3} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 relative z-10">
                  <Link href={tier.cta.href} className="inline-flex items-center justify-center gap-3 font-black text-xl text-black bg-white border-4 border-black px-6 py-5 shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] hover:-translate-y-1 transition-all w-full uppercase">
                    {tier.cta.label} <ChevronRight className="w-6 h-6" strokeWidth={3} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 bg-white border-b-8 border-black">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <span className="inline-block bg-heirlock-pink text-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000]">
              Frequently Asked
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none">Procurement<br/>Answers.</h2>
            <p className="text-xl text-black font-bold border-l-8 border-black pl-4">Require a comprehensive technical packet? Access the Procurement Pack or visit our Trust Center.</p>
            <Link href="/procurement" className="inline-flex items-center gap-3 font-black text-xl text-white bg-black border-4 border-black px-6 py-5 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all uppercase mt-4">
              Procurement Pack <ChevronRight className="w-6 h-6" strokeWidth={3} />
            </Link>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="border-4 border-black bg-cream p-6 md:p-8 shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] transition-all">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl font-black text-heirlock-yellow drop-shadow-[2px_2px_0_rgba(0,0,0,1)] mt-1">Q.</span>
                  <div>
                    <p className="text-xl font-black text-black uppercase leading-tight mb-2">{item.q}</p>
                    <p className="text-base text-black font-bold leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-4 bg-heirlock-blue border-b-8 border-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-heirlock-yellow rounded-full mix-blend-multiply blur-[80px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-heirlock-pink rounded-full mix-blend-multiply blur-[80px] opacity-60"></div>
        
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <span className="inline-block bg-black text-white px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#FFFACD]">
              Deployment Ready
            </span>
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none">Simulate<br/><span className="bg-white border-4 border-black px-2 inline-block -rotate-2 transform shadow-[8px_8px_0_0_#000] mt-2">Unlocks.</span></h2>
            <p className="text-xl text-black font-bold bg-white/50 backdrop-blur-sm p-4 border-4 border-black shadow-[4px_4px_0_0_#000]">Initiate a zero cost pilot. Validate operations on staging. Replicate to production upon stakeholder approval.</p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/create-vault" className="flex-1 text-center font-black text-xl lg:text-2xl text-heirlock-yellow bg-black border-4 border-black px-6 py-6 shadow-[8px_8px_0_0_#FFB3BA] hover:shadow-[12px_12px_0_0_#FFB3BA] hover:-translate-y-1 transition-all uppercase group">
                <span className="flex items-center justify-center gap-3">
                  LAUNCH VAULT <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                </span>
              </Link>
              <Link href="/integrations" className="flex-1 text-center font-black text-xl lg:text-2xl text-black bg-white border-4 border-black px-6 py-6 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 hover:bg-cream transition-all uppercase">
                Integrations
              </Link>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-8 md:p-12 shadow-[12px_12px_0_0_#000] flex flex-col gap-8 md:rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-5 border-b-4 border-black pb-6">
              <div className="w-16 h-16 bg-black flex items-center justify-center border-4 border-black">
                <Unlock className="w-8 h-8 text-heirlock-yellow" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-black uppercase">Launch Flow</h3>
            </div>
            
            <ol className="space-y-6 text-lg font-bold text-black counter-reset-flow">
              {[
                'Encrypt local payload.',
                'Specify timestamp; contract signs checksum.',
                'Distribute CID and hash to reviewers.',
                'Monitor on chain proof emit at schedule.'
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 shrink-0 bg-heirlock-pink border-4 border-black flex items-center justify-center font-black text-black mt-1">
                    {i + 1}
                  </div>
                  <span className="leading-snug pt-1">{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
              <div className="border-4 border-black bg-cream p-5">
                <p className="text-sm font-black text-black uppercase mb-1">Latency</p>
                <p className="text-2xl font-black text-black">~2s Webhook</p>
              </div>
              <div className="border-4 border-black bg-cream p-5">
                <p className="text-sm font-black text-black uppercase mb-1">Auditability</p>
                <p className="text-xl font-black text-black leading-tight mt-1">Chain + IPFS</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
