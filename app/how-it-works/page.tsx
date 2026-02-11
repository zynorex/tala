"use client";

import { AlertCircle, Check, ChevronRight, FileText, Globe, Lock, Shield, Upload, Zap } from "lucide-react";
import Link from "next/link";

const createFlow = [
  {
    step: "01",
    title: "Encrypt on your device",
    icon: Lock,
    summary:
      "The admin chooses a file, and the browser makes a fresh AES 256 key. Encryption runs locally so no plain document ever leaves the device.",
    bullets: [
      "Random 256 bit key generated in browser",
      "Ciphertext only, plaintext stays local",
      "Memory clears the key after upload",
      "No server side storage of secrets",
    ],
  },
  {
    step: "02",
    title: "Anchor to IPFS",
    icon: Upload,
    summary:
      "The encrypted file goes to IPFS through Pinata. The content ID is the fingerprint that proves immutability and global availability.",
    bullets: [
      "CID is the integrity proof",
      "Distributed across global nodes",
      "Permanent address for retrieval",
      "Nothing to delete or alter later",
    ],
  },
  {
    step: "03",
    title: "Lock the key on chain",
    icon: Zap,
    summary:
      "CID, AES key, and unlock time are written to the Polygon contract. The contract accepts custody and enforces the schedule.",
    bullets: [
      "Transaction carries CID, key, and unlock time",
      "Key sealed inside immutable logic",
      "Unlock moment cannot be edited",
      "Vault ID returned for reference",
    ],
  },
];

const openFlow = [
  {
    step: "01",
    title: "Verify what you have",
    icon: Shield,
    summary:
      "Students or bidders can download the encrypted file early and compare the CID with the announced value to prove it was not touched.",
    bullets: [
      "Encrypted PDF available right away",
      "CID comparison exposes tampering",
      "Community can audit the asset",
      "Prep downloads minutes in advance",
    ],
  },
  {
    step: "02",
    title: "Check the block time",
    icon: Zap,
    summary:
      "On unlock, the app asks the contract if current block time meets the policy. Reads cost zero gas and are visible to everyone.",
    bullets: [
      "Contract state queried in browser",
      "Block timestamp compared to unlock",
      "Read path only, no gas burn",
      "Answer is public and auditable",
    ],
  },
  {
    step: "03",
    title: "Decrypt in the browser",
    icon: Lock,
    summary:
      "If the time has arrived, the contract returns the key. The browser decrypts instantly and renders the PDF without servers.",
    bullets: [
      "If early, contract reverts with lock status",
      "If ready, AES 256 key is returned",
      "Decryption happens in milliseconds",
      "No middle layer can intercept",
    ],
  },
];

