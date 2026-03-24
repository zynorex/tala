import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldAlert, FileText, Lock, Cookie, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal Directory | TALA",
  description: "Legal hub and policies for the TALA vault system",
};

export default function LegalHub() {
  const legalPages = [
    {
      id: "01",
      title: "Terms of Service",
      description: "Operational doctrines governing your use of the T.A.L.A. zero-trust protocol.",
      href: "/terms",
      color: "bg-heirlock-yellow",
      icon: FileText
    },
    {
      id: "02",
      title: "Privacy Policy",
      description: "How we protect, process, and permanently record your data signatures.",
      href: "/privacy",
      color: "bg-heirlock-green",
      icon: Lock
    },
    {
      id: "03",
      title: "Disclaimer",
      description: "Liability boundaries and warnings for interacting with Web3 protocols.",
      href: "/disclaimer",
      color: "bg-heirlock-pink",
      icon: ShieldAlert
    },
    {
      id: "04",
      title: "Cookie Policy",
      description: "Functional tracking matrices and anonymous analytics declarations.",
      href: "/cookies",
      color: "bg-heirlock-blue",
      icon: Cookie
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white font-sans pb-32">
      {/* HEADER SECTION */}
      <section className="relative pt-32 pb-20 px-4 border-b-8 border-black overflow-hidden bg-cream">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col gap-6">
            <span className="inline-block bg-white text-black border-2 border-black px-3 py-1 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#000] max-w-fit mb-4 -rotate-1">
              INDEX // 00
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-black uppercase tracking-tighter leading-none mb-6">
              LEGAL <br/> DIRECTORY.
            </h1>
            <p className="text-xl md:text-2xl font-bold bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-3xl leading-relaxed">
              Complete index of doctrines, policies, and risk declarations for navigating the protocol.
            </p>
          </div>
        </div>
      </section>

      {/* DIRECTORY GRID */}
      <section className="py-24 px-4 bg-white relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {legalPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link key={page.href} href={page.href} className="group block outline-none">
                  <div className={`h-full border-4 border-black ${page.color} p-8 md:p-12 relative shadow-[8px_8px_0_0_#000] group-hover:shadow-[16px_16px_0_0_#000] group-hover:-translate-y-2 transition-all duration-300 flex flex-col`}>
                    
                    <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-8">
                      <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center -rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-[4px_4px_0_0_#000]">
                        <Icon className="h-8 w-8 text-black" strokeWidth={2.5} />
                      </div>
                      <span className="text-5xl font-black text-black opacity-30 group-hover:opacity-100 transition-opacity">{page.id}</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-black uppercase mb-4 leading-none">
                      {page.title}
                    </h2>
                    <p className="text-xl font-bold text-gray-900 flex-1">
                      {page.description}
                    </p>

                    <div className="mt-8 pt-6 border-t-4 border-black flex items-center justify-between">
                      <span className="font-black uppercase tracking-widest text-black">Read Document</span>
                      <ChevronRight className="w-8 h-8 text-black group-hover:translate-x-2 transition-transform" strokeWidth={3}/>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Links / Contact */}
          <div className="mt-20 border-4 border-black bg-black text-white p-8 md:p-12 shadow-[12px_12px_0_0_#BAFFC9] flex flex-col md:flex-row items-center justify-between gap-8 rotate-1 hover:-rotate-1 transition-transform duration-500">
            <div className="flex items-center gap-6">
              <Scale className="w-16 h-16 text-heirlock-green hidden md:block" />
              <div>
                <h3 className="font-black text-3xl md:text-4xl text-heirlock-green uppercase mb-2">Need Legal Support?</h3>
                <p className="text-xl font-bold text-gray-300 max-w-xl">
                  For law enforcement inquiries, DMCA takedowns, or compliance documentation, initiate contact with our legal team.
                </p>
              </div>
            </div>
            
            <Link
              href="/contact"
              className="px-8 py-5 bg-heirlock-green text-black border-4 border-black font-black uppercase tracking-widest text-xl shadow-[6px_6px_0_0_#FFF] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#FFF] transition-all whitespace-nowrap"
            >
              Contact Legal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
