'use client';

import Image from "next/image";
import Link from 'next/link';
import { 
  Heart, 
  Shield, 
  Cloud, 
  Link2, 
  Unlock, 
  Code2, 
  Lock,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Papers Protected", value: "5,234", icon: Lock },
    { label: "Schools Using T.A.L.A.", value: "142", icon: Shield },
    { label: "99.99% Uptime", value: "Always Secure", icon: Zap },
    { label: "Zero Leaks", value: "100%", icon: CheckCircle },
  ];

  const features = [
    {
      title: "Gas-Free Check-ins",
      description: "Administrators confirm papers are ready. Free every time. Only setup costs network gas.",
      icon: Heart,
    },
    {
      title: "100% Non-Custodial",
      description: "Your private keys never leave your device. We never have access to papers-ever.",
      icon: Shield,
    },
    {
      title: "24/7 Watchdog",
      description: "Our Oracle monitors scheduled unlock times. Papers release automatically at exact time.",
      icon: Cloud,
    },
    {
      title: "Multi-School Ready",
      description: "Polygon Amoy, Ethereum, and more coming soon. Protect papers across any blockchain.",
      icon: Link2,
    },
    {
      title: "Automatic Unlock",
      description: "When exam time arrives, papers automatically transfer to authorized students. No delays.",
      icon: Unlock,
    },
    {
      title: "Open Source",
      description: "Read the code. Trust through transparency. Security audited and battle-tested.",
      icon: Code2,
    }
  ];

  const useCases = [
    {
      title: "School Boards",
      description: "Ensure exam papers reach schools exactly on time. Zero possibility of early leaks.",
      icon: TrendingUp,
      color: "heirlock-yellow"
    },
    {
      title: "Universities",
      description: "Secure final exams and board examinations with mathematical certainty.",
      icon: Heart,
      color: "heirlock-pink"
    },
    {
      title: "State Education Bodies",
      description: "Deploy across multiple schools. Centralized control, decentralized security.",
      icon: Cloud,
      color: "heirlock-blue"
    },
    {
      title: "Competitive Exams",
      description: "Protect JEE, NEET, UPSC papers. Large-scale time-locked distribution.",
      icon: Zap,
      color: "heirlock-green"
    }
  ];

  const faqs = [
    {
      q: "How do I know papers won't leak before exam time?",
      a: "Papers are stored encrypted on IPFS and locked in a smart contract. Even we can't access them. Only the smart contract can release them at the scheduled time-mathematically guaranteed."
    },
    {
      q: "What if I need to change the unlock time?",
      a: "Before the papers are locked, you can update timing. Once locked, it's immutable-this is the security feature. Plan ahead and set the exact time needed."
    },
    {
      q: "Can my institution handle multiple exams?",
      a: "Yes! Create separate vaults for each exam. Each has its own lock time, beneficiaries, and papers. Manage unlimited exams in one dashboard."
    },
    {
      q: "Is T.A.L.A. really secure?",
      a: "Yes. Papers are encrypted with AES-256. Smart contracts are auditable. Your keys never leave your device. Only blockchain math unlocks the papers."
    },
    {
      q: "What blockchains does T.A.L.A. support?",
      a: "Currently Polygon Amoy (testnet). Polygon mainnet, Ethereum, and Base coming soon. Deploy anywhere you want."
    },
    {
      q: "How much does it cost?",
      a: "Creating a vault costs standard network gas fees (~$10-50 on testnet). Free forever after. No subscriptions, no hidden fees."
    }
  ];

  const mobileFeatures = [
    { icon: Heart, label: "Gas-Free", desc: "Setup" },
    { icon: Shield, label: "Non-Custodial", desc: "Your Keys" },
    { icon: Zap, label: "Auto", desc: "Unlock" },
    { icon: Lock, label: "Always", desc: "Secure" }
  ];

  return (
    <main className="min-h-screen">
      
      {/* MOBILE HERO - Custom Neo-Brutalist Mobile UI */}
      <section className="md:hidden bg-heirlock-yellow min-h-screen flex flex-col px-3 py-4 relative overflow-hidden">
        {/* Mobile Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-baseline gap-2">
            <h1 className="text-5xl font-bold">T.A.L.A.</h1>
            <span className="text-xs font-bold text-gray-700 border-2 border-black px-2 py-1">BETA</span>
          </div>
          <div className="border-4 border-black bg-white p-3 space-y-1">
            <p className="text-sm font-bold">Don't Let Your Exam</p>
            <p className="text-sm font-bold">Papers Leak</p>
          </div>
        </div>

        {/* Quick Stats - Mobile Card Stack */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="bg-white border-4 border-black p-3 flex justify-between items-center active:scale-95 active:shadow-none transition-transform cursor-pointer hover:shadow-brutal">
            <span className="text-xs font-bold text-gray-700">Papers Protected</span>
            <span className="text-2xl font-bold">5.2K</span>
          </div>
          <div className="bg-white border-4 border-black p-3 flex justify-between items-center active:scale-95 active:shadow-none transition-transform cursor-pointer hover:shadow-brutal">
            <span className="text-xs font-bold text-gray-700">Schools Using</span>
            <span className="text-2xl font-bold">142</span>
          </div>
        </div>

        {/* CTA - Full Width Mobile Button */}
        <div className="flex flex-col gap-2 mb-6">
          <Link href="/create-vault" className="w-full">
            <button className="w-full bg-black text-white px-3 py-3 font-bold border-4 border-black shadow-brutal text-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 hover:scale-105 hover:shadow-brutal">
              CREATE VAULT
            </button>
          </Link>
          <Link href="/" className="w-full">
            <button className="w-full bg-white text-black px-3 py-3 font-bold border-4 border-black shadow-brutal text-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 hover:scale-105 hover:shadow-brutal">
              HOW IT WORKS
            </button>
          </Link>
        </div>

        {/* Key Benefits - Icon Grid */}
        <div className="grid grid-cols-2 gap-2">
          {mobileFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white border-4 border-black p-3 text-center cursor-pointer active:scale-95 transition-transform duration-100 hover:shadow-brutal">
                <Icon className="w-6 h-6 mx-auto mb-1 transition-transform duration-200" />
                <p className="text-xs font-bold">{feature.label}</p>
                <p className="text-xs font-medium text-gray-700">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 opacity-10 w-32 h-32">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#000000" d="M40,-65C50,-55,55,-40,60,-25C65,-10,70,5,70,20C70,35,65,50,55,60C45,70,30,75,15,75C0,75,-15,70,-30,65C-45,60,-60,55,-70,45C-80,35,-85,20,-85,5C-85,-10,-80,-25,-70,-35C-60,-45,-45,-50,-30,-55C-15,-60,0,-65,15,-65C30,-65,30,-75,40,-65Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* DESKTOP HERO - Original Design */}
      <section className="hidden md:flex bg-heirlock-yellow min-h-screen items-center px-3 sm:px-4 py-8 md:py-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#000000" d="M40,-65C50,-55,55,-40,60,-25C65,-10,70,5,70,20C70,35,65,50,55,60C45,70,30,75,15,75C0,75,-15,70,-30,65C-45,60,-60,55,-70,45C-80,35,-85,20,-85,5C-85,-10,-80,-25,-70,-35C-60,-45,-45,-50,-30,-55C-15,-60,0,-65,15,-65C30,-65,30,-75,40,-65Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center relative z-10 px-3 sm:px-6">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 order-1 lg:order-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="inline-block bg-black text-heirlock-yellow px-3 py-1 mb-2">
                T.A.L.A.
              </span>
              <br />
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl">
                Don't Let Your Exam Papers Leak Before Time.
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium max-w-xl">
              The only time-lock for exams. When you set the unlock time, papers automatically become available to students. Non-custodial. Tamper-proof. Forever.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Link href="/create-vault">
                <button className="bg-black text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Create Free Vault
                </button>
              </Link>
              <Link href="/" className="inline-block w-full sm:w-auto">
                <button className="w-full bg-white text-black px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                  Learn How <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="pt-2 sm:pt-3 space-y-1">
              <p className="text-xs font-bold text-gray-700">✓ No credit card needed</p>
              <p className="text-xs font-bold text-gray-700">✓ Setup in 2 minutes</p>
              <p className="text-xs font-bold text-gray-700">✓ Your keys, your papers</p>
            </div>
          </div>

          <div className="flex justify-center order-2 lg:order-2 mt-4 lg:mt-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl">
            <div className="border-4 border-black bg-white p-8 shadow-brutal">
              <div className="aspect-square bg-gradient-to-br from-heirlock-pink to-heirlock-green rounded-xl flex items-center justify-center">
                <div className="text-6xl">🔐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Mobile Hidden */}
      <section className="hidden md:block bg-black px-4 py-12 md:py-16 border-t-4 border-b-4 border-black">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="border-4 border-white bg-black p-4 sm:p-6 text-center hover:bg-white transition-all group">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-2 sm:mb-3 group-hover:text-black" />
                  <p className="text-xl sm:text-3xl font-bold text-white group-hover:text-black">{stat.value}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-black mt-1 sm:mt-2">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WAVY DIVIDER - Mobile Hidden */}
      <div className="hidden md:block bg-heirlock-green relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFF59D"></path>
          </svg>
        </div>
      </div>

      {/* FEATURES SECTION - Custom Mobile Layout */}
      <section className="py-8 md:py-20 md:bg-heirlock-green">
        {/* Mobile Features - Vertical Stack */}
        <div className="px-3 md:hidden container mx-auto bg-heirlock-green border-4 border-black shadow-brutal">
          <div className="bg-white border-b-4 border-black p-4">
            <h2 className="text-2xl font-bold">Why T.A.L.A.?</h2>
            <p className="text-xs font-medium text-gray-700 mt-1">Built for educators</p>
          </div>
          
          <div className="space-y-1">
            <div className="bg-heirlock-pink border-b-4 border-black p-4 border-t-4 cursor-pointer active:scale-95 transition-transform duration-100 hover:shadow-brutal">
              <div className="flex gap-3">
                <Heart className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-200" />
                <div>
                  <p className="font-bold text-sm">Secure Setup</p>
                  <p className="text-xs font-medium text-gray-700">Create vault in 2 min</p>
                </div>
              </div>
            </div>

            <div className="bg-heirlock-blue border-b-4 border-black p-4 cursor-pointer active:scale-95 transition-transform duration-100 hover:shadow-brutal">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-200" />
                <div>
                  <p className="font-bold text-sm">Non-Custodial</p>
                  <p className="text-xs font-medium text-gray-700">Your keys always yours</p>
                </div>
              </div>
            </div>

            <div className="bg-heirlock-yellow border-b-4 border-black p-4 cursor-pointer active:scale-95 transition-transform duration-100 hover:shadow-brutal">
              <div className="flex gap-3">
                <Zap className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-200" />
                <div>
                  <p className="font-bold text-sm">Auto Unlock</p>
                  <p className="text-xs font-medium text-gray-700">Right on time</p>
                </div>
              </div>
            </div>

            <div className="bg-heirlock-green border-b-4 border-black p-4 cursor-pointer active:scale-95 transition-transform duration-100 hover:shadow-brutal">
              <div className="flex gap-3">
                <Cloud className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-200" />
                <div>
                  <p className="font-bold text-sm">Always Monitoring</p>
                  <p className="text-xs font-medium text-gray-700">24/7 security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Features - Original Grid */}
        <div className="hidden md:block">
          <div className="container mx-auto max-w-7xl bg-heirlock-green px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 md:mb-4 px-4 pt-12 md:pt-20">
              Why Choose T.A.L.A.?
            </h2>
            <p className="text-center text-sm sm:text-base md:text-lg font-medium mb-10 md:mb-16 max-w-2xl mx-auto px-4">
              Built for schools and exam boards. Tested. Audited. Ready.
            </p>

            <div className="px-4 pb-12 md:pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const colors = ["heirlock-yellow", "heirlock-pink", "heirlock-blue", "heirlock-green", "heirlock-yellow", "heirlock-pink"];
              return (
                <div key={idx} className="bg-white border-4 border-black shadow-brutal p-4 sm:p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <div className={`bg-${colors[idx]} border-4 border-black w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base font-medium text-gray-700">{feature.description}</p>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* WAVY DIVIDER - Mobile Hidden */}
      <div className="hidden md:block bg-heirlock-pink relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#BAFFC9"></path>
          </svg>
        </div>
      </div>

      {/* USE CASES SECTION - Custom Mobile Layout */}
      <section className="py-8 md:py-20 md:bg-heirlock-pink">
        {/* Mobile Use Cases - Carousel Style */}
        <div className="px-3 md:hidden container mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Who Uses T.A.L.A.?</h2>
            <p className="text-xs font-medium text-gray-700">Everyone securing exams</p>
          </div>

          <div className="space-y-3">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <div key={idx} className="bg-white border-4 border-black shadow-brutal p-4 cursor-pointer active:scale-95 active:shadow-none transition-transform duration-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                  <div className="flex gap-3">
                    <div className={`bg-heirlock-${useCase.color} border-4 border-black w-10 h-10 flex-shrink-0 flex items-center justify-center transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{useCase.title}</p>
                      <p className="text-xs font-medium text-gray-700 mt-1">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Use Cases - Original Grid */}
        <div className="hidden md:block bg-heirlock-pink">
          <div className="container mx-auto max-w-7xl px-4 py-8 md:py-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 md:mb-4">
              Who Should Use T.A.L.A.?
            </h2>
            <p className="text-center text-sm sm:text-base md:text-lg font-medium mb-10 md:mb-16 max-w-2xl mx-auto">
              If you're securing exam papers, this is for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, idx) => {
                const Icon = useCase.icon;
                return (
                  <div key={idx} className="bg-white border-4 border-black shadow-brutal p-6 sm:p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <div className={`w-16 h-16 bg-heirlock-${useCase.color} border-4 border-black flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                    <p className="text-base font-medium text-gray-700">{useCase.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS VISUAL - Custom Mobile Layout */}
      <section className="py-8 md:py-20 md:bg-heirlock-blue">
        {/* Mobile Steps - Vertical Timeline */}
        <div className="px-3 md:hidden container mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">3 Steps</h2>
            <p className="text-xs font-medium text-gray-700">Peace of mind</p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Create",
                desc: "Connect wallet, set exam time",
                time: "2 min"
              },
              {
                step: "2",
                title: "Upload",
                desc: "Add papers to IPFS vault",
                time: "Auto"
              },
              {
                step: "3",
                title: "Auto Release",
                desc: "Papers unlock exactly on time",
                time: "Guaranteed"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-heirlock-blue border-4 border-black shadow-brutal p-4 cursor-pointer active:scale-95 active:shadow-none transition-transform duration-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                <div className="flex gap-3">
                  <div className="bg-white border-4 border-black w-10 h-10 flex-shrink-0 flex items-center justify-center transition-transform duration-200">
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">{item.title}</p>
                    <p className="text-xs font-medium text-white opacity-80">{item.desc}</p>
                    <p className="text-xs font-bold text-white mt-1">⏱️ {item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Steps - Original Grid */}
        <div className="hidden md:block bg-heirlock-blue">
          <div className="container mx-auto max-w-7xl px-4 py-8 md:py-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10 md:mb-16">
              3 Steps to Secured Exams
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  step: "1",
                  title: "Create Vault",
                  desc: "Connect wallet, set exam date and time, add authorized institutions.",
                  time: "2 min"
                },
                {
                  step: "2",
                  title: "Upload Papers",
                  desc: "Add exam papers encrypted to IPFS. Smart contract locks until exam time.",
                  time: "1 min"
                },
                {
                  step: "3",
                  title: "Auto Release",
                  desc: "At scheduled time, papers automatically unlock to authorized students. Guaranteed.",
                  time: "Auto"
                }
              ].map((item, idx) => (
              <div key={idx} className="bg-white border-4 border-black shadow-brutal p-6 sm:p-8 text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="w-16 h-16 bg-heirlock-yellow border-4 border-black flex items-center justify-center mx-auto mb-4 rounded-full">
                  <span className="text-4xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="font-medium text-gray-700 mb-4">{item.desc}</p>
                <p className="text-sm font-medium text-black bg-heirlock-blue bg-opacity-20 border-2 border-heirlock-blue p-2">⏱️ {item.time}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - Custom Mobile Layout */}
      <section className="py-8 md:py-20 md:bg-heirlock-yellow">
        {/* Mobile FAQ - Accordion */}
        <div className="px-3 md:hidden container mx-auto bg-heirlock-yellow border-4 border-black shadow-brutal">
          <div className="bg-white border-b-4 border-black p-4">
            <h2 className="text-2xl font-bold">FAQ</h2>
          </div>

          <div className="divide-y-4 divide-black">
            {faqs.map((faq, idx) => (
              <details key={idx} className="p-4 cursor-pointer group">
                <summary className="font-bold text-sm flex justify-between items-center">
                  {faq.q}
                  <span className="text-lg group-open:rotate-180 transition-transform">+</span>
                </summary>
                <p className="font-medium text-gray-700 mt-3 text-xs leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Desktop FAQ - Original */}
        <div className="hidden md:block container mx-auto max-w-4xl bg-heirlock-yellow px-4 py-8 md:py-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10 md:mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 md:space-y-6">
            {faqs.map((faq, idx) => (
              <details key={idx} className="border-4 border-black p-6 bg-white cursor-pointer hover:shadow-brutal transition-all group">
                <summary className="font-bold text-lg md:text-xl flex justify-between items-center">
                  {faq.q}
                  <span className="group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <p className="font-medium text-gray-700 mt-4 text-sm md:text-base">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Custom Mobile Layout */}
      <section className="py-8 md:py-24 md:bg-black">
        {/* Mobile CTA - Stacked */}
        <div className="px-3 md:hidden container mx-auto">
          <div className="bg-white border-4 border-black shadow-brutal p-6 cursor-pointer active:scale-95 active:shadow-none transition-transform duration-100">
            <h2 className="text-2xl font-bold text-black mb-2">Ready to Secure Your Exams?</h2>
            <p className="text-xs font-medium text-gray-700 mb-4">Set up in 2 minutes. No credit card.</p>
            <Link href="/create-vault" className="w-full block">
              <button className="w-full bg-black text-white px-4 py-3 font-bold border-4 border-black shadow-brutal text-sm active:translate-x-1 active:translate-y-1 active:shadow-none mb-3 flex items-center justify-center gap-2 transition-all duration-100 hover:scale-105 hover:shadow-brutal">
                <Lock className="w-4 h-4 transition-transform duration-200" />
                CREATE VAULT NOW
              </button>
            </Link>
            <p className="text-xs font-medium text-gray-700 text-center">Just MetaMask and 2 minutes.</p>
          </div>
        </div>

        {/* Desktop CTA - Improved */}
        <div className="hidden md:block bg-black">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
            <div className="bg-heirlock-yellow border-4 border-black shadow-brutal p-8 md:p-12 lg:p-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 text-center">
                Ready to Secure Your Exams?
              </h2>
              <p className="text-base sm:text-lg md:text-xl font-bold text-black mb-8 text-center max-w-3xl mx-auto leading-relaxed">
                Set up your vault in 2 minutes. Papers protected forever. Mathematical certainty every time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/create-vault" className="flex-1 sm:flex-none">
                  <button className="w-full bg-black text-heirlock-yellow px-8 md:px-12 py-4 md:py-6 text-lg md:text-2xl font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center justify-center gap-3">
                    <Lock className="w-6 h-6 md:w-8 md:h-8" />
                    Create Vault Now
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                </Link>
              </div>

              <p className="text-black font-bold text-center text-sm md:text-base mt-4">
                ✓ No credit card required &nbsp;•&nbsp; ✓ No sign-up needed &nbsp;•&nbsp; ✓ Just MetaMask
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
