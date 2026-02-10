import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, ClipboardList, Download, CheckCircle2, BookOpen, Mail, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "T.A.L.A. | Procurement Pack",
  description: "Security, legal, and procurement materials for reviewing T.A.L.A.—DPA, SLA, infosec responses, and deployment options.",
  alternates: { canonical: "https://usetala.in/procurement" },
  openGraph: {
    title: "T.A.L.A. | Procurement Pack",
    description: "Request T.A.L.A. vendor documentation: security questionnaires, DPAs, architecture briefs, and deployment guidance.",
    url: "https://usetala.in/procurement",
    siteName: "T.A.L.A.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "T.A.L.A. Procurement Pack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.A.L.A. | Procurement Pack",
    description: "Request T.A.L.A. vendor documentation: security questionnaires, DPAs, architecture briefs, and deployment guidance.",
    images: ["/twitter-image"],
    creator: "@usetala",
  },
};

const assets = [
  { title: "Infosec questionnaire", body: "Standard responses covering IAM, encryption, logging, backups, and incident handling." },
  { title: "Data Processing Addendum", body: "Template outlining data roles, processing purposes, and retention controls." },
  { title: "Architecture brief", body: "Network, storage, and contract topology suitable for reviewer handoffs." },
  { title: "Insurance certificates", body: "Proof of coverage available on request." },
];

const steps = [
  { title: "Request the pack", detail: "Email support@usetala.in with your organization name and required documents." },
  { title: "Review alignment", detail: "We schedule a 30-minute review to align on scope, data flows, and deployment model." },
  { title: "Validate staging", detail: "Run test unlocks on staging and verify webhook delivery with your SIEM." },
  { title: "Finalize approvals", detail: "We provide signed copies of required artifacts for your procurement record." },
];

export default function ProcurementPage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-gradient-to-br from-heirlock-yellow via-white to-heirlock-blue border-b-4 border-black py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black bg-white border-4 border-black px-4 py-2 shadow-brutal">
              Procurement pack
            </p>
            <h1 className="text-5xl font-black text-black leading-tight">Documentation for vendor review</h1>
            <p className="text-lg text-gray-800 font-medium">
              Use this pack to accelerate security, legal, and procurement reviews. All materials align with the controls described in our Trust Center and API documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="mailto:support@usetala.in?subject=Procurement%20pack" className="inline-flex items-center justify-center gap-2 font-black text-lg text-heirlock-yellow bg-black border-4 border-black px-8 py-4 shadow-brutal">
                Request documents
              </Link>
              <Link href="/trust-center" className="inline-flex items-center justify-center gap-2 font-black text-lg text-black bg-white border-4 border-black px-8 py-4 shadow-brutal">
                View Trust Center
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {assets.map((item) => (
                <div key={item.title} className="border-4 border-black bg-white p-4 shadow-brutal flex flex-col gap-2">
                  <p className="text-sm font-black text-gray-700 uppercase">{item.title}</p>
                  <p className="text-sm text-gray-700">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-brutal space-y-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6" />
              <p className="text-lg font-black text-black">Approval flow</p>
            </div>
            <ol className="space-y-4 list-decimal list-inside text-sm text-gray-800">
              {steps.map((step) => (
                <li key={step.title} className="border-2 border-black bg-cream p-3 shadow-sm">
                  <p className="font-black text-black">{step.title}</p>
                  <p className="mt-1">{step.detail}</p>
                </li>
              ))}
            </ol>
            <div className="border-4 border-black bg-black text-heirlock-yellow px-4 py-3 font-mono text-sm">
              Support: support@usetala.in
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b-4 border-black bg-white">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ icon: ShieldCheck, title: "Security coverage", body: "Encryption, IAM, logging, backups, and incident response are documented for reviewers." }, { icon: FileText, title: "Contractual readiness", body: "DPA, SLA, and support commitments available for enterprise review." }, { icon: Building2, title: "Deployment options", body: "Guidance for standard, on-prem, and air-gapped footprints." }].map((item) => {
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

      <section className="py-16 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-3xl font-black text-black">Reference materials</h2>
            </div>
            <p className="text-sm text-black">Link these into your procurement record for faster approvals.</p>
            <ul className="space-y-2 text-sm text-black">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Status and uptime: <Link href="/status" className="underline font-bold">Status</Link></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Security and disclosure: <Link href="/trust-center" className="underline font-bold">Trust Center</Link></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Technical scope: <Link href="/docs" className="underline font-bold">Developer Docs</Link></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Integration details: <Link href="/integrations" className="underline font-bold">Integrations</Link></li>
            </ul>
          </div>
          <div className="border-4 border-black bg-white p-6 shadow-brutal space-y-4">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
              <p className="text-lg font-black text-black">Request a download link</p>
            </div>
            <p className="text-sm text-gray-800">We provide a secure link with time-bound access for your reviewers.</p>
            <Link href="mailto:support@usetala.in?subject=Procurement%20pack%20download" className="inline-flex items-center justify-center gap-2 font-black text-black border-3 border-black px-4 py-3 bg-cream">
              Email support@usetala.in
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4" />
              <span>Response target: same business day</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
