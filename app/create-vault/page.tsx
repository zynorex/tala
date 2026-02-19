'use client';

import { useEffect, useRef, useState } from 'react';
import { Lock, Users, Upload, Settings, Zap, Shield, Clock, CheckCircle, ChevronRight, ArrowRight, X, Info } from "lucide-react";
import Link from "next/link";
import CreateVaultForm from "@/app/components/CreateVaultForm";
import { useForm } from "react-hook-form";

type VaultTab = 'demo' | 'real';

function AccessNoticeModal({
  onClose,
  onSelectDemo,
  onSelectPaid,
}: {
  onClose: () => void;
  onSelectDemo: () => void;
  onSelectPaid: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab' && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-[10000] w-full max-w-xl mx-4" ref={dialogRef}>
        <div className="bg-white border-4 border-black shadow-brutal rounded-lg overflow-hidden transition-all duration-200 ease-out opacity-100 scale-100">
          <div className="flex items-start justify-between gap-4 p-5 md:p-6 border-b-4 border-black bg-heirlock-yellow">
            <div className="space-y-1">
              <p className="text-[11px] md:text-xs font-black uppercase tracking-wide text-black">Access notice</p>
              <h2 className="text-xl md:text-2xl font-black text-black leading-snug">Vault creation requires a paid workspace</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-black" aria-label="Close notice">
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          <div className="p-5 md:p-6 space-y-4">
            <p className="text-gray-900 text-base md:text-lg font-semibold">
              New vaults are available to paid customers. To experience the workflow immediately, use the demo vault that unlocks in a few minutes.
            </p>
            <p className="text-gray-700 text-sm md:text-base">
              The demo vault runs the same encryption, storage, and unlock process. When you are ready for production usage, continue to create a paid vault.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border-3 border-black bg-white p-4 rounded-lg">
                <p className="text-sm font-black text-black mb-1">Demo vault</p>
                <p className="text-xs text-gray-700">Unlocks in minutes, ideal for validation and walkthroughs.</p>
              </div>
              <div className="border-3 border-black bg-white p-4 rounded-lg">
                <p className="text-sm font-black text-black mb-1">Paid vault</p>
                <p className="text-xs text-gray-700">Custom schedules, production storage, and support.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onSelectDemo}
                className="w-full px-4 py-3 bg-black text-heirlock-yellow font-black text-sm md:text-base border-3 border-black rounded-lg shadow-brutal hover:-translate-y-0.5 transition-all"
              >
                Try the demo vault
              </button>
              <button
                onClick={onSelectPaid}
                className="w-full px-4 py-3 bg-white text-black font-black text-sm md:text-base border-3 border-black rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue to paid vaults
              </button>
            </div>

            <p className="text-[11px] text-gray-600 text-center border-t-2 border-black pt-3">
              You can switch to a paid vault at any time. The demo is for evaluation only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoVaultFormTab({ activeTab, setActiveTab }: { activeTab: VaultTab; setActiveTab: (tab: VaultTab) => void; }) {

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-3 border-b-4 border-black">
        <button
          onClick={() => setActiveTab('demo')}
          className={`px-6 py-4 font-black text-lg transition-all border-b-4 ${
            activeTab === 'demo'
              ? 'border-black bg-heirlock-green text-black'
              : 'border-transparent text-gray-600 hover:text-black'
          }`}
        >
          Demo Vault (2 Minutes)
        </button>
        <button
          onClick={() => setActiveTab('real')}
          className={`px-6 py-4 font-black text-lg transition-all border-b-4 ${
            activeTab === 'real'
              ? 'border-black bg-heirlock-blue text-black'
              : 'border-transparent text-gray-600 hover:text-black'
          }`}
        >
          Real Vault (Custom Time)
        </button>
      </div>

      {/* Tab Content */}
      <div className="border-4 border-black bg-cream p-4 flex items-center gap-3 shadow-brutal">
        <Info className="w-5 h-5 text-black" />
        <div className="flex-1 text-sm font-medium text-gray-800">
          {activeTab === 'demo'
            ? 'You are viewing the demo vault flow. It unlocks in minutes and does not require payment.'
            : 'You are viewing the paid vault flow. Deployment charges apply based on your workspace plan.'}
        </div>
      </div>

      {activeTab === 'demo' && (
        <div className="space-y-6">
          <div className="border-4 border-black p-6 bg-gradient-to-r from-heirlock-green to-yellow-100 shadow-brutal">
            <h2 className="text-3xl font-black text-black mb-3">See It In Action</h2>
            <p className="text-black font-bold mb-4">
              Test the full T.A.L.A. experience with a real vault that unlocks in just 2 minutes. Upload any file, download your encryption key, and watch time-locking technology work.
            </p>
            <ul className="space-y-2 text-sm font-bold text-black">
              <li>✓ Real AES-256-GCM encryption</li>
              <li>✓ Upload any file (max 50MB)</li>
              <li>✓ Get an encryption key</li>
              <li>✓ Auto-unlock after 2 minutes</li>
            </ul>
            <p className="text-xs text-black mt-4 italic opacity-90">
              We are still building. We are not perfect. There will be bugs. There will be rough edges. But we are honest, transparent, and here to help. Your feedback drives us forward.
            </p>
          </div>
          {/* Use CreateVaultForm in demo mode */}
          <CreateVaultForm demoMode={true} />
        </div>
      )}

      {activeTab === 'real' && (
        <div className="space-y-6">
          <div className="border-4 border-black p-6 bg-gradient-to-r from-heirlock-blue to-blue-100 shadow-brutal">
            <h2 className="text-3xl font-black text-black mb-3">Secure Forever</h2>
            <p className="text-black font-bold mb-4">
              Create a real vault with your own unlock date. Time-lock anything from hours to 100 years in the future. Complete control, military-grade security.
            </p>
            <ul className="space-y-2 text-sm font-bold text-black">
              <li>✓ Custom unlock dates (up to 100 years)</li>
              <li>✓ Blockchain-enforced time-locking</li>
              <li>✓ Military-grade encryption</li>
              <li>✓ Decentralized IPFS storage</li>
            </ul>
          </div>
          {/* Use CreateVaultForm in normal mode */}
          <CreateVaultForm demoMode={false} />
        </div>
      )}
    </div>
  );
}

