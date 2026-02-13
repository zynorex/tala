import { ArrowRight, BookOpen, CircuitBoard, Code2, FileCode, Globe, Lock, ScrollText, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { DevDocSection } from "@/app/docs/dev-doc-section";

export const metadata = {
  title: "Documentation | T.A.L.A.",
  description: "Authoritative references for building, auditing, and operating T.A.L.A.",
};

const primaryLinks = [
  {
    title: "Quick start",
    description: "Spin up your environment, deploy a vault, and validate the unlock path.",
    icon: BookOpen,
    href: "/docs/quickstart",
  },
  {
    title: "Architecture",
    description: "Trace how client encryption, IPFS, and contract logic work together.",
    icon: CircuitBoard,
    href: "/docs/architecture",
  },
  {
    title: "Smart contract",
    description: "Inspect TimeLockedVault structures, functions, and events.",
    icon: FileCode,
    href: "/docs/smart-contract",
  },
  {
    title: "API reference",
    description: "HTTP endpoints, auth patterns, rate policy, and SDK entry points.",
    icon: Globe,
    href: "/docs/api",
  },
  {
    title: "Security model",
    description: "Threat analysis, encryption choices, and operational controls.",
    icon: Shield,
    href: "/docs/security",
  },
];

const buildStages = [
  {
    title: "Plan",
    detail: "Select the right path for your team: classroom releases, procurement, or partner unlocks.",
  },
  {
    title: "Build",
    detail: "Use the quick start, API reference, and contract docs to assemble your flow without guesswork.",
  },
  {
    title: "Prove",
    detail: "Share CID, contract state, and audit events so stakeholders can verify each step in advance.",
  },
];

const referenceSpotlight = [
  {
    title: "Client encryption",
    body: "AES 256 in the browser with keys cleared after upload. No secret stays on our servers.",
    icon: Lock,
  },
  {
    title: "Chain enforcement",
    body: "Unlock checks run on Polygon time. No override exists outside the contract.",
    icon: Code2,
  },
  {
    title: "Transparent trail",
    body: "Uploads, voids, and unlocks emit events you can reference in audits and legal reviews.",
    icon: ScrollText,
  },
];

export default function DocsHub() {
  return (
    <main className="min-h-screen bg-cream text-black">
      <section className="border-b-4 border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Documentation</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">Build with confidence</h1>
            <p className="max-w-3xl text-lg md:text-xl font-semibold text-black/85">
              Every page here is written for engineers, security reviewers, and program owners who need a dependable release path. Follow the tracks, copy the examples, and ship with evidence.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-black bg-black px-5 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Start in minutes
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/smart-contract"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-black bg-white px-5 py-3 font-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Inspect the contract
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-cream px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Navigation</p>
            <h2 className="text-3xl md:text-4xl font-black">Choose your track</h2>
            <p className="text-sm text-black/80">Direct links to the sections teams use most often.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {primaryLinks.map((item) => {
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
                  <div className="flex items-center gap-2 text-sm font-black">
                    Read now
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Execution path</p>
            <h2 className="text-3xl md:text-4xl font-black">From planning to proof</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {buildStages.map((stage) => (
              <div key={stage.title} className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-cream p-6 shadow-brutal">
                <h3 className="text-xl font-black">{stage.title}</h3>
                <p className="text-sm leading-relaxed text-black/80">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-heirlock-yellow px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-black/70">Reference spotlight</p>
            <h2 className="text-3xl md:text-4xl font-black">Core pillars to review</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {referenceSpotlight.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
                  <Icon className="h-6 w-6" />
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-black/80">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Hands on</p>
            <h2 className="text-3xl md:text-4xl font-black">Deep dives with examples</h2>
            <p className="text-sm text-black/80">Expand any module to see copy ready commands and patterns.</p>
          </div>
          <DevDocSection />
        </div>
      </section>

      <section className="bg-black px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-heirlock-green">Need direct guidance?</h2>
          <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
            Reach the team for threat reviews, exam release planning, or procurement support. We respond with references you can forward to stakeholders.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-heirlock-green bg-heirlock-green px-6 py-3 font-black text-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Visit FAQ
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:support@usetala.in"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-heirlock-green bg-black px-6 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Contact support
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

