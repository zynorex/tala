'use client';

import { Download, Eye, Share2, Lock, Clock, Shield, Zap, CheckCircle, AlertCircle, ChevronRight, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function VaultAccessPortal() {
  const features = [
    {
      title: "Real-Time Status",
      description: "Monitor vault status with live countdown timers. Know exactly when your files will be available.",
      icon: Eye,
    },
    {
      title: "Instant Access",
      description: "Download files the moment the time-lock expires. No intermediaries, instant decryption.",
      icon: Download,
    },
    {
      title: "Verify Authenticity",
      description: "Blockchain-verified vaults. Cryptographically prove the source and integrity of your files.",
      icon: CheckCircle,
    },
    {
      title: "Secure Sharing",
      description: "Share vault access links with authorized users. Fine-grained permission controls.",
      icon: Share2,
    },
    {
      title: "Private Key Security",
      description: "Wallet-based authentication. You control access, no passwords, no intermediaries.",
      icon: Shield,
    },
    {
      title: "Time-Lock Guarantee",
      description: "Cryptographic time-locks ensure files are inaccessible until the specified moment.",
      icon: Lock,
    },
  ];

  const benefits = [
    "Zero Data Leaks - Mathematically guaranteed security",
    "Fair Access - Everyone gets files at exactly the same time",
    "Verified Proof - Blockchain-backed authenticity",
    "Complete Privacy - End-to-end encryption",
    "Global Access - Download from anywhere, anytime",
    "Permanent Records - Immutable audit trail on blockchain",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Vault Access <br />
              Portal
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Access your time-locked vaults with blockchain security. Monitor countdowns and download files the moment they unlock.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 md:py-20 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">Who Uses T.A.L.A.?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-4 border-black bg-white p-6">
              <h3 className="text-xl font-bold text-black mb-3">Educational Institutions</h3>
              <p className="text-gray-700">Secure exam distribution with time-locked paper release. Prevent leaks while ensuring fair access for all students.</p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <h3 className="text-xl font-bold text-black mb-3">Government & Tenders</h3>
              <p className="text-gray-700">Seal tender bids and confidential documents until official opening. Cryptographic guarantee of no premature access.</p>
            </div>
            <div className="border-4 border-black bg-white p-6">
              <h3 className="text-xl font-bold text-black mb-3">Legal & Compliance</h3>
              <p className="text-gray-700">Store sealed evidence, wills, and confidential records. Release on specific dates with blockchain-verified proof.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Portal Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <Icon className="w-8 h-8 text-heirlock-green mb-4" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-green">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Why Choose T.A.L.A.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="border-4 border-heirlock-green bg-black p-6 shadow-brutal flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-heirlock-green flex-shrink-0 mt-1" />
                <p className="text-white">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Access Your Secure Vaults
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Connect your wallet to view your vaults, track countdown timers, and access your files when they unlock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-black text-heirlock-green font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Connect Wallet
            </button>
            <Link href="/how-it-works">
              <button className="px-8 py-3 bg-white text-black font-bold border-4 border-black hover:bg-black hover:text-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
                How It Works <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
