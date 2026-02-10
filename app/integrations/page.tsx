import type { Metadata } from "next";
import Link from "next/link";
import { Network, Wallet, Webhook, Server, ShieldCheck, Cable, FileJson } from "lucide-react";

export const metadata: Metadata = {
  title: "T.A.L.A. | Integrations",
  description: "Connect T.A.L.A. to your stack—chains, wallets, webhooks, SIEM feeds, and storage partners with staging guidance.",
  alternates: { canonical: "https://usetala.in/integrations" },
  openGraph: {
    title: "T.A.L.A. | Integrations",
    description: "Supported chains, wallets, monitoring hooks, and storage gateways for verifiable unlocks.",
    url: "https://usetala.in/integrations",
    siteName: "T.A.L.A.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "T.A.L.A. Integrations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.A.L.A. | Integrations",
    description: "Supported chains, wallets, monitoring hooks, and storage gateways for verifiable unlocks.",
    images: ["/twitter-image"],
    creator: "@usetala",
  },
};

const categories = [
  {
    icon: Network,
    title: "Chains",
    body: "Polygon Amoy and mainnet supported. Rollup watchers mirror unlock events for resilience.",
    items: ["Polygon Amoy", "Polygon mainnet", "Secondary rollup watchers"],
  },
  {
    icon: Wallet,
    title: "Wallets",
    body: "Compatible with EVM wallets that support standard personal_sign flows. Tested with Ledger and popular extensions.",
    items: ["Ledger", "Browser extensions", "Mobile wallets via WalletConnect"],
  },
  {
    icon: Webhook,
    title: "SIEM and webhooks",
    body: "Delivery of unlock events, anomaly alerts, and incident notifications to your intake endpoints.",
    items: ["JSON webhooks", "Custom headers", "Retry with backoff"],
  },
  {
    icon: Server,
    title: "Storage and gateways",
    body: "IPFS pinning partners across regions with signed gateway access for retrieval." ,
    items: ["Multi-region pinning", "Gateway tokens", "Redundant CIDs"],
  },
];

const examples = [
  {
    title: "Webhook payload",
    detail: "Unlock event sent to your incident endpoint.",
    code: `{
  "event": "unlock_emitted",
  "vaultId": "vault-312",
  "chain": "polygon",
  "txHash": "0xabc...",
  "timestamp": 1710000000
}`,
  },
  {
    title: "Status subscription",
    detail: "Subscribe to status JSON for polling-based monitoring.",
    code: `GET https://api.usetala.in/status
Response: {
  "uptime": "99.9%",
  "lastIncident": "none",
  "network": "polygon"
}`,
  },
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-gradient-to-br from-heirlock-yellow via-white to-heirlock-blue border-b-4 border-black py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl space-y-6">
          <p className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black bg-white border-4 border-black px-4 py-2 shadow-brutal">
            Integrations
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-black leading-tight">Connect T.A.L.A. to your stack</h1>
              <p className="text-lg text-gray-800 font-medium">
                Chains, wallets, monitoring, and storage partners supported out of the box. Use the references below to align procurement and security reviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/docs/api" className="inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-white border-4 border-black px-8 py-4 shadow-brutal">
                  View API docs
                </Link>
                <Link href="mailto:support@usetala.in" className="inline-flex items-center justify-center gap-2 font-black text-lg text-heirlock-yellow bg-black border-4 border-black px-8 py-4 shadow-brutal">
                  Request validation
                </Link>
              </div>
            </div>
            <div className="border-4 border-black bg-white p-6 shadow-brutal grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.title} className="border-2 border-black bg-cream p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <p className="text-sm font-black text-black">{cat.title}</p>
                    </div>
                    <p className="text-sm text-gray-700">{cat.body}</p>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                      {cat.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              <div>
                <p className="text-sm font-black text-gray-600 uppercase">Operational hooks</p>
                <h2 className="text-3xl font-black text-black">Instrument unlocks and incidents</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map((example) => (
                <div key={example.title} className="border-4 border-black bg-cream p-4 shadow-brutal space-y-3">
                  <div className="flex items-center gap-3">
                    <FileJson className="w-5 h-5" />
                    <h3 className="text-lg font-black text-black">{example.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700">{example.detail}</p>
                  <pre className="bg-white border-2 border-black p-3 text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap">{example.code}</pre>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-4 border-black bg-heirlock-yellow p-5 shadow-brutal flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Cable className="w-5 h-5" />
                <h3 className="text-xl font-black text-black">Network requirements</h3>
              </div>
              <p className="text-sm text-black">Allowlist RPC to Polygon and permit outbound webhook calls from your intake endpoints. We can share IP ranges on request.</p>
            </div>
            <div className="border-4 border-black bg-white p-5 shadow-brutal flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                <h3 className="text-xl font-black text-black">Staging validation</h3>
              </div>
              <p className="text-sm text-gray-700">Test unlocks on staging contracts before production. We provide sample vaults, CIDs, and signed events for your QA teams.</p>
              <Link href="mailto:support@usetala.in?subject=Staging%20validation" className="text-sm font-bold text-black underline">Request staging access</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
