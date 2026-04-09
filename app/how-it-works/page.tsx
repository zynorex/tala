import type { Metadata } from 'next';
import {
  ArrowRight,
  Binary,
  Blocks,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  Eye,
  FileCode2,
  Fingerprint,
  Globe,
  Hash,
  KeyRound,
  Lock,
  Network,
  Radio,
  ScanEye,
  Server,
  Shield,
  ShieldCheck,
  ShieldHalf,
  Terminal,
  Timer,
  Unlock,
  Wallet,
  Zap,
  Layers,
  AlertTriangle,
  ArrowDown,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How T.A.L.A. Works — Protocol Mechanics',
  description:
    'Understand the inner workings of T.A.L.A. (Tamper Proof Automated Locking Algorithm) — browser-bound encryption, IPFS dispersion, and smart contract time-locks on Polygon.',
  alternates: { canonical: 'https://usetala.in/how-it-works' },
  openGraph: {
    title: 'How T.A.L.A. Works — Protocol Mechanics',
    description:
      'Browser-bound encryption routed through immutable chain infrastructure. No backdoors. No trust required.',
    url: 'https://usetala.in/how-it-works',
    siteName: 'T.A.L.A.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'How T.A.L.A. Works' }],
  },
};

export default function HowItWorks() {
  const createFlow = [
    {
      step: '01',
      title: 'Client-Side Encryption',
      summary: 'Before any data leaves your machine, T.A.L.A. encrypts your file entirely in-browser using military-grade cryptography.',
      bullets: [
        'AES-256-GCM encryption standard',
        'Zero-knowledge architecture',
        'Plaintext never touches servers',
        'Keys generated per vault session',
      ],
      icon: Lock,
      accent: 'bg-heirlock-pink',
      borderAccent: 'border-heirlock-pink',
    },
    {
      step: '02',
      title: 'Decentralized Dispersion',
      summary: 'The encrypted payload is distributed across a matrix of decentralized storage nodes for immutable persistence.',
      bullets: [
        'IPFS enterprise pinning via Pinata',
        'Content-addressed immutable CIDs',
        'Redundant global replication',
        'Hash integrity guarantee',
      ],
      icon: Network,
      accent: 'bg-heirlock-yellow',
      borderAccent: 'border-heirlock-yellow',
    },
    {
      step: '03',
      title: 'Smart Contract Lock',
      summary: 'A cryptographic time-lock condition is anchored to the Polygon network. The blockchain becomes the authority.',
      bullets: [
        'block.timestamp enforcement',
        'Immutable unlock epoch',
        'On-chain vault metadata',
        'No admin override exists',
      ],
      icon: FileCode2,
      accent: 'bg-heirlock-blue',
      borderAccent: 'border-heirlock-blue',
    },
  ];

  const openFlow = [
    {
      step: '01',
      title: 'Temporal Fulfillment',
      summary: 'The smart contract autonomously validates that the block timestamp has surpassed the unlock epoch.',
      bullets: [
        'Block-time verification',
        'Autonomous on-chain triggers',
        'Gas-optimized resolution',
        'Zero human intervention',
      ],
      icon: Radio,
      accent: 'bg-heirlock-green',
    },
    {
      step: '02',
      title: 'Access Authorization',
      summary: 'Once the temporal condition is met, the contract authorizes the vault owner to retrieve and decrypt the payload.',
      bullets: [
        'Contract state validation',
        'Owner address verification',
        'Decryption key required',
        'On-chain event emission',
      ],
      icon: KeyRound,
      accent: 'bg-heirlock-blue',
    },
    {
      step: '03',
      title: 'Local Decryption',
      summary: 'The encrypted payload is fetched from IPFS and decrypted entirely in the recipient\'s browser using their saved key.',
      bullets: [
        'Client-side AES decryption',
        'Integrity hash verification',
        'Immediate pristine access',
        'Key shredded after use',
      ],
      icon: Unlock,
      accent: 'bg-heirlock-pink',
    },
  ];

  const architectureLayers = [
    {
      layer: 'APPLICATION',
      tech: 'Next.js 15 + React',
      description: 'Server-rendered UI with client-side encryption engine. All crypto operations happen in your browser.',
      color: 'bg-heirlock-yellow',
      textColor: 'text-black',
    },
    {
      layer: 'ENCRYPTION',
      tech: 'AES-256-GCM',
      description: 'Military-grade symmetric encryption. Keys generated locally, never transmitted. Zero-knowledge by design.',
      color: 'bg-heirlock-pink',
      textColor: 'text-black',
    },
    {
      layer: 'STORAGE',
      tech: 'IPFS / Pinata',
      description: 'Content-addressed immutable storage. Encrypted data pinned across distributed nodes worldwide.',
      color: 'bg-heirlock-green',
      textColor: 'text-black',
    },
    {
      layer: 'CONSENSUS',
      tech: 'Polygon PoS',
      description: 'EVM-compatible L2 with sub-second finality. Time-lock conditions enforced by block.timestamp.',
      color: 'bg-heirlock-blue',
      textColor: 'text-black',
    },
    {
      layer: 'CONTRACT',
      tech: 'Solidity 0.8+',
      description: 'Immutable smart contracts gate every unlock. No override functions. No admin keys. Code is law.',
      color: 'bg-black',
      textColor: 'text-white',
    },
  ];

  const guarantees = [
    { icon: ShieldCheck, label: 'No admin can unlock early', detail: 'Smart contracts have no override function' },
    { icon: Eye, label: 'No server can read your files', detail: 'Zero-knowledge encryption by design' },
    { icon: Fingerprint, label: 'No key escrow exists', detail: 'Keys generated and used client-side only' },
    { icon: Hash, label: 'No data can be altered', detail: 'IPFS content-addressing guarantees integrity' },
    { icon: Timer, label: 'No time manipulation', detail: 'block.timestamp is consensus-validated' },
    { icon: ScanEye, label: 'Every action is auditable', detail: 'Full on-chain provenance trail' },
  ];

  return (
    <main className="min-h-screen bg-cream text-black selection:bg-black selection:text-heirlock-yellow">

      {/* ═══════════════════════════════════════════════════════════════════
          TICKER
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-b-8 border-black bg-black text-white overflow-hidden mt-16 md:mt-20">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap py-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-6">
              <Cpu className="w-4 h-4 mr-2 text-heirlock-green" />
              <span className="font-black tracking-[0.2em] uppercase text-xs">
                PROTOCOL MECHANICS // AES-256-GCM // IPFS DISPERSAL // POLYGON CONSENSUS // ZERO KNOWLEDGE //
              </span>
            </div>
          ))}
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-b-8 border-black px-4 py-20 md:px-8 md:py-28 overflow-hidden bg-cream">
        {/* Grid pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        </div>
        {/* Accent shapes */}
        <div className="absolute top-8 right-8 w-64 h-64 bg-heirlock-pink border-8 border-black rounded-full mix-blend-multiply opacity-30 blur-xl pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 w-96 h-48 bg-heirlock-blue border-8 border-black mix-blend-multiply opacity-20 blur-lg pointer-events-none hidden lg:block"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col gap-6">
            {/* Tag */}
            <div className="relative inline-block max-w-fit">
              <div className="absolute -right-3 -top-3 h-full w-full bg-heirlock-pink border-4 border-black"></div>
              <span className="relative inline-block bg-white text-black border-4 border-black px-5 py-2 font-black uppercase text-sm tracking-[0.2em] shadow-[4px_4px_0_0_#000]">
                <Terminal className="w-4 h-4 inline mr-2 -mt-0.5" />
                Protocol Mechanics
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-black text-black uppercase tracking-tighter leading-[0.85] mb-4">
              How{' '}
              <span className="relative inline-block">
                T.A.L.A.
                <span className="absolute -bottom-2 left-0 w-full h-5 bg-heirlock-yellow -z-10 border-2 border-black"></span>
              </span>
              <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '3px black' }}>
                Operates.
              </span>
            </h1>

            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] mt-4">
              <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] leading-relaxed">
                Browser-bound encryption routed through immutable chain infrastructure. Your files are encrypted before they leave your device, stored on IPFS, and locked by smart contracts on Polygon. <span className="font-black">No backdoors. No trust required.</span>
              </p>

              <div className="flex flex-col gap-4 justify-end">
                <Link
                  href="/create-vault"
                  className="group flex items-center gap-3 border-4 border-black bg-black px-8 py-5 text-lg font-black uppercase text-heirlock-yellow shadow-[8px_8px_0_0_#BAFFC9] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#BAFFC9]"
                >
                  Deploy a Vault
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
                <Link
                  href="/about"
                  className="group flex items-center gap-3 border-4 border-black bg-white px-8 py-5 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
                >
                  About the Protocol
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          HIGH-LEVEL FLOW VISUAL — 3 mega-steps
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-black text-white px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block border-2 border-heirlock-green px-4 py-1 text-xs font-black uppercase tracking-[0.3em] text-heirlock-green mb-6">
              The Big Picture
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter">
              Encrypt → Lock → Unlock
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-white">
            {[
              {
                num: '01',
                title: 'ENCRYPT',
                subtitle: 'In Your Browser',
                desc: 'Files are encrypted with AES-256-GCM entirely on your device. The plaintext never leaves your machine.',
                icon: Lock,
                color: 'text-heirlock-pink',
                borderColor: 'border-heirlock-pink',
              },
              {
                num: '02',
                title: 'LOCK',
                subtitle: 'On The Blockchain',
                desc: 'Encrypted data is pinned to IPFS and a time-lock smart contract is deployed on Polygon with your unlock epoch.',
                icon: Blocks,
                color: 'text-heirlock-yellow',
                borderColor: 'border-heirlock-yellow',
              },
              {
                num: '03',
                title: 'UNLOCK',
                subtitle: 'When Time Arrives',
                desc: 'When block.timestamp passes your unlock time, the vault opens. You decrypt locally with your saved key.',
                icon: Unlock,
                color: 'text-heirlock-green',
                borderColor: 'border-heirlock-green',
              },
            ].map((item, i) => (
              <div
                key={item.num}
                className={`p-8 md:p-10 border-b-4 md:border-b-0 md:border-r-4 border-white last:border-r-0 last:border-b-0 group hover:bg-white/5 transition-colors relative`}
              >
                <span className="text-7xl font-black text-white/10 absolute top-4 right-4 group-hover:text-white/20 transition-colors">
                  {item.num}
                </span>
                <div className="relative z-10">
                  <div className={`w-16 h-16 border-4 ${item.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-black uppercase mb-2 ${item.color}`}>{item.title}</h3>
                  <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-4">{item.subtitle}</p>
                  <p className="text-base font-bold text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          PHASE 0A: SEAL & ANCHOR — detailed create flow
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 border-b-8 border-black bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#CCC_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
        <div className="mx-auto max-w-7xl relative z-10">
          {/* Section header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-8 border-black pb-8 mb-12">
            <div>
              <span className="inline-block bg-heirlock-yellow text-black border-4 border-black px-4 py-2 font-black uppercase text-sm tracking-[0.2em] shadow-[4px_4px_0_0_#000] mb-6">
                PHASE_0A // ORIGINATION
              </span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                Seal &<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>Anchor</span>
              </h2>
            </div>
            <div className="border-4 border-black bg-black text-white px-6 py-4 font-bold text-lg shadow-[8px_8px_0_0_#FFB3BA] -rotate-2 max-w-sm uppercase">
              &quot;Trustless cryptography operating directly in-browser. Zero server trust.&quot;
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {createFlow.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={`relative flex flex-col gap-6 border-4 border-black ${step.accent} p-8 shadow-[10px_10px_0_0_#000] hover:shadow-[14px_14px_0_0_#000] hover:-translate-y-3 transition-all group`}
                >
                  <div className="flex items-center justify-between border-b-4 border-black pb-4">
                    <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Icon className="h-8 w-8 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-5xl font-black text-black/20 group-hover:text-black/40 transition-colors">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-tight">{step.title}</h3>
                  <p className="text-base font-bold flex-1 text-black/70">{step.summary}</p>
                  <ul className="space-y-3 mt-2 border-t-4 border-black border-dashed pt-4">
                    {step.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 shrink-0 mt-1" strokeWidth={3} />
                        <span className="font-bold text-sm leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SMART CONTRACT TERMINAL — code display
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 border-b-8 border-black bg-cream overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-block bg-black text-heirlock-green px-4 py-1 font-black uppercase text-xs tracking-[0.2em] mb-4 shadow-[4px_4px_0_0_#BAFFC9]">
                Smart Contract Logic
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">The Code That Guards Your Vault</h2>
            </div>
            <div className="border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] max-w-xs">
              <p className="text-sm font-bold text-gray-700">
                <AlertTriangle className="w-4 h-4 inline mr-1 -mt-0.5 text-black" />
                No override function exists. The <code className="bg-gray-100 px-1 font-mono">require()</code> check is absolute.
              </p>
            </div>
          </div>

          <div className="border-4 border-black bg-[#0a0a0a] shadow-[12px_12px_0_0_#000] overflow-hidden">
            {/* Terminal title bar */}
            <div className="flex items-center gap-3 border-b-4 border-[#222] px-6 py-4 bg-[#111]">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-heirlock-pink border-2 border-black"></div>
                <div className="w-4 h-4 rounded-full bg-heirlock-yellow border-2 border-black"></div>
                <div className="w-4 h-4 rounded-full bg-heirlock-green border-2 border-black"></div>
              </div>
              <div className="flex-1 text-center font-black text-[#555] tracking-widest text-xs uppercase">
                ~/contracts/TalaVault.sol
              </div>
              <div className="text-[10px] font-mono text-heirlock-green tracking-wider">SOLIDITY 0.8+</div>
            </div>
            {/* Code content */}
            <div className="p-6 md:p-10 font-mono text-sm md:text-base leading-[2] text-[#00ff41] overflow-x-auto">
              <div className="text-[#555] mb-2">{'// TALA Vault — Time-Lock Enforcement'}</div>
              <div>
                <span className="text-heirlock-pink">function</span>{' '}
                <span className="text-white">unlockVault</span>
                {'('}
                <span className="text-heirlock-blue">uint256</span>{' '}
                <span className="text-gray-400">vaultId</span>
                {') '}
                <span className="text-heirlock-pink">external</span>{' '}
                <span className="text-heirlock-yellow">returns</span>
                {' ('}
                <span className="text-white">bytes32</span>
                {') {'}
              </div>
              <div className="ml-6">
                <span className="text-gray-600">{'// Load vault from on-chain storage'}</span>
              </div>
              <div className="ml-6">
                {'Vault '}
                <span className="text-heirlock-pink">memory</span>
                {' v = vaults[vaultId];'}
              </div>
              <br />
              <div className="ml-6">
                <span className="text-gray-600">{'// ENFORCE TEMPORAL LOCK — no override exists'}</span>
              </div>
              <div className="ml-6">
                <span className="text-heirlock-pink">require</span>
                {'('}
                <span className="text-white">block.timestamp</span>
                {' >= v.unlockTime,'}
              </div>
              <div className="ml-12">
                <span className="text-heirlock-yellow">&quot;ERR_VAULT_STILL_SEALED&quot;</span>
                {');'}
              </div>
              <br />
              <div className="ml-6">
                <span className="text-gray-600">{'// EMIT ON-CHAIN AUDIT EVENT'}</span>
              </div>
              <div className="ml-6">
                <span className="text-heirlock-blue">emit</span>
                {' VaultUnlocked(vaultId, msg.sender);'}
              </div>
              <br />
              <div className="ml-6">
                <span className="text-heirlock-pink">return</span>
                {' v.contentHash;'}
              </div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          PHASE 0B: TRIGGER & ASSEMBLY — unlock flow
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 border-b-8 border-black bg-white relative">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-8 border-black pb-8 mb-12">
            <div>
              <span className="inline-block bg-heirlock-blue text-black border-4 border-black px-4 py-2 font-black uppercase text-sm tracking-[0.2em] shadow-[4px_4px_0_0_#000] mb-6">
                PHASE_0B // RESOLUTION
              </span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                Trigger &<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>Assembly</span>
              </h2>
            </div>
            <div className="border-4 border-black bg-cream p-6 shadow-[8px_8px_0_0_#000] max-w-sm rotate-1">
              <p className="font-bold text-lg uppercase leading-tight">
                When the timestamp arrives, the contract opens. You decrypt locally with your saved key.
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {openFlow.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step + step.title}
                  className={`relative flex flex-col gap-6 border-4 border-black ${step.accent} p-8 shadow-[10px_10px_0_0_#000] hover:shadow-[14px_14px_0_0_#000] hover:-translate-y-3 transition-all group`}
                >
                  <div className="flex items-center justify-between border-b-4 border-black pb-4">
                    <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center group-hover:-rotate-12 transition-transform">
                      <Icon className="h-8 w-8 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-5xl font-black text-black/20 group-hover:text-black/40 transition-colors">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-tight">{step.title}</h3>
                  <p className="text-base font-bold flex-1 text-black/70">{step.summary}</p>
                  <ul className="space-y-3 mt-2 border-t-4 border-black border-dashed pt-4">
                    {step.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-1 text-black" strokeWidth={3} />
                        <span className="font-bold text-sm leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          ARCHITECTURE STACK — layered system view
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-black text-white px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <span className="inline-block border-2 border-heirlock-green px-4 py-1 text-xs font-black uppercase tracking-[0.3em] text-heirlock-green">
                System Architecture
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                The Stack
                <br />
                <span className="text-heirlock-green">Dissected.</span>
              </h2>
              <p className="text-lg font-medium text-gray-400 max-w-md leading-relaxed">
                Five layers of defense between your data and any adversary. Each layer is independently verifiable and operates with zero trust in the layers above it.
              </p>
              <div className="border-2 border-white/20 p-6">
                <p className="text-sm font-mono text-heirlock-yellow uppercase tracking-wider">
                  <Binary className="w-4 h-4 inline mr-2" />
                  Every layer is open source and independently auditable.
                </p>
              </div>
            </div>

            {/* Stack visualization */}
            <div className="flex flex-col gap-0">
              {architectureLayers.map((layer, i) => (
                <div
                  key={layer.layer}
                  className={`${layer.color} ${layer.textColor} p-6 border-4 border-black -mt-1 first:mt-0 hover:-translate-x-2 transition-transform group relative`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Layer {String(i).padStart(2, '0')}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${layer.color === 'bg-black' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                          {layer.tech}
                        </span>
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-wide mb-1">{layer.layer}</h3>
                      <p className="text-sm font-bold opacity-70 leading-relaxed">{layer.description}</p>
                    </div>
                    <Layers className="w-6 h-6 shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          SECURITY GUARANTEES — 6 iron-clad promises
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-heirlock-yellow px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-black text-heirlock-yellow px-4 py-1 font-black uppercase text-xs tracking-[0.2em] mb-6 shadow-[4px_4px_0_0_#FFF]">
              Iron Guarantees
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              What We Guarantee
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-4 border-black bg-white">
            {guarantees.map((g, i) => (
              <div
                key={g.label}
                className="p-8 border-b-4 border-r-4 border-black last:border-r-0 hover:bg-heirlock-green/10 transition-colors group"
              >
                <g.icon className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
                <h3 className="text-lg font-black uppercase mb-2 leading-tight">{g.label}</h3>
                <p className="text-sm font-bold text-gray-600">{g.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          COMPARISON — TALA vs Traditional
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b-8 border-black bg-white px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-black text-white px-4 py-1 font-black uppercase text-xs tracking-[0.2em] mb-6 shadow-[4px_4px_0_0_#BAFFC9]">
              Paradigm Shift
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Old World vs.{' '}
              <span className="relative inline-block">
                TALA
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-heirlock-green -z-10 border-2 border-black"></span>
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-0 border-4 border-black">
            {/* OLD */}
            <div className="bg-gray-100 p-8 md:p-12 border-b-4 md:border-b-0 md:border-r-4 border-black">
              <h3 className="text-2xl font-black uppercase mb-8 text-gray-400 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 border-4 border-black flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                </div>
                Traditional Systems
              </h3>
              <ul className="space-y-5">
                {[
                  'Admins have master keys',
                  'Servers store plaintext',
                  'Unlock time can be overridden',
                  'Trust-based access control',
                  'Audit trails can be deleted',
                  'Insider threats possible',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-500 font-bold">
                    <span className="w-6 h-6 border-2 border-gray-400 text-gray-400 flex items-center justify-center shrink-0 text-xs font-black mt-0.5">✕</span>
                    <span className="line-through">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TALA */}
            <div className="bg-black text-white p-8 md:p-12">
              <h3 className="text-2xl font-black uppercase mb-8 text-heirlock-green flex items-center gap-3">
                <div className="w-10 h-10 bg-heirlock-green border-4 border-heirlock-green flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-black" />
                </div>
                T.A.L.A. Protocol
              </h3>
              <ul className="space-y-5">
                {[
                  'Zero admin access by design',
                  'Client-side encryption only',
                  'block.timestamp is immutable',
                  'Cryptographic access control',
                  'On-chain permanent audit log',
                  'Mathematically impossible',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-bold">
                    <span className="w-6 h-6 bg-heirlock-green text-black flex items-center justify-center shrink-0 text-xs font-black mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-heirlock-pink px-4 py-20 md:px-8 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(0,0,0,0.03)_48%,rgba(0,0,0,0.03)_52%,transparent_52%)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
              Execute
              <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>Command.</span>
            </h2>
            <p className="text-xl font-bold text-black/70 max-w-lg">
              Now you know how it works. Deploy your first vault and experience the protocol firsthand. No trust required.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/create-vault"
              className="group inline-flex items-center gap-3 border-4 border-black bg-black px-10 py-6 text-xl font-black uppercase text-heirlock-yellow shadow-[10px_10px_0_0_#FFF] transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0_0_#FFF]"
            >
              Deploy Vault
              <Zap className="h-6 w-6 transition-transform group-hover:scale-110" />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 border-4 border-black bg-white px-10 py-6 text-xl font-black uppercase text-black shadow-[10px_10px_0_0_#000] transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0_0_#000]"
            >
              Learn More
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
