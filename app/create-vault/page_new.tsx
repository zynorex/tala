'use client';

import { useEffect, useRef, useState } from 'react';
import { Lock, Users, Upload, Settings, Zap, Shield, Clock, CheckCircle, ChevronRight, ArrowRight, X, Info, Terminal, AlertOctagon, Skull } from "lucide-react";
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl" ref={dialogRef}>
        <div className="bg-white border-8 border-black shadow-[16px_16px_0_0_#FFF] overflow-hidden transform -rotate-1">
          <div className="flex items-start justify-between gap-4 p-6 border-b-8 border-black bg-heirlock-yellow">
            <div className="space-y-2">
              <p className="font-black uppercase tracking-[0.3em] text-black bg-white inline-block px-2 border-2 border-black">SECURITY CLEARANCE</p>
              <h2 className="text-3xl lg:text-4xl font-black text-black leading-none uppercase">RESTRICTED ZONE</h2>
            </div>
            <button onClick={onClose} className="p-2 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors" aria-label="Close notice">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="border-l-8 border-black pl-4">
              <p className="text-black text-lg font-black uppercase">
                ACTIVE DEPLOYMENTS REQUIRE AUTHORIZED WORKSPACE UPGRADES.
              </p>
              <p className="text-gray-700 text-sm font-bold mt-2">
                TO VERIFY PROTOCOL INTEGRITY, YOU MAY INITIATE A GHOST-DEPLOYMENT (DEMO) THAT AUTO-UNLOCKS IN 1 MINUTE.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-4 border-black bg-heirlock-green/20 hover:bg-heirlock-green/40 transition-colors p-6 rounded-none">
                <div className="flex items-center gap-3 mb-2">
                  <Terminal className="w-6 h-6" />
                  <p className="text-xl font-black text-black uppercase">GHOST (DEMO)</p>
                </div>
                <p className="font-bold text-sm">1 MINUTE TICKER. BURN AFTER READING. FOR RECON ONLY.</p>
              </div>
              <div className="border-4 border-black bg-black text-white p-6 rounded-none">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-heirlock-yellow" />
                  <p className="text-xl font-black text-white uppercase">METAL (PAID)</p>
                </div>
                <p className="font-bold text-sm text-gray-300">CUSTOM SCHEDULES. PERMANENT STORAGE. ENTERPRISE BANDWIDTH.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onSelectDemo}
                className="flex-1 py-4 bg-heirlock-yellow text-black font-black text-lg border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                INITIALIZE GHOST
              </button>
              <button
                onClick={onSelectPaid}
                className="flex-1 py-4 bg-black text-white font-black text-lg border-4 border-black shadow-[6px_6px_0_0_#FFF] hover:shadow-[8px_8px_0_0_#FFF] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                DEPLOY METAL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoVaultFormTab({ activeTab, setActiveTab }: { activeTab: VaultTab; setActiveTab: (tab: VaultTab) => void; }) {

  return (
    <div className="space-y-8">
      {/* Brutalist Tab Navigation */}
      <div className="flex flex-col sm:flex-row border-8 border-black shadow-[12px_12px_0_0_#000]">
        <button
          onClick={() => setActiveTab('demo')}
          className={`flex-1 px-6 py-6 font-black text-xl lg:text-2xl transition-all border-b-4 sm:border-b-0 sm:border-r-4 border-black uppercase flex items-center justify-center gap-3 ${
            activeTab === 'demo'
              ? 'bg-heirlock-green text-black'
              : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50'
          }`}
        >
          {activeTab === 'demo' && <Terminal className="w-6 h-6 shrink-0" />}
          GHOST / DEMO
        </button>
        <button
          onClick={() => setActiveTab('real')}
          className={`flex-1 px-6 py-6 font-black text-xl lg:text-2xl transition-all uppercase flex items-center justify-center gap-3 ${
            activeTab === 'real'
              ? 'bg-heirlock-blue text-black'
              : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50'
          }`}
        >
          {activeTab === 'real' && <Shield className="w-6 h-6 shrink-0" />}
          METAL / REAL
        </button>
      </div>

      {activeTab === 'demo' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="border-8 border-black p-8 md:p-12 bg-black text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-heirlock-green/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="font-black bg-heirlock-green text-black px-3 py-1 mb-6 inline-block uppercase tracking-widest text-sm border-2 border-heirlock-green">SIMULATION MODE</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">GHOST PROTOCOL</h2>
              <p className="font-bold text-lg md:text-xl text-gray-300 mb-8 max-w-2xl uppercase border-l-4 border-heirlock-green pl-4">
                VALIDATE ENCRYPTION LOGIC. VAULT UNLOCKS IN EXACTLY 60 SECONDS. ZERO COST.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'AES-256-GCM ACTIVE',
                  '50MB PAYLOAD MAX',
                  'KEY GENERATION LIVE',
                  'AUTO-DESTRUCT IN 1M'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border-2 border-white/20 p-3 bg-white/5 uppercase font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-heirlock-green" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-8 border-black bg-white p-4 md:p-8 shadow-[12px_12px_0_0_#000]">
            <CreateVaultForm demoMode={true} />
          </div>
        </div>
      )}

      {activeTab === 'real' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="border-8 border-black p-8 md:p-12 bg-black text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-heirlock-blue/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="font-black bg-heirlock-blue text-black px-3 py-1 mb-6 inline-block uppercase tracking-widest text-sm border-2 border-heirlock-blue">LIVE DEPLOYMENT</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">METAL ARCHITECTURE</h2>
              <p className="font-bold text-lg md:text-xl text-gray-300 mb-8 max-w-2xl uppercase border-l-4 border-heirlock-blue pl-4">
                PERMANENT TIME-LOCKING. ABSOLUTE CRYPTOGRAPHIC CONTROL. DO NOT LOSE YOUR KEYS.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'CUSTOM EPOCH SCHEDULING',
                  'BLOCKCHAIN ENFORCEMENT',
                  'IPFS REDUNDANCY',
                  'FULL MILITARY ENCRYPTION'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border-2 border-white/20 p-3 bg-white/5 uppercase font-bold text-sm">
                    <Zap className="w-5 h-5 text-heirlock-yellow" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-8 border-black bg-white p-4 md:p-8 shadow-[12px_12px_0_0_#000]">
            <CreateVaultForm demoMode={false} />
          </div>
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
      title: "CONNECT",
      description: "LINK WEB3 IDENTITY. KEYS NEVER LEAVE DEVICE.",
      icon: Shield,
    },
    {
      title: "ENCRYPT",
      description: "AES-256 CLIENT-SIDE LOCKDOWN OF PAYLOAD.",
      icon: Lock,
    },
    {
      title: "SCHEDULE",
      description: "DEFINE UNLOCK EPOCH TILL 2100+.",
      icon: Clock,
    },
    {
      title: "SCATTER",
      description: "BLOCKCHAIN SET. IPFS DEPLOYED.",
      icon: Zap,
    },
  ];

  return (
    <main className="min-h-screen bg-cream font-sans pb-20 selection:bg-black selection:text-heirlock-yellow">
      {showAccessModal && (
        <AccessNoticeModal
          onClose={closeAccessModal}
          onSelectDemo={handleSelectDemo}
          onSelectPaid={handleSelectPaid}
        />
      )}

      {/* GLITCH/TICKER HEADER */}
      <div className="w-full bg-black text-white border-b-8 border-black py-3 overflow-hidden whitespace-nowrap flex z-50 relative mt-16 md:mt-20">
        <div className="flex animate-[marquee_20s_linear_infinite] px-4 min-w-max">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-4">
              <AlertOctagon className="w-5 h-5 mr-3 text-heirlock-red" />
              <span className="font-black tracking-widest uppercase text-sm">
                SYSTEM REDY. COMMENCE DEPLOYMENT. ENCRYPTION AT 100%.
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-4 md:px-8 border-b-8 border-black bg-[url('/noise.png')] bg-repeat">
        <div className="absolute top-0 right-0 w-96 h-96 bg-heirlock-yellow border-8 border-black rounded-full mix-blend-multiply opacity-50 blur-md pointer-events-none hidden md:block"></div>
        
        <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row items-end justify-between relative z-10 gap-8">
          <div>
            <div className="inline-block border-4 border-black bg-black text-white px-4 py-1 mb-6 shadow-[4px_4px_0_0_#BAFFC9] transform -rotate-1">
              <span className="font-black uppercase tracking-[0.2em] text-xs">CREATE VAULT</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference drop-shadow-[-4px_4px_0_rgba(0,0,0,1)] text-white">
              DEPLOY <br />
              <span className="text-heirlock-blue">A VAULT</span>
            </h1>
          </div>
          
          <div className="xl:w-1/3 bg-white border-8 border-black p-6 shadow-[8px_8px_0_0_#000] rotate-1">
            <p className="font-bold text-lg md:text-xl uppercase">
              Time-lock any sensitive file. Secure it with military-grade cryptography.
            </p>
            <p className="font-black text-sm uppercase tracking-widest mt-4 pt-4 border-t-4 border-black inline-block">
              // READY FOR ARTIFACTS
            </p>
          </div>
        </div>
      </section>

      {/* DEPLOYMENT FORM - CORE FOCUS */}
      <section id="vault-form" className="py-20 px-4 md:px-8 bg-white border-b-8 border-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(#CCC_2px,transparent_2px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto relative z-10">
          <DemoVaultFormTab activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </section>

      {/* MATRIX PROTOCOL / HOW IT WORKS */}
      <section className="py-24 px-4 md:px-8 border-b-8 border-black bg-black text-white">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-5xl md:text-8xl font-black uppercase text-heirlock-yellow drop-shadow-[6px_6px_0_rgba(255,255,255,1)] mb-16 tracking-tighter">
            SEQUENCE <br /> DIRECTIVES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-8 border-white bg-white">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-black text-white border-r-4 border-b-4 lg:border-b-0 border-white p-8 hover:bg-heirlock-blue hover:text-black transition-colors group">
                  <div className="flex justify-between items-start border-b-4 border-white pb-4 mb-6 group-hover:border-black">
                    <span className="font-black text-3xl">/0{index + 1}</span>
                    <Icon className="w-10 h-10 group-hover:text-black" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{step.title}</h3>
                  <p className="font-bold leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE ARCHIVES (Specs) & FINAL PUSH */}
      <section className="py-24 px-4 md:px-8 bg-heirlock-pink border-b-8 border-black">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl md:text-7xl font-black uppercase text-black mb-8 tracking-tighter">
              TARGET AUDIENCE
            </h2>
            <div className="space-y-6">
              {[
                { t: "EDUCATION", d: "SECURE EXAM PAPERS. PREVENT ADVANCE LEAKS." },
                { t: "MEDICAL", d: "HIPAA COMPLIANT PHI OBFUSCATION." },
                { t: "LEGAL", d: "SMART CONTRACT AUDIT LOGS FOR EVIDENCE." },
                { t: "CYBER", d: "0-DAY VULNERABILITY TIMELOCKS." }
              ].map((ic, ix) => (
                <div key={ix} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000] hover:translate-x-2 transition-transform">
                  <h3 className="font-black text-2xl uppercase mb-2 flex items-center gap-3">
                    <Skull className="w-6 h-6" /> {ic.t}
                  </h3>
                  <p className="font-bold uppercase text-gray-700">{ic.d}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 flex flex-col justify-center border-l-8 border-black lg:pl-16">
            <h2 className="text-5xl md:text-8xl font-black uppercase mb-8 leading-none tracking-tighter">
              SYSTEM OP <br/>MANUAL
            </h2>
            <p className="font-bold text-xl uppercase mb-8 p-4 border-4 border-black bg-white">
              NEED TO UNDERSTAND THE DEEP MAGIC?
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/how-it-works" className="px-8 py-6 bg-black text-white text-2xl font-black uppercase border-4 border-black shadow-[8px_8px_0_0_#FFF] hover:bg-white hover:text-black hover:shadow-[12px_12px_0_0_#000] transition-all flex items-center justify-between">
                DOCS / INTEL <ChevronRight className="w-8 h-8" />
              </Link>
              <Link href="/pricing" className="px-8 py-6 bg-white text-black text-2xl font-black uppercase border-4 border-black shadow-[8px_8px_0_0_#000] hover:bg-black hover:text-white hover:shadow-[12px_12px_0_0_#FFF] transition-all flex items-center justify-between">
                UPGRADE CLEARANCE <ChevronRight className="w-8 h-8" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </main>
  );
}
