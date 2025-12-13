'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lock,
  Shield,
  Zap,
  BookOpen,
  Briefcase,
  Gavel,
  CheckCircle,
  ChevronRight,
  Code,
  Database,
  Globe,
  User,
  Unlock
} from "lucide-react";

// Micro Interactions Hook
function useMicroInteractions() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Scroll Reveal Animation */
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Shimmer */
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      /* Icon bounce on hover */
      @keyframes iconBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      /* Pulse effect */
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }

      /* Interactive Elements */
      .micro-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .micro-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
      }

      .micro-button:active {
        transform: translateY(-1px);
      }

      /* Card Hover Effects */
      .micro-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .micro-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12) !important;
      }

      .micro-card:hover .micro-icon {
        animation: iconBounce 0.6s ease-in-out;
        color: #FFFACD;
      }

      /* Icon hover */
      .micro-icon {
        transition: all 0.3s ease;
      }

      /* Scroll Reveal */
      .reveal-section {
        animation: slideUp 0.8s ease-out;
      }

      .reveal-card {
        animation: scaleIn 0.6s ease-out;
      }

      /* Button Ripple Effect */
      .micro-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      .micro-button:active::after {
        animation: ripple 0.6s ease-out;
      }

      @keyframes ripple {
        to {
          width: 300px;
          height: 300px;
          opacity: 0;
        }
      }

      /* Text Gradient Animation */
      .micro-gradient-text {
        background: linear-gradient(135deg, #000 0%, #333 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transition: all 0.3s ease;
      }

      /* Stat Number Animation */
      .micro-stat-box {
        transition: all 0.3s ease;
      }

      .micro-stat-box:hover {
        transform: scale(1.05);
        background-color: white !important;
      }

      /* Section Stagger */
      .stagger-1 { animation-delay: 0.1s; }
      .stagger-2 { animation-delay: 0.2s; }
      .stagger-3 { animation-delay: 0.3s; }
      .stagger-4 { animation-delay: 0.4s; }
      .stagger-5 { animation-delay: 0.5s; }
      .stagger-6 { animation-delay: 0.6s; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <main className="min-h-screen bg-cream">
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Hero Skeleton */}
      <section className="bg-gradient-to-br from-heirlock-yellow to-heirlock-blue py-12 md:py-20 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            <div className="skeleton-shimmer h-20 md:h-32 w-4/5 rounded"></div>
            <div className="skeleton-shimmer h-8 md:h-12 w-3/5 rounded"></div>
            <div className="space-y-3">
              <div className="skeleton-shimmer h-4 w-full rounded"></div>
              <div className="skeleton-shimmer h-4 w-5/6 rounded"></div>
            </div>
            <div className="flex gap-4">
              <div className="skeleton-shimmer h-12 w-32 rounded"></div>
              <div className="skeleton-shimmer h-12 w-40 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Section Skeleton */}
      <section className="bg-heirlock-red py-16 md:py-24 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="skeleton-shimmer h-12 md:h-16 w-3/5 rounded mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-4 border-black bg-black p-8">
                <div className="skeleton-shimmer h-16 w-20 rounded mb-3"></div>
                <div className="skeleton-shimmer h-6 w-full rounded mb-2"></div>
                <div className="skeleton-shimmer h-4 w-4/5 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Status Skeleton */}
      <section className="bg-black py-6 px-4 border-b-4 border-heirlock-yellow">
        <div className="container mx-auto max-w-5xl">
          <div className="border-4 border-heirlock-yellow bg-black p-4">
            <div className="skeleton-shimmer h-8 w-full rounded"></div>
          </div>
        </div>
      </section>

      {/* Three Pillars Skeleton */}
      <section className="py-16 md:py-24 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="skeleton-shimmer h-12 md:h-16 w-3/5 rounded mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border-4 border-black p-8">
                <div className="skeleton-shimmer h-12 w-12 rounded mb-4"></div>
                <div className="skeleton-shimmer h-6 w-4/5 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="skeleton-shimmer h-4 w-full rounded"></div>
                  <div className="skeleton-shimmer h-4 w-5/6 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Skeleton */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-blue border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="skeleton-shimmer h-12 md:h-16 w-3/5 rounded mb-12"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-4 border-black bg-white p-6 md:p-8 flex gap-6">
                <div className="skeleton-shimmer h-16 w-16 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="skeleton-shimmer h-6 w-2/5 rounded"></div>
                  <div className="space-y-2">
                    <div className="skeleton-shimmer h-4 w-full rounded"></div>
                    <div className="skeleton-shimmer h-4 w-5/6 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Specs Skeleton */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="skeleton-shimmer h-12 md:h-16 w-3/5 rounded mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-4 border-black bg-white p-8">
                <div className="skeleton-shimmer h-10 w-10 rounded mb-4"></div>
                <div className="skeleton-shimmer h-6 w-3/5 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="skeleton-shimmer h-4 w-full rounded"></div>
                  <div className="skeleton-shimmer h-4 w-4/5 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  useMicroInteractions();
  
  const pillars = [
    {
      title: "Education",
      description: "Exam Integrity. Time-lock papers until 10:00 AM sharp. Mathematical certainty replaces administrative trust.",
      icon: BookOpen,
      color: "bg-heirlock-yellow"
    },
    {
      title: "Governance",
      description: "Fair Tenders. Keep contractor bids sealed until the official opening moment. Corruption-proof procurement.",
      icon: Briefcase,
      color: "bg-heirlock-pink"
    },
    {
      title: "Legal",
      description: "Evidence Protection. Timestamp intellectual property and whistleblower evidence forever. Immutable proof.",
      icon: Gavel,
      color: "bg-heirlock-green"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "ENCRYPT.",
      description: "Client-side AES-256 encryption. Your file is locked on your device before it ever touches the internet. Raw files never reach our servers.",
      icon: Lock
    },
    {
      number: 2,
      title: "LOCK.",
      description: "Smart Contract accepts custody of the decryption key. Mathematical impossibility of early access. Even creators cannot bypass the time-lock.",
      icon: Zap
    },
    {
      number: 3,
      title: "REVEAL.",
      description: "At T-Minus Zero, the blockchain releases the key automatically. Students decrypt in their browser. Instant access guaranteed.",
      icon: Unlock
    }
  ];

  const securitySpecs = [
    {
      icon: Lock,
      title: "AES-256 Standards",
      description: "Military-grade encryption. Same standard used by Banks and Defense Systems."
    },
    {
      icon: Database,
      title: "Immutable Ledger",
      description: "Every action recorded on blockchain. Permanent audit trail. No deletion. No forgery."
    },
    {
      icon: User,
      title: "Non-Custodial",
      description: "You own your data. We never have encryption keys. Zero central point of failure."
    },
    {
      icon: Code,
      title: "Open Source",
      description: "Verify the code yourself. Audit by independent security firms. Transparency by design."
    }
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show skeleton for 800ms on initial load
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* ========== SECTION 1: HERO ========== */}
      <section className="bg-gradient-to-br from-heirlock-yellow to-heirlock-blue py-12 md:py-20 px-4 border-b-4 border-black relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-8xl font-black text-black leading-tight">
                <span className="whitespace-nowrap">THE VAULT IS</span><br />LOCKED.
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-black max-w-3xl">
                India's First Decentralized <span className="whitespace-nowrap">Time-Capsule</span> Protocol.
              </h2>
              <p className="text-lg md:text-xl text-gray-800 max-w-3xl leading-relaxed font-medium">
                Secure Exams, Government Tenders, and Legal Assets with mathematical certainty. Trust Code, Not Humans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/create-vault">
                  <button className="micro-button px-8 py-4 bg-black text-heirlock-yellow font-black border-4 border-black shadow-brutal inline-flex items-center gap-2 text-lg">
                    Launch App <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/documentation">
                  <button className="micro-button px-8 py-4 bg-white text-black font-black border-4 border-white shadow-brutal inline-flex items-center gap-2 text-lg">
                    Read Documentation <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Mascot */}
            <div className="relative h-80 md:h-96 hidden md:flex items-center justify-center group">
              <div className="absolute inset-0 animate-float">
                <Image
                  src="/mascot.png"
                  alt="T.A.L.A. Mascot"
                  fill
                  className="object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute top-10 right-0 opacity-5 w-96 h-96">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#000000" d="M40,-65C50,-55,55,-40,60,-25C65,-10,70,5,70,20C70,35,65,50,55,60C45,70,30,75,15,75C0,75,-15,70,-30,65C-45,60,-60,55,-70,45C-80,35,-85,20,-85,5C-85,-10,-80,-25,-70,-35C-60,-45,-45,-50,-30,-55C-15,-60,0,-65,15,-65C30,-65,30,-75,40,-65Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: CRISIS / PROBLEM ========== */}
      <section className="bg-heirlock-red py-16 md:py-24 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-12 leading-tight">
            THE COST OF HUMAN TRUST
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border-4 border-black bg-black p-8 shadow-brutal">
              <div className="text-5xl font-black text-heirlock-yellow mb-3">41+</div>
              <p className="text-xl text-white font-bold">Paper Leaks in 5 Years</p>
              <p className="text-gray-400 mt-2">Documented incidents of exam paper compromise</p>
            </div>
            <div className="border-4 border-black bg-black p-8 shadow-brutal">
              <div className="text-5xl font-black text-heirlock-pink mb-3">1.4 Cr</div>
              <p className="text-xl text-white font-bold">Students Affected</p>
              <p className="text-gray-400 mt-2">Lives disrupted by compromised exams and lost trust</p>
            </div>
            <div className="border-4 border-black bg-black p-8 shadow-brutal">
              <div className="text-5xl font-black text-heirlock-green mb-3">∞</div>
              <p className="text-xl text-white font-bold">Loss of Trust</p>
              <p className="text-gray-400 mt-2">Immeasurable damage to India's education system</p>
            </div>
          </div>

          <div className="border-4 border-black bg-hierlock-green p-8 md:p-10 shadow-brutal">
            <p className="text-xl md:text-2xl font-bold text-black leading-relaxed">
              <span className="text-black">Centralized systems have a single point of failure: The Human.</span> Whether through greed, coercion, or negligence, humans will eventually compromise systems they control. T.A.L.A. removes the human from the equation entirely.
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 3: LIVE NETWORK STATUS ========== */}
      <section className="bg-black py-6 px-4 border-b-4 border-heirlock-yellow">
        <div className="container mx-auto max-w-5xl">
          <div className="border-4 border-heirlock-yellow bg-black p-4 font-mono text-heirlock-yellow text-sm md:text-base overflow-x-auto shadow-brutal">
            <div className="flex items-center justify-between gap-4 whitespace-nowrap animate-pulse">
              <span className="inline-block">[ NETWORK: POLYGON AMOY ]</span>
              <span className="inline-block">●</span>
              <span className="inline-block">[ STATUS: OPERATIONAL ]</span>
              <span className="inline-block">●</span>
              <span className="inline-block">[ CURRENT BLOCK: 12,450,231 ]</span>
              <span className="inline-block">●</span>
              <span className="inline-block">[ GAS PRICE: 0.01 GWEI ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: THE THREE PILLARS ========== */}
      <section className="py-16 md:py-24 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-12">
            ONE PROTOCOL, THREE PILLARS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className={`micro-card ${pillar.color} border-4 border-black p-8 shadow-brutal stagger-${idx + 1}`}>
                  <Icon className="micro-icon w-12 h-12 text-black mb-4" />
                  <h3 className="text-2xl font-black text-black mb-3">{pillar.title}</h3>
                  <p className="text-black font-medium leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: HOW IT WORKS ========== */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-blue border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-16">
            HOW IT WORKS
          </h2>

          <div className="space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="micro-card border-4 border-black bg-white p-8 shadow-brutal stagger-${idx + 1}">
                  <div className="flex items-start gap-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-heirlock-blue border-4 border-black flex-shrink-0 shadow-brutal">
                      <span className="text-3xl font-black text-black">{step.number}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-black text-black mb-3">{step.title}</h3>
                      <p className="text-lg text-black leading-relaxed font-medium">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== SECTION 6: TECH STACK ========== */}
      <section className="py-16 md:py-24 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
            BUILT ON TRUSTLESS INFRASTRUCTURE
          </h2>
          <p className="text-lg text-black font-bold mb-12">We leverage the world's most secure decentralized networks.</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Polygon", desc: "EVM Security" },
              { name: "IPFS", desc: "Immutable Storage" },
              { name: "Next.js", desc: "Modern Frontend" },
              { name: "Wagmi", desc: "Web3 Hooks" },
              { name: "RainbowKit", desc: "Wallet Connect" }
            ].map((tech, idx) => (
              <div key={idx} className="micro-card border-4 border-black bg-white p-6 shadow-brutal text-center stagger-${idx + 1}">
                <h4 className="text-lg font-black text-black mb-1">{tech.name}</h4>
                <p className="text-sm text-gray-700">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 7: SECURITY SPECS ========== */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-12">
            SECURITY GUARANTEES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securitySpecs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div key={idx} className="micro-card border-4 border-black bg-white p-8 shadow-brutal stagger-${idx + 1}">
                  <Icon className="micro-icon w-10 h-10 text-black mb-4" />
                  <h3 className="text-2xl font-black text-black mb-3">{spec.title}</h3>
                  <p className="text-black font-medium leading-relaxed">{spec.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8: COMPARISON (Old vs New) ========== */}
      <section className="py-16 md:py-24 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-12">
            THE SHIFT FROM TRUST TO TRUTH
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="micro-card border-4 border-black bg-white p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-6 border-b-4 border-black pb-4">The Old Way (Web2)</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-black text-xl">✗</span>
                  <span className="text-black font-medium">Passwords can be stolen or shared</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-black text-xl">✗</span>
                  <span className="text-black font-medium">Admins can be bribed or coerced</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-black text-xl">✗</span>
                  <span className="text-black font-medium">Servers can be hacked or infiltrated</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-black text-xl">✗</span>
                  <span className="text-black font-medium">Audit trails can be altered or deleted</span>
                </li>
              </ul>
            </div>

            <div className="micro-card border-4 border-black bg-heirlock-green p-8 shadow-brutal">
              <h3 className="text-2xl font-black text-black mb-6 border-b-4 border-black pb-4">The T.A.L.A. Way (Web3)</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-black font-medium">Key locked on immutable blockchain</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-black font-medium">Logic enforced by mathematics, not humans</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-black font-medium">Storage decentralized across IPFS</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-black font-medium">Audit trail permanent and immutable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 9: MANIFESTO / VISION ========== */}
      <section className="py-16 md:py-24 px-4 bg-black border-b-4 border-heirlock-green">
        <div className="container mx-auto max-w-5xl">
          <div className="border-4 border-heirlock-green bg-black p-8 md:p-12 shadow-brutal">
            <blockquote className="text-2xl md:text-4xl font-black text-heirlock-green leading-tight mb-8">
              "In a digital democracy, secrecy should not depend on a bureaucrat's honesty. It should depend on mathematical laws."
            </blockquote>
            <p className="text-lg text-white font-bold">— The T.A.L.A. Protocol</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="micro-card border-4 border-white bg-black p-6 shadow-brutal stagger-1">
              <h3 className="text-white font-black mb-2">For Students</h3>
              <p className="text-gray-400">Fair exams. No leaks. Mathematical certainty.</p>
            </div>
            <div className="micro-card border-4 border-white bg-black p-6 shadow-brutal stagger-2">
              <h3 className="text-white font-black mb-2">For Government</h3>
              <p className="text-gray-400">Transparent tenders. Corruption-proof. Immutable proof.</p>
            </div>
            <div className="micro-card border-4 border-white bg-black p-6 shadow-brutal stagger-3">
              <h3 className="text-white font-black mb-2">For Society</h3>
              <p className="text-gray-400">Trust in code. Democracy in mathematics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 10: FINAL CTA ========== */}
      <section className="bg-heirlock-pink py-16 md:py-24 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-6">
            READY TO DEPLOY?
          </h2>
          <p className="text-xl md:text-2xl font-bold text-black mb-12 max-w-2xl mx-auto">
            Join Government Bodies, Universities, and Organizations securing the future with mathematical certainty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-vault">
              <button className="micro-button px-8 py-4 bg-black text-heirlock-pink font-black border-4 border-black shadow-brutal inline-flex items-center gap-2 text-lg">
                Connect Wallet <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="micro-button px-8 py-4 bg-white text-black font-black border-4 border-black shadow-brutal inline-flex items-center gap-2 text-lg"
            >
              GitHub Repo <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          <p className="text-black font-bold mt-8">The future is code. The future is T.A.L.A.</p>
        </div>
      </section>
    </main>
  );
}
