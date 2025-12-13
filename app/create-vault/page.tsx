'use client';

import { Lock, Users, Upload, Settings, Zap, Shield, Clock, CheckCircle, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CreateVault() {
  const steps = [
    {
      number: "1",
      title: "Connect Your Wallet",
      description: "Use MetaMask, WalletConnect, or any Web3 wallet. Your keys stay with you.",
      icon: Shield,
    },
    {
      number: "2",
      title: "Upload Papers",
      description: "Select your exam papers. They're encrypted before leaving your device.",
      icon: Upload,
    },
    {
      number: "3",
      title: "Set Time-Lock",
      description: "Choose when papers should unlock. Set date and time precisely.",
      icon: Clock,
    },
    {
      number: "4",
      title: "Add Recipients",
      description: "Specify which students can access papers after unlock. Or keep it open.",
      icon: Users,
    },
  ];

  const features = [
    {
      title: "Simple 4-Step Process",
      description: "Create your vault in under 5 minutes. No technical knowledge required.",
      icon: Zap,
    },
    {
      title: "Military-Grade Encryption",
      description: "Your papers encrypted with AES-256. Impossible to decrypt without keys.",
      icon: Lock,
    },
    {
      title: "Choose Your Blockchain",
      description: "Deploy on Polygon Amoy, Ethereum, or other networks. Your choice.",
      icon: CheckCircle,
    },
    {
      title: "Instant Confirmation",
      description: "Get vault deployed on blockchain instantly. See smart contract address immediately.",
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
              First Vault
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Secure your exam papers in 4 easy steps. No gas fees for setup on test networks.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">How to Create a Vault</h2>
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

      {/* CTA */}
      <section className="py-12 md:py-20 bg-heirlock-blue border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Secure Your Exams?
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Start creating your vault now. Deploy on test networks for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-black text-heirlock-blue font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Launch Vault Creator
            </button>
            <Link href="/">
              <button className="px-8 py-3 bg-white text-black font-bold border-4 border-black hover:bg-black hover:text-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
