import { Database, Lock, Server, Share2, Shield, Upload } from "lucide-react";

export const metadata = {
  title: "Architecture | T.A.L.A. Docs",
  description: "System blueprint for the T.A.L.A. vault platform",
};

const pillars = [
  {
    title: "Client",
    description: "Creates AES 256 keys, encrypts files locally, and clears secrets after upload.",
    icon: Lock,
  },
  {
    title: "IPFS",
    description: "Pins encrypted payloads with immutable content identifiers for later verification.",
    icon: Database,
  },
  {
    title: "Polygon",
    description: "Holds the key, enforces unlock time, and emits an audit trail of events.",
    icon: Server,
  },
];

const flow = [
  {
    label: "Encrypt",
    detail: "Browser generates a fresh key and encrypts the document before anything leaves the device.",
    accent: "bg-black text-white",
    icon: Lock,
  },
  {
    label: "Anchor",
    detail: "Encrypted data is pinned to IPFS through Pinata. The CID is the integrity anchor shared with stakeholders.",
    accent: "bg-heirlock-yellow",
    icon: Upload,
  },
  {
    label: "Lock",
    detail: "The contract stores CID, key, and unlock moment. No override path exists outside on chain logic.",
    accent: "bg-heirlock-green",
    icon: Shield,
  },
  {
    label: "Release",
    detail: "When block time reaches the policy, the contract returns the key. Clients decrypt in the browser without servers.",
    accent: "bg-heirlock-blue",
    icon: Share2,
  },
];

const properties = [
  {
    title: "Non custodial",
    copy: "Keys live in the browser during creation and on chain after commit. Servers never keep them in plaintext.",
  },
  {
    title: "Deterministic timing",
    copy: "Unlock checks read validator time. The schedule cannot be moved by configuration or support requests.",
  },
  {
    title: "Immutable evidence",
    copy: "Uploads, voids, and unlocks emit events that anyone can prove later in an audit or dispute.",
  },
  {
    title: "Global access",
    copy: "IPFS distribution and Polygon validation keep the release available even when a region is offline.",
  },
];

export default function ArchitecturePage() {
  return (
    <main className="space-y-12">
      <section className="space-y-4 border-b-4 border-black pb-8">
        <h1 className="text-5xl md:text-6xl font-black text-black">System architecture</h1>
        <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
          <p className="text-lg font-semibold text-black/85">
            T.A.L.A. runs a client first flow backed by decentralized storage and a simple on chain contract. This page shows how each layer works and where guarantees come from.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Core layers</p>
          <h2 className="text-3xl md:text-4xl font-black">Three parts, one guarantee</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-black/70">
                  <Icon className="h-4 w-4" />
                  {item.title}
                </div>
                <p className="text-sm leading-relaxed text-black/80">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Flow</p>
          <h2 className="text-3xl md:text-4xl font-black">What happens from upload to release</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {flow.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${step.accent}`}>{step.label}</span>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-black/80">{step.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Request path</p>
          <h2 className="text-3xl md:text-4xl font-black">Data moves with proof</h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border-4 border-black bg-black p-6 shadow-brutal font-mono text-sm text-heirlock-yellow">
          <pre>{`Client
  -> generate AES 256 key
  -> encrypt file locally
  -> upload encrypted file to IPFS
       -> receive CID
       -> submit CID + key + unlock time to contract
            -> contract records state
            -> emits VaultCreated event
            -> waits until block time >= unlock time
            -> returns key on unlock request
  -> browser decrypts and renders`}</pre>
        </div>
      </section>

      <section className="space-y-6 pb-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Assurance</p>
          <h2 className="text-3xl md:text-4xl font-black">Properties that hold under stress</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {properties.map((item) => (
            <div key={item.title} className="rounded-2xl border-3 border-black bg-heirlock-yellow p-6 shadow-brutal">
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="text-sm leading-relaxed text-black/80">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

