import type { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Clock3,
  SignalHigh,
  Eye,
  Sparkles,
  Globe2,
  LineChart,
  Target,
  BookOpen,
  Briefcase,
  Gavel,
  ChevronRight,
  ArrowRight,
  ShieldHalf,
  Layers3,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "T.A.L.A. | About",
  description: "Tamper-proof Automated Locking Algorithm for exams, tenders, and evidence—built on smart contracts, client-side encryption, and auditable unlocks.",
  alternates: { canonical: "https://usetala.in/about" },
  openGraph: {
    title: "T.A.L.A. | About",
    description: "Trust is Code: cryptographic time-locks replacing human trust for education, governance, and legal workflows.",
    url: "https://usetala.in/about",
    siteName: "T.A.L.A.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About T.A.L.A.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.A.L.A. | About",
    description: "Trust is Code: cryptographic time-locks replacing human trust for education, governance, and legal workflows.",
    images: ["/opengraph-image"],
    creator: "@usetala",
  },
};

export default function About() {
  const highlights = [
    {
      title: "Mathematics replaces discretion",
      description: "Smart contracts gate every unlock. No override buttons. No admin backdoors.",
      icon: ShieldCheck,
    },
    {
      title: "Client-side secrecy",
      description: "AES-256 encryption runs on your device. Plaintext never touches our servers.",
      icon: Lock,
    },
    {
      title: "Time is the root of trust",
      description: "Blockchain time-locks enforce the exact moment a vault opens—auditable forever.",
      icon: Clock3,
    },
  ];

  const proofPoints = [
    { label: "Admin overrides", value: "0", caption: "Design forbids early access" },
    { label: "Latency to unlock", value: "<12s", caption: "Bounded by block finality" },
    { label: "Surface area", value: "Minimal", caption: "Keys never sit on servers" },
    { label: "Audit trail", value: "On-chain", caption: "Every unlock is provable" },
  ];

  const trustStack = [
    {
      title: "Edge Encryption",
      description: "Keys generated per vault, derived and used locally, shredded after encrypting.",
      icon: KeyRound,
      tone: "from-heirlock-green/80 via-white to-heirlock-blue/70",
    },
    {
      title: "Immutable Storage",
      description: "Ciphertext stored on IPFS through enterprise gateways; hashes guarantee integrity.",
      icon: Globe2,
      tone: "from-heirlock-blue/70 via-white to-heirlock-yellow/80",
    },
    {
      title: "Time-Lock Contract",
      description: "Polygon smart contracts release keys only when block.timestamp meets policy.",
      icon: ShieldHalf,
      tone: "from-heirlock-yellow/80 via-white to-heirlock-pink/70",
    },
  ];

  const pillars = [
    {
      title: "Education",
      subtitle: "Leak-proof exam delivery",
      description: "Universities and boards release papers at the same second for millions of students, without trusting intermediaries.",
      icon: BookOpen,
      accent: "bg-heirlock-green",
    },
    {
      title: "Governance",
      subtitle: "Sealed tenders that stay sealed",
      description: "Bids stay cryptographically locked until the opening ceremony—no preferential peeks.",
      icon: Briefcase,
      accent: "bg-heirlock-yellow",
    },
    {
      title: "Justice",
      subtitle: "Evidence that cannot be coerced",
      description: "Whistleblower dossiers and wills stay inaccessible until the lawful moment, immune to pressure or compromise.",
      icon: Gavel,
      accent: "bg-heirlock-pink",
    },
  ];

  const differentiators = [
    {
      title: "Zero-knowledge handling",
      description: "We never see plaintext or keys. The protocol is architected to keep us blind by default.",
      icon: Eye,
    },
    {
      title: "Observable security",
      description: "Unlock proofs are on-chain and queryable. Trust is inspectable, not implied.",
      icon: Target,
    },
    {
      title: "Operational resilience",
      description: "IPFS redundancy, wallet-based auth, and multi-region relays keep unlocks available when you need them.",
      icon: SignalHigh,
    },
    {
      title: "Enterprise governance",
      description: "Role-based flows, audit-grade logs, and compliance-ready reports for regulators and boards.",
      icon: LineChart,
    },
  ];

  const process = [
    {
      title: "Model the risk",
      body: "Map who could access the asset today and when they should not. TALA locks those windows mathematically.",
      icon: Target,
    },
    {
      title: "Encrypt at source",
      body: "Files are encrypted locally. Only ciphertext is uploaded to the vault and pinned across IPFS.",
      icon: Layers3,
    },
    {
      title: "Set the unlock moment",
      body: "Smart contracts enforce the exact block-time the key can be claimed. No manual approvals exist.",
      icon: Clock3,
    },
    {
      title: "Deliver with proofs",
      body: "Recipients verify the contract state and download. Every action leaves an auditable trail.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-cream text-black">
      <section className="relative overflow-hidden px-6 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-heirlock-green via-white to-heirlock-blue opacity-80" />
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute -left-16 bottom-10 h-52 w-52 rounded-full bg-heirlock-pink/30 blur-2xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
          <div className="space-y-6 md:w-3/5">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 shadow-brutal">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">About TALA</span>
            </div>
            <h1 className="text-4xl leading-tight font-black md:text-6xl">
              Trust Automation Layer for India’s high-stakes secrets.
            </h1>
            <p className="max-w-2xl text-lg font-semibold md:text-xl">
              TALA is a cryptographic time-lock protocol that removes human discretion from the moment a file can be opened. Exams, tenders, evidence—released exactly when the blockchain says so.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/create-vault" className="inline-flex w-full sm:w-auto justify-center rounded-xl border-3 border-black bg-black px-6 py-3 text-white font-black shadow-brutal transition-transform hover:-translate-y-0.5">
                Create a vault
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/documentation" className="inline-flex w-full sm:w-auto justify-center rounded-xl border-3 border-black bg-white px-6 py-3 font-black shadow-brutal transition-transform hover:-translate-y-0.5">
                View architecture
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:max-w-lg">
              {proofPoints.map((item) => (
                <div key={item.label} className="rounded-xl border-3 border-black bg-white/80 p-4 shadow-brutal">
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                  <p className="mt-2 text-xs text-gray-700">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-2/5">
            <div className="grid gap-4">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="relative overflow-hidden rounded-2xl border-3 border-black bg-white p-6 shadow-brutal"
                  >
                    <div className="absolute right-4 top-4 text-black/10 text-6xl font-black leading-none">0{idx + 1}</div>
                    <div className="mb-4 inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-black">
                      <Icon className="mr-2 h-4 w-4" />
                      Signal
                    </div>
                    <h3 className="text-xl font-black mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-800 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black">Why we exist</h2>
            <p className="text-lg font-semibold text-gray-900">
              In every high-stakes workflow there is a moment where someone could open the file too early. TALA removes that possibility with math, not policy.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border-2 border-black bg-heirlock-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">No backdoors</span>
              <span className="rounded-full border-2 border-black bg-heirlock-green px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">Audit-first</span>
              <span className="rounded-full border-2 border-black bg-heirlock-pink px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">Time-bound</span>
            </div>
          </div>

          <div className="md:w-1/2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {differentiators.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border-3 border-black bg-cream p-4 shadow-brutal">
                  <Icon className="h-6 w-6" />
                  <h3 className="mt-3 text-lg font-black">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-black">The trust stack</h2>
              <p className="text-sm font-semibold text-gray-800">Three layers lock every vault: edge encryption, immutable storage, on-chain time-lock.</p>
            </div>
            <Link href="/documentation" className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white shadow-brutal">
              Deep dive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustStack.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.title}
                  className="relative overflow-hidden rounded-2xl border-3 border-black bg-white p-6 shadow-brutal"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${layer.tone} opacity-70`} />
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-black p-2 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-black/70">Layer</span>
                    </div>
                    <h3 className="text-2xl font-black">{layer.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-900">{layer.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-black bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-heirlock-green">Sectors we secure</p>
              <h2 className="text-3xl md:text-4xl font-black">One protocol, three missions</h2>
            </div>
            <div className="rounded-full border-2 border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Designed for scale
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="relative overflow-hidden rounded-2xl border-3 border-white bg-white/5 p-6 shadow-brutal">
                  <div className="absolute inset-0 opacity-15" />
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full ${pillar.accent} px-3 py-1 text-xs font-black uppercase tracking-[0.15em] border-2 border-black`}> 
                    <Icon className="h-4 w-4" />
                    {pillar.title}
                  </div>
                  <h3 className="text-2xl font-black text-white">{pillar.subtitle}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/90">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-black">Proof over promises</h2>
              <p className="text-sm font-semibold text-gray-800">Every unlock is observable. Every guarantee is measurable.</p>
            </div>
            <div className="rounded-xl border-3 border-black bg-heirlock-yellow px-4 py-3 text-sm font-black shadow-brutal">
              On-chain transparency → zero discretionary access
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {proofPoints.map((point) => (
              <div key={point.label} className="rounded-xl border-3 border-black bg-cream p-4 shadow-brutal">
                <div className="text-3xl font-black leading-none">{point.value}</div>
                <div className="text-sm font-semibold text-gray-900">{point.label}</div>
                <p className="mt-2 text-xs text-gray-700 leading-relaxed">{point.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-black bg-heirlock-blue px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/70">Deployment pattern</p>
              <h2 className="text-3xl md:text-4xl font-black text-black">How institutions ship with TALA</h2>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white shadow-brutal">
              Talk to us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {process.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative overflow-hidden rounded-2xl border-3 border-black bg-white p-5 shadow-brutal">
                  <div className="absolute right-3 top-3 text-black/10 text-4xl font-black">0{idx + 1}</div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-white">
                    <Icon className="h-4 w-4" />
                    Step
                  </div>
                  <h3 className="mt-4 text-xl font-black text-black">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-900">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-black bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">Ready to anchor trust in code?</h2>
          <p className="text-sm md:text-base font-semibold text-white/80 max-w-3xl mx-auto">
            Deploy TALA across your institution and turn policy into cryptography. We will co-design your rollout, model your risk, and stand up verifiable unlocks without backdoors.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/create-vault" className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-white bg-white px-6 py-3 font-black text-black shadow-brutal transition-transform hover:-translate-y-0.5">
              Launch a vault
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-white bg-transparent px-6 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5">
              Speak with the team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

