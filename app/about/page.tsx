import type { Metadata } from 'next';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Clock3,
  SignalHigh,
  Eye,
  Globe2,
  LineChart,
  Target,
  BookOpen,
  Briefcase,
  Gavel,
  ArrowRight,
  ShieldHalf,
  Layers3,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'T.A.L.A. | About',
  description:
    'Tamper-proof Automated Locking Algorithm for exams, tenders, and evidence—built on smart contracts, client-side encryption, and auditable unlocks.',
  alternates: { canonical: 'https://usetala.in/about' },
  openGraph: {
    title: 'T.A.L.A. | About',
    description:
      'Trust is Code: cryptographic time-locks replacing human trust for education, governance, and legal workflows.',
    url: 'https://usetala.in/about',
    siteName: 'T.A.L.A.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'About T.A.L.A.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T.A.L.A. | About',
    description:
      'Trust is Code: cryptographic time-locks replacing human trust for education, governance, and legal workflows.',
    images: ['/opengraph-image'],
    creator: '@usetala',
  },
};

export default function About() {
  const highlights = [
    {
      title: 'Mathematics replaces discretion',
      description: 'Smart contracts gate every unlock. No override buttons. No admin backdoors.',
      icon: ShieldCheck,
      color: 'bg-heirlock-yellow',
    },
    {
      title: 'Client-side secrecy',
      description: 'AES-256 encryption runs on your device. Plaintext never touches our servers.',
      icon: Lock,
      color: 'bg-heirlock-blue',
    },
    {
      title: 'Time is the root of trust',
      description: 'Blockchain time-locks enforce the exact moment a vault opens—auditable forever.',
      icon: Clock3,
      color: 'bg-heirlock-green',
    },
  ];

  const proofPoints = [
    { label: 'Admin overrides', value: '0', caption: 'Design forbids early access' },
    { label: 'Latency to unlock', value: '<12s', caption: 'Bounded by block finality' },
    { label: 'Surface area', value: 'Minimal', caption: 'Keys never sit on servers' },
    { label: 'Audit trail', value: 'On-chain', caption: 'Every unlock is provable' },
  ];

  const trustStack = [
    {
      title: 'Edge Encryption',
      description: 'Keys generated per vault, derived and used locally, shredded after encrypting.',
      icon: KeyRound,
    },
    {
      title: 'Immutable Storage',
      description: 'Ciphertext stored on IPFS through enterprise gateways; hashes guarantee integrity.',
      icon: Globe2,
    },
    {
      title: 'Time-Lock Contract',
      description: 'Polygon smart contracts release keys only when block.timestamp meets policy.',
      icon: ShieldHalf,
    },
  ];

  const pillars = [
    {
      title: 'Education',
      subtitle: 'Leak-proof exam delivery',
      description:
        'Universities and boards release papers at the same second for millions of students, without trusting intermediaries.',
      icon: BookOpen,
      color: 'bg-heirlock-green',
    },
    {
      title: 'Governance',
      subtitle: 'Sealed tenders that stay sealed',
      description: 'Bids stay cryptographically locked until the opening ceremony—no preferential peeks.',
      icon: Briefcase,
      color: 'bg-heirlock-yellow',
    },
    {
      title: 'Justice',
      subtitle: 'Evidence that cannot be coerced',
      description:
        'Whistleblower dossiers and wills stay inaccessible until the lawful moment, immune to pressure or compromise.',
      icon: Gavel,
      color: 'bg-heirlock-pink',
    },
  ];

  const process = [
    {
      title: 'Model the risk',
      body: 'Map who could access the asset today and when they should not. TALA locks those windows mathematically.',
      icon: Target,
    },
    {
      title: 'Encrypt at source',
      body: 'Files are encrypted locally. Only ciphertext is uploaded to the vault and pinned across IPFS.',
      icon: Layers3,
    },
    {
      title: 'Set the unlock moment',
      body: 'Smart contracts enforce the exact block-time the key can be claimed. No manual approvals exist.',
      icon: Clock3,
    },
    {
      title: 'Deliver with proofs',
      body: 'Recipients verify the contract state and download. Every action leaves an auditable trail.',
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-cream text-black selection:bg-black selection:text-heirlock-yellow">
      {/* Header Ticker */}
      <div className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            System Status: Nominal
          </span>
          <span className="hidden sm:inline-block">Tamper-proof Automated Locking Algorithm</span>
          <span className="flex items-center gap-2 text-heirlock-green">
            <div className="h-2 w-2 animate-pulse rounded-full bg-heirlock-green" />
            Online
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b-4 border-black px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative mb-8 inline-block">
            <div className="absolute -right-4 -top-4 -z-10 h-full w-full bg-heirlock-pink" />
            <div className="border-4 border-black bg-white px-6 py-2 text-sm md:text-base font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000]">
              About the protocol
            </div>
          </div>
          
          <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl lg:text-[6rem]">
            Trust is Code.
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>
              We removed the human element.
            </span>
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <p className="border-l-8 border-black pl-6 text-xl font-bold leading-relaxed text-black md:text-2xl">
              TALA is a cryptographic time-lock protocol that removes human discretion from the moment a file can be opened. Exams, tenders, evidence—released exactly when the blockchain says so.
            </p>
            
            <div className="flex flex-col items-start justify-end gap-4 sm:flex-row">
              <Link
                href="/create-vault"
                className="group flex items-center gap-2 border-4 border-black bg-black px-8 py-4 text-lg font-black uppercase text-heirlock-yellow shadow-[8px_8px_0_0_#888] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
              >
                Create a Vault
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/documentation"
                className="group flex items-center gap-2 border-4 border-black bg-white px-8 py-4 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
              >
                Read Docs
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Points / Stats */}
      <section className="bg-heirlock-yellow border-b-4 border-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y-4 divide-black md:grid-cols-4 md:divide-x-4 md:divide-y-0">
          {proofPoints.map((point) => (
            <div key={point.label} className="p-8 text-center md:text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/60">{point.label}</p>
              <p className="mt-2 text-4xl font-black md:text-5xl">{point.value}</p>
              <p className="mt-2 text-sm font-bold">{point.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy / Highlights */}
      <section className="border-b-4 border-black bg-white px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <h2 className="text-4xl font-black uppercase md:text-6xl">
              The Architecture of<br />Guaranteed Trust
            </h2>
            <div className="max-w-md text-lg font-bold">
              We replaced "trust me, I promise" with "verify the code, it's open source."
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className={`flex flex-col border-4 border-black p-8 shadow-[8px_8px_0_0_#000] ${item.color} transition-transform hover:-translate-y-1`}
              >
                <item.icon className="h-12 w-12 stroke-[2.5px]" />
                <h3 className="mt-6 text-2xl font-black uppercase leading-tight">{item.title}</h3>
                <p className="mt-4 text-base font-bold text-black/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical Stack / Trust Layers */}
      <section className="border-b-4 border-black bg-black px-4 py-20 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="inline-block border-2 border-heirlock-green px-4 py-1 text-xs font-black uppercase tracking-widest text-heirlock-green">
                The Stack
              </div>
              <h2 className="text-4xl font-black uppercase leading-none md:text-5xl lg:text-7xl">
                How we secure<br />the timeline.
              </h2>
              <p className="max-w-md text-lg font-medium text-gray-300">
                A system built on the premise that keys should not exist until they are needed, and should never exist in a place where they can be stolen.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {trustStack.map((layer, index) => (
                <div
                  key={layer.title}
                  className="relative group border-4 border-white bg-black p-6 transition-all hover:border-heirlock-green"
                >
                  <div className="absolute -left-3 -top-3 -z-10 h-full w-full border-4 border-white/20 bg-transparent transition-all group-hover:border-heirlock-green" />
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-white bg-black text-white group-hover:border-heirlock-green group-hover:text-heirlock-green">
                      <layer.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-wide text-white group-hover:text-heirlock-green">{layer.title}</h3>
                      <p className="mt-2 font-mono text-sm leading-relaxed text-gray-300 group-hover:text-white">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases / Pillars */}
      <section className="border-b-4 border-black bg-heirlock-blue/10 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-black uppercase md:text-6xl">Sectors deemed critical</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="group relative">
                <div className={`absolute inset-0 translate-x-3 translate-y-3 border-4 border-black ${pillar.color}`} />
                <div className="relative h-full border-4 border-black bg-white p-8 transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
                  <div className="mb-6 flex items-center justify-between">
                    <pillar.icon className="h-8 w-8" />
                    <span className="bg-black px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                      {pillar.title}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase">{pillar.subtitle}</h3>
                  <p className="mt-4 text-sm font-bold text-gray-700">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center text-4xl font-black uppercase md:text-6xl">
            The Flow
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <div key={step.title} className="relative">
                {/* Connector Line (Desktop) */}
                {i !== process.length - 1 && (
                  <div className="absolute top-8 -right-4 hidden lg:block w-8 border-t-4 border-black border-dashed z-0" />
                )}
                
                <div className="relative z-10 flex flex-col h-full bg-cream">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-white shadow-[4px_4px_0_0_#000]">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-black uppercase mb-1 flex items-center gap-2">
                    <span className="text-sm bg-black text-white w-6 h-6 flex items-center justify-center rounded-full">
                      {i + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-sm font-bold text-black/70 mt-2 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid / Differentiators - Condensed */}
      <section className="border-t-4 border-black bg-heirlock-pink px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-3xl font-black uppercase max-w-xl">
                Ready to replace human error with mathematical certainty?
            </h2>
            <Link
                href="/create-vault"
                className="inline-flex items-center gap-2 border-4 border-black bg-white px-8 py-4 text-xl font-black uppercase text-black shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
            >
                Start Now
                <ArrowRight className="h-6 w-6" />
            </Link>
        </div>
      </section>
    </main>
  );
}
