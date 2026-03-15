'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function LaunchPage() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const launchDate = new Date('2026-04-20T00:00:00').getTime();
      const now = new Date().getTime();
      const timeUntilLaunch = launchDate - now;

      if (timeUntilLaunch > 0) {
        const days = Math.floor(timeUntilLaunch / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeUntilLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilLaunch % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeUntilLaunch % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b from-heirlock-yellow via-cream to-white">
      <section className="py-16 md:py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border-3 border-black bg-white text-black font-black hover:bg-black hover:text-white transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="hidden md:flex items-center gap-3 text-sm font-black uppercase tracking-wide text-black">
              <Clock3 className="w-4 h-4" />
              March 14 2026 • 12:00 AM IST
            </div>
          </div>

          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 border-4 border-black bg-heirlock-pink px-4 py-2 font-black text-black uppercase tracking-wide shadow-brutal">
                Public launch window confirmed
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-black leading-tight">
                Secure time locked storage built for people who cannot afford doubts
              </h1>

              <p className="text-lg md:text-xl text-gray-800 font-medium max-w-2xl">
                TALA delivers device side encryption, contract enforced unlocks, and distributed storage. You control the keys while the protocol guarantees timing and access.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-7 py-4 border-4 border-black bg-black text-heirlock-yellow font-black text-lg shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all">
                  Get launch alerts
                </button>
                <Link href="/create-vault">
                  <button className="px-7 py-4 border-4 border-black bg-heirlock-green text-black font-black text-lg shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all">
                    Try a five minute demo
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{
                  label: 'Vaults tested in beta', value: '12,000+' }, {
                  label: 'Average unlock drift', value: '< 2s' }, {
                  label: 'Data custody', value: 'Client side only' }].map((stat, idx) => (
                  <div key={idx} className="border-4 border-black bg-white p-4 shadow-brutal">
                    <p className="text-2xl font-black text-black">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-8 border-black bg-heirlock-blue p-6 md:p-8 shadow-brutal">
              <p className="text-sm font-black text-black uppercase tracking-wider mb-5 text-center">Launch countdown</p>
              <div className="w-full max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
                <div className="border-4 border-black bg-white px-5 py-6 md:px-6 md:py-7 flex flex-col items-center justify-center">
                  <p className="text-4xl md:text-5xl font-black text-black leading-none tracking-tight">{String(countdown.days).padStart(2, '0')}</p>
                  <p className="text-[11px] md:text-xs font-black text-gray-600 uppercase mt-3 tracking-wide">Days</p>
                </div>
                <div className="border-4 border-black bg-white px-5 py-6 md:px-6 md:py-7 flex flex-col items-center justify-center">
                  <p className="text-4xl md:text-5xl font-black text-black leading-none tracking-tight">{String(countdown.hours).padStart(2, '0')}</p>
                  <p className="text-[11px] md:text-xs font-black text-gray-600 uppercase mt-3 tracking-wide">Hours</p>
                </div>
                <div className="border-4 border-black bg-white px-5 py-6 md:px-6 md:py-7 flex flex-col items-center justify-center">
                  <p className="text-4xl md:text-5xl font-black text-black leading-none tracking-tight">{String(countdown.minutes).padStart(2, '0')}</p>
                  <p className="text-[11px] md:text-xs font-black text-gray-600 uppercase mt-3 tracking-wide">Minutes</p>
                </div>
                <div className="border-4 border-black bg-white px-5 py-6 md:px-6 md:py-7 flex flex-col items-center justify-center">
                  <p className="text-4xl md:text-5xl font-black text-black leading-none tracking-tight">{String(countdown.seconds).padStart(2, '0')}</p>
                  <p className="text-[11px] md:text-xs font-black text-gray-600 uppercase mt-3 tracking-wide">Seconds</p>
                </div>
              </div>
              <p className="text-sm font-black text-black mt-6 text-center">
                March 14 2026 at 12:00 AM IST
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-white border-t-4 border-black border-b-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-center">What ships on launch day</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-black bg-heirlock-yellow p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <Lock className="w-8 h-8 text-black shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">Complete vault journey</h3>
                  <p className="text-gray-800 font-medium">Create, lock, wait, unlock, and decrypt with a single flow. Every stage is auditable.</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-heirlock-blue p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <ShieldCheck className="w-8 h-8 text-black shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">Device side encryption</h3>
                  <p className="text-gray-800 font-medium">AES 256 GCM runs on your device. Keys never leave your control and are never stored by TALA.</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-heirlock-green p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <Zap className="w-8 h-8 text-black shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">Contract enforced timing</h3>
                  <p className="text-gray-800 font-medium">Polygon smart contracts hold unlock conditions. Vaults open at the exact scheduled time.</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-heirlock-pink p-8 shadow-brutal">
              <div className="flex items-start gap-4 mb-6">
                <Shield className="w-8 h-8 text-black shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">Distributed storage</h3>
                  <p className="text-gray-800 font-medium">Files stay on IPFS with redundant availability. No single failure can block access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-black">Who gets the most value</h2>
            <p className="text-base md:text-lg text-gray-800 font-medium max-w-xl">
              Precision unlocks and transparent custody help teams that must prove integrity to regulators, stakeholders, and the public.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              title: 'Universities and examination boards',
              description: 'Protect question papers, evaluation keys, and academic records with timed release and verifiable audit logs.'
            }, {
              title: 'Government and legal teams',
              description: 'Hold sensitive tenders, case files, and directives with clear proof of custody and predictable unlocks.'
            }, {
              title: 'Enterprises and program managers',
              description: 'Share contracts, financial statements, and disclosures only when schedules permit while keeping teams aligned.'
            }, {
              title: 'Personal estates and creators',
              description: 'Store wills, private media, or digital assets with guaranteed access at the right moment.'
            }].map((useCase, idx) => (
              <div key={idx} className="border-4 border-black bg-white p-6 shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all">
                <h3 className="text-xl font-black text-black mb-2">{useCase.title}</h3>
                <p className="text-gray-800 font-medium">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-white border-t-4 border-black border-b-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-black">Launch plan highlights</h2>
            <p className="text-base md:text-lg text-gray-800 font-medium max-w-xl">
              A focused path to open the protocol with clarity on what is live now and what is shipping on day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              title: 'Public beta now',
              copy: 'Create unlimited vaults, test the full flow, and export logs for review. No credit card needed.'
            }, {
              title: 'Operational hardening',
              copy: 'Load testing on Polygon, redundancy on IPFS gateways, and automated key rotation guidance.'
            }, {
              title: 'Launch day unlocks',
              copy: 'Production contracts with timelock proofs, live observability, and support for organizations at scale.'
            }].map((item, idx) => (
              <div key={idx} className="border-4 border-black bg-cream p-6 shadow-brutal flex flex-col gap-3">
                <p className="text-sm font-black uppercase tracking-wide text-black">Step {idx + 1}</p>
                <h3 className="text-xl font-black text-black">{item.title}</h3>
                <p className="text-gray-800 font-medium flex-1">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-black text-center">Questions teams are asking</h2>
          <div className="space-y-6">
            {[{
              q: 'What happens on March 14',
              a: 'We open production access with full vault lifecycle, contract enforced unlocks, and monitored IPFS distribution for all users.'
            }, {
              q: 'Is there a cost to start',
              a: 'Starter access remains free with up to ninety nine vaults and five hundred megabytes per vault. No payment details needed to begin.'
            }, {
              q: 'Can we test today',
              a: 'Yes. Create a demo vault that unlocks in five minutes and review every step of the process before launch day.'
            }, {
              q: 'How is data protected',
              a: 'Encryption runs on your device, keys are never stored by TALA, and unlock logic is enforced on chain. Data is never exposed in plaintext during transit or at rest.'
            }].map((faq, idx) => (
              <div key={idx} className="border-4 border-black bg-cream p-6 shadow-brutal">
                <h3 className="text-lg font-black text-black mb-2">{faq.q}</h3>
                <p className="text-gray-800 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-3 border-4 border-black bg-white px-5 py-2 font-black text-black uppercase tracking-wide shadow-brutal">
            Early access list now open
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black">Stay ahead of launch day</h2>
          <p className="text-lg text-gray-800 font-medium">Join the first wave to receive launch alerts, implementation guides, and migration support.</p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 border-4 border-black bg-white text-black font-medium placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20"
            />
            <button className="px-6 py-3 border-4 border-black bg-black text-heirlock-yellow font-black hover:bg-gray-900 transition-all whitespace-nowrap">
              Notify me
            </button>
          </form>

          <p className="text-xs text-gray-700 font-medium">No spam, just launch milestones and setup guidance.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 border-t-4 border-black">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <Sparkles className="w-12 h-12 text-black mx-auto" />
          <h2 className="text-4xl md:text-5xl font-black text-black">Launch with certainty not promises</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-vault">
              <button className="px-8 py-4 border-4 border-black bg-black text-heirlock-yellow font-black text-lg shadow-brutal hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                Start the demo
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/documentation">
              <button className="px-8 py-4 border-4 border-black bg-white text-black font-black text-lg shadow-brutal hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                Explore the docs
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          <p className="text-sm text-gray-600 font-medium">
            Built for public bodies, universities, enterprises, and individuals who need verifiable access control.
          </p>
        </div>
      </section>
    </main>
  );
}
