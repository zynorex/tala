'use client';

import { Lock, Users, Upload, Settings, Zap, Shield, Clock, CheckCircle, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CreateVault() {
  const steps = [
    {
      number: "1",
      title: "Connect Your Wallet",
      description: "Use MetaMask, WalletConnect, or any Web3 wallet. Your keys stay with you always.",
      icon: Shield,
    },
    {
      number: "2",
      title: "Upload Your File",
      description: "Select any file up to 500MB. Encrypted with AES-256 before it leaves your device.",
      icon: Upload,
    },
    {
      number: "3",
      title: "Set Unlock Time",
      description: "Choose the exact date and time when your vault unlocks. From now to 100 years ahead.",
      icon: Clock,
    },
    {
      number: "4",
      title: "Deploy to Blockchain",
      description: "Create your vault on the blockchain. Immutable, transparent, and tamper-proof forever.",
      icon: Users,
    },
  ];

  const features = [
    {
      title: "Non-Custodial Security",
      description: "You control everything. We never see your files or encryption keys. Complete privacy.",
      icon: Shield,
    },
    {
      title: "Military-Grade Encryption",
      description: "AES-256-GCM encryption with PBKDF2 key derivation. Impossible to crack.",
      icon: Lock,
    },
    {
      title: "Decentralized Storage",
      description: "Files stored on IPFS with dual providers. Redundancy ensures permanence.",
      icon: CheckCircle,
    },
    {
      title: "Blockchain Immutability",
      description: "Smart contract on Polygon ensures rules are enforced by code, not trust.",
      icon: Zap,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-blue border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Create Your <br />
              Secure Vault
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Time-lock any sensitive file with military-grade encryption. Perfect for exams, contracts, medical records, intellectual property, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">4 Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center h-12 w-12 bg-heirlock-blue text-black font-bold text-lg">
                      {step.number}
                    </div>
                    <Icon className="w-6 h-6 text-heirlock-blue flex-shrink-0" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-blue">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Vault Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = ["bg-heirlock-blue", "bg-heirlock-green", "bg-heirlock-yellow", "bg-heirlock-pink"];
              return (
                <div
                  key={index}
                  className={`${colors[index % 4]} border-4 border-black p-6 shadow-brutal`}
                >
                  <Icon className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-lg font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-black text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">Who Uses T.A.L.A.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Educational Institutions",
                description: "Secure exam papers from leaks. Time-lock ensures papers stay protected until exam day.",
              },
              {
                title: "Healthcare Providers",
                description: "Protect patient records and medical documents. HIPAA-compliant secure storage.",
              },
              {
                title: "Legal Firms",
                description: "Secure contracts and confidential documents. Auditable access with blockchain.",
              },
              {
                title: "Tech Companies",
                description: "Protect intellectual property and trade secrets. Time-lock for coordinated releases.",
              },
              {
                title: "Financial Services",
                description: "Secure sensitive financial documents. Non-custodial storage for compliance.",
              },
              {
                title: "Individuals",
                description: "Protect personal documents, wills, and important records for future access.",
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <h3 className="text-lg font-bold text-black mb-3">{useCase.title}</h3>
                <p className="text-gray-700">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-20 bg-white border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">Why Choose T.A.L.A.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Complete Control</h3>
              <p className="text-gray-800 mb-4 font-medium">
                You retain full ownership of your files and encryption keys. We can never access your data.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ You own the encryption keys</li>
                <li>✓ You set the unlock time</li>
                <li>✓ You decide who gets access</li>
                <li>✓ You control everything</li>
              </ul>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-pink shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Blockchain Security</h3>
              <p className="text-gray-800 mb-4 font-medium">
                Smart contracts enforce rules algorithmically. Time-lock is enforced by code, not trust.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ Immutable audit trail</li>
                <li>✓ Transparent operations</li>
                <li>✓ Tamper-proof records</li>
                <li>✓ No single point of failure</li>
              </ul>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-blue shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Cryptographic Strength</h3>
              <p className="text-gray-800 mb-4 font-medium">
                Military-grade encryption ensures your files stay secure even if hacked.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ AES-256-GCM encryption</li>
                <li>✓ PBKDF2 key derivation</li>
                <li>✓ Authentication verification</li>
                <li>✓ No backdoors</li>
              </ul>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-green shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Decentralized Storage</h3>
              <p className="text-gray-800 mb-4 font-medium">
                IPFS ensures your files stay accessible forever, distributed across the network.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ Dual provider redundancy</li>
                <li>✓ Global accessibility</li>
                <li>✓ No server dependency</li>
                <li>✓ Permanent storage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-blue">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Future?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your first vault today. Time-lock your sensitive files with military-grade encryption on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-heirlock-blue text-black font-bold border-4 border-heirlock-blue hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Create Vault Now
            </button>
            <Link href="/how-it-works">
              <button className="px-8 py-3 bg-transparent text-white font-bold border-4 border-white hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
                How It Works <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
