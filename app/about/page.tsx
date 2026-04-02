import type { Metadata } from 'next';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Clock3,
  Eye,
  Globe2,
  Target,
  BookOpen,
  Briefcase,
  Gavel,
  ArrowRight,
  ShieldHalf,
  Layers3,
  Terminal,
  Fingerprint,
  Cpu,
  Binary,
  Blocks,
  ChevronRight,
  Zap,
  Network,
  Timer,
  Database,
  ScanEye,
  ShieldAlert,
  Hash,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About T.A.L.A. — Tamper Proof Automated Locking Algorithm',
  description:
    'T.A.L.A. (Tamper Proof Automated Locking Algorithm) — a zero-trust cryptographic time-lock protocol replacing human discretion with mathematical certainty for exams, tenders, and evidence.',
  alternates: { canonical: 'https://usetala.in/about' },
  openGraph: {
    title: 'About T.A.L.A. — Tamper Proof Automated Locking Algorithm',
    description:
      'Trust is Code: cryptographic time-locks replacing human trust for education, governance, and legal workflows.',
    url: 'https://usetala.in/about',
    siteName: 'T.A.L.A.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'About T.A.L.A. — Tamper Proof Automated Locking Algorithm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About T.A.L.A. — Tamper Proof Automated Locking Algorithm',
    description:
      'Trust is Code: cryptographic time-locks replacing human trust for education, governance, and legal workflows.',
    images: ['/opengraph-image'],
    creator: '@usetala',
  },
};

