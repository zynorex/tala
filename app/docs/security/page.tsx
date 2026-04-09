import { AlertTriangle, CheckCircle, Lock, Shield, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Security model | T.A.L.A. Docs",
  description: "Threat posture, encryption choices, and assurance controls for T.A.L.A.",
};

const threats = [
  {
    title: "Server seizure",
    risk: "Infrastructure is taken down or seized.",
    response: "Servers never keep keys. They hold only CIDs and contract pointers. Encrypted payloads stay on IPFS, while keys remain on chain.",
  },
  {
    title: "Clock manipulation",
    risk: "Someone tries to move the unlock time forward.",
    response: "Unlock checks read validator time from Polygon. No single host clock can change the schedule once it is committed.",
  },
  {
    title: "Key theft",
    risk: "An attacker obtains the encrypted key blob.",
    response: "Keys are created in the browser, sent encrypted, and stored on chain. Brute forcing AES 256 is infeasible with current computing power.",
  },
  {
    title: "IPFS loss",
    risk: "The encrypted file disappears from storage.",
    response: "Pinata pins across regions. The CID exposes any attempt to swap or tamper with the payload.",
  },
];

const principles = [
  {
    title: "Confidentiality",
    copy: "AES 256 keeps content private. Network observers see only ciphertext until the correct key arrives at unlock time.",
  },
  {
    title: "Integrity",
    copy: "GCM authentication tags make tampering obvious. Any change to the encrypted blob fails validation in the browser.",
  },
  {
    title: "Authenticity",
    copy: "Smart contracts are immutable. Unlock events and void events are on chain proofs tied to specific vault identifiers.",
  },
  {
    title: "Accountability",
    copy: "On chain logs show who created, voided, and unlocked. That record supports audits and dispute resolution.",
  },
];

const checklist = [
  "Client encrypts before upload; no plaintext leaves the device.",
  "CID and checksum recorded for every submission.",
  "Polygon enforces unlock time; no admin override exists.",
  "Keys never stored on servers; AES 256 used throughout.",
  "Webhooks signed for authenticity and retried with backoff.",
  "Regular reviews and external audits of contract changes.",
  "Bug bounty with responsible disclosure at support@usetala.in.",
];

export default function SecurityPage() {
  return (
    <main className="space-y-12">
      <section className="space-y-4 border-b-4 border-black pb-8">
        <h1 className="text-5xl md:text-6xl font-black text-black">Security posture</h1>
        <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
          <p className="text-lg font-semibold text-black/85">
            This page explains the guarantees behind T.A.L.A., the risks we model, and the controls that keep exam and procurement material locked until release.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Lock className="h-6 w-6" />
          <h2 className="text-3xl font-black">Encryption standard</h2>
        </div>
        <div className="rounded-2xl border-4 border-black bg-white p-8 shadow-brutal">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-500 p-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black">AES 256 GCM</h3>
              <p className="text-sm font-semibold text-black/70">Authenticated encryption with associated data</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border-3 border-black bg-cream p-4 shadow-brutal">
              <h4 className="text-lg font-black">Algorithm</h4>
              <p className="text-sm text-black/80">Advanced Encryption Standard with 256 bit keys in counter mode with authentication.</p>
            </div>
            <div className="rounded-xl border-3 border-black bg-cream p-4 shadow-brutal">
              <h4 className="text-lg font-black">Why it is chosen</h4>
              <p className="text-sm text-black/80">Fast, parallel friendly, and widely audited. The same mode used by modern TLS.</p>
            </div>
            <div className="rounded-xl border-3 border-black bg-cream p-4 shadow-brutal">
              <h4 className="text-lg font-black">Key handling</h4>
              <p className="text-sm text-black/80">Keys originate in the browser, never appear in plaintext on servers, and are sealed on chain until unlock.</p>
            </div>
            <div className="rounded-xl border-3 border-black bg-cream p-4 shadow-brutal">
              <h4 className="text-lg font-black">Data validation</h4>
              <p className="text-sm text-black/80">Authentication tags catch any alteration to ciphertext before decryption runs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-3xl font-black">Threat scenarios</h2>
        </div>
        <div className="space-y-4">
          {threats.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-2xl border-4 border-black bg-white shadow-brutal">
              <div className="bg-orange-500 px-6 py-4 text-white">
                <h3 className="text-2xl font-black">{item.title}</h3>
              </div>
              <div className="space-y-3 px-6 py-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-black/60">Risk</p>
                  <p className="text-sm text-black/80">{item.risk}</p>
                </div>
                <div className="border-t-2 border-black pt-3">
                  <p className="flex items-center gap-2 text-sm font-black text-black">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Response
                  </p>
                  <p className="text-sm text-black/80">{item.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6" />
          <h2 className="text-3xl font-black">Security principles</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {principles.map((item) => (
            <div key={item.title} className="rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="text-sm text-black/80 leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6" />
          <h2 className="text-3xl font-black">Operational checklist</h2>
        </div>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border-2 border-black bg-white p-4 shadow-md">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-black/85">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