export default function CreateVault() {
  const [activeTab, setActiveTab] = useState<VaultTab>('demo');
  const [showAccessModal, setShowAccessModal] = useState(false);

  useEffect(() => {
    const seen = typeof window !== 'undefined' ? localStorage.getItem('createVaultAccessNotice') : 'true';
    if (!seen) {
      setShowAccessModal(true);
    }
  }, []);

  const closeAccessModal = () => {
    setShowAccessModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('createVaultAccessNotice', 'true');
    }
  };

  const focusForm = () => {
    const el = document.getElementById('vault-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectDemo = () => {
    setActiveTab('demo');
    closeAccessModal();
    focusForm();
  };

  const handleSelectPaid = () => {
    setActiveTab('real');
    closeAccessModal();
    focusForm();
  };

  useEffect(() => {
    if (!showAccessModal) return;
    const timer = setTimeout(() => {
      setShowAccessModal(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, [showAccessModal]);

  const steps = [
    {
      number: "1",
      title: "Connect Your Wallet",
      description: "Use MetaMask, WalletConnect, or any Web3 wallet. Your keys stay with you always.",
      icon: Shield,
    },
    {
      number: "2",
      title: "Upload Your File",
      description: "Select any file up to 50MB. Encrypted with AES-256 before it leaves your device.",
      icon: Upload,
    },
    {
      number: "3",
      title: "Set Unlock Time",
      description: "Choose the exact date and time when your vault unlocks. From now to 100 years ahead.",
      icon: Clock,
    },
    {
      number: "4",
      title: "Deploy to Blockchain",
      description: "Create your vault on the blockchain. Immutable, transparent, and tamper-proof forever.",
      icon: Users,
    },
  ];

  const features = [
    {
      title: "Non-Custodial Security",
      description: "You control everything. We never see your files or encryption keys. Complete privacy.",
      icon: Shield,
    },
    {
      title: "Military-Grade Encryption",
      description: "AES-256-GCM encryption with PBKDF2 key derivation. Impossible to crack.",
      icon: Lock,
    },
    {
      title: "Decentralized Storage",
      description: "Files stored on IPFS with dual providers. Redundancy ensures permanence.",
      icon: CheckCircle,
    },
    {
      title: "Blockchain Immutability",
      description: "Smart contract on Polygon ensures rules are enforced by code, not trust.",
      icon: Zap,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {showAccessModal && (
        <AccessNoticeModal
          onClose={closeAccessModal}
          onSelectDemo={handleSelectDemo}
          onSelectPaid={handleSelectPaid}
        />
      )}

      {/* Hero Section */}
      <section className="bg-heirlock-blue border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Create Your <br />
              Secure Vault
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Time-lock any sensitive file with military-grade encryption. Perfect for exams, contracts, medical records, intellectual property, and more.
            </p>
            <div className="pt-4">
              <a
                href="#vault-form"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-heirlock-yellow font-black text-lg border-4 border-black shadow-brutal hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              >
                <Lock className="w-5 h-5" />
                <span>Start Creating Vault</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section - PROMINENT */}
      <section id="vault-form" className="py-12 md:py-20 bg-white border-t-4 border-heirlock-blue scroll-mt-20">
        <div className="container mx-auto max-w-4xl px-3 sm:px-4">
          <div className="mb-12">
            {/* Vault Form Tabs */}
            <div className="mb-12">
              <DemoVaultFormTab activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Educational Content */}
      <section className="py-12 md:py-20 bg-heirlock-yellow border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center h-12 w-12 bg-heirlock-blue text-black font-bold text-lg">
                      {step.number}
                    </div>
                    <Icon className="w-6 h-6 text-heirlock-blue flex-shrink-0" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-blue">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Vault Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = ["bg-heirlock-blue", "bg-heirlock-green", "bg-heirlock-yellow", "bg-heirlock-pink"];
              return (
                <div
                  key={index}
                  className={`${colors[index % 4]} border-4 border-black p-6 shadow-brutal`}
                >
                  <Icon className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-lg font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-black text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">Who Uses T.A.L.A.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Educational Institutions",
                description: "Secure exam papers from leaks. Time-lock ensures papers stay protected until exam day.",
              },
              {
                title: "Healthcare Providers",
                description: "Protect patient records and medical documents. HIPAA-compliant secure storage.",
              },
              {
                title: "Legal Firms",
                description: "Secure contracts and confidential documents. Auditable access with blockchain.",
              },
              {
                title: "Tech Companies",
                description: "Protect intellectual property and trade secrets. Time-lock for coordinated releases.",
              },
              {
                title: "Financial Services",
                description: "Secure sensitive financial documents. Non-custodial storage for compliance.",
              },
              {
                title: "Individuals",
                description: "Protect personal documents, wills, and important records for future access.",
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <h3 className="text-lg font-bold text-black mb-3">{useCase.title}</h3>
                <p className="text-gray-700">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-20 bg-white border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">Why Choose T.A.L.A.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Complete Control</h3>
              <p className="text-gray-800 mb-4 font-medium">
                You retain full ownership of your files and encryption keys. We can never access your data.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ You own the encryption keys</li>
                <li>✓ You set the unlock time</li>
                <li>✓ You decide who gets access</li>
                <li>✓ You control everything</li>
              </ul>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-pink shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Blockchain Security</h3>
              <p className="text-gray-800 mb-4 font-medium">
                Smart contracts enforce rules algorithmically. Time-lock is enforced by code, not trust.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ Immutable audit trail</li>
                <li>✓ Transparent operations</li>
                <li>✓ Tamper-proof records</li>
                <li>✓ No single point of failure</li>
              </ul>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-blue shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Cryptographic Strength</h3>
              <p className="text-gray-800 mb-4 font-medium">
                Military-grade encryption ensures your files stay secure even if hacked.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ AES-256-GCM encryption</li>
                <li>✓ PBKDF2 key derivation</li>
                <li>✓ Authentication verification</li>
                <li>✓ No backdoors</li>
              </ul>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-green shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-4">Decentralized Storage</h3>
              <p className="text-gray-800 mb-4 font-medium">
                IPFS ensures your files stay accessible forever, distributed across the network.
              </p>
              <ul className="space-y-2 text-gray-800 font-medium">
                <li>✓ Dual provider redundancy</li>
                <li>✓ Global accessibility</li>
                <li>✓ No server dependency</li>
                <li>✓ Permanent storage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-heirlock-blue border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Need Help?
          </h2>
          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Check our documentation or contact support if you have any questions about creating vaults.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/how-it-works">
              <button className="px-8 py-3 bg-black text-heirlock-blue font-bold border-4 border-black hover:bg-white hover:text-shadow-heirlock-green shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
                How It Works <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/documentation">
              <button className="px-8 py-3 bg-transparent text-black font-bold border-4 border-black hover:bg-black hover:text-heirlock-blue shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
                Documentation <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

