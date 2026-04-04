import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | TALA",
  description: "Terms of Service for TALA vault system",
};

const SectionCard = ({ index, title, children, variant = 'default' }: { index: string, title: string, children: React.ReactNode, variant?: 'default' | 'warning' | 'terminal' | 'critical' }) => {
  const bgs = {
    default: 'bg-white',
    warning: 'bg-heirlock-yellow',
    terminal: 'bg-black text-white',
    critical: 'bg-[#FF6961] text-black'
  };
  const shadows = {
    default: 'shadow-[12px_12px_0_0_#000]',
    warning: 'shadow-[12px_12px_0_0_#000]',
    terminal: 'shadow-[12px_12px_0_0_#FFFACD]',
    critical: 'shadow-[12px_12px_0_0_#000]'
  };
  const titleColor = {
    default: 'text-black',
    warning: 'text-black',
    terminal: 'text-heirlock-green',
    critical: 'text-black'
  };
  const borderColor = variant === 'terminal' ? 'border-white' : 'border-black';
  const headerBorder = variant === 'terminal' ? 'border-white' : 'border-black';

  return (
    <div className={`border-4 ${borderColor} ${bgs[variant]} p-8 md:p-12 relative group ${shadows[variant]} hover:-translate-y-2 transition-all duration-300`}>
      <div className={`absolute -left-4 -top-6 md:-left-6 w-16 h-16 flex items-center justify-center font-black text-2xl border-4 transition-all duration-300 z-10 
        ${variant === 'terminal' ? 'bg-white text-black border-black shadow-[4px_4px_0_0_#BAFFC9] group-hover:shadow-[8px_8px_0_0_#BAFFC9]' : 'bg-black text-white border-black shadow-[4px_4px_0_0_#FFF] group-hover:shadow-[8px_8px_0_0_#FFF]'} 
        group-hover:scale-110 group-hover:rotate-6`}>
        {index}
      </div>
      <h2 className={`text-3xl md:text-4xl font-black uppercase mb-8 ${titleColor[variant]} border-b-4 ${headerBorder} pb-4`}>{title}</h2>
      <div className={`space-y-6 text-lg md:text-xl font-bold leading-relaxed ${variant === 'terminal' ? 'text-gray-300' : 'text-gray-900'}`}>
        {children}
      </div>
    </div>
  );
};

