'use client';

import { Code, FileText, Shield, Zap, BookOpen, ExternalLink, ChevronRight, Github } from "lucide-react";
import Link from "next/link";

export default function Documentation() {
  const docSections = [
    {
      title: "Developer Docs",
      description: "Complete technical documentation with architecture, smart contracts, and security models.",
      icon: Code,
      href: "/docs",
    },
    {
      title: "Getting Started",
      description: "Learn the basics of T.A.L.A. and how to set up your first vault.",
      icon: BookOpen,
      href: "/docs",
    },
    {
      title: "Architecture",
      description: "Understand the hybrid model combining Client, IPFS, and Blockchain.",
      icon: Shield,
      href: "/docs/architecture",
    },
    {
      title: "Smart Contracts",
      description: "Solidity reference for TimeLockedVault with function signatures and error codes.",
      icon: Code,
      href: "/docs/smart-contract",
    },
    {
      title: "Security Model",
      description: "Threat analysis, encryption standards (AES-256-GCM), and attack vector mitigations.",
      icon: Zap,
      href: "/docs/security",
    },
    {
      title: "API Reference",
      description: "Technical specifications for integrating T.A.L.A. into your applications.",
      icon: FileText,
      href: "/docs/smart-contract",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Documentation
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Complete guides, API reference, and technical documentation for T.A.L.A.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Link key={index} href={section.href}>
                  <div className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-full flex flex-col cursor-pointer">
                    <Icon className="w-8 h-8 text-heirlock-green mb-4" />
                    <h3 className="text-xl font-bold mb-3 flex-1">{section.title}</h3>
                    <p className="text-gray-700 text-sm mb-4">{section.description}</p>
                    <div className="flex items-center gap-2 text-heirlock-green font-bold">
                      Read More <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-green">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-heirlock-green bg-black p-8 shadow-brutal">
              <Github className="w-8 h-8 text-heirlock-green mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Open Source Code</h3>
              <p className="text-gray-300 mb-6">
                T.A.L.A. is fully open source. Review our smart contracts and frontend code on GitHub.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-heirlock-green font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                View on GitHub <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="border-4 border-heirlock-green bg-black p-8 shadow-brutal">
              <FileText className="w-8 h-8 text-heirlock-green mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Whitepaper</h3>
              <p className="text-gray-300 mb-6">
                Read our technical whitepaper explaining the T.A.L.A. architecture and security model.
              </p>
              <a
                href="#"
                className="text-heirlock-green font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Download PDF <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Need Help?
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Check our FAQ or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/faq">
              <button className="px-8 py-3 bg-black text-heirlock-green font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Visit FAQ
              </button>
            </Link>
            <a href="mailto:support@tala.edu" className="px-8 py-3 bg-white text-black font-bold border-4 border-black hover:bg-black hover:text-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
              Contact Support <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
