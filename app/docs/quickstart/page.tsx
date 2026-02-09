import Link from "next/link";
import { ClipboardList, PlayCircle, Cloud, ShieldCheck, ArrowRight, Code2 } from "lucide-react";

const steps = [
  {
    title: "Request access",
    detail: "Email support@usetala.in to enable API access on your account. You will receive a test key for staging and a scoped key for production.",
  },
  {
    title: "Create a vault",
    detail: "Encrypt locally, then call the create endpoint with CID, checksum, and unlock timestamp.",
    code: `curl -X POST https://api.usetala.in/v1/vaults \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cid": "bafybeigdyr...",
    "checksum": "sha256:2f0c...",
    "unlockAt": 1710000000,
    "metadata": {"label": "Exam Set A"}
  }'`,
  },
  {
    title: "Track status",
    detail: "Poll status or subscribe to webhooks to confirm pinning, contract commit, and unlock state.",
    code: `curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.usetala.in/v1/vaults/vault-312/status`,
  },
  {
    title: "Receive webhooks",
    detail: "Provide an HTTPS endpoint. We retry with exponential backoff if your endpoint is unavailable.",
    code: `{
  "event": "unlock_emitted",
  "vaultId": "vault-312",
  "chain": "polygon",
  "txHash": "0xabc...",
  "timestamp": 1710000000
}`,
  },
];

export default function ApiQuickstartPage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-gradient-to-br from-heirlock-yellow via-white to-heirlock-blue border-b-4 border-black py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black bg-white border-4 border-black px-4 py-2 shadow-brutal">
              API quickstart
            </p>
            <h1 className="text-5xl font-black text-black leading-tight">Build against T.A.L.A. in minutes</h1>
            <p className="text-lg text-gray-800 font-medium">
              Follow the staged sequence below to create a vault, commit to chain, and monitor unlocks. Use staging keys while you validate flows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/docs/api" className="inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-white border-4 border-black px-8 py-4 shadow-brutal">
                Full API reference <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="mailto:support@usetala.in?subject=API%20access" className="inline-flex items-center justify-center gap-2 font-black text-lg text-heirlock-yellow bg-black border-4 border-black px-8 py-4 shadow-brutal">
                Request keys
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="border-4 border-black bg-white p-4 shadow-brutal">
                <p className="text-sm font-black text-gray-700 uppercase">Environment</p>
                <p className="text-sm text-gray-800">Staging mirrors production contracts with test CIDs and mock unlocks.</p>
              </div>
              <div className="border-4 border-black bg-white p-4 shadow-brutal">
                <p className="text-sm font-black text-gray-700 uppercase">Rate limits</p>
                <p className="text-sm text-gray-800">Default 60 requests per minute per key. Increase available on review.</p>
              </div>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-brutal space-y-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6" />
              <p className="text-lg font-black text-black">Four-step flow</p>
            </div>
            <ol className="space-y-4 list-decimal list-inside text-sm text-gray-800">
              {steps.map((step) => (
                <li key={step.title} className="border-2 border-black bg-cream p-3 shadow-sm">
                  <p className="font-black text-black">{step.title}</p>
                  <p className="mt-1">{step.detail}</p>
                  {step.code && (
                    <pre className="bg-white border-2 border-black p-3 text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap mt-2">{step.code}</pre>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ icon: PlayCircle, title: "Staging unlocks", body: "Use test keys to simulate unlocks and verify webhook delivery." }, { icon: Cloud, title: "CID integrity", body: "Provide checksums with every CID. The service validates content length and hash." }, { icon: ShieldCheck, title: "Access control", body: "Scoped keys per environment. Revoke and rotate without downtime." }].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="border-4 border-black bg-cream p-6 shadow-brutal space-y-3">
                <Icon className="w-6 h-6" />
                <h3 className="text-xl font-black text-black">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
