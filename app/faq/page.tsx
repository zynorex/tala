'use client';

import { ChevronDown, ChevronUp, HelpCircle, ChevronRight, Lock, Users, Briefcase, Code } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      category: "General & Security",
      color: "heirlock-yellow",
      icon: Lock,
      questions: [
        {
          question: "Why not just use a Password Protected PDF?",
          answer:
            "Passwords can be shared or stolen. T.A.L.A. uses a Smart Contract that physically refuses to release the password until the exact time. No human can bypass it. No hacker can steal it before the scheduled moment. The encryption key is locked inside immutable blockchain code.",
        },
        {
          question: "Is T.A.L.A. owned by the Government?",
          answer:
            "T.A.L.A. is neutral infrastructure. It is a protocol that any Board, Department, or Court can use. We do not control exams, tenders, or documents. We provide the cryptographic guarantee. You own your data.",
        },
        {
          question: "Is the encryption really unbreakable?",
          answer:
            "We use AES-256 (Advanced Encryption Standard), the same standard used by Banks and the Military. To brute-force this encryption would take billions of years using current supercomputers. It is mathematically unbreakable with known technology.",
        },
      ],
    },
    {
      category: "For Students (Exams)",
      color: "heirlock-green",
      icon: Users,
      questions: [
        {
          question: "Do I need to pay to view the paper?",
          answer:
            "No. Reading and unlocking the paper is completely free. You only need a wallet address to verify you are a real, authorized user. No cryptocurrency, no money, no subscription. Zero cost for students.",
        },
        {
          question: "What if my internet fails at 10:00 AM?",
          answer:
            "You download the heavy encrypted PDF *before* the exam—hours in advance. At 10:00 AM, you only need 1kb of data to fetch the decryption key. This works even on 2G internet. If your connection drops after unlocking, the decrypted PDF is already on your device.",
        },
        {
          question: "Will my identity be revealed?",
          answer:
            "No. T.A.L.A. is privacy-preserving. We verify your wallet address to confirm you are authorized. We never ask for your name, Aadhaar number, or personal information. Your blockchain transaction is pseudonymous.",
        },
        {
          question: "Can I download the exam paper before 10:00 AM?",
          answer:
            "Yes! You can download the encrypted file anytime. Verification of the file hash ensures it hasn't been tampered with. What you cannot do is decrypt it—the key is mathematically locked until the unlock time. This is a security feature.",
        },
        {
          question: "What if I lose my wallet password?",
          answer:
            "Once you unlock the exam and download the decrypted PDF, your wallet password doesn't matter anymore. The PDF is yours to keep. However, we recommend backing up your wallet securely as you would with any cryptocurrency wallet.",
        },
      ],
    },
    {
      category: "For Government (Tenders & Contracts)",
      color: "heirlock-pink",
      icon: Briefcase,
      questions: [
        {
          question: "How does this stop corruption in Tenders?",
          answer:
            "Currently, corrupt officials peek at sealed bids early to help their friends win. With T.A.L.A., the bids are AES-256 encrypted. Even the official opening the tender cannot read the bid amounts until the public opening time. The encryption key is locked in the blockchain until the official moment.",
        },
        {
          question: "Is this legally binding?",
          answer:
            "Yes. The Blockchain creates a \"Non-Repudiable Audit Trail.\" Every upload, lock, unlock, and modification is cryptographically signed. If a file was uploaded or unlocked, the blockchain signature proves exactly who did it and when. No one can deny it. This is admissible as legal evidence in court.",
        },
        {
          question: "Can an official change the unlock time after uploading?",
          answer:
            "No. Once the unlock time is recorded on the blockchain, it cannot be changed. The smart contract code enforces this mathematically. Even the uploading official cannot modify the time. This removes the possibility of \"forgetting\" to unlock something on time.",
        },
        {
          question: "What if we need to cancel the tender?",
          answer:
            "Officials can use the \"Emergency Void\" function to permanently destroy the encryption key on the blockchain. This makes the bid file absolutely unreadable by anyone, forever. The cancellation is permanently recorded on-chain as proof.",
        },
        {
          question: "How many tenders can we manage at once?",
          answer:
            "Unlimited. Each tender gets its own vault with its own encryption key and unlock time. You can manage 10 tenders or 1000 tenders simultaneously. The system is built for multi-tender operations.",
        },
      ],
    },
    {
      category: "Technical & Developers",
      color: "heirlock-blue",
      icon: Code,
      questions: [
        {
          question: "What if the exam/tender is cancelled?",
          answer:
            "The Admin can trigger the \"Emergency Void\" function. This permanently destroys the encryption key on the Polygon Blockchain, making the file unreadable forever. The cancellation is recorded on-chain as permanent, non-deniable proof. No student can access the file, even if they somehow obtained the original ciphertext.",
        },
        {
          question: "How scalable is it?",
          answer:
            "Highly scalable. The heavy PDF files are stored on IPFS (distributed network), not on our servers. Encryption happens client-side in the browser. The blockchain only stores tiny metadata (CID, unlock time, key hash). This architecture allows millions of concurrent users without server crashes.",
        },
        {
          question: "What happens if IPFS goes down?",
          answer:
            "IPFS is distributed across thousands of nodes worldwide run by independent parties. It has no single point of failure. Even if 99% of IPFS nodes went offline, as long as 1 node has the file, it remains accessible. But more realistically, files are redundantly stored by Pinata (our gateway), ensuring 99.99% availability.",
        },
        {
          question: "Can you read our exam papers?",
          answer:
            "No. The data never touches our servers. Encryption happens in your browser, and the encrypted ciphertext goes directly to IPFS. We never have access to encryption keys. Even if we wanted to read your papers, we physically cannot—the data is encrypted.",
        },
        {
          question: "What blockchains do you support?",
          answer:
            "Currently: Polygon Amoy (testnet) for testing. Mainnet support includes: Polygon (low cost, fast), with Ethereum and Arbitrum coming soon. You can choose which blockchain to use for your vault.",
        },
        {
          question: "How much does it cost to set up a vault?",
          answer:
            "On Polygon, vault setup costs ~₹1-2 (0.01-0.02 MATIC) in gas fees. Reading/unlocking is completely free (no gas cost for view operations). One-time setup, unlimited unlocks. No subscription fees.",
        },
        {
          question: "Can developers integrate T.A.L.A. into their LMS?",
          answer:
            "Yes. We provide REST APIs and SDKs for integration. Your LMS can upload exams, retrieve audit logs, and embed our unlock widget. All communication is encrypted (TLS 1.3). No exam content passes through our servers.",
        },
      ],
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="bg-heirlock-yellow py-12 md:py-20 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-black mb-4">F.A.Q.</h1>
            <h2 className="text-xl md:text-3xl font-bold text-black mb-6">
              Questions & Answers from Every Perspective.
            </h2>
            <p className="text-base md:text-lg font-medium text-black max-w-2xl mx-auto">
              Whether you're a student, government official, or developer, find answers to your concerns about T.A.L.A.'s security, logic, and usage.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {faqCategories.map((category, catIdx) => {
            const bgColor = {
              "heirlock-yellow": "bg-heirlock-yellow",
              "heirlock-green": "bg-heirlock-green",
              "heirlock-pink": "bg-heirlock-pink",
              "heirlock-blue": "bg-heirlock-blue",
            }[category.color] || "bg-heirlock-yellow";

            const CategoryIcon = category.icon;

            return (
              <div key={catIdx} className="mb-12">
                {/* Category Header */}
                <div className={`${bgColor} p-6 md:p-8 border-4 border-black mb-6 shadow-brutal`}>
                  <div className="flex items-center gap-4 mb-2">
                    <CategoryIcon className="w-8 h-8 text-black" />
                    <h2 className="text-3xl md:text-4xl font-black text-black">
                      {category.category}
                    </h2>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-3">
                  {category.questions.map((q, qIdx) => {
                    const isOpen = openIndex === globalIndex;
                    const currentIndex = globalIndex;
                    globalIndex++;

                    return (
                      <div
                        key={qIdx}
                        className="border-4 border-black bg-white shadow-brutal hover:shadow-brutal-lg transition-all"
                      >
                        <button
                          onClick={() => toggleQuestion(currentIndex)}
                          className="w-full p-6 md:p-7 text-left flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-black leading-tight">
                              {q.question}
                            </h3>
                          </span>
                          <div className="flex-shrink-0 mt-1">
                            {isOpen ? (
                              <ChevronUp className="w-6 h-6 text-black" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-black" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t-4 border-black bg-gray-50 p-6 md:p-7">
                            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                              {q.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-black border-t-4 border-black py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white border-4 border-white p-8 md:p-10 text-center shadow-brutal">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-black" />
            <p className="text-lg md:text-xl font-bold text-black mb-6">
              Still have doubts? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@nil.xyz"
                className="px-6 py-3 bg-heirlock-green text-black font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-block"
              >
                Email Support
              </a>
              <Link href="/documentation">
                <button className="px-6 py-3 bg-heirlock-blue text-black font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  Read Documentation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-heirlock-green py-12 md:py-16 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl md:text-4xl font-black text-black mb-6">
            Ready to Begin?
          </h3>
          <p className="text-base md:text-lg text-black mb-8 font-bold max-w-2xl mx-auto">
            Now that your questions are answered, deploy T.A.L.A. and secure your documents today.
          </p>
          <Link href="/create-vault">
            <button className="px-8 py-4 bg-black text-white font-black border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2 text-lg">
              Create Free Vault <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
