import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | TALA",
  description: "Important disclaimers and risk warnings for TALA",
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
  <span className={`w-3 h-3 mt-2.5 shrink-0 border-2 ${variant === 'terminal' ? 'bg-heirlock-green border-heirlock-green' : 'bg-black border-black'}`}></span>
);

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white font-sans pb-32">
      {/* Brutalist Hero Header */}
      <section className="relative pt-32 pb-20 px-4 border-b-8 border-black overflow-hidden bg-cream">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col gap-6">
            <Link href="/legal" className="inline-flex items-center gap-2 font-black mb-8 hover:-translate-x-2 transition-transform bg-black text-white px-5 py-3 border-4 border-black shadow-[4px_4px_0_0_#FFB3BA] hover:shadow-[8px_8px_0_0_#FFB3BA] uppercase text-sm tracking-widest max-w-fit">
              <ChevronLeft className="w-5 h-5" strokeWidth={3} /> Back to Legal Directory
            </Link>
            
            <span className="inline-block bg-heirlock-pink text-black border-2 border-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] max-w-fit mb-4 -rotate-1">
              LEGAL DIRECTIVE // 03
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-black uppercase tracking-tighter leading-none mb-6">
              DISCLAIMER.
            </h1>
            <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-2xl leading-relaxed">
              Liability boundaries and absolute warnings for interacting with Web3 protocols.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-24">
        
        <div className="bg-[#FF6961] text-black border-4 border-black p-8 md:p-12 shadow-[12px_12px_0_0_#000] mb-16 animate-pulse-slow">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6">CRITICAL ALERT</h2>
          <p className="text-xl md:text-2xl font-black leading-tight">
            TALA is a non-custodial platform. Loss of your encryption keys or private keys results in PERMANENT AND IRREVERSIBLE loss of access to your vault and all contents. We cannot recover your data.
          </p>
        </div>

        <div className="space-y-16">
          <SectionCard index="01" title="Non-Custodial Nature" variant="terminal">
            <p className="text-white">TALA is explicitly a non-custodial platform. This mathematically means:</p>
            <ul className="space-y-4 flex flex-col mt-6">
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span><strong className="text-heirlock-green uppercase">We hold zero assets.</strong> You maintain absolute control over your encryption keys, private keys, wallet, and vault contents at all times.</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span><strong className="text-heirlock-green uppercase">No system backdoors.</strong> Your keys exist purely on your local device. We cannot access, decrypt, or recover your vault.</span></li>
              <li className="flex gap-4 items-start"><Bullet variant="terminal"/><span><strong className="text-heirlock-green uppercase">Not a fiduciary.</strong> TALA is software infrastructure, not a designated financial custodian or banking institution.</span></li>
            </ul>
          </SectionCard>

          <SectionCard index="02" title="Permanent Loss of Access" variant="critical">
            <p className="text-2xl font-black uppercase bg-black text-white p-4 shadow-[4px_4px_0_0_#FFF]">
              IF YOU LOSE YOUR ENCRYPTION KEY:
            </p>
            <ul className="space-y-4 mt-6">
              <li className="flex gap-4 flex-col md:flex-row md:items-start border-b-2 border-black/20 pb-4">
                <strong className="text-black uppercase tracking-wider min-w-[200px]">NO RECOVERY</strong>
                <span className="text-gray-900">There is no "forgot password." No mechanisms exist for recovery. Customer service mathematically cannot help you.</span>
              </li>
              <li className="flex gap-4 flex-col md:flex-row md:items-start border-b-2 border-black/20 pb-4">
                <strong className="text-black uppercase tracking-wider min-w-[200px]">NO BACKUPS</strong>
                <span className="text-gray-900">We do not sweep or backup your telemetry. Your key exists only with you.</span>
              </li>
              <li className="flex gap-4 flex-col md:flex-row md:items-start">
                <strong className="text-black uppercase tracking-wider min-w-[200px]">IRREVERSIBLE</strong>
                <span className="text-gray-900">It is equivalent to burning the data. Restoration is computationally impossible.</span>
              </li>
            </ul>
          </SectionCard>

          <SectionCard index="03" title="Blockchain Vulnerabilities" variant="terminal">
            <p className="text-white">TALA operates on blockchain mechanics, exposing you to inherent architectural risks:</p>
            <ul className="space-y-4 mt-6">
              <li className="border-l-4 border-heirlock-yellow pl-4">
                <strong className="text-heirlock-yellow block uppercase">Irreversible Transactions</strong>
                <span className="text-gray-300">Errors in destination or payloads cannot be rolled back by central administrators.</span>
              </li>
              <li className="border-l-4 border-heirlock-green pl-4">
                <strong className="text-heirlock-green block uppercase">Gas Extortion</strong>
                <span className="text-gray-300">Network congestion can result in violently unpredictable and catastrophic transaction fees.</span>
              </li>
              <li className="border-l-4 border-heirlock-blue pl-4">
                <strong className="text-heirlock-blue block uppercase">RPC & Network Interruption</strong>
                <span className="text-gray-300">Third-party node providers failing will prevent you from interacting with the smart contracts.</span>
              </li>
            </ul>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <SectionCard index="04" title="Smart Contracts" variant="warning">
              <p>While rigorously tested, TALA's smart contracts carry extreme operational risks:</p>
              <ul className="space-y-3 flex flex-col mt-4">
                <li className="flex gap-4 items-start"><Bullet/><strong>No Formal Audits:</strong> Code is used explicitly at-your-own-risk.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Exploitable Flaws:</strong> Zero-day exploits can permanently lock funds.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>No Insurance:</strong> Failure yields zero recourse. No one will reimburse you.</li>
              </ul>
            </SectionCard>

            <SectionCard index="05" title="Cryptography Limits">
              <p>Encryption secures TALA, but physics and implementations decay:</p>
              <ul className="space-y-3 flex flex-col mt-4">
                <li className="flex gap-4 items-start"><Bullet/><strong>Quantum Threats:</strong> Algorithms may degrade against future computing capabilities.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Malware Intercepts:</strong> Device compromises can scrape memory during decryption.</li>
              </ul>
            </SectionCard>
          </div>

          <SectionCard index="06" title="IPFS & Data Persistence">
            <p>We leverage Pinata and IPFS. Understand the following harsh reality:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-cream p-6 border-4 border-black shadow-[8px_8px_0_0_#FFF]">
                <h4 className="font-black text-xl uppercase mb-3 px-2 py-1 bg-black text-white inline-block">PERSISTENCE</h4>
                <p>IPFS does NOT guarantee forever storage. If Pinata unpins your payload, your vault data is permanently purged across the network.</p>
              </div>
              <div className="bg-cream p-6 border-4 border-black shadow-[8px_8px_0_0_#FFF]">
                <h4 className="font-black text-xl uppercase mb-3 px-2 py-1 bg-black text-white inline-block">IMMUTABILITY</h4>
                <p>IPFS payload hashes are strictly immutable. To alter vault content, you must execute an entirely new deployment logic.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard index="07" title="Wallet Sovereignty" variant="critical">
            <p className="text-2xl font-black uppercase bg-black text-white p-4 shadow-[4px_4px_0_0_#FFF]">
              YOUR PRIVATE KEY IS THE ABSOLUTE MASTER OVERRIDE.
            </p>
            <p className="mt-6 text-black">If your seed phrase or hardware wallet is compromised via phishing, malicious injections, or physical theft—your assets and vault ownership can be fully drained. We cannot halt this or freeze the contract.</p>
          </SectionCard>

          <SectionCard index="08" title="Global Law & Compliance">
             <p className="mb-6">Deploying cryptography and participating in Web3 interfaces carries shifting jurisdictional liability.</p>
             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="bg-gray-100 p-4 border-2 border-black font-bold text-base flex flex-col"><strong className="uppercase block border-b-2 border-black pb-2 mb-2">Shutdown Directives</strong> Governments can throttle TALA access regionally without notice.</li>
              <li className="bg-gray-100 p-4 border-2 border-black font-bold text-base flex flex-col"><strong className="uppercase block border-b-2 border-black pb-2 mb-2">Tax Liability</strong> Using TALA might trigger undeclared taxable events based on your tax residency.</li>
              <li className="bg-gray-100 p-4 border-2 border-black font-bold text-base flex flex-col"><strong className="uppercase block border-b-2 border-black pb-2 mb-2">Sanctions</strong> Attempting to evade global sanctions using anon wallets is your sole legal peril.</li>
             </ul>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <SectionCard index="09" title="Tech Rot">
              <p>Platform dependencies degrade. Browser engine shifts, Web3 deprecation standards, or Polygon AMOY shutdowns can instantaneously render vaults inaccessible.</p>
            </SectionCard>

            <SectionCard index="10" title="Service Uptime">
              <p>TALA is inherently provided "AS-IS". There is explicitly zero 99.9% uptime guarantee. Interfaces can vanish; contracts can fail.</p>
            </SectionCard>
          </div>

          <SectionCard index="11" title="Assumption of Risk" variant="critical">
            <p className="mb-6 font-black uppercase text-2xl">By deploying to TALA, you accept full responsibility for:</p>
            <ul className="space-y-4">
              <li className="flex gap-4 items-center line-through decoration-black decoration-4"><Bullet variant="critical"/> Any hope of centralized disaster recovery.</li>
              <li className="flex gap-4 items-center line-through decoration-black decoration-4"><Bullet variant="critical"/> Holding TALA devs liable for ANY financial destruction.</li>
              <li className="flex gap-4 items-center line-through decoration-black decoration-4"><Bullet variant="critical"/> Assuming your IPFS chunks will exist indefinitely.</li>
            </ul>
            <div className="mt-8 bg-black text-white p-4 font-black text-xl uppercase text-center border-4 border-black">
              IF YOU DO NOT ACCEPT, DISCONNECT IMMEDIATELY.
            </div>
          </SectionCard>

          <SectionCard index="12" title="Resolution & Liability">
             <p className="mb-8">
              TO THE ABSOLUTE MAXIMUM MAXIMUM EXTENT PERMITTED BY APPLICABLE GLOBAL LAW: TALA AND ITS ARCHITECTS DENY ALL LIABILITY FOR LOST OPPORTUNITIES, LOST ASSETS, DECRYPTION FAILURES, AND PROTOCOL EXPLOITS.
            </p>
            <div className="bg-heirlock-pink text-black p-8 md:p-12 border-4 border-black shadow-[12px_12px_0_0_#000] flex flex-col md:flex-row items-center justify-between gap-8 hover:-rotate-1 transition-transform duration-500">
              <p className="text-2xl md:text-3xl font-black uppercase max-w-lg leading-tight">
                Review complete legal vectors or open a communications thread.
              </p>
              <Link href="/contact" className="px-8 py-5 bg-black text-heirlock-pink font-black uppercase tracking-widest text-xl border-4 border-black shadow-[6px_6px_0_0_#FFF] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#FFF] transition-all whitespace-nowrap">
                Contact Legal
              </Link>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}
