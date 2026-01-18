'use client';

import { CheckCircle, Clock, Zap, Code, Shield, Globe, Users, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const quarters = [
    {
      quarter: "Q1 2026",
      status: "in-progress",
      color: "heirlock-green",
      icon: Zap,
      features: [
        {
          title: "Mainnet Launch",
          description: "Polygon PoS mainnet deployment. Real transactions, production-ready.",
          status: "in-progress",
          priority: "critical"
        },
        {
          title: "Advanced Analytics Dashboard",
          description: "Institution-level insights: exam access patterns, anomaly detection, compliance reports.",
          status: "in-progress",
          priority: "high"
        },
        {
          title: "API & Webhooks",
          description: "REST API for integrations with LMS, exam software, and institutional systems.",
          status: "planned",
          priority: "high"
        },
        {
          title: "Bulk Operations",
          description: "Upload 1,000 documents, configure permissions, and manage time-locks in one operation.",
          status: "planned",
          priority: "high"
        }
      ]
    },
    {
      quarter: "Q2 2026",
      status: "planned",
      color: "heirlock-yellow",
      icon: Shield,
      features: [
        {
          title: "Zero-Knowledge Rollups",
          description: "ZK-SNARK integration for 1000x faster and cheaper transactions.",
          status: "planned",
          priority: "high"
        },
        {
          title: "Zero-Knowledge Proofs",
          description: "Verify credentials and audit trails without exposing sensitive data.",
          status: "planned",
          priority: "high"
        },
        {
          title: "Privacy-Preserving Analytics",
          description: "Detect fraud and anomalies using cryptographic techniques, not surveillance.",
          status: "planned",
          priority: "medium"
        },
        {
          title: "Advanced Access Control",
          description: "Role-based access, delegation, and temporary share links with expiration.",
          status: "planned",
          priority: "medium"
        }
      ]
    },
    {
      quarter: "Q3 2026",
      status: "planned",
      color: "heirlock-pink",
      icon: Globe,
      features: [
        {
          title: "Multi-Chain Support",
          description: "Deploy on Ethereum, Optimism, Arbitrum, and other major L2s.",
          status: "planned",
          priority: "high"
        },
        {
          title: "Bridge Infrastructure",
          description: "Seamlessly move vaults between chains based on cost and performance.",
          status: "planned",
          priority: "high"
        },
        {
          title: "Interoperability Standards",
          description: "Work with W3C on cross-chain educational data formats.",
          status: "planned",
          priority: "medium"
        },
        {
          title: "Mobile App (Beta)",
          description: "iOS/Android app for exam access and vault management.",
          status: "planned",
          priority: "medium"
        }
      ]
    },
    {
      quarter: "Q4 2026",
      status: "planned",
      color: "heirlock-blue",
      icon: Users,
      features: [
        {
          title: "AI-Powered Proctoring",
          description: "Optional AI analysis of exam conditions (anomalies, suspicious patterns).",
          status: "planned",
          priority: "medium"
        },
        {
          title: "Fraud Detection Engine",
          description: "Machine learning models to detect and flag unusual exam behavior.",
          status: "planned",
          priority: "medium"
        },
        {
          title: "EdTech Ecosystem Integration",
          description: "Connect with course platforms, credential issuers, and employer verification.",
          status: "planned",
          priority: "medium"
        },
        {
          title: "Student Learning Records",
          description: "Verifiable record of all learning achievements, owned by students.",
          status: "planned",
          priority: "high"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-heirlock-green text-black";
      case "in-progress":
        return "bg-heirlock-yellow text-black";
      case "planned":
        return "bg-heirlock-pink text-black";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-4 border-red-600";
      case "high":
        return "border-l-4 border-heirlock-green";
      case "medium":
        return "border-l-4 border-heirlock-yellow";
      default:
        return "border-l-4 border-gray-400";
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Product Roadmap
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Our 2026 vision: from mainnet launch to AI-powered proctoring and cross-chain interoperability.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          {quarters.map((q, qIdx) => {
            const QuarterIcon = q.icon;
            return (
              <div key={qIdx} className="mb-16">
                {/* Quarter Header */}
                <div className="mb-8 border-4 border-black p-6 rounded-lg" style={{ backgroundColor: `var(--color-${q.color})` }}>
                  <div className="flex items-center gap-4">
                    <QuarterIcon className="w-8 h-8 text-black" />
                    <div>
                      <h2 className="text-3xl font-bold text-black">{q.quarter}</h2>
                      <span className={`inline-block mt-2 px-3 py-1 rounded font-bold text-sm ${getStatusColor(q.status)}`}>
                        {q.status === 'in-progress' ? '🔄 In Progress' : '📅 Planned'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {q.features.map((feature, fIdx) => (
                    <div key={fIdx} className={`border-4 border-black bg-white p-6 rounded-lg ${getPriorityColor(feature.priority)}`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
                          <p className="text-gray-700 text-sm mb-4">{feature.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-300">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(feature.status)}`}>
                          {feature.status === 'completed' ? '✓ Done' : feature.status === 'in-progress' ? '→ In Progress' : '○ Planned'}
                        </span>
                        <span className="text-xs font-bold uppercase text-gray-600">
                          {feature.priority} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 md:py-20 bg-heirlock-yellow border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">Beyond 2026</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-4 border-black bg-white p-8 rounded-lg">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold text-black mb-3">Decentralized Exam Governance</h3>
              <p className="text-gray-700 text-sm">
                DAOs managing exam standards and accreditation. Communities govern their educational systems.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-8 rounded-lg">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-black mb-3">Student-Owned Records</h3>
              <p className="text-gray-700 text-sm">
                Every student controls a verifiable record of all achievements. Portable, lifelong learning history.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-8 rounded-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-black mb-3">Global Network</h3>
              <p className="text-gray-700 text-sm">
                Thousands of institutions worldwide using T.A.L.A. as the foundation for secure, transparent education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="border-4 border-black bg-heirlock-pink p-12 rounded-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Influence Our Roadmap</h2>
            <p className="text-lg text-black max-w-2xl mx-auto mb-8">
              What features matter most to you? Vote on features, submit ideas, and help shape the future of T.A.L.A.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://feature-voting.nil.ai"
                className="px-8 py-4 bg-black text-white font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity"
              >
                Vote on Features
              </a>
              <a
                href="mailto:product@nil.ai?subject=Feature%20Request"
                className="px-8 py-4 bg-white text-black font-bold border-4 border-black rounded-lg hover:bg-gray-50 transition-colors"
              >
                Submit Feedback
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
