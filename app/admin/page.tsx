'use client';

import { Lock, Users, Zap, BarChart3, Shield, Settings, Upload, CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const features = [
    {
      title: "Upload Exam Papers",
      description: "Securely upload and manage exam papers. Encrypted storage with non-custodial security.",
      icon: Upload,
    },
    {
      title: "Set Time-Locks",
      description: "Define precise unlock times. Papers remain locked until the exact moment you specify.",
      icon: Clock,
    },
    {
      title: "Free Check-ins",
      description: "Confirm papers are ready gas-free. Only initial setup costs network fees.",
      icon: Zap,
    },
    {
      title: "Monitor Status",
      description: "Real-time dashboard showing paper status, unlock times, and oracle monitoring.",
      icon: BarChart3,
    },
    {
      title: "Student Management",
      description: "Create student groups and manage who can access papers after unlock.",
      icon: Users,
    },
    {
      title: "Security Controls",
      description: "Advanced security settings, audit logs, and access controls for peace of mind.",
      icon: Shield,
    },
  ];

  const benefits = [
    "100% Non-Custodial - We never access your papers",
    "99.99% Uptime - Oracle monitoring 24/7",
    "Zero Paper Leaks - Cryptographic security",
    "Multi-Chain Support - Polygon, Ethereum, and more",
    "Gas-Optimized - Minimal transaction costs",
    "Instant Unlock - Automatic release at scheduled time",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-pink border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Admin <br />
              Dashboard
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Manage exam papers with blockchain-powered security. Upload, lock, and release with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <Icon className="w-8 h-8 text-heirlock-pink mb-4" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-pink">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Why Choose T.A.L.A. for Admins?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="border-4 border-heirlock-pink bg-black p-6 shadow-brutal flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-heirlock-pink flex-shrink-0 mt-1" />
                <p className="text-white">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-heirlock-pink border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Get Started with Admin Dashboard
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Upload your first exam vault and experience blockchain security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-vault">
              <button className="px-8 py-3 bg-black text-heirlock-pink font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Access Admin Dashboard
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

