'use client';

import { Download, Eye, Share2, Lock, Clock, Shield, Zap, Award, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function StudentPortal() {
  const features = [
    {
      title: "View Paper Status",
      description: "See exactly when your exam paper will be available. Live countdown to unlock time.",
      icon: Eye,
    },
    {
      title: "Instant Download",
      description: "Once time expires, download your papers instantly. No waiting, no delays.",
      icon: Download,
    },
    {
      title: "Verify Authenticity",
      description: "Blockchain-verified papers. Prove you received your exam from the official source.",
      icon: CheckCircle,
    },
    {
      title: "Share Results",
      description: "Easily share your exam results with universities or employers with verified proof.",
      icon: Share2,
    },
    {
      title: "Secure Access",
      description: "Your private keys, your access. No one can access your papers without your permission.",
      icon: Shield,
    },
    {
      title: "Time-Lock Protection",
      description: "Papers protected until the scheduled moment. Cryptographic security ensures fairness.",
      icon: Lock,
    },
  ];

  const benefits = [
    "No Paper Leaks - Cryptographically secure",
    "Fair Assessment - Everyone gets papers at same time",
    "Verified Authenticity - Blockchain-backed proof",
    "Complete Privacy - Your data never shared",
    "Multi-Device Access - Download from anywhere",
    "Permanent Records - Keep proof forever",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Student <br />
              Portal
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Access your exam papers with blockchain security. See the countdown and download instantly when time expires.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Your Student Tools</h2>
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Why Students Trust T.A.L.A.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="border-4 border-heirlock-green bg-black p-6 shadow-brutal flex items-start gap-4">
                <Award className="w-6 h-6 text-heirlock-green flex-shrink-0 mt-1" />
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
            Access Your Exam Portal
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Connect your wallet to see your scheduled exams and track unlock times.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-black text-heirlock-green font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Connect Wallet
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
