'use client';

import { ChevronDown, ChevronUp, Shield, Zap, Lock, Users, HelpCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is T.A.L.A.?",
          answer:
            "T.A.L.A. (Time-locked Accessible Learning Archive) is a blockchain-based system that secures exam papers with time-lock cryptography and automatic release. It prevents paper leaks while ensuring fair, instant access to authorized students at scheduled times.",
        },
        {
          question: "How does T.A.L.A. prevent exam paper leaks?",
          answer:
            "Papers are encrypted using AES-256 before being stored on the blockchain. Time-locked smart contracts prevent decryption until the scheduled unlock time. The private keys stay with administrators, not with T.A.L.A., making it impossible for anyone to access papers early.",
        },
        {
          question: "Is T.A.L.A. open source?",
          answer:
            "Yes, T.A.L.A. is fully open source. You can review all smart contracts and source code on GitHub. This transparency is crucial for educational institutions to verify security.",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          question: "Which blockchains does T.A.L.A. support?",
          answer:
            "Currently, T.A.L.A. is deployed on Polygon Amoy, Ethereum Sepolia, and Arbitrum Sepolia for testing. Mainnet deployments on Polygon, Ethereum, and Arbitrum are coming soon.",
        },
        {
          question: "How much does it cost to use T.A.L.A.?",
          answer:
            "Initial vault setup requires a small amount of gas (typically $1-5 on Polygon). Admin check-ins are free on gas-optimized networks. Student access and paper downloads are completely free.",
        },
        {
          question: "How are papers encrypted?",
          answer:
            "Papers are encrypted using AES-256 on the client side before being uploaded. The encryption keys never leave your device. Only authorized users with the correct key can decrypt papers after unlock.",
        },
      ],
    },
    {
      category: "For Administrators",
      questions: [
        {
          question: "How do I upload exam papers?",
          answer:
            "Log in to your admin dashboard, connect your wallet, and click 'Create Vault'. Upload your papers (they'll be encrypted), set the unlock time, add authorized students, and deploy. Takes about 5 minutes.",
        },
        {
          question: "Can I update papers after uploading?",
          answer:
            "Once papers are locked and deployed, they cannot be modified. This is a security feature. Plan carefully before deployment. You can create new vaults with updated papers if needed.",
        },
        {
          question: "What happens if the oracle fails?",
          answer:
            "We have redundant oracle infrastructure with 99.99% uptime. In the extremely unlikely event of oracle failure, papers will still be accessible through direct blockchain interaction. You can also manually trigger the unlock function.",
        },
      ],
    },
    {
      category: "For Students",
      questions: [
        {
          question: "When can I access my exam papers?",
          answer:
            "You'll see a countdown timer in your student portal showing exactly when papers will unlock. Once the time expires, you can download them instantly. Check back at the scheduled time.",
        },
        {
          question: "Can I download papers multiple times?",
          answer:
            "Yes, once papers are unlocked, you can download them as many times as you need. They're stored securely and you get permanent access.",
        },
        {
          question: "What if I lose my access?",
          answer:
            "Your access is tied to your wallet address. As long as you have access to the wallet that was authorized, you can always download your papers.",
        },
      ],
    },
    {
      category: "Security",
      questions: [
        {
          question: "Has T.A.L.A. been audited?",
          answer:
            "Yes, all smart contracts have been audited by leading blockchain security firms. Audit reports are available on our Smart Contracts page. We maintain high security standards.",
        },
        {
          question: "What if someone hacks my wallet?",
          answer:
            "If your wallet is compromised, immediately contact your school admin. They can revoke access and grant it to a new wallet. Never share your private keys with anyone.",
        },
        {
          question: "Can T.A.L.A. admins access my papers?",
          answer:
            "No. T.A.L.A. is completely non-custodial. We never have access to encryption keys or papers. Even our founders cannot decrypt your exam papers.",
        },
      ],
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let questionIndex = 0;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Frequently Asked <br />
              Questions
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Find answers to common questions about T.A.L.A., security, and how it works.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-3 sm:px-4">
          <div className="space-y-16">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b-4 border-heirlock-green">
                  <HelpCircle className="w-6 h-6 text-heirlock-green" />
                  <h2 className="text-3xl md:text-4xl font-bold text-black">{section.category}</h2>
                </div>

                <div className="space-y-4">
                  {section.questions.map((q, qIndex) => {
                    const globalIndex = questionIndex++;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={qIndex}
                        className="border-4 border-black bg-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        <button
                          onClick={() => toggleQuestion(globalIndex)}
                          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="text-lg font-bold text-black text-left">{q.question}</h3>
                          {isOpen ? (
                            <ChevronUp className="w-6 h-6 text-heirlock-green flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-heirlock-green flex-shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 border-t-4 border-heirlock-green pt-4">
                            <p className="text-gray-700 leading-relaxed">{q.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-green">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="border-4 border-heirlock-green bg-black p-12 shadow-brutal">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-heirlock-green">Still Have Questions?</h2>
            <p className="text-gray-300 mb-8">
              Can't find what you're looking for? Reach out to our support team. We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:support@tala.edu"
                className="flex-1 bg-heirlock-green text-black px-6 py-4 font-bold rounded border-4 border-heirlock-green hover:bg-black hover:text-heirlock-green transition-all text-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                Email Support
              </a>
              <Link href="/documentation" className="flex-1">
                <button className="w-full border-4 border-heirlock-green text-heirlock-green px-6 py-4 font-bold rounded hover:bg-heirlock-green hover:text-black transition-all shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                  Read Documentation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
