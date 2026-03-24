import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | TALA",
  description: "Cookie Policy for TALA vault system",
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

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white font-sans pb-32">
      {/* Brutalist Hero Header */}
      <section className="relative pt-32 pb-20 px-4 border-b-8 border-black overflow-hidden bg-cream">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col gap-6">
            <Link href="/legal" className="inline-flex items-center gap-2 font-black mb-8 hover:-translate-x-2 transition-transform bg-black text-white px-5 py-3 border-4 border-black shadow-[4px_4px_0_0_#BAE1FF] hover:shadow-[8px_8px_0_0_#BAE1FF] uppercase text-sm tracking-widest max-w-fit">
              <ChevronLeft className="w-5 h-5" strokeWidth={3} /> Back to Legal Directory
            </Link>
            
            <span className="inline-block bg-heirlock-blue text-black border-2 border-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] max-w-fit mb-4 rotate-1">
              LEGAL DIRECTIVE // 04
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-black uppercase tracking-tighter leading-none mb-6">
              COOKIE <br/> POLICY.
            </h1>
            <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-2xl leading-relaxed">
              Functional tracking matrices and anonymous analytics declarations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-24">
        
        <div className="bg-heirlock-blue text-black border-4 border-black p-8 md:p-12 shadow-[12px_12px_0_0_#000] mb-16 hover:translate-x-2 transition-transform">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6">TRANSPARENCY</h2>
          <p className="text-xl font-bold leading-tight">
            We use absolute minimum tracking. No third-party ad networks. No cross-site profiling. We use localized tokens exclusively to maintain decentralized session states and essential interface settings.
          </p>
        </div>

        <div className="space-y-16">
          <SectionCard index="01" title="What are Cookies?">
            <p className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-6">
              Cookies are local files stored on your machine.
            </p>
            <p>They contain data retrieved by your browser to serve specific purposes. TALA heavily relies on client-side storage to execute cryptography without touching servers.</p>
            <ul className="space-y-4 flex flex-col mt-6">
              <li className="flex gap-4 items-start"><Bullet/><span><strong className="uppercase block mb-1">Session Data</strong> Temporal state tokens deleted upon browser exit.</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span><strong className="uppercase block mb-1">Persistent Storage</strong> Local hardware storage preserving UI themes (Dark/Light).</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span><strong className="uppercase block mb-1">First-Party Only</strong> Set uniquely and explicitly by the TALA protocol domain.</span></li>
            </ul>
          </SectionCard>

          <SectionCard index="02" title="Why We Use Cookies" variant="terminal">
            <p className="text-white">Our decentralized service completely requires local authentication matrices to function:</p>
            <ul className="space-y-6 mt-6">
              <li className="border-l-4 border-heirlock-green pl-4">
                <strong className="text-heirlock-green block uppercase">Identity & Connection</strong>
                <span className="text-gray-300">Wallet connection persistence (Web3Modal/Wagmi flags) preventing immediate disconnection upon refresh.</span>
              </li>
              <li className="border-l-4 border-white pl-4">
                <strong className="text-white block uppercase">Authentication Overlays</strong>
                <span className="text-gray-300">Securing JWTs holding the server signature proving you own the connected Web3 wallet.</span>
              </li>
              <li className="border-l-4 border-heirlock-blue pl-4">
                <strong className="text-heirlock-blue block uppercase">Performance & Diagnostics</strong>
                <span className="text-gray-300">Basic Vercel/NextJS routing cache variables essential to SPA architecture.</span>
              </li>
            </ul>
          </SectionCard>

          <SectionCard index="03" title="Detailed Inventory">
            <p>We believe in verifiable transparency. Here is the strict index of all potential local variables utilized by TALA:</p>
            
            <div className="overflow-x-auto mt-8 border-4 border-black shadow-[8px_8px_0_0_#FFFACD]">
              <table className="w-full text-left font-bold m-0 border-collapse bg-white whitespace-nowrap">
                <thead>
                  <tr className="bg-black text-white uppercase text-sm tracking-widest">
                    <th className="p-4 border-r-2 border-b-4 border-white">Token/Cookie</th>
                    <th className="p-4 border-r-2 border-b-4 border-white">Type</th>
                    <th className="p-4 border-r-2 border-b-4 border-white">TTL</th>
                    <th className="p-4 border-b-4 border-white">Logic Vector</th>
                  </tr>
                </thead>
                <tbody className="text-sm md:text-base">
                  <tr className="border-b-2 border-black hover:bg-heirlock-yellow transition-colors">
                    <td className="p-4 border-r-2 border-black font-mono">auth_session</td>
                    <td className="p-4 border-r-2 border-black">HTTP Cookie</td>
                    <td className="p-4 border-r-2 border-black">7 Days</td>
                    <td className="p-4">Retains cryptographic wallet signature proof</td>
                  </tr>
                  <tr className="border-b-2 border-black hover:bg-heirlock-yellow transition-colors">
                    <td className="p-4 border-r-2 border-black font-mono">wagmi.store</td>
                    <td className="p-4 border-r-2 border-black">Local Storage</td>
                    <td className="p-4 border-r-2 border-black">Browser</td>
                    <td className="p-4">Cached RPC provider and Web3 connection state</td>
                  </tr>
                  <tr className="border-b-2 border-black hover:bg-heirlock-yellow transition-colors">
                    <td className="p-4 border-r-2 border-black font-mono">tala-theme</td>
                    <td className="p-4 border-r-2 border-black">Local Storage</td>
                    <td className="p-4 border-r-2 border-black">Infinite</td>
                    <td className="p-4">UI contrast mode preference</td>
                  </tr>
                  <tr className="hover:bg-heirlock-yellow transition-colors">
                    <td className="p-4 border-r-2 border-black font-mono">csrf_token</td>
                    <td className="p-4 border-r-2 border-black">HTTP Cookie</td>
                    <td className="p-4 border-r-2 border-black">Session</td>
                    <td className="p-4">Anti-forgery injection block</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard index="04" title="Third-Party Vectors" variant="warning">
             <p className="mb-6">While TALA fundamentally limits external vectors, interacting with decentralized networks triggers external network tracking.</p>
             <ul className="space-y-4 flex flex-col mt-6 bg-white p-6 border-4 border-black">
              <li className="flex gap-4 items-start"><Bullet/><span><strong className="uppercase block border-b-2 border-black pb-1 mb-2">Web3 Wallets (MetaMask etc.)</strong> Inject completely siloed variables entirely out of our domain scope.</span></li>
              <li className="flex gap-4 items-start"><Bullet/><span><strong className="uppercase block border-b-2 border-black pb-1 mb-2">RPC Provider Analytics</strong> Alchemy and independent RPC nodes passively log query IPs globally via the transaction broadcast route.</span></li>
            </ul>
            <div className="mt-8 bg-black text-white p-4 font-black text-sm uppercase text-center w-full">
              WE HAVE ZERO ADMINISTRATIVE CONTROL OVER PROTOCOL-LAYER METADATA AGGREGATION.
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <SectionCard index="05" title="Consent Mechanics">
              <p>Navigating the protocol and successfully deploying vaults constitutes active consent to fundamental storage mechanics outlined here, as it is mathematically impossible to sustain a session otherwise.</p>
            </SectionCard>

            <SectionCard index="06" title="Control Access">
              <p>Browsers grant absolute client-side sovereignty. You can nuke <code className="bg-gray-200 px-2 py-1 border-2 border-black text-sm text-black inline-block">LocalStorage</code> and clear <code className="bg-gray-200 text-black px-2 py-1 border-2 border-black text-sm inline-block">Cookies</code> manually via developer tools. Disabling these immediately bricks the DApp connection.</p>
            </SectionCard>
          </div>

        </div>
      </div>
    </div>
  );
}
