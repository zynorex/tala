"use client";

import {
  AlertCircle,
  CheckCircle2,
  Database,
  Eye,
  FileCode2,
  Lock,
  Network,
  Radio,
  Server,
  Terminal,
  Unlock,
  Wallet,
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("create");

  const createFlow = [
    {
      step: "01",
      title: "Client-Side Encryption",
      summary: "Before any data leaves your machine, T.A.L.A. slices your file into chunks and encrypts it locally.",
      bullets: [
        "AES-256-GCM Military Grade",
        "Zero-knowledge architecture",
        "No plaintext ever touches our servers",
      ],
      icon: Lock,
      accent: "bg-heirlock-pink"
    },
    {
      step: "02",
      title: "Decentralized Dispersion",
      summary: "The encrypted chunks are distributed across a matrix of decentralized storage nodes.",
      bullets: [
        "IPFS & Arweave pinning",
        "Redundant chunk replication",
        "Immutable CIDs mapped to contracts",
      ],
      icon: Network,
      accent: "bg-heirlock-yellow"
    },
    {
      step: "03",
      title: "Smart Contract Lock",
      summary: "A cryptographic hash acts as a time-lock condition anchored to the Polygon network.",
      bullets: [
        "Time-based condition embedding",
        "Decryption keys partitioned",
        "Smart Contract state established"
      ],
      icon: FileCode2,
      accent: "bg-heirlock-blue"
    },
  ];

  const openFlow = [
    {
      step: "01",
      title: "Condition Fulfillment",
      summary: "The smart contract validates the temporal passage or specific multisig trigger.",
      bullets: [
        "Block-time verification",
        "Autonomous triggers",
        "Gas-optimized resolution"
      ],
      icon: Radio,
      accent: "bg-heirlock-green"
    },
    {
      step: "02",
      title: "Key Reconstruction",
      summary: "Node guardians return the key fragments once the contract emits the unlock event.",
      bullets: [
        "Shamir's Secret Sharing",
        "Decentralized Oracle validation",
        "Secure enclave assembly"
      ],
      icon: Database,
      accent: "bg-heirlock-blue"
    },
    {
      step: "03",
      title: "Local Assembly",
      summary: "Fragments combine locally in the recipient's browser to restore the original asset.",
      bullets: [
        "Client-side decryption",
        "Integrity hashing check",
        "Immediate pristine access"
      ],
      icon: Unlock,
      accent: "bg-heirlock-pink"
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans pb-32">
      {/* HEADER SECTION */}
      <section className="relative pt-32 pb-20 px-4 border-b-8 border-black overflow-hidden bg-cream">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col gap-6">
            <span className="inline-block bg-heirlock-pink text-black border-2 border-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] max-w-fit mb-4 -rotate-1">
              PROTOCOL MECHANICS
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none mb-6">
              HOW <br/> T.A.L.A. <br/> OPERATES.
            </h1>
            <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-2xl leading-relaxed">
              We leverage browser-bound encryption routed through immutable chain infrastructure. No backdoors. No trust required.
            </p>
          </div>
        </div>
      </section>

      {/* PHASE 0A: CREATE */}
      <section className="py-24 px-4 border-b-8 border-black bg-white relative">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-8 border-black pb-8 mb-12">
            <div>
              <span className="inline-block bg-heirlock-yellow text-black border-2 border-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] mb-4">
                PHASE_0A // ORIGINATION
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">SEAL & <br/>ANCHOR</h2>
            </div>
            <div className="border-4 border-black bg-black text-white px-6 py-4 font-bold text-lg shadow-[8px_8px_0_0_#FFB3BA] -rotate-2 max-w-sm uppercase">
              "Trustless cryptography operating directly in-browser."
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {createFlow.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className={`relative flex flex-col gap-6 border-4 border-black ${step.accent} p-6 md:p-8 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-2 transition-all`}>
                  <div className="flex items-center justify-between border-b-4 border-black pb-4">
                    <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center -rotate-3">
                      <Icon className="h-7 w-7 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-4xl font-black text-black opacity-40">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-tight">{step.title}</h3>
                  <p className="text-base font-bold flex-1">{step.summary}</p>
                  <ul className="space-y-3 mt-4 border-t-4 border-black border-dashed pt-4">
                    {step.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="font-bold leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SMART CONTRACT TERMINAL */}
      <section className="py-24 px-4 border-b-8 border-black bg-cream overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="border-4 border-black bg-[#111] p-2 shadow-[12px_12px_0_0_#000]">
            <div className="flex items-center gap-3 border-b-4 border-[#333] pb-4 mb-4 px-4 pt-2">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-heirlock-pink border-2 border-black"></div>
                <div className="w-4 h-4 rounded-full bg-heirlock-yellow border-2 border-black"></div>
                <div className="w-4 h-4 rounded-full bg-heirlock-green border-2 border-black"></div>
              </div>
              <div className="flex-1 text-center font-black text-[#666] tracking-widest text-sm uppercase">~/smart-contracts/TalaVault.sol</div>
            </div>
            <div className="p-4 md:p-8 font-mono text-sm md:text-base lg:text-lg text-[#00ff41] leading-relaxed overflow-x-auto">
              <pre><code>
<span className="text-heirlock-pink">function</span> <span className="text-white">unlockPayload</span>(<span className="text-heirlock-blue">uint256</span> vaultId) <span className="text-heirlock-pink">external</span> <span className="text-heirlock-yellow">returns</span> (<span className="text-white">bytes32</span>) {'{'}
<br/>
  &nbsp;&nbsp;Vault <span className="text-heirlock-pink">memory</span> v = vaults[vaultId];
<br/>
  &nbsp;&nbsp;<span className="text-[#666]">// ENFORCE TEMPORAL LOCK</span><br/>
  &nbsp;&nbsp;<span className="text-heirlock-pink">require</span>(block.timestamp {'>='} v.unlockTime, <span className="text-heirlock-yellow">"ERR_STILL_SEALED"</span>);
<br/><br/>
  &nbsp;&nbsp;<span className="text-[#666]">// BROADCAST RESOLUTION</span><br/>
  &nbsp;&nbsp;<span className="text-heirlock-blue">emit</span> KeyFragmentReleased(vaultId, v.shards);
<br/><br/>
  &nbsp;&nbsp;<span className="text-heirlock-pink">return</span> v.merkleRoot;
<br/>
{'}'}
              </code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 0B: UNLOCK */}
      <section className="py-24 px-4 bg-white relative">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-8 border-black pb-8 mb-12">
            <div>
              <span className="inline-block bg-heirlock-blue text-white border-2 border-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] mb-4">
                PHASE_0B // RESOLUTION
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">TRIGGER & <br/>ASSEMBLY</h2>
            </div>
            <div className="border-4 border-black bg-cream p-6 shadow-[8px_8px_0_0_#000] max-w-sm rotate-1">
              <p className="font-bold text-lg uppercase leading-tight">Key shards re-combine in a decentralized enclave automatically when time elapses.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {openFlow.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className={`relative flex flex-col gap-6 border-4 border-black ${step.accent} p-6 md:p-8 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-2 transition-all`}>
                  <div className="flex items-center justify-between border-b-4 border-black pb-4">
                    <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center -rotate-3">
                      <Icon className="h-7 w-7 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-4xl font-black text-black opacity-40">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-tight">{step.title}</h3>
                  <p className="text-base font-bold flex-1">{step.summary}</p>
                  <ul className="space-y-3 mt-4 border-t-4 border-black border-dashed pt-4">
                    {step.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="font-bold leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-20 text-center border-t-8 border-black pt-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">EXECUTE COMMAND.</h2>
            <Link href="/create-vault" className="inline-flex items-center gap-3 font-black text-2xl text-white bg-black border-4 border-black px-8 py-5 shadow-[8px_8px_0_0_#BAE1FF] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#BAE1FF] transition-all uppercase">
              Deploy Vault <Zap className="w-8 h-8" fill="currentColor" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