export default function About() {
  const acronymLetters = [
    { letter: 'T', word: 'TAMPER', accent: 'bg-heirlock-yellow', shadow: '#000' },
    { letter: 'A', word: 'PROOF', accent: 'bg-heirlock-pink', shadow: '#000' },  // second part of "tamper proof"
    { letter: 'L', word: 'AUTOMATED', accent: 'bg-heirlock-green', shadow: '#000' },  // actually maps to A
    { letter: 'A', word: 'LOCKING', accent: 'bg-heirlock-blue', shadow: '#000' },  // maps to L
  ];

  const fullFormParts = [
    { letter: 'T', word: 'TAMPER PROOF', color: 'text-heirlock-yellow', borderColor: 'border-heirlock-yellow' },
    { letter: 'A', word: 'AUTOMATED', color: 'text-heirlock-pink', borderColor: 'border-heirlock-pink' },
    { letter: 'L', word: 'LOCKING', color: 'text-heirlock-green', borderColor: 'border-heirlock-green' },
    { letter: 'A', word: 'ALGORITHM', color: 'text-heirlock-blue', borderColor: 'border-heirlock-blue' },
  ];

  const proofPoints = [
    { label: 'Admin Overrides', value: '0', caption: 'Design forbids early access', icon: ShieldAlert },
    { label: 'Unlock Latency', value: '<12s', caption: 'Bounded by block finality', icon: Timer },
    { label: 'Server Key Storage', value: 'ZERO', caption: 'Keys never sit on servers', icon: KeyRound },
    { label: 'Audit Trail', value: 'ON-CHAIN', caption: 'Every unlock is provable', icon: Hash },
  ];

  const trustStack = [
    {
      title: 'Edge Encryption',
      description: 'Keys generated per vault, derived and used locally, shredded after encrypting. Plaintext never leaves your device.',
      icon: KeyRound,
      tag: 'LAYER 01',
      accent: 'heirlock-yellow',
    },
    {
      title: 'Immutable Storage',
      description: 'Ciphertext pinned across IPFS via enterprise gateways. Content-addressed hashes guarantee integrity forever.',
      icon: Globe2,
      tag: 'LAYER 02',
      accent: 'heirlock-pink',
    },
    {
      title: 'Time-Lock Contract',
      description: 'Polygon smart contracts release access only when block.timestamp meets the vault policy. No human override exists.',
      icon: ShieldHalf,
      tag: 'LAYER 03',
      accent: 'heirlock-green',
    },
  ];

  const pillars = [
    {
      title: 'Education',
      subtitle: 'Leak-proof exam delivery',
      description:
        'Universities and boards release papers at the same second for millions of students, without trusting intermediaries. No couriers. No 3 AM leaks.',
      icon: BookOpen,
      color: 'bg-heirlock-green',
      borderAccent: 'border-heirlock-green',
    },
    {
      title: 'Governance',
      subtitle: 'Sealed tenders that stay sealed',
      description: 'Bids stay cryptographically locked until the opening ceremony. No preferential peeks. No insider advantages.',
      icon: Briefcase,
      color: 'bg-heirlock-yellow',
      borderAccent: 'border-heirlock-yellow',
    },
    {
      title: 'Justice',
      subtitle: 'Evidence beyond coercion',
      description:
        'Whistleblower dossiers and wills stay inaccessible until the lawful moment, immune to pressure, compromise, or unauthorized access.',
      icon: Gavel,
      color: 'bg-heirlock-pink',
      borderAccent: 'border-heirlock-pink',
    },
  ];

  const processSteps = [
    {
      title: 'Model the Risk',
      body: 'Map who could access the asset today and when they should not. TALA locks those windows mathematically.',
      icon: Target,
      tag: '/01',
    },
    {
      title: 'Encrypt at Source',
      body: 'Files are encrypted locally with AES-256-GCM. Only ciphertext is uploaded to the vault and pinned across IPFS.',
      icon: Lock,
      tag: '/02',
    },
    {
      title: 'Set the Unlock Epoch',
      body: 'Smart contracts enforce the exact block-time the key can be claimed. No manual approvals. No overrides.',
      icon: Clock3,
      tag: '/03',
    },
    {
      title: 'Deliver with Proofs',
      body: 'Recipients verify the contract state and download. Every action leaves an immutable, auditable on-chain trail.',
      icon: ShieldCheck,
      tag: '/04',
    },
  ];

  const techSpecs = [
    { label: 'Encryption', value: 'AES-256-GCM', icon: Lock },
    { label: 'Network', value: 'Polygon PoS', icon: Network },
    { label: 'Storage', value: 'IPFS / Pinata', icon: Database },
    { label: 'Verification', value: 'On-Chain Proofs', icon: ScanEye },
    { label: 'Key Mgmt', value: 'Client-Side Only', icon: Fingerprint },
    { label: 'Architecture', value: 'Zero-Knowledge', icon: Eye },
  ];

  return (
    <main className="min-h-screen bg-cream text-black selection:bg-black selection:text-heirlock-yellow">

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HEADER TICKER — glitchy scrolling status bar
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-b-8 border-black bg-black text-white overflow-hidden mt-16 md:mt-20">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap py-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center mx-6">
              <Terminal className="w-4 h-4 mr-2 text-heirlock-green" />
              <span className="font-black tracking-[0.25em] uppercase text-xs">
                T.A.L.A. // TAMPER PROOF AUTOMATED LOCKING ALGORITHM // SYSTEM NOMINAL // ENCRYPTION ACTIVE //
              </span>
            </div>
          ))}
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: HERO — massive kinetic typography
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-b-8 border-black px-4 py-20 md:px-8 md:py-28 overflow-hidden">
        {/* Grid background pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        </div>
        {/* Floating accent blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-heirlock-yellow border-8 border-black rounded-full mix-blend-multiply opacity-40 blur-xl pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-heirlock-pink border-8 border-black rounded-full mix-blend-multiply opacity-30 blur-lg pointer-events-none hidden lg:block"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          {/* Tag */}
          <div className="relative mb-8 inline-block">
            <div className="absolute -right-3 -top-3 h-full w-full bg-heirlock-pink border-4 border-black"></div>
            <div className="relative border-4 border-black bg-white px-6 py-2 text-sm font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_0_#000]">
              <Cpu className="w-4 h-4 inline mr-2 -mt-0.5" />
              About the Protocol
            </div>
          </div>

          {/* Main Hero Heading */}
          <h1 className="max-w-6xl text-6xl font-black uppercase leading-[0.85] tracking-tighter md:text-8xl lg:text-[7.5rem] mb-8">
            Trust is{' '}
            <span className="relative inline-block">
              Code
              <span className="absolute -bottom-2 left-0 w-full h-4 bg-heirlock-yellow -z-10 border-2 border-black"></span>
            </span>
            .
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '3px black' }}>
              We eliminated
            </span>
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '3px black' }}>
              the human element.
            </span>
          </h1>

          {/* Subtitle + CTA */}
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <p className="border-l-8 border-black pl-6 text-xl font-bold leading-relaxed text-black md:text-2xl max-w-2xl">
                TALA is a cryptographic time-lock protocol that removes human discretion from the moment a file can be opened. Exams, tenders, evidence — released exactly when the blockchain says so.
              </p>
              <p className="text-lg font-medium text-gray-700 max-w-2xl pl-6 border-l-8 border-transparent">
                No admin overrides. No API backdoors. No key escrow. The smart contract <em>is</em> the authority.
              </p>
            </div>

            <div className="flex flex-col items-start justify-end gap-4 sm:flex-row lg:flex-col">
              <Link
                href="/create-vault"
                className="group flex items-center gap-3 border-4 border-black bg-black px-8 py-5 text-lg font-black uppercase text-heirlock-yellow shadow-[8px_8px_0_0_#BAFFC9] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#BAFFC9]"
              >
                Deploy a Vault
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
              <Link
                href="/how-it-works"
                className="group flex items-center gap-3 border-4 border-black bg-white px-8 py-5 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
              >
                Read Intel
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: FULL FORM BREAKDOWN — the star of the page
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-black text-white px-4 py-20 md:px-8 md:py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(186,255,201,0.05)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-heirlock-green/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-16 text-center">
            <span className="inline-block border-2 border-heirlock-green px-4 py-1 text-xs font-black uppercase tracking-[0.3em] text-heirlock-green mb-6">
              Decode the Protocol
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
              What is{' '}
              <span className="text-heirlock-yellow">T</span>
              <span className="text-white">.</span>
              <span className="text-heirlock-pink">A</span>
              <span className="text-white">.</span>
              <span className="text-heirlock-green">L</span>
              <span className="text-white">.</span>
              <span className="text-heirlock-blue">A</span>
              <span className="text-white">.</span>
              ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-4 border-white">
            {fullFormParts.map((part, i) => (
              <div
                key={i}
                className={`p-8 md:p-10 border-b-4 lg:border-b-0 lg:border-r-4 border-white last:border-r-0 last:border-b-0 group hover:bg-white/5 transition-colors relative`}
              >
                {/* Giant letter */}
                <div className={`text-8xl md:text-9xl font-black ${part.color} leading-none mb-4 transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
                  {part.letter}
                </div>
                {/* Word */}
                <div className={`border-t-4 ${part.borderColor} pt-4`}>
                  <p className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    {part.word}
                  </p>
                </div>
                {/* Index */}
                <span className="absolute top-4 right-4 text-xs font-black text-white/30 tracking-widest">
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Full form sentence */}
          <div className="mt-12 border-4 border-heirlock-yellow p-8 md:p-12 bg-black relative">
            <div className="absolute -top-4 left-8 bg-heirlock-yellow px-4 py-1 text-black font-black uppercase text-xs tracking-widest border-2 border-black">
              Protocol Definition
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-200 leading-relaxed">
              <span className="text-heirlock-yellow font-black">T</span>amper{' '}
              <span className="text-heirlock-yellow font-black">P</span>roof{' '}
              <span className="text-heirlock-pink font-black">A</span>utomated{' '}
              <span className="text-heirlock-green font-black">L</span>ocking{' '}
              <span className="text-heirlock-blue font-black">A</span>lgorithm — a zero-trust cryptographic vault protocol that replaces human discretion with{' '}
              <span className="text-white font-black underline decoration-heirlock-green decoration-4 underline-offset-4">mathematical certainty</span>.
              No admin overrides. No key escrow. The smart contract <em className="text-heirlock-yellow">is</em> the authority.
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: PROOF POINTS — hard stats strip
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-heirlock-yellow border-b-8 border-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y-4 divide-black sm:grid-cols-2 lg:grid-cols-4 sm:divide-y-0 sm:divide-x-4">
          {proofPoints.map((point) => (
            <div key={point.label} className="p-8 text-center group hover:bg-yellow-200 transition-colors">
              <point.icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">{point.label}</p>
              <p className="mt-2 text-5xl font-black">{point.value}</p>
              <p className="mt-2 text-sm font-bold text-black/70">{point.caption}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: PHILOSOPHY / HIGHLIGHTS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-white px-4 py-20 md:px-8 md:py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#CCC_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="inline-block bg-black text-white px-4 py-1 font-black uppercase text-xs tracking-[0.2em] mb-6 shadow-[4px_4px_0_0_#BAFFC9]">
                Core Philosophy
              </span>
              <h2 className="text-5xl font-black uppercase md:text-7xl tracking-tighter leading-[0.9]">
                The Architecture
                <br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>of Guaranteed Trust</span>
              </h2>
            </div>
            <div className="max-w-md text-lg font-bold border-4 border-black p-6 bg-cream shadow-[8px_8px_0_0_#000]">
              We replaced &quot;trust me, I promise&quot; with &quot;verify the code, it&apos;s open source.&quot;
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Mathematics replaces discretion',
                description: 'Smart contracts gate every unlock. No override buttons. No admin backdoors. The code is the final word.',
                icon: ShieldCheck,
                color: 'bg-heirlock-yellow',
                shadow: 'shadow-[10px_10px_0_0_#000]',
              },
              {
                title: 'Client-side secrecy',
                description: 'AES-256-GCM encryption runs entirely on your device. Plaintext never touches our servers. Zero-knowledge by design.',
                icon: Lock,
                color: 'bg-heirlock-blue',
                shadow: 'shadow-[10px_10px_0_0_#000]',
              },
              {
                title: 'Time is the root of trust',
                description: 'Blockchain time-locks enforce the exact moment a vault opens. Auditable forever. Tamper-proof by mathematics.',
                icon: Clock3,
                color: 'bg-heirlock-green',
                shadow: 'shadow-[10px_10px_0_0_#000]',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`flex flex-col border-4 border-black p-8 ${item.shadow} ${item.color} transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0_0_#000] group`}
              >
                <item.icon className="h-12 w-12 stroke-[2.5px] group-hover:scale-110 transition-transform" />
                <h3 className="mt-6 text-2xl font-black uppercase leading-tight">{item.title}</h3>
                <p className="mt-4 text-base font-bold text-black/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: THE TRUST STACK — vertical layers
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-black px-4 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <span className="inline-block border-2 border-heirlock-green px-4 py-1 text-xs font-black uppercase tracking-[0.25em] text-heirlock-green">
                The Security Stack
              </span>
              <h2 className="text-5xl font-black uppercase leading-[0.85] md:text-6xl lg:text-8xl tracking-tighter">
                How we secure
                <br />
                <span className="text-heirlock-green">the timeline.</span>
              </h2>
              <p className="max-w-md text-lg font-medium text-gray-400 leading-relaxed">
                A system built on the premise that keys should not exist until they are needed, and should never exist in a place where they can be stolen.
              </p>
              <div className="border-2 border-white/20 p-6">
                <p className="text-sm font-mono text-heirlock-yellow uppercase tracking-wider">
                  <Binary className="w-4 h-4 inline mr-2" />
                  Zero-knowledge architecture — your data is mathematically inaccessible to us.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {trustStack.map((layer) => (
                <div
                  key={layer.title}
                  className="relative group border-4 border-white bg-black p-8 transition-all hover:border-heirlock-green hover:-translate-y-1"
                >
                  <div className="absolute -left-2 -top-2 h-full w-full border-4 border-white/10 bg-transparent transition-all group-hover:border-heirlock-green/30" />
                  <div className="relative flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center border-4 border-white bg-black text-white group-hover:border-heirlock-green group-hover:text-heirlock-green transition-colors">
                      <layer.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-${layer.accent} block mb-1`}>
                        {layer.tag}
                      </span>
                      <h3 className="text-xl font-black uppercase tracking-wide text-white group-hover:text-heirlock-green transition-colors">{layer.title}</h3>
                      <p className="mt-2 font-mono text-sm leading-relaxed text-gray-400 group-hover:text-gray-200 transition-colors">
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


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: TECH SPECS GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-cream px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase mb-10 tracking-tight flex items-center gap-3">
            <Cpu className="w-8 h-8" />
            Technical Specifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-4 border-black">
            {techSpecs.map((spec, i) => (
              <div
                key={spec.label}
                className="p-6 border-b-4 border-r-4 border-black last:border-r-0 bg-white hover:bg-heirlock-yellow/30 transition-colors group text-center"
              >
                <spec.icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{spec.label}</p>
                <p className="text-sm font-black uppercase">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8: SECTORS / USE CASES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black px-4 py-20 md:px-8 md:py-28 bg-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl space-y-16 relative z-10">
          <div className="text-center">
            <span className="inline-block bg-black text-heirlock-yellow px-4 py-1 font-black uppercase text-xs tracking-[0.2em] mb-6 shadow-[4px_4px_0_0_#BAFFC9]">
              Mission Critical
            </span>
            <h2 className="text-5xl font-black uppercase md:text-7xl tracking-tighter">
              Sectors Deemed
              <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>Critical</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="group relative">
                <div className={`absolute inset-0 translate-x-4 translate-y-4 border-4 border-black ${pillar.color}`} />
                <div className="relative h-full border-4 border-black bg-white p-8 md:p-10 transition-all group-hover:-translate-y-2 group-hover:-translate-x-2">
                  <div className="mb-6 flex items-center justify-between">
                    <div className={`w-14 h-14 border-4 border-black ${pillar.color} flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                      <pillar.icon className="h-7 w-7" />
                    </div>
                    <span className="bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                      {pillar.title}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3">{pillar.subtitle}</h3>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9: PROCESS FLOW
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black px-4 py-20 md:px-8 md:py-28 bg-cream">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="inline-block bg-black text-white px-4 py-1 font-black uppercase text-xs tracking-[0.2em] mb-6">
              Operational Sequence
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              The Flow
            </h2>
          </div>

          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 border-4 border-black bg-white">
            {processSteps.map((step, i) => (
              <div
                key={step.title}
                className={`p-8 border-b-4 sm:border-b-4 lg:border-b-0 lg:border-r-4 border-black last:border-r-0 last:border-b-0 hover:bg-heirlock-green/10 transition-colors group relative`}
              >
                {/* Step tag */}
                <span className="text-5xl font-black text-black/10 absolute top-4 right-4 group-hover:text-black/20 transition-colors">
                  {step.tag}
                </span>

                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center border-4 border-black bg-black text-white group-hover:bg-heirlock-green group-hover:text-black transition-colors">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-3">{step.title}</h3>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 10: THE MANIFESTO STRIP
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-black text-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Why does this{' '}
                <span className="text-heirlock-yellow">matter</span>?
              </h2>
              <div className="space-y-4 text-gray-300 font-bold text-lg leading-relaxed">
                <p>
                  Every year, exam papers leak affecting millions. Tender bids are previewed by insiders. Legal evidence is tampered with before trial.
                </p>
                <p>
                  The common thread? <span className="text-white font-black">Humans in the loop.</span> People with access, with incentives, with pressure points.
                </p>
                <p>
                  TALA removes them all. The algorithm doesn&apos;t take bribes. The smart contract doesn&apos;t have a &quot;just this once&quot; button. The blockchain doesn&apos;t forget.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                'No admin can unlock early',
                'No server stores your keys',
                'No employee can peek at files',
                'No government can compel early access',
                'No hacker can bypass block.timestamp',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 border-2 border-white/20 p-4 hover:border-heirlock-green hover:bg-white/5 transition-all group">
                  <ShieldCheck className="w-5 h-5 text-heirlock-green shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase text-sm tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 11: FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-heirlock-pink px-4 py-20 md:px-8 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(0,0,0,0.03)_48%,rgba(0,0,0,0.03)_52%,transparent_52%)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              Ready to replace human error with mathematical certainty?
            </h2>
            <p className="text-xl font-bold text-black/70">
              Deploy your first vault in under 60 seconds. No subscription. No credit card. Connect your wallet and go.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/create-vault"
              className="group inline-flex items-center gap-3 border-4 border-black bg-black px-10 py-6 text-xl font-black uppercase text-heirlock-yellow shadow-[10px_10px_0_0_#FFF] transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0_0_#FFF]"
            >
              Deploy Vault
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Link>
            <Link
              href="/how-it-works"
              className="group inline-flex items-center gap-3 border-4 border-black bg-white px-10 py-6 text-xl font-black uppercase text-black shadow-[10px_10px_0_0_#000] transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0_0_#000]"
            >
              Read Documentation
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>


      {/* Marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </main>
  );
}
