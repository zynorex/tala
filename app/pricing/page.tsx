'use client';

import { CheckCircle, Lock, BarChart3, Shield, Zap, ChevronRight, ExternalLink, Skull, AlertOctagon, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RazorpayButton } from '@/app/components/RazorpayCheckout';
import type { PlanTier, BillingInterval } from '@/lib/payments/types';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  color: string;
  textColor: string;
  buttonClass: string;
  icon: React.ComponentType<any>;
  features: string[];
  highlighted?: boolean;
  planTierKey: PlanTier | null;
  contactSales?: boolean;
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [activatedPlan, setActivatedPlan] = useState<PlanTier | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handlePaymentSuccess = useCallback(
    (planTier: PlanTier) => (data: { planTier: PlanTier; planExpiresAt: string }) => {
      setActivatedPlan(data.planTier);
      setTimeout(() => router.push('/dashboard?upgrade=success'), 2000);
    },
    [router],
  );

  const billingInterval: BillingInterval = isYearly ? 'YEARLY' : 'MONTHLY';

  const pricingTiers: PricingTier[] = [
    {
      name: 'STARTER',
      price: 99,
      description: 'LONE WOLF PROTOCOL. BASE LEVEL ENCRYPTION.',
      color: 'bg-heirlock-blue',
      textColor: 'text-black',
      buttonClass: 'bg-black text-white hover:bg-gray-800',
      icon: Lock,
      planTierKey: 'STARTER' as PlanTier,
      features: [
        '99 SECURE VAULTS',
        '500MB PER VAULT',
        'AES-256 ENCRYPTION',
        '1 USER ACCOUNT',
        'IPFS COLD STORAGE',
        'STANDARD SUPPORT',
      ],
    },
    {
      name: 'PRO',
      price: 499,
      description: 'INSTITUTIONAL GRADE. NO COMPROMISES.',
      color: 'bg-heirlock-yellow',
      textColor: 'text-black',
      buttonClass: 'bg-black text-white hover:bg-gray-800',
      icon: Shield,
      highlighted: true,
      planTierKey: 'PROFESSIONAL' as PlanTier,
      features: [
        'UNLIMITED VAULTS',
        '1GB PER VAULT',
        'AES-256-GCM MILITARY',
        'UP TO 10 OPERATORS',
        'API INTEGRATION',
        'PRIORITY OVERRIDE',
        'AUDIT LOGS',
      ],
    },
    {
      name: 'ENTERPRISE',
      price: 999,
      description: 'GLOBAL OPERATIONS. MAXIMUM BANDWIDTH.',
      color: 'bg-heirlock-green',
      textColor: 'text-black',
      buttonClass: 'bg-black text-white hover:bg-gray-800',
      icon: Zap,
      planTierKey: 'ENTERPRISE' as PlanTier,
      features: [
        'UNLIMITED EVERYTHING',
        'INFINITE STORAGE',
        'UNLIMITED OPERATORS',
        'PREMIUM IPFS NODES',
        'BATCH DEPLOYMENTS',
        'WEBHOOK TRIGGERS',
        '24/7 DEDICATED COMS',
      ],
    },
    {
      name: 'GOV / SYNDICATE',
      price: 9999,
      description: 'NATION-STATE LEVEL PROTECTION ARCHITECTURE.',
      color: 'bg-heirlock-pink',
      textColor: 'text-black',
      buttonClass: 'bg-black text-white hover:bg-gray-800',
      icon: Skull,
      planTierKey: null,
      contactSales: true,
      features: [
        'DEDICATED METAL',
        'SOC 2 / ISO 27001',
        'ON-PREMISE HYBRID',
        'ZERO-KNOWLEDGE PROOFS',
        'MULTI-SIG CLEARANCE',
        'WHITE-LABEL ASSETS',
        'INCIDENT RESPONSE TEAM',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-cream font-sans pb-20 selection:bg-black selection:text-heirlock-yellow">
      {/* GLITCH/TICKER HEADER */}
      <div className="w-full bg-black text-white border-b-8 border-black py-3 overflow-hidden whitespace-nowrap flex z-50 relative">
        <div className="flex animate-[marquee_20s_linear_infinite] px-4 min-w-max">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-4">
              <AlertOctagon className="w-5 h-5 mr-3 text-heirlock-yellow" />
              <span className="font-black tracking-widest uppercase text-sm">
                SECURE YOUR DATA. ZERO COMPROMISE. NO DELETIONS. NO SURRENDER.
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-12 px-4 md:px-8 border-b-8 border-black overflow-hidden bg-[url('/noise.png')] bg-repeat opacity-95">
        <div className="absolute top-0 left-10 w-64 h-64 bg-heirlock-yellow border-8 border-black rounded-full mix-blend-multiply blur-sm opacity-50 animate-pulse hidden md:block"></div>
        <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-heirlock-pink border-8 border-black mix-blend-multiply opacity-50 transform rotate-12 hidden md:block"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          <div className="inline-block border-4 border-black bg-black text-white px-4 py-1 mb-6 shadow-[4px_4px_0_0_#FFE600] transform -rotate-1">
            <span className="font-black uppercase tracking-[0.2em] text-xs">Acquisition Protocols</span>
          </div>
          
          <div className="flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-12 mb-6 w-full">
            <h1 className="text-5xl md:text-7xl font-black leading-none text-center uppercase tracking-tighter mix-blend-difference drop-shadow-[-3px_3px_0_rgba(0,0,0,1)] text-white">
              PRICE OF SECURITY
            </h1>

            {/* BRUTALIST TOGGLE */}
            <div className="border-4 border-black bg-white p-3 flex items-center gap-4 shadow-[6px_6px_0_0_#000] rotate-1 shrink-0">
              <span className={`text-lg md:text-xl font-black ${!isYearly ? 'text-black' : 'text-gray-400'}`}>MONTHLY</span>
              
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-20 h-10 bg-heirlock-yellow border-4 border-black rounded-full transition-colors flex items-center shrink-0 cursor-pointer overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1/2 bg-black transition-transform duration-300 ${isYearly ? 'translate-x-full' : 'translate-x-0'}`}></div>
              </button>

              <div className="flex flex-col">
                <span className={`text-lg md:text-xl font-black ${isYearly ? 'text-black' : 'text-gray-400'}`}>ANNUAL</span>
                {isYearly ? (
                  <span className="text-[10px] font-black bg-heirlock-pink border-2 border-black px-1 mt-0.5 -rotate-2 self-start leading-none py-0.5">SAVE 20%</span>
                ) : (
                  <span className="text-[10px] font-black bg-white opacity-0 mt-0.5 leading-none py-0.5">SAVE 20%</span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-sm md:text-lg font-bold max-w-2xl text-center border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
            NO HIDDEN FEES. NO MIDDLEMEN. JUST UNBREAKABLE ENCRYPTION AT SCALE.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="py-12 px-4 md:px-8 border-b-8 border-black bg-white" id="plans">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              const isHighlight = tier.highlighted;
              
              return (
                <div
                  key={index}
                  className={`
                    relative border-8 border-black p-8 flex flex-col
                    ${tier.color} ${tier.textColor}
                    ${isHighlight ? 'lg:-translate-y-8 shadow-[16px_16px_0_0_#000] lg:scale-105 z-10' : 'shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-2'}
                    transition-all duration-300
                  `}
                >
                  {isHighlight && (
                    <div className="absolute -top-6 -right-6 bg-black text-white font-black px-4 py-2 border-4 border-black rotate-6 shadow-[4px_4px_0_0_#FFF] z-20 whitespace-nowrap">
                      PRIORITY TARGET
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <Icon className="w-12 h-12 stroke-[2.5px]" />
                    <span className="text-sm font-black border-2 border-black px-2 py-1 bg-white uppercase">ID: 0{index + 1}</span>
                  </div>

                  <h3 className="text-4xl lg:text-5xl font-black uppercase mb-2 tracking-tight">
                    {tier.name}
                  </h3>
                  <p className="font-bold text-sm mb-6 h-10 border-b-4 border-black/20 pb-12">
                    {tier.description}
                  </p>

                  <div className="mb-8 bg-white border-4 border-black p-4 rotate-[-1deg]">
                    <div className="flex items-start gap-1">
                      <span className="text-xl font-black mt-1">₹</span>
                      <span className="text-5xl lg:text-6xl font-black">
                        {isYearly ? Math.round(tier.price * 12 * 0.8).toLocaleString('en-IN') : tier.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-sm font-black uppercase mt-1 text-gray-500">
                      /{isYearly ? 'YEAR' : 'MONTH'} 
                      {isYearly && <span className="text-black ml-2 bg-heirlock-yellow px-1 border border-black">(-20%)</span>}
                    </p>
                  </div>

                  {/* FEATURES */}
                  <div className="flex-grow">
                    <p className="font-black uppercase tracking-widest text-xs mb-4 border-b-4 border-black pb-2">Loadout:</p>
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex gap-3 items-start font-bold uppercase text-sm">
                          <Terminal className="w-5 h-5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="mt-auto">
                    {tier.contactSales ? (
                      <Link
                        href="/contact"
                        className={`w-full py-4 border-4 border-black font-black uppercase text-xl flex items-center justify-between px-6 transition-all active:translate-y-1 active:shadow-none hover:rotate-1 ${tier.buttonClass} shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]`}
                      >
                        ENGAGE
                        <ExternalLink className="w-6 h-6" />
                      </Link>
                    ) : !session ? (
                      <Link
                        href={`/auth/login?redirect=/pricing`}
                        className={`w-full py-4 border-4 border-black font-black uppercase text-lg flex items-center justify-between px-4 transition-all active:translate-y-1 active:shadow-none hover:-rotate-1 ${tier.buttonClass} shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]`}
                      >
                        AUTH REQ
                        <ChevronRight className="w-6 h-6" />
                      </Link>
                    ) : activatedPlan === tier.planTierKey ? (
                      <div className="w-full py-4 bg-green-400 border-4 border-black font-black uppercase text-xl flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#000]">
                        <CheckCircle className="w-6 h-6" />
                        SECURED
                      </div>
                    ) : (
                      <div className="brutal-razor-wrapper w-full relative group">
                         {/* We style the Razorpay Button wrapper to match brutalist */}
                        <div className={`w-full h-full absolute inset-0 bg-black translate-x-1 translate-y-1 -z-10 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform`}></div>
                        <div className="w-full border-4 border-black bg-white hover:bg-black hover:text-white transition-colors">
                          <RazorpayButton
                            planTier={tier.planTierKey!}
                            billingInterval={billingInterval}
                            label={`ACQUIRE NOW`}
                            onSuccess={handlePaymentSuccess(tier.planTierKey!)}
                            className="w-full h-full !py-4 !bg-transparent !text-inherit !rounded-none !font-black !text-xl !uppercase !tracking-widest"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH SPECS MATRIX */}
      <section className="py-24 px-4 md:px-8 border-b-8 border-black bg-heirlock-yellow relative">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8 bg-black p-8 md:p-12 border-8 border-white shadow-[16px_16px_0_0_#FFF]">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
              SPECS MATRIX
            </h2>
            <div className="text-white text-right max-w-md font-bold text-lg md:text-xl border-l-4 border-heirlock-yellow pl-6">
              Compare deployment parameters. Uncompromising performance across all sectors.
            </div>
          </div>

          <div className="overflow-x-auto border-8 border-black bg-white shadow-[16px_16px_0_0_#000]">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-black text-white font-black uppercase text-xl md:text-2xl text-center">
                  <th className="p-6 border-r-4 border-b-8 border-white text-left">PARAMETER</th>
                  <th className="p-6 border-r-4 border-b-8 border-white">STARTER</th>
                  <th className="p-6 border-r-4 border-b-8 border-white bg-heirlock-pink text-black">PRO</th>
                  <th className="p-6 border-r-4 border-b-8 border-white">ENTERPRISE</th>
                  <th className="p-6 border-b-8 border-white">GOV</th>
                </tr>
              </thead>
              <tbody className="font-bold text-lg uppercase text-center">
                {[
                  ['VAULT LIMIT', '99 UNITS', 'UNLIMITED', 'UNLIMITED', 'UNLIMITED'],
                  ['CAPACITY / VAULT', '500 MB', '1 GB', 'INFINITE', 'INFINITE'],
                  ['OPERATIVES', '1', 'UP TO 10', 'UNLIMITED', 'UNLIMITED'],
                  ['ENCRYPTION', 'AES-256', 'AES-256-GCM', 'CUSTOM METAL', 'ZERO-KNOWLEDGE'],
                  ['SUPPORT COMM', 'COMMUNITY', 'PRIORITY', '24/7 DEDICATED', 'INCIDENT TEAM'],
                  ['API OMNI-ACCESS', false, true, true, true],
                  ['WHITE-LABEL', false, false, false, true],
                ].map((row, i) => (
                  <tr key={i} className={`border-b-4 border-black ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-heirlock-blue/20 transition-colors`}>
                    <td className="p-6 border-r-4 border-black text-left font-black tracking-widest">{row[0]}</td>
                    <td className="p-6 border-r-4 border-black">
                      {typeof row[1] === 'boolean' ? (row[1] ? <div className="w-6 h-6 bg-black rounded-full mx-auto" /> : <div className="w-6 h-6 border-4 border-black rounded-sm mx-auto" />) : row[1]}
                    </td>
                    <td className="p-6 border-r-4 border-black bg-heirlock-yellow/10">
                      {typeof row[2] === 'boolean' ? (row[2] ? <div className="w-6 h-6 bg-black rounded-full mx-auto" /> : <div className="w-6 h-6 border-4 border-black rounded-sm mx-auto" />) : row[2]}
                    </td>
                    <td className="p-6 border-r-4 border-black">
                      {typeof row[3] === 'boolean' ? (row[3] ? <div className="w-6 h-6 bg-black rounded-full mx-auto" /> : <div className="w-6 h-6 border-4 border-black rounded-sm mx-auto" />) : row[3]}
                    </td>
                    <td className="p-6">
                      {typeof row[4] === 'boolean' ? (row[4] ? <div className="w-6 h-6 bg-black rounded-full mx-auto" /> : <div className="w-6 h-6 border-4 border-black rounded-sm mx-auto" />) : row[4]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* INTELLIGENCE DESK / FAQ */}
      <section className="py-24 px-4 md:px-8 border-b-8 border-black bg-black text-white relative">
        <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(#333_2px,transparent_2px)] [background-size:32px_32px] opacity-30"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <h2 className="text-6xl md:text-8xl lg:text-[100px] font-black uppercase text-center mb-16 text-heirlock-yellow drop-shadow-[8px_8px_0_rgba(255,255,255,1)]">
            INTEL DESK
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              { q: 'CAN I SWITCH SUB-ROUTINES (PLANS)?', a: 'AFFIRMATIVE. Instant upgrade or downgrade. Credits prorated automatically to your operational account.' },
              { q: 'WHAT ABOUT ANNUAL DISCOUNTS?', a: 'COMMIT LONG TERM. WE DROP THE PRICE BY 20%. Standard mercenary protocol.' },
              { q: 'ANY FREE TRIALS?', a: '14 DAYS. FULL ACCESS. ZERO CREDIT CARD. We show you the metal before you buy.' },
              { q: 'PAYMENT GATEWAYS?', a: 'UPI. CREDIT. DEBIT. NET BANKING. ALL SECURED VIA RAZORPAY. PCI-DSS COMPLIANT.' },
              { q: 'WHAT IF I HIT STORAGE MAX?', a: 'WARNING ISSUED AT 80%. No automatic charges. You either upgrade or purge old data.' },
              { q: 'HOW IS IT STORED?', a: 'CLIENT-SIDE ENCRYPTION. AES-256-GCM BEFORE DEPARTURE. SHREDDED AND SCATTERED ACROSS DECENTRALIZED IPFS NODES.' },
              { q: 'CAN I PULL OUT MY DATA?', a: 'YES. EXPORT BATCHES AVAILABLE. YOUR DATA. YOUR CONTROL. ALWAYS.' },
              { q: 'WHAT HAPPENS TO DELETED FILES?', a: '30-DAY PURGATORY. AFTER THAT, TOTAL INCINERATION FROM ALL GLOBAL SERVERS.' }
            ].map((faq, idx) => (
              <div key={idx} className="border-4 border-white bg-black text-white p-8 hover:bg-white hover:text-black hover:border-white transition-all group group-hover:shadow-[12px_12px_0_0_#FFF] shadow-[8px_8px_0_0_#FFF]">
                <div className="text-xl font-black uppercase mb-4 flex items-start gap-4 text-white group-hover:text-black">
                  <span className="text-heirlock-yellow group-hover:text-black">/0{idx + 1}</span>
                  {faq.q}
                </div>
                <p className="font-bold border-t-4 border-white/20 group-hover:border-black pt-4 text-white group-hover:text-black">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL PUSH */}
      <section className="py-32 px-4 md:px-8 border-b-8 border-black bg-white overflow-hidden relative">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-heirlock-green border-8 border-black star-shape mix-blend-multiply opacity-50 animate-spin-slow"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-8 hover:scale-105 transition-transform duration-500 cursor-default">
            INITIALIZE<br />PROTOCOL
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link
              href={session ? '/dashboard' : '/auth/login?redirect=/pricing'}
              className="px-12 py-6 bg-black text-white font-black text-2xl uppercase tracking-widest border-8 border-black hover:bg-white hover:text-black hover:shadow-[12px_12px_0_0_#000] active:translate-y-2 active:shadow-none transition-all"
            >
              {session ? 'DASHBOARD' : 'START FREE'}
            </Link>
            <Link
              href="/contact"
              className="px-12 py-6 bg-white text-black font-black text-2xl uppercase tracking-widest border-8 border-black shadow-[12px_12px_0_0_#000] hover:bg-heirlock-yellow hover:-translate-y-2 hover:shadow-[16px_16px_0_0_#000] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4"
            >
              CONTACT ENG
            </Link>
          </div>
        </div>
      </section>
      
      {/* Add a tiny CSS inline for animations & shapes if not in tailwind config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .star-shape {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
      `}} />
    </main>
  );
}
