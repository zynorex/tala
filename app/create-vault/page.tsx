'use client';

import { useEffect, useRef, useState } from 'react';
import { Lock, FileText, Settings, Shield, Clock, CheckCircle, ChevronRight, ArrowLeft, X, Info, ShieldCheck, Database, FileUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import CreateVaultForm from "@/app/components/CreateVaultForm";

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl" ref={dialogRef}>
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#FFF] overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-6 border-b-4 border-black bg-heirlock-yellow">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-black mb-2">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-bold uppercase tracking-widest text-xs">Access Required</p>
              </div>
              <h2 className="text-3xl font-black text-black leading-none uppercase">RESTRICTED ENVIRONMENT</h2>
            </div>
            <button onClick={onClose} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors" aria-label="Close notice">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6 bg-white">
            <p className="text-black text-lg font-bold">
              Production vault deployment requires an active workspace plan.
            </p>
            <p className="text-gray-700 text-base">
              You may validate the platform's cryptography and logic by deploying a Sandbox Vault. Sandbox vaults automatically decrypt after 2 minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-4 border-black bg-white p-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onSelectDemo}>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <p className="font-black text-black uppercase">Sandbox Mode</p>
                </div>
                <p className="text-sm text-gray-600 font-medium">Free evaluation. Vault unlocks in 2 mins. Do not use for real data.</p>
              </div>
              <div className="border-4 border-black bg-white p-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onSelectPaid}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-heirlock-blue" />
                  <p className="font-black text-black uppercase">Production Mode</p>
                </div>
                <p className="text-sm text-gray-600 font-medium">Full access. Custom unlock times. Infinite storage capability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvironmentSelector({ activeTab, setActiveTab }: { activeTab: VaultTab; setActiveTab: (tab: VaultTab) => void; }) {
  return (
    <div className="flex flex-col sm:flex-row border-4 border-black bg-white shadow-[8px_8px_0_0_#000] mb-12">
      <button
        onClick={() => setActiveTab('demo')}
        className={`flex-1 px-6 py-5 font-black text-lg transition-all border-b-4 sm:border-b-0 sm:border-r-4 border-black uppercase flex items-center justify-center gap-3 ${
          activeTab === 'demo'
            ? 'bg-heirlock-yellow text-black'
            : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50'
        }`}
      >
        <Settings className="w-5 h-5" />
        Sandbox Environment
      </button>
      <button
        onClick={() => setActiveTab('real')}
        className={`flex-1 px-6 py-5 font-black text-lg transition-all uppercase flex items-center justify-center gap-3 ${
          activeTab === 'real'
            ? 'bg-black text-white'
            : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        Production Vault
      </button>
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

  const handleSelectDemo = () => {
    setActiveTab('demo');
    closeAccessModal();
  };

  const handleSelectPaid = () => {
    setActiveTab('real');
    closeAccessModal();
  };

  useEffect(() => {
    if (!showAccessModal) return;
    const timer = setTimeout(() => {
      setShowAccessModal(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, [showAccessModal]);

  const steps = [
    { title: "Authentication", description: "Connect verifiable identity.", icon: Shield },
    { title: "Payload Data", description: "Select local file for client-side encryption.", icon: FileUp },
    { title: "Epoch Schedule", description: "Define absolute future decryption timestamp.", icon: Clock },
    { title: "Network Commit", description: "Deploy to blockchain. Distribute to IPFS nodes.", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-cream font-sans selection:bg-black selection:text-white flex flex-col">
      {showAccessModal && (
        <AccessNoticeModal
          onClose={closeAccessModal}
          onSelectDemo={handleSelectDemo}
          onSelectPaid={handleSelectPaid}
        />
      )}

      {/* ISOLATED TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black hover:text-gray-600 transition-colors bg-white px-4 py-2 border-2 border-black inline-flex">
          <ArrowLeft className="w-4 h-4" />
          EXIT DEPLOYMENT
        </Link>
        <div className="font-black text-xl tracking-[0.2em] uppercase shrink-0">
          T.A.L.A. // DEPLOY ENGINE
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <div className="px-3 py-1 font-bold text-xs uppercase border-2 border-black bg-heirlock-green">
            NETWORK: SECURE
          </div>
          <div className="px-3 py-1 font-bold text-xs uppercase border-2 border-black bg-gray-100">
            {activeTab === 'demo' ? 'MODE: SANDBOX' : 'MODE: PRODUCTION'}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col xl:flex-row max-w-[1600px] mx-auto w-full border-x-4 border-black bg-white shadow-xl min-h-[calc(100vh-76px)]">
        
        {/* LEFT COLUMN: GUIDANCE AND INFO */}
        <aside className="xl:w-[400px] border-b-4 xl:border-b-0 xl:border-r-4 border-black bg-gray-50 flex flex-col">
          <div className="p-8 border-b-4 border-black bg-white">
            <h1 className="text-4xl lg:text-5xl font-black uppercase leading-none tracking-tight mb-2 text-black">
              VAULT <br/> SETUP
            </h1>
            <p className="font-bold text-gray-600 text-sm mt-4">
              Step-by-step cryptographic deployment protocol.
            </p>
          </div>

          <div className="p-8 flex-1">
            <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-gray-500">OPERATIONAL DIRECTIVES</h3>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-10 h-10 border-2 border-black bg-white font-black text-black group-hover:bg-heirlock-yellow transition-colors shrink-0">
                      0{index + 1}
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-sm mb-1">{step.title}</h4>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-5 border-4 border-black bg-heirlock-blue/20">
              <div className="flex items-center gap-2 font-black uppercase text-sm mb-2">
                <Lock className="w-4 h-4" /> NO BACKDOORS
              </div>
              <p className="text-xs font-medium text-gray-800">
                T.A.L.A. uses strict zero-knowledge architecture. If you lose your decryption key and the final hash, there is no recovery mechanism.
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: THE FORM */}
        <section className="flex-1 bg-white p-4 md:p-8 xl:p-12 xl:overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <EnvironmentSelector activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mb-8">
              {activeTab === 'demo' ? (
                <div className="p-4 border-l-4 border-heirlock-yellow bg-gray-50 mb-8">
                  <h2 className="font-black text-lg uppercase mb-1">Sandbox Evaluation Active</h2>
                  <p className="text-sm font-medium text-gray-600">
                    This vault will automatically unlock exactly 2 minutes after deployment. No blockchain gas fees will be charged to your live wallet.
                  </p>
                </div>
              ) : (
                <div className="p-4 border-l-4 border-black bg-gray-50 mb-8">
                  <h2 className="font-black text-lg uppercase mb-1">Production Environment</h2>
                  <p className="text-sm font-medium text-gray-600">
                    You are deploying a permanent cryptographic vault. Ensure your target wallet has sufficient gas for the polygon sequence.
                  </p>
                </div>
              )}
            </div>

            {/* FORM CONTAINER - Clean minimal wrapper for their complex form */}
            <div className="border-4 border-black bg-white p-1">
              <CreateVaultForm demoMode={activeTab === 'demo'} />
            </div>

            <p className="text-center text-xs font-bold text-gray-400 mt-12 uppercase tracking-widest">
              END OF DEPLOYMENT SEQUENCE
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