const Bullet = ({ variant = 'default' }: { variant?: 'default' | 'terminal' | 'critical' }) => (
  <span className={`w-3 h-3 mt-2.5 shrink-0 border-2 ${variant === 'terminal' ? 'bg-heirlock-green border-heirlock-green' : variant === 'critical' ? 'bg-black border-black' : 'bg-black border-black'}`}></span>
);

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream selection:bg-black selection:text-white">
      {/* Brutalist Hero Header */}
      <section className="relative pt-32 pb-20 px-4 border-b-8 border-black overflow-hidden bg-cream">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col gap-6">
            <Link href="/legal" className="inline-flex items-center gap-2 font-black mb-8 hover:-translate-x-2 transition-transform bg-black text-white px-5 py-3 border-4 border-black shadow-[4px_4px_0_0_#FFFACD] hover:shadow-[8px_8px_0_0_#FFFACD] uppercase text-sm tracking-widest max-w-fit">
              <ChevronLeft className="w-5 h-5" strokeWidth={3} /> Back to Legal Directory
            </Link>
            
            <span className="inline-block bg-heirlock-yellow text-black border-2 border-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] max-w-fit mb-4 -rotate-1">
              LEGAL DIRECTIVE // 01
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-black uppercase tracking-tighter leading-none mb-6">
              TERMS OF <br/> SERVICE.
            </h1>
            <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-2xl leading-relaxed">
              The operational doctrines governing your use of the T.A.L.A. zero-trust protocol.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-24">
        <div className="space-y-16">
          
          <SectionCard index="01" title="Acceptance of Terms">
            <p>
              By accessing and using TALA ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please <strong>do not use this Service</strong>. Your use of TALA constitutes your acceptance of these terms, our Privacy Policy, Disclaimer, and all other policies referenced herein.
            </p>
            <p className="bg-gray-100 p-6 border-l-8 border-black text-black">
              TALA reserves the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes have been posted constitutes your acceptance of the modified terms.
            </p>
          </SectionCard>

          <SectionCard index="02" title="Service Description" variant="terminal">
            <p className="text-white">
              TALA is a time-locked, non-custodial vault system built on blockchain technology (primarily Polygon network). The Service allows users to:
            </p>
            <ul className="space-y-4 flex flex-col mt-6">
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span>Encrypt files using AES-256-GCM encryption</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span>Upload encrypted files to IPFS (via Pinata)</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span>Create time-locked vaults with blockchain-based unlock conditions</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span>Access vault contents only after the specified unlock time</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span>Manage multiple vaults through a user dashboard</span></li>
            </ul>
            <div className="mt-8 border-4 border-heirlock-yellow text-heirlock-yellow p-6 font-mono text-base uppercase">
              TALA does not store your encryption keys, wallet credentials, or have custody of your files. You maintain complete control and responsibility for your vault's contents and encryption keys at all times.
            </div>
          </SectionCard>

          <SectionCard index="03" title="Eligibility and Requirements">
            <p>To use TALA, you must:</p>
            <ul className="space-y-3 flex flex-col">
              <li className="flex gap-4 items-start"><Bullet/><span>Be at least 18 years old (or the legal age in your jurisdiction)</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>Have a compatible blockchain wallet (MetaMask, WalletConnect, etc.)</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>Have sufficient MATIC tokens for gas fees on Polygon network</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>Not be a resident of sanctioned countries or on any sanctions list</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>Comply with all applicable laws and regulations in your jurisdiction</span></li>
            </ul>
            <p>We reserve the right to refuse service or terminate accounts that violate these requirements.</p>
          </SectionCard>

          <SectionCard index="04" title="User Responsibilities">
            <p>You are explicitly responsible for the following:</p>
            <ul className="space-y-6 mt-6">
              <li className="flex gap-4 items-start border-b-2 border-gray-200 pb-4">
                <Bullet/>
                <div>
                  <strong className="text-black uppercase tracking-wider block mb-1">Wallet Security</strong>
                  Maintaining the confidentiality of your wallet's private keys, seed phrases, and access credentials. We cannot recover lost or compromised wallets.
                </div>
              </li>
              <li className="flex gap-4 items-start border-b-2 border-gray-200 pb-4">
                <Bullet/>
                <div>
                  <strong className="text-black uppercase tracking-wider block mb-1">Encryption Keys</strong>
                  Keeping your encryption keys secure and creating reliable backups. Loss of encryption keys results in permanent inability to access vault contents.
                </div>
              </li>
              <li className="flex gap-4 items-start border-b-2 border-gray-200 pb-4">
                <Bullet/>
                <div>
                  <strong className="text-black uppercase tracking-wider block mb-1">Account Activity</strong>
                  All activity that occurs under your wallet address is your responsibility. You are liable for all transactions and actions performed.
                </div>
              </li>
              <li className="flex gap-4 items-start border-b-2 border-gray-200 pb-4">
                <Bullet/>
                <div>
                  <strong className="text-black uppercase tracking-wider block mb-1">Compliance</strong>
                  Ensuring your use of TALA complies with all applicable laws, regulations, and sanctions requirements in your jurisdiction.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Bullet/>
                <div>
                  <strong className="text-black uppercase tracking-wider block mb-1">Content Responsibility</strong>
                  You are solely responsible for ensuring that vault contents do not violate laws, infringe on intellectual property, or contain illegal materials.
                </div>
              </li>
            </ul>
          </SectionCard>

          <SectionCard index="05" title="Non-Custodial Nature" variant="warning">
            <p className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-6">
              TALA is explicitly a zero-knowledge, non-custodial service.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start"><Bullet/><span>We do not control, store, or have access to your encrypted files</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>We do not control, store, or have access to your encryption keys</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>We do not control or have custody of your wallet or assets</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>We cannot recover, restore, or access vault contents for any reason</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span>Smart contract code handles all unlock logic - we cannot override or modify it</span></li>
            </ul>
            <div className="mt-8 bg-black text-white p-6 border-4 border-black shadow-[6px_6px_0_0_#FFF]">
              <h4 className="font-black text-xl text-heirlock-red uppercase mb-2 animate-pulse">Critical Warning</h4>
              <p>This means if you lose your encryption key, vault access is permanently impossible, and we cannot help you recover it under any circumstances.</p>
            </div>
          </SectionCard>

          <SectionCard index="06" title="Blockchain Risks" variant="terminal">
            <p className="text-white">TALA operates on blockchain networks, primarily Polygon. You acknowledge and accept:</p>
            <ul className="space-y-4 mt-6">
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span><strong>Transaction Irreversibility:</strong> All blockchain transactions are permanent and cannot be reversed or refunded once confirmed.</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span><strong>Gas Fees:</strong> You are responsible for all gas fees. These are not refundable and may be unpredictable during network congestion.</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span><strong>Network Failures:</strong> Blockchain networks may experience congestion, outages, or technical failures beyond our control.</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span><strong>Smart Contract Risk:</strong> While our smart contracts are thoroughly tested, all smart contracts carry inherent security risks and potential vectors for exploits.</span></li>
            </ul>
          </SectionCard>

          <SectionCard index="07" title="Limitations of Liability" variant="critical">
            <p className="text-2xl font-black uppercase bg-black text-white p-4 inline-block shadow-[4px_4px_0_0_#FFF]">
              TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL LIABILITY FOR:
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex gap-4 items-start"><Bullet variant="critical"/><span className="text-black">Loss or inability to access encryption keys or vault contents</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="critical"/><span className="text-black">Data loss, corruption, or deletion</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="critical"/><span className="text-black">Blockchain network failures or exploits</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="critical"/><span className="text-black">Third-party service failures (IPFS, Pinata, RPC providers)</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="critical"/><span className="text-black">Lost profits, opportunities, or revenue, or any indirect, incidental, or consequential damages</span></li>
            </ul>
            <div className="mt-8 bg-white text-black font-black uppercase p-6 border-4 border-black text-xl">
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO USE TALA (IF ANY).
            </div>
          </SectionCard>

          <SectionCard index="08" title="Prohibited Activities">
            <p>You agree not to use TALA to:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <li className="bg-gray-100 p-4 border-2 border-black flex gap-3 items-center font-bold text-base"><Bullet/> Store illegal content</li>
              <li className="bg-gray-100 p-4 border-2 border-black flex gap-3 items-center font-bold text-base"><Bullet/> Violate sanctions laws</li>
              <li className="bg-gray-100 p-4 border-2 border-black flex gap-3 items-center font-bold text-base"><Bullet/> Harass or defame others</li>
              <li className="bg-gray-100 p-4 border-2 border-black flex gap-3 items-center font-bold text-base"><Bullet/> Engage in fraud</li>
              <li className="bg-gray-100 p-4 border-2 border-black flex gap-3 items-center font-bold text-base"><Bullet/> Avoid money laundering controls</li>
              <li className="bg-gray-100 p-4 border-2 border-black flex gap-3 items-center font-bold text-base"><Bullet/> Reverse engineer source code</li>
            </ul>
          </SectionCard>

          <SectionCard index="09" title="Intellectual Property">
             <p>The TALA platform, including its source code, design, documentation, logos, and branding, is protected by copyright and other intellectual property laws.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
               <div className="border-4 border-heirlock-green p-6 bg-white shadow-[8px_8px_0_0_#BAFFC9]">
                 <h3 className="font-black text-xl uppercase mb-4 text-heirlock-green px-2 py-1 bg-black inline-block">PERMITTED</h3>
                 <ul className="space-y-2">
                   <li className="flex gap-3 items-start"><Bullet/> Use for personal/non-commercial</li>
                   <li className="flex gap-3 items-start"><Bullet/> Review open-source contracts</li>
                   <li className="flex gap-3 items-start"><Bullet/> Use docs for education</li>
                 </ul>
               </div>
               <div className="border-4 border-heirlock-red p-6 bg-white shadow-[8px_8px_0_0_#FF6961]">
                 <h3 className="font-black text-xl uppercase mb-4 text-heirlock-yellow px-2 py-1 bg-black inline-block">PROHIBITED</h3>
                 <ul className="space-y-2">
                   <li className="flex gap-3 items-start"><Bullet/> Copying without permission</li>
                   <li className="flex gap-3 items-start"><Bullet/> Creating derivative commercial works</li>
                   <li className="flex gap-3 items-start"><Bullet/> Removing attribution</li>
                 </ul>
               </div>
             </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <SectionCard index="10" title="Third Parties">
              <p>TALA integrates with services like IPFS, Pinata, and external RPCs. We are not responsible for their outages, security vulnerabilities, or privacy changes. You are responsible for reviewing their isolated terms.</p>
            </SectionCard>

            <SectionCard index="11" title="Modifications">
              <p>We reserve the right to modify, suspend, or discontinue TALA at any time. We are not liable for any service discontinuation. Your only explicit recourse is to cease using the platform.</p>
            </SectionCard>
          </div>

          <SectionCard index="12" title="Resolution & Agreement">
            <p className="mb-6">
              These Terms are governed by applicable law. By using TALA, you irrevocably consent to exclusive jurisdiction in relevant courts and arbitration of disputes. Any claims must be brought within one year.
            </p>
            <p className="mb-8">
              If a provision is found unenforceable, it will be modified minimally to enforceability, keeping the rest intact. These Terms and Privacy Policy constitute the entire understanding.
            </p>
            <div className="bg-black text-white p-8 md:p-12 border-4 border-black shadow-[12px_12px_0_0_#FFE600] flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="text-2xl md:text-3xl font-black uppercase text-heirlock-yellow max-w-lg leading-tight">
                By interacting with TALA smart contracts, you mathematically and legally verify your acceptance.
              </p>
              <Link href="/contact" className="px-8 py-5 bg-white text-black font-black uppercase tracking-widest text-xl border-4 border-black shadow-[6px_6px_0_0_#FF6961] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#FF6961] transition-all whitespace-nowrap">
                Contact Legal
              </Link>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}