const assurances = [
  {
    title: "AES 256 at the edge",
    icon: Lock,
    copy: "Same cipher trusted by banks and defense. Brute force would outlive current hardware by centuries.",
  },
  {
    title: "Time sourced from validators",
    icon: Globe,
    copy: "Polygon timestamps are agreed by thousands of independent validators. No single server clock can be gamed.",
  },
  {
    title: "Audit trail on chain",
    icon: FileText,
    copy: "Uploads and unlocks live as permanent public events. Every action is traceable as legal grade evidence.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-cream text-black">
      <section className="relative overflow-hidden px-6 py-16 md:py-20 border-b-4 border-black bg-white">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative mx-auto max-w-6xl space-y-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">How it works</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">Operational logic you can verify</h1>
          <p className="max-w-3xl text-lg md:text-xl font-semibold">
            TALA runs a client first, chain enforced flow so no person can move the unlock earlier. Everything below is auditable and observable.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/documentation"
              className="inline-flex w-full sm:w-auto justify-center rounded-xl border-3 border-black bg-black px-6 py-3 text-white font-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Read the protocol
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/create-vault"
              className="inline-flex w-full sm:w-auto justify-center rounded-xl border-3 border-black bg-white px-6 py-3 font-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Spin up a vault
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-cream px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Phase A</p>
              <h2 className="text-3xl md:text-4xl font-black">Create and seal</h2>
              <p className="text-sm md:text-base text-gray-900">Admin experience without trust gaps.</p>
            </div>
            <div className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-brutal">
              Client first, chain enforced
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {createFlow.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative flex h-full flex-col gap-4 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-black/70">
                      <Icon className="h-4 w-4" />
                      Step {step.step}
                    </div>
                    <span className="text-lg font-black text-black/40">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-900">{step.summary}</p>
                  <div className="space-y-2">
                    {step.bullets.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-black" />
                        <span className="text-sm text-gray-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-heirlock-pink px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/70">Phase B</p>
              <h2 className="text-3xl md:text-4xl font-black">Open with proofs</h2>
              <p className="text-sm md:text-base text-gray-900">Public verification and unlock without admins.</p>
            </div>
            <div className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-brutal">
              Observable by anyone
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {openFlow.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative flex h-full flex-col gap-4 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-black/70">
                      <Icon className="h-4 w-4" />
                      Step {step.step}
                    </div>
                    <span className="text-lg font-black text-black/40">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-900">{step.summary}</p>
                  <div className="space-y-2">
                    {step.bullets.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-black" />
                        <span className="text-sm text-gray-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Smart contract spine</p>
              <h2 className="text-3xl md:text-4xl font-black">The unlock condition</h2>
            </div>
            <div className="rounded-full border-2 border-black bg-heirlock-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-brutal">
              Nothing runs off chain
            </div>
          </div>

          <div className="rounded-2xl border-4 border-black bg-black p-6 shadow-brutal">
            <code className="block font-mono text-sm text-heirlock-yellow leading-relaxed whitespace-pre">
{`function unlockVault() public view returns (bytes32) {
    require(block.timestamp >= unlockTime,
        "VAULT_LOCKED: wait for unlock time");
    return aesKey;
}`}
            </code>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border-3 border-black bg-cream p-5 shadow-brutal">
              <h3 className="text-lg font-black mb-2">What it enforces</h3>
              <p className="text-sm leading-relaxed text-gray-900">
                The contract rejects any request before the unlock time and simply returns the key once the block clock crosses the policy. The rule is small on purpose so it is easy to audit.
              </p>
            </div>
            <div className="rounded-2xl border-3 border-black bg-heirlock-green p-5 shadow-brutal">
              <h3 className="text-lg font-black mb-2">Why it holds up</h3>
              <p className="text-sm leading-relaxed text-gray-900">
                Block timestamps are agreed by independent validators. There is no secret admin clock and no override function. If the chain does not say ready, the vault stays closed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-heirlock-yellow px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/70">Security posture</p>
              <h2 className="text-3xl md:text-4xl font-black">Assurances you can check</h2>
            </div>
            <div className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-brutal">
              Proof over promises
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-white p-6 shadow-brutal">
                  <Icon className="h-8 w-8" />
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-900">{item.copy}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border-4 border-black bg-black p-6 shadow-brutal">
            <h3 className="text-xl font-black text-heirlock-yellow mb-3">The bottom line</h3>
            <p className="text-sm md:text-base leading-relaxed text-white">
              Once sealed inside TALA, a vault will not open early. There is no admin door to knock on, no secret support script to run. Time and math decide the moment.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-heirlock-green px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">Immutable audit log</h2>
          <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-brutal space-y-4">
            <p className="text-base leading-relaxed text-gray-900">
              Every action lives on Polygon as a public record. Anyone can replay who uploaded, who queried, and when a vault opened. That history cannot be erased.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border-2 border-black p-4">
                <h4 className="font-black text-black mb-1">Vault created</h4>
                <p className="text-sm text-gray-800">Upload event proves time and content ID.</p>
              </div>
              <div className="rounded-xl border-2 border-black p-4">
                <h4 className="font-black text-black mb-1">Key sealed</h4>
                <p className="text-sm text-gray-800">Contract event stores the unlock policy.</p>
              </div>
              <div className="rounded-xl border-2 border-black p-4">
                <h4 className="font-black text-black mb-1">Unlock query</h4>
                <p className="text-sm text-gray-800">Read events show when users checked readiness.</p>
              </div>
              <div className="rounded-xl border-2 border-black p-4">
                <h4 className="font-black text-black mb-1">Void event</h4>
                <p className="text-sm text-gray-800">Emergency void proves a key was destroyed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <h2 className="text-3xl md:text-4xl font-black">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can an admin leak the key early?",
                a: "No. The interface does not keep the key. After encryption, it lives only inside the contract until the unlock moment.",
              },
              {
                q: "What if the chain is attacked?",
                a: "Polygon time is agreed by many validators. To fake time an attacker would have to capture the majority at once.",
              },
              {
                q: "What if internet is weak on exam day?",
                a: "Students pre download the encrypted file. On the day they only fetch a tiny key, even slow networks handle it.",
              },
              {
                q: "Can someone swap the encrypted file?",
                a: "If a single bit changes, the CID changes. Anyone can compare the published CID to catch tampering.",
              },
              {
                q: "What if we need to cancel?",
                a: "Trigger a void. The key is destroyed on chain and the file becomes impossible to open. The void itself is a recorded event.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border-3 border-black bg-cream p-5 shadow-brutal">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 h-5 w-5" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-black">{item.q}</h3>
                    <p className="text-sm leading-relaxed text-gray-900">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-heirlock-blue px-6 py-16 border-t-4 border-black">
        <div className="mx-auto max-w-6xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">Ready to implement</h2>
          <p className="text-sm md:text-base font-semibold text-black/80 max-w-3xl mx-auto">
            You now have the full flow. Move to the docs for contract details or start a vault to see it live.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/documentation"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-black bg-black px-6 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              View docs
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/create-vault"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-black bg-white px-6 py-3 font-black text-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Deploy TALA
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
