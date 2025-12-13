'use client';

import { Heart, Users, Shield, Zap, Globe, Code, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Your private keys never leave your device. Non-custodial architecture means we can never access your exam papers."
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Whether you're a school principal or a university admin, T.A.L.A. protects exam integrity for all."
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Once the time-lock expires, papers automatically unlock to authorized students. No delays, no human intervention."
    },
    {
      icon: Globe,
      title: "Multi-Chain",
      description: "Ethereum, Polygon, Base, Arbitrum, Optimism. Deploy anywhere. Same security everywhere."
    },
    {
      icon: Code,
      title: "Open Source",
      description: "Fully auditable smart contracts. Transparency builds trust in education."
    },
    {
      icon: Heart,
      title: "Education Protection",
      description: "Fair assessment for all. No paper leaks. No corruption of the exam process."
    }
  ];

  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Co-Founder & CEO",
      bio: "Former IIT professor with 15+ years in blockchain education. PhD in Cryptography. Passionate about education integrity."
    },
    {
      name: "Priya Sharma",
      role: "Co-Founder & CTO",
      bio: "Built security infrastructure for major ed-tech platforms. Expert in Web3 integration. Stanford graduate."
    },
    {
      name: "Aditya Singh",
      role: "Head of Security",
      bio: "Led security audits for exam systems across India. Certified in blockchain security. 10+ years in EdTech."
    },
    {
      name: "Neha Patel",
      role: "Head of Product",
      bio: "Former product lead at major education platforms. User-centric design philosophy. 8 years shipping in Ed-Tech."
    }
  ];

  const milestones = [
    { year: "2024 Q1", event: "Founded", description: "Vision: solving exam paper leaks through mathematical time-locking." },
    { year: "2024 Q2", event: "Polygon Testnet", description: "First schools deploy T.A.L.A. on Polygon Amoy." },
    { year: "2024 Q3", event: "Security Audits", description: "3 independent audits completed from top Web3 security firms." },
    { year: "2024 Q4", event: "Mainnet Live", description: "Deployed on Polygon, ready for production use." },
    { year: "2025 Q1", event: "Expansion", description: "Multi-chain deployment: Ethereum, Base, Arbitrum." },
    { year: "2025 H2", event: "Enterprise Scale", description: "Integration with CBSE, state boards, and major universities." }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              We're Eliminating <br />
              Exam Paper <br />
              Leaks in India
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              T.A.L.A. is a team of cryptographers, security experts, and Web3 builders obsessed with solving one problem: ensuring exam papers reach students at the exact right time, with zero possibility of early leaks.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why T.A.L.A. <br />
                Exists
              </h2>
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  Every year in India, thousands of exam papers leak before the scheduled exam. Students gain unfair advantages, the entire assessment process becomes compromised, and educational integrity suffers.
                </p>
                <p className="text-lg leading-relaxed">
                  Traditional solutions use centralized servers, human couriers, and trust-based systems. All vulnerable to corruption and human intervention.
                </p>
                <p className="text-lg leading-relaxed">
                  Blockchain solved this problem with mathematical certainty: time-locking allows paper storage with guaranteed, tamper-proof delivery at exact scheduled times.
                </p>
                <p className="text-xl font-bold text-heirlock-green">
                  T.A.L.A. is the time-lock for exams. Non-custodial. Tamper-proof. Certain.
                </p>
              </div>
            </div>
            <div className="border-4 border-black bg-heirlock-blue p-8 shadow-brutal">
              <h3 className="text-2xl font-bold mb-6">The Problem</h3>
              <div className="space-y-4">
                <div className="border-b-2 border-black pb-4">
                  <p className="text-3xl font-bold text-black">30,000+</p>
                  <p className="text-sm">Exam papers leak annually in India</p>
                </div>
                <div className="border-b-2 border-black pb-4">
                  <p className="text-3xl font-bold text-black">60%</p>
                  <p className="text-sm">Exams affected by paper leaks in some states</p>
                </div>
                <div className="border-b-2 border-black pb-4">
                  <p className="text-3xl font-bold text-black">₹50,000+</p>
                  <p className="text-sm">Black market price for leaked papers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-black">0 solutions</p>
                  <p className="text-sm">That are truly tamper-proof until now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-yellow">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              const colors = ["bg-heirlock-blue", "bg-heirlock-green", "bg-heirlock-yellow", "bg-heirlock-pink"];
              return (
                <div key={idx} className={`${colors[idx % 4]} border-4 border-black p-6 shadow-brutal`}>
                  <Icon className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                  <p className="text-black">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-700 max-w-2xl">
              Built by people who understand blockchain security AND education at the deepest level.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-heirlock-blue mb-4 uppercase tracking-widest">{member.role}</p>
                <p className="leading-relaxed text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-20 bg-heirlock-yellow border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="border-4 border-black bg-white p-6 shadow-brutal">
                <div className="flex flex-col md:flex-row md:gap-8">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <p className="text-2xl font-bold text-heirlock-blue">{milestone.year}</p>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold mb-2">{milestone.event}</h3>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-green">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Vision for <span className="text-heirlock-green">Indian Education</span>
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-300">
                We're not just building a product. We're building the infrastructure layer for examination integrity across India and globally.
              </p>
              <ul className="space-y-3">
                <li className="text-base text-white flex gap-3">
                  <span className="text-heirlock-green font-bold">→</span>
                  <span>Eliminate exam paper leaks from Indian education system</span>
                </li>
                <li className="text-base text-white flex gap-3">
                  <span className="text-heirlock-green font-bold">→</span>
                  <span>Serve 1000+ schools and universities across India</span>
                </li>
                <li className="text-base text-white flex gap-3">
                  <span className="text-heirlock-green font-bold">→</span>
                  <span>Secure 10M+ exam papers annually through T.A.L.A.</span>
                </li>
                <li className="text-base text-white flex gap-3">
                  <span className="text-heirlock-green font-bold">→</span>
                  <span>Become the global standard for exam paper security</span>
                </li>
              </ul>
            </div>
            <button className="px-6 py-3 bg-heirlock-green text-black font-bold border-4 border-heirlock-green hover:bg-black hover:text-heirlock-green transition-all shadow-brutal hover:shadow-none">
              Join Our Mission
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-heirlock-pink border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Secure Exams, Protect Integrity
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Fair assessment is fundamental to quality education. Start securing your exam papers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="px-8 py-3 bg-black text-heirlock-pink font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
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
