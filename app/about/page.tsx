import type { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Clock3,
  SignalHigh,
  Sparkles,
  Globe2,
  Target,
  BookOpen,
  Briefcase,
  Gavel,
  ChevronRight,
  ArrowRight,
  ShieldHalf,
  Layers3,
  PenLine,
  BadgeCheck,
  Radio,
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
  const signals = [
    {
      title: "No override culture",
      text: "There is no super-admin. Keys are born on the client and shredded after use.",
      icon: ShieldCheck,
    },
    {
      title: "Visible guarantees",
      text: "Unlocks are observable on-chain. Auditors verify, not trust.",
      icon: Radio,
    },
    {
      title: "Time-bound by math",
      text: "Block time dictates availability. Human calendars do not.",
      icon: Clock3,
    },
    {
      title: "Smallest possible surface",
      text: "No passwords to steal. Wallet-based identity and minimal API exposure.",
      icon: SignalHigh,
    },
  ];

  const steps = [
    {
      label: "Model",
      title: "Map who must never see the file early",
      detail: "We catalog every human touchpoint and eliminate discretionary access windows.",
      icon: Target,
    },
    {
      label: "Encrypt",
      title: "Lock at the edge with per-vault keys",
      detail: "Keys derive in-browser, encrypt locally, and never leave the user’s device in the clear.",
      icon: KeyRound,
    },
    {
      label: "Anchor",
      title: "Seal to IPFS and on-chain time-locks",
      detail: "Ciphertext pins to IPFS; the decryption key sits behind a Polygon contract until block conditions are met.",
      icon: ShieldHalf,
    },
    {
      label: "Prove",
      title: "Release with verifiable state",
      detail: "Recipients verify contract state, pull the key, and decrypt—every action leaves a proof trail.",
      icon: BadgeCheck,
    },
  ];

  const sectors = [
    {
      title: "Education",
      headline: "Leak-proof exam delivery",
      copy: "National boards release papers at the same second for millions—no invigilator discretion required.",
      icon: BookOpen,
      tone: "bg-heirlock-green",
    },
    {
      title: "Governance",
      headline: "Sealed tenders that stay sealed",
      copy: "Bids stay locked until opening. No quiet peeks, no favoritism, no ‘lost’ envelopes.",
      icon: Briefcase,
      tone: "bg-heirlock-yellow",
    },
    {
      title: "Justice",
      headline: "Evidence that cannot be coerced",
      copy: "Whistleblower dossiers and wills remain inaccessible until the lawful moment, immune to pressure.",
      icon: Gavel,
      tone: "bg-heirlock-pink",
    },
  ];

  const operational = [
    {
      title: "Edge-first encryption",
      detail: "Plaintext never traverses our servers. Keys exist only long enough to encrypt and decrypt."},
    {
      title: "Deterministic unlocks",
      detail: "If block.timestamp < policy, the key is unreachable. No emails, no approvals, just math."},
    {
      title: "Verifiable delivery",
      detail: "Users can query the contract, inspect the state, and download with confidence."},
    {
      title: "Audit-ready events",
      detail: "Every unlock emits traceable events; regulators and boards can replay history on-chain."},
  ];

  return (
    <main className="min-h-screen bg-cream text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white px-6 py-16 md:py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
          <div className="space-y-6 lg:w-3/5">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-heirlock-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-brutal">
              <Sparkles className="h-4 w-4" />
              Hand-built protocol
            </div>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Human-led cryptography for moments that cannot fail.
            </h1>
            <p className="max-w-2xl text-lg font-semibold md:text-xl">
              TALA removes discretion from the exact second a file can open. No backdoors, no “just this once” overrides—only verifiable unlocks enforced by time and math.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/create-vault" className="inline-flex w-full sm:w-auto justify-center rounded-xl border-3 border-black bg-black px-6 py-3 text-white font-black shadow-brutal transition-transform hover:-translate-y-0.5">
                Create a vault
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/documentation" className="inline-flex w-full sm:w-auto justify-center rounded-xl border-3 border-black bg-white px-6 py-3 font-black shadow-brutal transition-transform hover:-translate-y-0.5">
                Read the protocol
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:max-w-xl">
              {signals.slice(0, 2).map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.title} className="rounded-xl border-3 border-black bg-cream p-4 shadow-brutal">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                      <Icon className="h-4 w-4" />
                      {signal.title}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-900">{signal.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:w-2/5">
            <div className="rounded-2xl border-3 border-black bg-black p-6 text-white shadow-brutal">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-heirlock-green">TALA Guarantee</span>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-2xl font-black">No one can open it early</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                We design out temptation. Keys never touch our servers, unlocks are on-chain, and the protocol leaves no admin knobs to twist.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                  <div className="text-lg font-black text-heirlock-green">0</div>
                  <p className="text-xs text-white/80">Override pathways</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                  <div className="text-lg font-black text-heirlock-green">On-chain</div>
                  <p className="text-xs text-white/80">Unlock attestations</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                  <div className="text-lg font-black text-heirlock-green">Edge</div>
                  <p className="text-xs text-white/80">Encryption origin</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                  <div className="text-lg font-black text-heirlock-green">Minutes</div>
                  <p className="text-xs text-white/80">To start deploying</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-cream px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
          <div className="lg:w-1/3 space-y-4">
            <h2 className="text-3xl font-black">Not a promise. A guarantee.</h2>
            <p className="text-sm font-semibold text-gray-900">
              We replace policy with cryptography. Every claim here is tied to how the protocol is built, not how we wish humans would behave.
            </p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {signals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.title} className="rounded-xl border-3 border-black bg-white p-4 shadow-brutal">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">
                    <Icon className="h-4 w-4" />
                    {signal.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-900">{signal.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/70">How TALA works</p>
              <h2 className="text-3xl md:text-4xl font-black">Time-locking a secret without backdoors</h2>
            </div>
            <Link href="/documentation" className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white shadow-brutal">
              See the flow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex gap-4 rounded-2xl border-3 border-black bg-cream p-5 shadow-brutal">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white font-black">0{idx + 1}</div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-black/70">
                      <Icon className="h-4 w-4" />
                      {step.label}
                    </div>
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-900">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-heirlock-green">Where it runs today</p>
              <h2 className="text-3xl md:text-4xl font-black">One protocol, real-world use</h2>
            </div>
            <div className="rounded-full border-2 border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Built for scrutiny
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div key={sector.title} className="relative overflow-hidden rounded-2xl border-3 border-white bg-white/5 p-6 shadow-brutal">
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full ${sector.tone} px-3 py-1 text-xs font-black uppercase tracking-[0.15em] border-2 border-black text-black`}>
                    <Icon className="h-4 w-4" />
                    {sector.title}
                  </div>
                  <h3 className="text-2xl font-black text-white">{sector.headline}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white">{sector.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/70">Operational posture</p>
              <h2 className="text-3xl md:text-4xl font-black">How we keep humans out of the loop</h2>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white shadow-brutal">
              Talk to engineering
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {operational.map((item) => (
              <div key={item.title} className="flex gap-3 rounded-2xl border-3 border-black bg-cream p-5 shadow-brutal">
                <div className="mt-1 h-8 w-1 rounded-full bg-black" />
                <div className="space-y-1">
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-900">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border-4 border-black bg-white p-8 shadow-brutal">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-heirlock-pink px-3 py-1 text-xs font-black uppercase tracking-[0.15em]">
            <PenLine className="h-4 w-4" />
            From the team
          </div>
          <h2 className="text-3xl font-black">Why we built TALA this way</h2>
          <p className="text-base leading-relaxed text-gray-900">
            We have shipped products in environments where “just this once” was the root cause. TALA exists to remove that temptation. The protocol is intentionally minimal, intentionally verifiable, and intentionally stubborn about who can open a file and when. If someone pressures you to break the rules, the system simply won’t comply.
          </p>
          <p className="text-base leading-relaxed text-gray-900">
            This is our commitment: the math wins over the human every single time. If that sounds rigid, it is—because fairness, procurement integrity, and evidence safety demand it.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm font-black text-black/80">
            <span className="rounded-full border-2 border-black bg-heirlock-green px-3 py-1">Built in India</span>
            <span className="rounded-full border-2 border-black bg-heirlock-yellow px-3 py-1">Protocol-first</span>
            <span className="rounded-full border-2 border-black bg-heirlock-blue px-3 py-1">Auditable by design</span>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-black bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">Ready to anchor trust in code?</h2>
          <p className="text-sm md:text-base font-semibold text-white/85 max-w-3xl mx-auto">
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

