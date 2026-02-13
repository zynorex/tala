import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, Cloud, PlayCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "T.A.L.A. | Quick start",
  description: "Follow this guided path to set up the environment, create a vault, and observe the unlock process.",
};

const steps = [
  {
    title: "Get access",
    detail: "Request API access at support@usetala.in. You receive staging and production keys scoped to your team.",
  },
  {
    title: "Create a vault",
    detail: "Encrypt locally, then post CID, checksum, and unlock time to the create endpoint.",
    code: `curl -X POST https://api.usetala.in/v1/vaults
  -H "Authorization: Bearer YOUR_API_KEY"
  -H "Content-Type: application/json"
  -d '{
    "cid": "bafy...",
    "checksum": "sha256:2f0c...",
    "unlockAt": 1893456000,
    "metadata": {"label": "Exam Set A"}
  }'`,
  },
  {
    title: "Observe state",
    detail: "Poll or subscribe to confirm pinning, contract commit, and unlock readiness.",
    code: `curl -H "Authorization: Bearer YOUR_API_KEY"
  https://api.usetala.in/v1/vaults/vault-312/status`,
  },
  {
    title: "Receive notifications",
    detail: "Expose an HTTPS endpoint. Webhooks retry with backoff when your endpoint is unavailable.",
    code: `{
  "event": "unlock_emitted",
  "vaultId": "vault-312",
  "chain": "polygon",
  "txHash": "0xabc...",
  "timestamp": 1893456000
}`,
  },
];

const callouts = [
  {
    icon: PlayCircle,
    title: "Staging unlocks",
    body: "Use test keys to simulate unlock events and confirm webhook handling before launch.",
  },
  {
    icon: Cloud,
    title: "CID integrity",
    body: "Send checksums with every CID. The service validates content length and hash before commit.",
  },
  {
    icon: ShieldCheck,
    title: "Access control",
    body: "Keys are scoped per environment. Rotate or revoke without downtime for students or partners.",
  },
];

export default function ApiQuickstartPage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="border-b-4 border-black bg-gradient-to-br from-heirlock-yellow via-white to-heirlock-blue px-4 py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-xl border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-black shadow-brutal">
              API quick start
            </p>
            <h1 className="text-5xl font-black text-black leading-tight">Build with the T.A.L.A. API</h1>
            <p className="text-lg font-medium text-black/80">
              Use this sequence to create your first vault, validate the chain commit, and watch the unlock event. Keep staging keys in place until every check passes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/docs/api"
                className="inline-flex items-center justify-center gap-2 border-4 border-black bg-white px-8 py-4 text-lg font-black text-black shadow-brutal"
              >
                Full API reference
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:support@usetala.in?subject=API%20access"
                className="inline-flex items-center justify-center gap-2 border-4 border-black bg-black px-8 py-4 text-lg font-black text-heirlock-yellow shadow-brutal"
              >
                Request keys
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              <div className="border-4 border-black bg-white p-4 shadow-brutal">
                <p className="text-sm font-black uppercase text-gray-700">Environment</p>
                <p className="text-sm text-gray-800">Staging mirrors production contracts with mock unlocks for safe rehearsal.</p>
              </div>
              <div className="border-4 border-black bg-white p-4 shadow-brutal">
                <p className="text-sm font-black uppercase text-gray-700">Rate policy</p>
                <p className="text-sm text-gray-800">Default 60 requests per minute per key. Higher limits available on review.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border-4 border-black bg-white p-6 shadow-brutal">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6" />
              <p className="text-lg font-black text-black">Four stage flow</p>
            </div>
            <ol className="list-inside list-decimal space-y-4 text-sm text-gray-800">
              {steps.map((step) => (
                <li key={step.title} className="border-2 border-black bg-cream p-3 shadow-sm">
                  <p className="font-black text-black">{step.title}</p>
                  <p className="mt-1">{step.detail}</p>
                  {step.code && (
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap border-2 border-black bg-white p-3 text-xs text-gray-800"><code>{step.code}</code></pre>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-4 py-16">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="text-3xl font-black">Launch checklist</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {["Keys stored in environment variables, never in client code.", "CID and checksum recorded for every upload.", "Webhook endpoint verified with test payloads before production.", "Run through one full unlock with staging data before exam day."].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border-3 border-black bg-cream p-4 shadow-brutal">
                <CheckCircle2 className="mt-0.5 h-5 w-5" />
                <p className="text-sm text-black/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-cream px-4 py-16">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-3xl font-black">Context that helps</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {callouts.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-3 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
                  <Icon className="h-6 w-6" />
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="text-sm text-black/80">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
