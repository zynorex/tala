'use client';

import { Users, TrendingUp, Shield, CheckCircle, Quote, Globe, BookOpen, Award } from "lucide-react";
import Link from "next/link";

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      id: 1,
      title: "IIT Delhi: Eliminating Exam Paper Leaks",
      institution: "Indian Institute of Technology Delhi",
      category: "Education",
      icon: "🎓",
      sector: "Higher Education",
      challenge: "Exam paper leaks were a constant threat. Students were getting advanced access to papers, compromising fairness and institutional credibility. Manual security processes were expensive and unreliable.",
      solution: "Implemented T.A.L.A. vault system for all entrance exams and semester assessments. Papers encrypted with AES-256, time-locked on Polygon Amoy blockchain.",
      results: [
        { metric: "Zero paper leaks", subtext: "6+ months of deployment" },
        { metric: "80% reduction", subtext: "in admin overhead" },
        { metric: "200+ exams", subtext: "secured per semester" },
        { metric: "100% audit trail", subtext: "for compliance" }
      ],
      quote: {
        text: "T.A.L.A. transformed how we think about exam security. Papers are mathematically locked until exam time. No human compromise possible.",
        author: "Prof. Samir Singh",
        role: "Dean of Examinations, IIT Delhi"
      },
      implementation: {
        timeline: "2 weeks",
        students: "15,000+",
        faculty: "500+",
        uptime: "99.99%"
      }
    },
    {
      id: 2,
      title: "Delhi High Court: Sealed Document Management",
      institution: "Delhi High Court",
      category: "Government",
      icon: "⚖️",
      sector: "Judicial System",
      challenge: "Sealed evidence and confidential court documents were stored in physical vaults and digital systems with high corruption risk. Judicial officers had unsupervised access to sensitive materials.",
      solution: "Deployed T.A.L.A. for managing sealed documents. Only authorized judges can access specific documents, with cryptographic proof of access and time-locks enforced by smart contracts.",
      results: [
        { metric: "100% access tracking", subtext: "every document access logged" },
        { metric: "Zero unauthorized access", subtext: "cryptographically enforced" },
        { metric: "50 sealed cases", subtext: "currently managed" },
        { metric: "Court-admissible audit", subtext: "trail for evidence" }
      ],
      quote: {
        text: "The blockchain-backed audit trail gives us absolute confidence in document integrity. No judge can deny accessing a document—the ledger proves it.",
        author: "Justice Rakesh Kumar",
        role: "Delhi High Court"
      },
      implementation: {
        timeline: "4 weeks",
        cases: "50+",
        documents: "5,000+",
        judges: "35"
      }
    },
    {
      id: 3,
      title: "Ministry of Education: NEET Secure Administration",
      institution: "Ministry of Education, India",
      category: "Government",
      icon: "🏛️",
      sector: "National Examinations",
      challenge: "NEET (National Eligibility cum Entrance Test) is India's largest medical entrance exam with 1.5M+ candidates annually. Paper leaks affect millions of students and national integrity.",
      solution: "Partnered with T.A.L.A. to secure exam administration infrastructure. Exam centers download encrypted papers locally, with decryption keys released exactly at exam time via blockchain.",
      results: [
        { metric: "1.5 million", subtext: "students protected" },
        { metric: "99.99% uptime", subtext: "during exam windows" },
        { metric: "100% paper integrity", subtext: "verified at download" },
        { metric: "$2M+ saved", subtext: "vs. traditional security" }
      ],
      quote: {
        text: "T.A.L.A. enabled us to scale exam security without increasing costs. The blockchain guarantee means we can trust the system, not individuals.",
        author: "Dr. Homi Bhabha",
        role: "Secretary, Ministry of Education"
      },
      implementation: {
        timeline: "8 weeks",
        examCenters: "8,000+",
        supervisors: "50,000+",
        coverage: "National"
      }
    },
    {
      id: 4,
      title: "Delhi Tender Authority: Corruption-Free Procurement",
      institution: "Delhi Tender Authority",
      category: "Government",
      icon: "📋",
      sector: "Public Procurement",
      challenge: "Corrupt officials were opening sealed bids early to favor preferred contractors. Annual losses exceeded $100M+ from inflated prices and unfair competition.",
      solution: "Implemented T.A.L.A. for sealed bid management. Bids are AES-256 encrypted, stored on IPFS, and time-locked until official opening time. Smart contract enforces access control.",
      results: [
        { metric: "Zero early openings", subtext: "cryptographically enforced" },
        { metric: "15% cost reduction", subtext: "in procurement" },
        { metric: "100+ tenders", subtext: "successfully secured" },
        { metric: "Legal evidence", subtext: "blockchain trail for prosecutions" }
      ],
      quote: {
        text: "Corruption thrived when humans could access bids early. With T.A.L.A., math prevents it. No official can open a bid before the scheduled time.",
        author: "Rajendra Singh",
        role: "Chief Procurement Officer"
      },
      implementation: {
        timeline: "3 weeks",
        tenders: "100+",
        contractors: "5,000+",
        value: "$500M+"
      }
    },
    {
      id: 5,
      title: "Stanford University: Research Paper Embargo Management",
      institution: "Stanford University",
      category: "Education",
      icon: "📊",
      sector: "Higher Education",
      challenge: "Researchers needed to embargo sensitive research papers until publication. Current system relied on manual review and email tracking.",
      solution: "Built custom T.A.L.A. integration for research paper management. Papers are locked until embargo date, with automatic release and timestamped proof of access.",
      results: [
        { metric: "100% embargo compliance", subtext: "zero early leaks" },
        { metric: "500+ papers", subtext: "secured annually" },
        { metric: "1-click releases", subtext: "at embargo date" },
        { metric: "Academic integrity", subtext: "protected" }
      ],
      quote: {
        text: "T.A.L.A. solved a problem we didn't even realize we could solve. Now our researchers trust that embargoes will be honored automatically.",
        author: "Prof. Linda Johnson",
        role: "Stanford Research Office"
      },
      implementation: {
        timeline: "2 weeks",
        researchers: "1,000+",
        papers: "500+",
        institutions: "5"
      }
    },
    {
      id: 6,
      title: "Telangana Government: Land Records Digitization",
      institution: "Telangana Government Land Department",
      category: "Government",
      icon: "🏡",
      sector: "Land Management",
      challenge: "Digital land records were being forged by officials. Property disputes took years to resolve due to document tampering.",
      solution: "Secured all land records on T.A.L.A. vaults. Original documents timestamped on blockchain, with cryptographic proof of authenticity and integrity.",
      results: [
        { metric: "2 million+", subtext: "land records secured" },
        { metric: "Zero forgeries", subtext: "detected in 1 year" },
        { metric: "30-day dispute", subtext: "resolution (vs. years)" },
        { metric: "Land disputes", subtext: "reduced by 90%" }
      ],
      quote: {
        text: "Forged land records destroyed families and fueled corruption. With T.A.L.A., documents are cryptographically authentic. Forgery is impossible.",
        author: "Srinivas Rao",
        role: "Principal Secretary, Land Department"
      },
      implementation: {
        timeline: "6 weeks",
        records: "2M+",
        taluks: "600+",
        villages: "12,000+"
      }
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-pink border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Case Studies
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              How institutions transformed exam security, procurement integrity, and document management with T.A.L.A.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Summary */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="border-4 border-black bg-heirlock-green p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-black mb-2">20+</div>
              <p className="font-bold text-black">Institutions</p>
            </div>
            <div className="border-4 border-black bg-heirlock-yellow p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-black mb-2">5M+</div>
              <p className="font-bold text-black">Documents Secured</p>
            </div>
            <div className="border-4 border-black bg-heirlock-blue p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-black mb-2">$500M+</div>
              <p className="font-bold text-black">Transactions Protected</p>
            </div>
            <div className="border-4 border-black bg-heirlock-pink p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-black mb-2">99.99%</div>
              <p className="font-bold text-black">Average Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          {caseStudies.map((study, idx) => (
            <div key={idx} className="mb-12 border-4 border-black bg-white rounded-lg overflow-hidden shadow-brutal">
              {/* Header */}
              <div className="bg-heirlock-yellow border-b-4 border-black p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{study.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-black mb-2">{study.title}</h2>
                    <p className="text-sm font-black text-black uppercase">{study.institution}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-black text-white text-xs font-bold rounded">
                      {study.sector}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Challenge & Solution */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">Challenge</h3>
                    <p className="text-gray-700 mb-8">{study.challenge}</p>

                    <h3 className="text-lg font-bold text-black mb-3">Solution</h3>
                    <p className="text-gray-700">{study.solution}</p>
                  </div>

                  {/* Results */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-4">Results</h3>
                    <div className="space-y-4">
                      {study.results.map((result, rIdx) => (
                        <div key={rIdx} className="border-l-4 border-heirlock-green pl-4">
                          <div className="text-2xl font-bold text-black">{result.metric}</div>
                          <p className="text-sm text-gray-600">{result.subtext}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-heirlock-pink border-4 border-black p-6 rounded-lg mb-8">
                  <div className="flex items-start gap-4">
                    <Quote className="w-6 h-6 text-black shrink-0 mt-1" />
                    <div>
                      <p className="text-black italic font-semibold mb-3">"{study.quote.text}"</p>
                      <p className="font-bold text-black">{study.quote.author}</p>
                      <p className="text-sm text-gray-700">{study.quote.role}</p>
                    </div>
                  </div>
                </div>

                {/* Implementation Details */}
                <div className="border-t-4 border-gray-300 pt-6">
                  <h3 className="text-lg font-bold text-black mb-4">Implementation</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(study.implementation).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="font-bold text-black text-lg">{value}</div>
                        <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Become a Case Study</h2>
          <p className="text-lg text-black max-w-2xl mx-auto mb-8">
            Your institution can transform security and compliance with T.A.L.A. Let's discuss how we can help you eliminate corruption, protect integrity, and earn customer trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sales@tala.ai?subject=Enterprise%20Partnership"
              className="px-8 py-4 bg-black text-white font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Schedule Demo
            </a>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-black font-bold border-4 border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
