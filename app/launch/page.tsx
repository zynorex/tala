'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Zap, Lock, Shield, Rocket, Calendar, Clock, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function LaunchPage() {
  const launchDate = new Date('2026-03-14');
  const now = new Date();
  const timeUntilLaunch = launchDate.getTime() - now.getTime();
  const daysUntilLaunch = Math.ceil(timeUntilLaunch / (1000 * 60 * 60 * 24));
  const hoursUntilLaunch = Math.ceil((timeUntilLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <main className="min-h-screen bg-gradient-to-b from-heirlock-yellow via-cream to-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 relative">
        <Link href="/" className="inline-block mb-6 px-4 py-2 border-3 border-black bg-white text-black font-black hover:bg-black hover:text-white transition-all text-sm">
          ← Back
        </Link>
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block border-4 border-black bg-heirlock-pink px-6 py-3 font-black text-black">
            COMING VERY SOON
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-black leading-tight">
            The Future of <span className="inline-block border-4 border-black bg-heirlock-yellow px-3 py-1">Secure Storage</span> Launches March 14th
          </h1>

          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-3xl mx-auto">
            India's First Decentralized Time-Capsule Protocol. Trust Code, Not Humans. Mathematical Certainty Awaits.
          </p>

          {/* Countdown Timer */}
          <div className="border-8 border-black bg-heirlock-blue p-8 shadow-brutal">
            <p className="text-sm font-black text-black opacity-70 uppercase tracking-wider mb-4">Launch Countdown</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-4 border-black bg-white p-6">
                <p className="text-4xl md:text-5xl font-black text-black">{daysUntilLaunch}</p>
                <p className="text-xs font-black text-gray-600 uppercase mt-2">Days</p>
              </div>
              <div className="border-4 border-black bg-white p-6">
                <p className="text-4xl md:text-5xl font-black text-black">{hoursUntilLaunch}</p>
                <p className="text-xs font-black text-gray-600 uppercase mt-2">Hours</p>
              </div>
              <div className="border-4 border-black bg-white p-6">
                <p className="text-4xl md:text-5xl font-black text-black">00</p>
                <p className="text-xs font-black text-gray-600 uppercase mt-2">Minutes</p>
              </div>
              <div className="border-4 border-black bg-white p-6">
                <p className="text-4xl md:text-5xl font-black text-black">00</p>
                <p className="text-xs font-black text-gray-600 uppercase mt-2">Seconds</p>
              </div>
            </div>
            <p className="text-sm font-black text-black mt-6">
              📅 <strong>March 14, 2026</strong> at 12:00 AM IST
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="px-8 py-4 border-4 border-black bg-black text-heirlock-yellow font-black text-lg shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all">
              Notify Me
            </button>
            <Link href="/create-vault">
              <button className="px-8 py-4 border-4 border-black bg-heirlock-green text-black font-black text-lg shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all">
                Try Demo Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Launching Section */}
      <section className="py-16 md:py-24 px-4 bg-white border-t-4 border-black border-b-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-center">What's Launching</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Core Features */}
            <div className="border-4 border-black bg-heirlock-yellow p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <Lock className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">Complete Vault Lifecycle</h3>
                  <p className="text-gray-800 font-medium">Create, lock, wait, unlock, and decrypt. Full user journey implemented with military-grade encryption.</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-heirlock-blue p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <Shield className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">AES-256-GCM Encryption</h3>
                  <p className="text-gray-800 font-medium">Non-custodial encryption on your device. Your keys, your control. TALA never holds your secrets.</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-heirlock-green p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <Zap className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">Blockchain-Enforced Time-Locks</h3>
                  <p className="text-gray-800 font-medium">Smart contracts on Polygon ensure vaults unlock exactly when you want. Code doesn't lie.</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-heirlock-pink p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <Users className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">IPFS Decentralized Storage</h3>
                  <p className="text-gray-800 font-medium">Files stored on IPFS network. No single point of failure. Access from anywhere, anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-center">Designed For</h2>

          <div className="space-y-6">
            {[
              {
                title: "📚 Universities & Educational Institutes",
                description: "Secure exam question papers, answer sheets, and academic records with time-locked access."
              },
              {
                title: "⚖️ Government Bodies & Legal Firms",
                description: "Protect confidential documents and sensitive government tenders with mathematical certainty."
              },
              {
                title: "🏢 Enterprises & Organizations",
                description: "Time-locked contracts, sensitive business records, and future-dated disclosures."
              },
              {
                title: "👥 Individual Users",
                description: "Securely store personal documents, wills, and digital assets for future access."
              }
            ].map((useCase, idx) => (
              <div key={idx} className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-lg transition-all">
                <h3 className="text-lg md:text-xl font-black text-black mb-2">{useCase.title}</h3>
                <p className="text-gray-800 font-medium">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="py-16 md:py-24 px-4 bg-white border-t-4 border-black border-b-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-center">FAQ</h2>

          <div className="space-y-6">
            {[
              {
                q: "What happens on February 1st?",
                a: "TALA opens to public beta. All users can create and manage unlimited vaults with complete encryption, time-locking, and decentralized storage."
              },
              {
                q: "Is it free?",
                a: "Yes! TALA Starter plan (free) includes up to 99 vaults, 500 MB storage per vault, and full AES-256 encryption. No credit card required."
              },
              {
                q: "Can I test it before launch?",
                a: "Absolutely! Try our demo vault right now. Create a test vault that auto-unlocks in 2 minutes. Full feature experience, no real time-locks."
              },
              {
                q: "Will my data be safe?",
                a: "Yes. All encryption happens on your device before upload. TALA never sees your unencrypted data. Time-locks enforced by smart contracts on Polygon blockchain."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-4 border-black bg-cream p-6 shadow-brutal">
                <h3 className="text-lg font-black text-black mb-2">{faq.q}</h3>
                <p className="text-gray-800 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 md:py-24 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-800 font-medium mb-8">Get notified the moment TALA launches. First 1000 users get exclusive beta benefits.</p>
          
          <form className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border-4 border-black bg-white text-black font-medium placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20"
            />
            <button className="px-6 py-3 border-4 border-black bg-black text-heirlock-yellow font-black hover:bg-gray-900 transition-all whitespace-nowrap">
              Notify Me
            </button>
          </form>

          <p className="text-xs text-gray-700 font-medium mt-4">We'll never spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 md:py-24 px-4 border-t-4 border-black">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <Sparkles className="w-12 h-12 text-black mx-auto" />
          
          <h2 className="text-4xl md:text-5xl font-black text-black">The Future Is Code.<br />The Future Is T.A.L.A.</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-vault">
              <button className="px-8 py-4 border-4 border-black bg-black text-heirlock-yellow font-black text-lg shadow-brutal hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                Try Demo <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/documentation">
              <button className="px-8 py-4 border-4 border-black bg-white text-black font-black text-lg shadow-brutal hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                Learn More <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          <p className="text-sm text-gray-600 font-medium">
            Built for Government Bodies • Universities • Enterprises • Individuals<br />
            Securing the Future with Mathematical Certainty
          </p>
        </div>
      </section>
    </main>
  );
}
