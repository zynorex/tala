'use client';

import { CheckCircle, Lock, Unlock, Zap, Clock, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Upload Your Exam Papers",
      description: "School admins upload exam papers securely. Papers are encrypted and stored non-custodially.",
      icon: Lock,
    },
    {
      number: "2",
      title: "Set Time-Lock Duration",
      description: "Define when papers should unlock. T.A.L.A. secures them until the exact moment.",
      icon: Clock,
    },
    {
      number: "3",
      title: "Oracle Monitoring",
      description: "Our 24/7 Oracle monitors the blockchain. When time expires, unlock triggers automatically.",
      icon: Zap,
    },
    {
      number: "4",
      title: "Automatic Release",
      description: "Papers unlock instantly to authorized students. No delays, no manual intervention needed.",
      icon: Unlock,
    },
  ];

  const features = [
    {
      title: "Non-Custodial Security",
      description: "Your private keys, your control. We never hold your exam papers. Military-grade encryption.",
      icon: Shield,
    },
    {
      title: "Time-Lock Smart Contracts",
      description: "Papers locked by code, not trust. Unlock at predetermined time automatically via blockchain oracle.",
      icon: CheckCircle,
    },
    {
      title: "Zero Gas for Admins",
      description: "Admins confirm readiness free of charge. Only initial setup costs gas. Everything else is free.",
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
              How T.A.L.A. <br />
              Works
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              A step-by-step guide to understanding how we protect your exam papers with blockchain and encryption.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">The Process</h2>
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

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-blue">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Key Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = ["bg-heirlock-blue", "bg-heirlock-green", "bg-heirlock-yellow"];
              return (
                <div
                  key={index}
                  className={`${colors[index % 3]} border-4 border-black p-6 shadow-brutal`}
                >
                  <Icon className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-black">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-heirlock-blue border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Secure Your Papers?
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Start using T.A.L.A. today. Create your first vault in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-vault">
              <button className="px-8 py-3 bg-black text-heirlock-blue font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Create Vault
              </button>
            </Link>
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
