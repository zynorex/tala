import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | TALA",
  description: "Privacy Policy for TALA vault system",
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream selection:bg-black selection:text-white">
      {/* Brutalist Hero Header */}
      <div className="bg-black text-white pt-32 pb-24 px-4 border-b-8 border-black shadow-[0_16px_0_0_#BAE1FF] relative z-20">
        <div className="container mx-auto max-w-5xl relative">
          <Link href="/legal" className="inline-flex items-center gap-2 font-bold mb-12 hover:-translate-x-2 transition-transform bg-white text-black px-5 py-3 border-4 border-black shadow-[4px_4px_0_0_#FFE600] uppercase text-sm tracking-widest">
            <ChevronLeft className="w-5 h-5" strokeWidth={3} /> Back to Legal Directory
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
            <div>
              <div className="inline-block bg-heirlock-yellow text-black px-4 py-2 font-black uppercase tracking-widest text-sm mb-6 shadow-[4px_4px_0_0_#FFF]">
                LEGAL DIRECTIVE // 02
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-6">
                Privacy<br/><span className="text-heirlock-green drop-shadow-[6px_6px_0_rgba(255,255,255,1)]">Policy.</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold border-l-8 border-heirlock-yellow pl-6 max-w-2xl mt-8">
                How we protect, process, and permanently record your data signatures on the protocol.
              </p>
            </div>
            <div className="font-mono text-sm uppercase text-gray-400 border-4 border-gray-800 p-4 bg-gray-900 shadow-[4px_4px_0_0_#FFF]">
              <div className="text-white font-bold mb-1 border-b border-gray-700 pb-1">FILE METADATA</div>
              <div>Last Updated: DEC.2024</div>
              <div>Version: 1.0.0</div>
              <div>Status: ACTIVE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-24">
        <div className="space-y-16">
          
          <SectionCard index="01" title="Introduction">
            <p className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-6">
              TALA operates as a zero-knowledge, non-custodial vault platform.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and otherwise handle information. Since TALA is non-custodial, we do not have access to your vault contents or encryption keys. We are committed to protecting your privacy and ensuring you have a positive, secure experience on our protocol.
            </p>
          </SectionCard>

          <SectionCard index="02" title="Information We Collect" variant="terminal">
            <p className="text-white">We collect minimal information and exactly only what is fundamentally necessary to operate the Service:</p>
            <ul className="space-y-6 flex flex-col mt-8">
              <li className="flex gap-4 items-start border-b border-gray-800 pb-4">
                <Bullet variant="terminal"/>
                <div>
                  <strong className="text-heirlock-yellow uppercase tracking-widest block mb-1">Wallet Address</strong>
                  <span className="text-gray-400 font-mono text-sm">PUBLICLY VISIBLE ON-CHAIN</span>
                  <p className="mt-2 text-white">Your blockchain wallet address, collected identically to standard Web3 dApps when connecting.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start border-b border-gray-800 pb-4">
                <Bullet variant="terminal"/>
                <div>
                  <strong className="text-heirlock-yellow uppercase tracking-widest block mb-1">Transaction Data</strong>
                  <span className="text-gray-400 font-mono text-sm">IMMUTABLE / PERMANENT</span>
                  <p className="mt-2 text-white">Records of vault creation, access times, and transaction hashes permanently stored on-chain.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start border-b border-gray-800 pb-4">
                <Bullet variant="terminal"/>
                <div>
                  <strong className="text-heirlock-yellow uppercase tracking-widest block mb-1">Analytics Data</strong>
                  <span className="text-gray-400 font-mono text-sm">ANONYMOUS</span>
                  <p className="mt-2 text-white">Usage statistics including pages visited, features used, and device information for security.</p>
                </div>
              </li>
            </ul>
          </SectionCard>

          <SectionCard index="03" title="Information We DO NOT Collect" variant="warning">
            <p>The following information is explicitly NOT collected, seen, or stored by TALA:</p>
            <ul className="space-y-4 font-black text-xl mt-6">
              <li className="flex gap-4 items-center line-through decoration-red-500 decoration-4"><Bullet/> Encryption keys</li>
              <li className="flex gap-4 items-center line-through decoration-red-500 decoration-4"><Bullet/> Private keys or seed phrases</li>
              <li className="flex gap-4 items-center line-through decoration-red-500 decoration-4"><Bullet/> Vault contents or encrypted datasets</li>
              <li className="flex gap-4 items-center line-through decoration-red-500 decoration-4"><Bullet/> File contents or detailed unencrypted metadata</li>
              <li className="flex gap-4 items-center line-through decoration-red-500 decoration-4"><Bullet/> Personal identification info (unless voluntarily given via support)</li>
            </ul>
            <div className="mt-8 bg-black text-white p-6 border-4 border-black font-black uppercase text-heirlock-green">
              ✓ Your data stays entirely under your control. We cannot access what happens inside your vault.
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <SectionCard index="04" title="Collection Vectors">
              <p>We collect information inherently through:</p>
              <ul className="space-y-3 flex flex-col mt-4">
                <li className="flex gap-4 items-start"><Bullet/><strong>Wallet Connections</strong> when authorizing the dApp.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Smart Contract Interactions</strong> when writing state.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Website Browsing</strong> via cookies/analytics.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Voluntary Comms</strong> when contacting support.</li>
              </ul>
            </SectionCard>

            <SectionCard index="05" title="Data Utilization">
              <p>We use collected diagnostic info for:</p>
              <ul className="space-y-3 flex flex-col mt-4">
                <li className="flex gap-4 items-start"><Bullet/><strong>Service Operation:</strong> Processing logic.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Security:</strong> Detecting fraud / abuse.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Improvement:</strong> Usage analytics.</li>
                <li className="flex gap-4 items-start"><Bullet/><strong>Compliance:</strong> Legal obligations.</li>
              </ul>
            </SectionCard>
          </div>

          <SectionCard index="06" title="Data Storage & Security">
            <p>Your data is architected and secured as follows:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0_0_#FFFACD]">
                <h4 className="font-black text-xl uppercase mb-3 px-2 py-1 bg-black text-heirlock-yellow inline-block">ON-CHAIN</h4>
                <p>All vault metadata transactions are permanently stored on the Polygon ledger and cannot be deleted or modified by anyone, including us.</p>
              </div>
              <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0_0_#FFB3BA]">
                <h4 className="font-black text-xl uppercase mb-3 px-2 py-1 bg-black text-heirlock-pink inline-block">OFF-CHAIN</h4>
                <p>Telemetry and generic server data are secured using industry-standard firewalls, strict IAM access controls, and audited encryption at rest.</p>
              </div>
            </div>
            <p className="mt-8 border-l-8 border-red-500 pl-4 text-red-600 font-bold bg-red-50 p-4">
              ⚠️ No security system is impenetrable. We cannot guarantee absolute security against zero-day exploits, and you use TALA at your own risk.
            </p>
          </SectionCard>

          <SectionCard index="07" title="Blockchain Transparency" variant="critical">
            <p className="text-2xl font-black uppercase bg-black text-white p-4 shadow-[4px_4px_0_0_#FFF]">
              By interacting with Web3, your actions are public.
            </p>
            <ul className="space-y-4 mt-6">
              <li className="flex gap-4 flex-col md:flex-row md:items-start border-b-2 border-black/20 pb-4">
                <strong className="text-black uppercase tracking-wider min-w-[200px]">Public Visibility</strong>
                <span className="text-gray-900">All vault transactions are publicly visible on the blockchain scanner. Anyone can view them.</span>
              </li>
              <li className="flex gap-4 flex-col md:flex-row md:items-start border-b-2 border-black/20 pb-4">
                <strong className="text-black uppercase tracking-wider min-w-[200px]">Wallet Linkage</strong>
                <span className="text-gray-900">Your wallet address is permanently associated with all vault transactions you deploy or decrypt.</span>
              </li>
              <li className="flex gap-4 flex-col md:flex-row md:items-start">
                <strong className="text-black uppercase tracking-wider min-w-[200px]">Immutability</strong>
                <span className="text-gray-900">Blockchain data cannot be deleted, modified, or scrubbed once recorded in a block.</span>
              </li>
            </ul>
            <div className="mt-8 bg-white text-black p-4 font-black">
              Consider using wallet mixers or privacy networks if you want to obfuscate transaction history (though this may have severe legal implications depending on jurisdiction).
            </div>
          </SectionCard>

          <SectionCard index="08" title="Third-Party Integrations" variant="terminal">
            <p className="text-white">We integrate with massive infrastructure providers. Their privacy policies govern the data they index:</p>
            <ul className="space-y-4 mt-6">
              <li className="border-l-4 border-heirlock-yellow pl-4">
                <strong className="text-heirlock-yellow block uppercase">IPFS / PINATA</strong>
                <span className="text-gray-300">Your encrypted payloads are stored on IPFS via Pinata gateways.</span>
              </li>
              <li className="border-l-4 border-heirlock-green pl-4">
                <strong className="text-heirlock-green block uppercase">RPC Providers</strong>
                <span className="text-gray-300">Blockchain node providers like Alchemy/Infura will see and may log your IP address.</span>
              </li>
              <li className="border-l-4 border-heirlock-blue pl-4">
                <strong className="text-heirlock-blue block uppercase">Wallets</strong>
                <span className="text-gray-300">MetaMask, Phantom, etc., operate under isolated data practices.</span>
              </li>
            </ul>
          </SectionCard>

          <SectionCard index="09" title="Your Global Privacy Rights">
            <p className="mb-6">Depending on your jurisdiction (e.g., GDPR in the EU, CCPA in California), you may have the following sovereign rights:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-cream border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
                <strong className="block uppercase font-black text-lg">ACCESS</strong>
                <p className="text-sm">Request a copy of personal data we explicitly hold off-chain.</p>
              </div>
              <div className="bg-cream border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
                <strong className="block uppercase font-black text-lg">CORRECTION</strong>
                <p className="text-sm">Request we correct inaccurate off-chain databases.</p>
              </div>
              <div className="bg-cream border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
                <strong className="block uppercase font-black text-lg">DELETION</strong>
                <p className="text-sm">Delete personal data (on-chain data CANNOT be deleted).</p>
              </div>
            </div>
            <p className="mt-8 bg-black text-white p-4 font-bold border-4 border-black">
               EU Users: Blockchain data processing relies on legitimate interest and absolute network immutability, bypassing typical "Right to be Forgotten" mandates where mathematically impossible.
            </p>
          </SectionCard>

          <SectionCard index="10" title="Protection Imperatives">
            <ul className="space-y-6">
              <li className="border-l-4 border-black pl-4">
                <strong className="block text-xl font-black uppercase">Cookies & Analytics</strong>
                We use minimal functional cookies. See Cookie Policy for detailed tracking matrices.
              </li>
              <li className="border-l-4 border-black pl-4">
                <strong className="block text-xl font-black uppercase">Minors & Children</strong>
                TALA is engineered for 18+ protocol usage. We will aggressively delete any off-chain data identified as belonging to minors.
              </li>
              <li className="border-l-4 border-black pl-4">
                <strong className="block text-xl font-black uppercase">Breach Protocols</strong>
                In the event of an off-chain structural breach, we will initiate public notifications detailing affected data silos and remediation vectors.
              </li>
            </ul>
          </SectionCard>

          <SectionCard index="11" title="Resolution & Agreement">
             <p className="mb-8">
              We may update this Privacy Policy periodically to reflect protocol evolutions or legal compliance shifts. Changes are effective immediately. Continual interactions with TALA proxy contracts constitute unyielding acceptance.
            </p>
            <div className="bg-heirlock-green text-black p-8 md:p-12 border-4 border-black shadow-[12px_12px_0_0_#000] flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="text-2xl md:text-3xl font-black uppercase max-w-lg leading-tight">
                For privacy escalations or GDPR/CCPA requests, initialize contact.
              </p>
              <Link href="/contact" className="px-8 py-5 bg-black text-heirlock-green font-black uppercase tracking-widest text-xl border-4 border-black shadow-[6px_6px_0_0_#FFF] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#FFF] transition-all whitespace-nowrap">
                Contact Privacy
              </Link>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}
