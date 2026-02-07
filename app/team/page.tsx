'use client';

import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & Chief Architect",
      bio: "Cryptographer and blockchain engineer with 15+ years in security infrastructure. PhD in Computer Science from IIT Delhi. Previously built security systems at Google and Microsoft.",
      expertise: ["Smart Contracts", "Cryptography", "System Design"],
      image: "👨‍💼",
      social: {
        email: "support@usetala.in",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com"
      }
    },
    {
      name: "Priya Sharma",
      role: "VP Engineering & Protocol Lead",
      bio: "Full-stack blockchain engineer with expertise in Solidity and Web3. Led engineering at two successful Web3 startups. Expert in gas optimization and Layer 2 solutions.",
      expertise: ["Solidity", "Web3", "DevOps"],
      image: "👩‍💻",
      social: {
        email: "support@usetala.in",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com"
      }
    },
    {
      name: "Rohan Patel",
      role: "Head of Product",
      bio: "Product strategist with background in edtech and government technology. Worked with 50+ educational institutions across India. Deep understanding of exam security requirements.",
      expertise: ["Product Strategy", "Education", "Government Relations"],
      image: "👨‍🔬",
      social: {
        email: "support@usetala.in",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com"
      }
    },
    {
      name: "Aisha Chen",
      role: "Head of Security",
      bio: "Security researcher with 12 years in penetration testing and compliance. CISSP certified. Managed security for Fortune 500 companies in financial and healthcare sectors.",
      expertise: ["Security Audit", "Compliance", "Penetration Testing"],
      image: "👩‍🏫",
      social: {
        email: "support@usetala.in",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com"
      }
    },
    {
      name: "Marcus Webb",
      role: "Frontend Lead",
      bio: "UI/UX engineer with 8 years building consumer-facing applications. Expert in React, Next.js, and design systems. Created design systems for multiple startups.",
      expertise: ["React", "UX Design", "Design Systems"],
      image: "👨‍🎨",
      social: {
        email: "support@usetala.in",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com"
      }
    },
    {
      name: "Elena Rodriguez",
      role: "Growth & Partnerships",
      bio: "Growth strategist with experience scaling B2B SaaS products. Built partnerships with 100+ schools and government agencies. Expert in enterprise sales and go-to-market strategy.",
      expertise: ["Growth Strategy", "Enterprise Sales", "Partnerships"],
      image: "👩‍💼",
      social: {
        email: "support@usetala.in",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com"
      }
    }
  ];

  const advisors = [
    {
      name: "Dr. Vitalik Buterin",
      role: "Ethereum Co-founder",
      expertise: "Blockchain & Consensus Mechanisms",
      image: "👤"
    },
    {
      name: "Prof. Raghunath Mashelkar",
      role: "Former Director CSIR",
      expertise: "Government Policy & Innovation",
      image: "👤"
    },
    {
      name: "Kiran Bedi",
      role: "Former Police Commissioner",
      expertise: "Law Enforcement & Governance",
      image: "👤"
    },
    {
      name: "Dr. Shashi Tharoor",
      role: "Member of Parliament",
      expertise: "Policy & Public Administration",
      image: "👤"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-blue border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Meet the Team
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Cryptographers, engineers, and changemakers building the future of secure education.
            </p>
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Core Team</h2>
            <p className="text-lg text-gray-700 max-w-2xl">
              Six professionals with decades of combined experience in blockchain, security, and education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="border-4 border-black bg-white shadow-brutal p-8 rounded-lg flex flex-col h-full">
                {/* Avatar */}
                <div className="text-5xl mb-4">{member.image}</div>

                {/* Name & Role */}
                <h3 className="text-2xl font-bold text-black mb-1">{member.name}</h3>
                <p className="text-sm font-black text-heirlock-green uppercase mb-4">{member.role}</p>

                {/* Bio */}
                <p className="text-gray-700 text-sm mb-4 flex-1">
                  {member.bio}
                </p>

                {/* Expertise */}
                <div className="mb-6 border-t-2 border-gray-300 pt-4">
                  <p className="text-xs font-bold text-black uppercase mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-heirlock-yellow text-black text-xs font-bold rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 border-t-2 border-gray-300 pt-4">
                  <a href={`mailto:${member.social.email}`} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="Email">
                    <Mail className="w-4 h-4" />
                  </a>
                  <a href={member.social.linkedin} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={member.social.twitter} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="Twitter">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href={member.social.github} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-12 md:py-20 bg-heirlock-yellow border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Advisory Board</h2>
            <p className="text-lg text-gray-800 max-w-2xl">
              Guided by leaders in blockchain, policy, and governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisors.map((advisor, idx) => (
              <div key={idx} className="border-4 border-black bg-white p-6 rounded-lg">
                <div className="text-4xl mb-4">{advisor.image}</div>
                <h3 className="text-xl font-bold text-black mb-1">{advisor.name}</h3>
                <p className="text-sm font-black text-heirlock-green uppercase mb-3">{advisor.role}</p>
                <p className="text-gray-700 text-sm">{advisor.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">Our Culture</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-black bg-heirlock-green p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-4">We Believe In</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Decentralization:</strong> Power should be distributed, not centralized.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Privacy:</strong> Your data is yours. We never sell or misuse it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Transparency:</strong> Open source where possible. Code is law.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Impact:</strong> We measure success by lives improved, not just revenue.</span>
                </li>
              </ul>
            </div>

            <div className="border-4 border-black bg-heirlock-pink p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-4">We Avoid</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Hype:</strong> We build solid technology, not marketing fluff.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Shortcuts:</strong> Security cannot be compromised for speed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Surveillance:</strong> We don't track, analyze, or profile users.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Enshittification:</strong> We won't degrade service for profit.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-heirlock-blue border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Join Us</h2>
          <p className="text-lg text-black max-w-2xl mx-auto mb-8">
            We're hiring engineers, product managers, and security researchers. Interested in building the future of education security?
          </p>
          <a
            href="mailto:support@usetala.in"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </main>
  );
}

