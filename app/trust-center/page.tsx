import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileBadge2, Globe2, Lock, AlertTriangle, Mail, BookCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "T.A.L.A. | Trust Center",
  description: "Security, transparency, and operational readiness for T.A.L.A.—disclosures, controls, and contact for responsible security.",
  alternates: { canonical: "https://usetala.in/trust-center" },
  openGraph: {
    title: "T.A.L.A. | Trust Center",
    description: "Security posture, disclosure process, and verification artifacts for T.A.L.A. time-locked vaults.",
    url: "https://usetala.in/trust-center",
    siteName: "T.A.L.A.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "T.A.L.A. Trust Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.A.L.A. | Trust Center",
    description: "Security posture, disclosure process, and verification artifacts for T.A.L.A. time-locked vaults.",
    images: ["/opengraph-image"],
    creator: "@usetala",
  },
};

export default function TrustCenterPage() {
  const controls = [
    { title: "Security posture", body: "Encryption in transit and at rest, PBKDF2-based key derivation, and smart contract enforced unlock windows." },
    { title: "Identity", body: "Wallet-sign flows and passphrase shards reduce reliance on email resets or single admin accounts." },
    { title: "Monitoring", body: "Integrity beacons every five minutes, webhook alerts, and SOC dashboards for incident triage." },
    { title: "Data handling", body: "Client-side encryption by default, IPFS pinning across regions, and no server-side key custody." },
  ];

  const artifacts = [
    { label: "Security.txt", href: "/.well-known/security.txt" },
    { label: "Smart contract audits", href: "/docs/smart-contract" },
    { label: "Architecture overview", href: "/docs/architecture" },
    { label: "API documentation", href: "/docs/api" },
  ];

  const compliance = [
    { name: "Audit cadence", detail: "Independent reviews scheduled quarterly." },
    { name: "Data residency", detail: "Primary storage in India with regional IPFS partners." },
    { name: "Availability", detail: "99.9 percent target uptime with status reporting." },
    { name: "Disclosure", detail: "Coordinated vulnerability reporting through support@usetala.in." },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-gradient-to-br from-heirlock-yellow via-white to-heirlock-blue border-b-4 border-black py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black bg-white border-4 border-black px-4 py-2 shadow-brutal">
              Trust Center
            </p>
            <h1 className="text-5xl font-black text-black leading-tight">Security, transparency, and operational readiness</h1>
            <p className="text-lg text-gray-800 font-medium">
              This hub centralizes disclosures, security practices, and verification links so your reviewers can complete diligence without waiting for email threads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/status" className="inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-white border-4 border-black px-8 py-4 shadow-brutal">
                View live status
              </Link>
              <Link href="mailto:support@usetala.in" className="inline-flex items-center justify-center gap-2 font-black text-lg text-heirlock-yellow bg-black border-4 border-black px-8 py-4 shadow-brutal">
                Contact security
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {controls.map((item) => (
                <div key={item.title} className="border-4 border-black bg-white p-4 shadow-brutal">
                  <p className="text-sm font-black text-gray-700 uppercase">{item.title}</p>
                  <p className="text-sm text-gray-700 mt-2">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-white shadow-brutal p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              <div>
                <p className="text-sm font-black uppercase text-gray-600">Responsible disclosure</p>
                <p className="text-2xl font-black text-black">Coordinated response window</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-800">
              <p>Report suspected vulnerabilities privately to support@usetala.in. Include reproduction steps, potential impact, and preferred contact method.</p>
              <p>We aim to acknowledge within 48 hours and share mitigation timelines within 7 business days for high severity issues.</p>
              <p>Do not post proofs publicly until a fix is confirmed or a coordinated date is agreed.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border-2 border-black bg-cream p-3">
                <p className="text-xs font-bold text-gray-700 uppercase">PGP</p>
                <p className="text-sm text-black">Request the security key via support@usetala.in</p>
              </div>
              <div className="border-2 border-black bg-cream p-3">
                <p className="text-xs font-bold text-gray-700 uppercase">Timeline</p>
                <p className="text-sm text-black">Acknowledge 48h, remediation plan 7d, fix priority by severity</p>
              </div>
            </div>
            <div className="border-4 border-black bg-black text-heirlock-yellow px-4 py-3 font-mono text-sm">
              security contact: support@usetala.in
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <FileBadge2 className="w-8 h-8" />
              <div>
                <p className="text-sm font-black text-gray-600 uppercase">Artifacts</p>
                <h2 className="text-3xl font-black text-black">Verified references</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artifacts.map((item) => (
                <Link key={item.label} href={item.href} className="micro-card border-4 border-black bg-cream p-4 shadow-brutal flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-black">{item.label}</p>
                    <p className="text-sm text-gray-700">Open the latest version</p>
                  </div>
                  <span className="font-mono text-sm text-gray-600">→</span>
                </Link>
              ))}
            </div>
            <div className="border-4 border-black bg-cream p-6 shadow-brutal flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Globe2 className="w-6 h-6" />
                <h3 className="text-xl font-black text-black">Data locations</h3>
              </div>
              <p className="text-sm text-gray-700">Primary compute and storage operate in India. IPFS pinning uses multiple regional partners to improve durability. No plaintext material is stored server side.</p>
              <p className="text-sm text-gray-700">On request, we can share region lists and gateway partners for your review.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-4 border-black bg-heirlock-yellow p-6 shadow-brutal flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6" />
                <h3 className="text-xl font-black text-black">Access controls</h3>
              </div>
              <p className="text-sm text-black">Least-privilege IAM, hardware backed admin keys, and mandatory reviewer approval for production access.</p>
            </div>
            <div className="border-4 border-black bg-white p-6 shadow-brutal flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <BookCheck className="w-6 h-6" />
                <h3 className="text-xl font-black text-black">Compliance posture</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {compliance.map((item) => (
                  <li key={item.name} className="flex gap-2">
                    <span className="font-black">•</span>
                    <span>
                      <span className="font-bold text-black">{item.name}:</span> {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-4 border-black bg-white p-6 shadow-brutal flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-black text-black">Incident response</h3>
              </div>
              <p className="text-sm text-gray-700">Critical events trigger immediate isolation, log capture, and stakeholder notification. Post-incident reports summarize impact, timeline, and mitigations.</p>
              <Link href="/status" className="text-sm font-bold text-black underline">View status and history</Link>
            </div>
            <div className="border-4 border-black bg-cream p-6 shadow-brutal flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <div>
                <p className="text-sm font-black text-gray-700 uppercase">Reach the team</p>
                <p className="text-sm text-black">support@usetala.in</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
