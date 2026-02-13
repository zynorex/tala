'use client';

import { BookOpen, ChevronRight, Code, ExternalLink, FileText, Github, Layers, Lock, Shield, Zap } from "lucide-react";
import Link from "next/link";

const navEntries = [
  {
    title: "Platform overview",
    description: "What T.A.L.A. does, why it matters, and the principles behind the release guarantee.",
    icon: Layers,
    href: "/docs",
  },
  {
    title: "Developer quick start",
    description: "Set up your environment, deploy a vault, and test the unlock path in minutes.",
    icon: BookOpen,
    href: "/docs/quickstart",
  },
  {
    title: "Architecture and security",
    description: "Detailed view of client encryption, IPFS anchoring, and chain enforced timing.",
    icon: Shield,
    href: "/docs/architecture",
  },
  {
    title: "Contract reference",
    description: "Function catalog, error surfaces, and state model for TimeLockedVault.",
    icon: Code,
    href: "/docs/smart-contract",
  },
  {
    title: "API and web clients",
    description: "Guides for programmatic vault creation, webhook delivery, and client side helpers.",
    icon: FileText,
    href: "/docs/api",
  },
  {
    title: "Security posture",
    description: "Threat analysis, AES 256 design choices, and operational safeguards for exams and RFPs.",
    icon: Zap,
    href: "/docs/security",
  },
];

const featured = [
  {
    title: "Vault deployment guide",
    summary: "Create a vault, upload encrypted content, and publish the policy so stakeholders can verify it.",
    href: "/create-vault",
    cta: "Launch a vault",
  },
  {
    title: "Contract deep dive",
    summary: "Read the Solidity source, audit the unlock guard, and see how voiding destroys the key on chain.",
    href: "/docs/smart-contract",
    cta: "Review the contract",
  },
  {
    title: "Integration blueprint",
    summary: "Embed vault status in your product, surface CID checks to users, and stream unlock outcomes to logs.",
    href: "/docs/api",
    cta: "Follow the blueprint",
  },
];

const credibility = [
  {
    title: "Open source",
    copy: "Inspect the code, reuse components, and track changes as we harden the platform.",
    href: "https://github.com",
    icon: Github,
  },
  {
    title: "Cryptography first",
    copy: "Client side AES 256 with keys erased after upload. No server holds secrets.",
    href: "/docs/security",
    icon: Lock,
  },
  {
    title: "Proof oriented",
    copy: "Every action leaves an on chain trace so you can present evidence to auditors and regulators.",
    href: "/docs/architecture",
    icon: Shield,
  },
];

export default function Documentation() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b-4 border-black bg-heirlock-green px-6 py-16 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-black/70">Documentation</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">A single source for T.A.L.A. delivery</h1>
            <p className="max-w-3xl text-lg md:text-xl font-semibold text-black/90">
              Build, review, and operate with confidence. These resources give developers, security teams, and educators clear guidance without marketing fluff.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-black bg-black px-5 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Start building
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/smart-contract"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-black bg-white px-5 py-3 font-black text-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Review the contract
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Navigation</p>
              <h2 className="text-3xl md:text-4xl font-black">Pick the track that fits</h2>
              <p className="text-sm text-black/80">Curated entry points for builders, auditors, and program owners.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {navEntries.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-black/70">
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </div>
                  <p className="text-sm leading-relaxed text-black/80 flex-1">{item.description}</p>
                  <div className="flex items-center gap-2 text-sm font-black text-black">
                    Read now
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-heirlock-yellow px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/70">Featured guides</p>
              <h2 className="text-3xl md:text-4xl font-black">Go from concept to live run</h2>
              <p className="text-sm text-black/80">Follow these concise guides to ship a working release path.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal transition-transform hover:-translate-y-0.5"
              >
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="text-sm leading-relaxed text-black/80 flex-1">{item.summary}</p>
                <div className="flex items-center gap-2 text-sm font-black text-black">
                  {item.cta}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Assurance layer</p>
              <h2 className="text-3xl md:text-4xl font-black">Why teams rely on T.A.L.A.</h2>
              <p className="text-sm text-black/80">Every claim is backed by verifiable artifacts, not promises.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {credibility.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-heirlock-green p-6 shadow-brutal transition-transform hover:-translate-y-0.5"
                >
                  <Icon className="h-6 w-6" />
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-black/80 flex-1">{item.copy}</p>
                  <div className="flex items-center gap-2 text-sm font-black text-black">
                    Explore
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-heirlock-green">Need a direct path to help?</h2>
          <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
            Browse the FAQ for quick answers or reach support for architecture reviews, compliance questions, and launch preparation.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-heirlock-green bg-heirlock-green px-6 py-3 font-black text-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Visit FAQ
              <ChevronRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:support@usetala.in"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-heirlock-green bg-black px-6 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Contact support
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

