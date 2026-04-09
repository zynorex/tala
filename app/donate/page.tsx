import type { Metadata } from "next";
import { Heart, ShieldCheck, HandHeart, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "T.A.L.A. | Support Us",
  description:
    "Help us build open-source, Trust-is-Code infrastructure. Donate to T.A.L.A. and support cryptographic time-locks.",
};

export default function Donate() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 xl:px-24 bg-blanch relative overflow-hidden selection:bg-heirlock-yellow selection:text-black">
      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6 mt-10">
          <div className="inline-flex items-center px-4 py-2 bg-heirlock-yellow border-4 border-black text-black text-sm lg:text-base font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000] mb-4">
            <Heart className="w-5 h-5 mr-3" />
            Support Our Mission
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black uppercase tracking-tighter leading-none text-carbon" style={{ textShadow: '6px 6px 0px #BAE1FF' }}>
            Fund the <br className="hidden md:block" />
            Future
          </h1>
          <p className="text-xl md:text-3xl font-bold text-carbon max-w-3xl mx-auto leading-tight bg-white p-6 border-4 border-black shadow-[8px_8px_0_0_#000] mt-8">
            By donating to T.A.L.A., you&apos;re accelerating the shift toward tamper-proof, time-locked infrastructure.
          </p>
        </div>

        {/* Donation Main Card */}
        <div className="bg-white border-8 border-black p-8 md:p-16 shadow-[12px_12px_0_0_#000] w-full max-w-4xl text-center relative mt-10">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-heirlock-pink border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0_0_#000] hover:rotate-180 transition-transform duration-700">
            <Sparkles className="text-black w-10 h-10" />
          </div>
          
          <div className="mb-12">
            <div className="w-24 h-24 bg-heirlock-blue border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0_0_#000] rotate-3 hover:rotate-0 transition-transform">
              <HandHeart className="w-12 h-12 text-black" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-carbon mb-6 uppercase tracking-tight">
              Secure Checkout
            </h2>
            <p className="text-carbon text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-snug">
              Contribute seamlessly through Razorpay. Every contribution helps us maintain servers, develop smart contracts, and expand the platform.
            </p>
          </div>

          <div className="bg-cream border-4 border-black p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex flex-col items-center md:items-start text-left">
              <span className="text-base font-black text-black uppercase tracking-widest mb-2 px-2 bg-heirlock-green border-2 border-black inline-block">Official Link</span>
              <span className="text-2xl md:text-3xl font-black text-black break-all flex items-center gap-2 tracking-tight group-hover:underline">
                razorpay.me/@usetala
              </span>
            </div>
            
            <a 
              href="https://razorpay.me/@usetala" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto shrink-0 inline-flex items-center justify-center h-20 px-10 text-xl md:text-2xl font-black bg-heirlock-yellow text-black border-4 border-black hover:bg-heirlock-green hover:-translate-y-2 transition-all shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] uppercase tracking-widest group/btn"
            >
              Donate Now
              <ArrowRight className="w-8 h-8 ml-3 group-hover/btn:translate-x-2 transition-transform" strokeWidth={3} />
            </a>
          </div>

          <div className="flex items-center justify-center gap-3 text-base md:text-lg font-bold text-black border-2 border-black bg-blanch inline-flex px-6 py-3 shadow-[4px_4px_0_0_#000]">
            <ShieldCheck className="w-6 h-6" strokeWidth={3} />
            <span>Payments processed securely via Razorpay</span>
          </div>
        </div>
      </div>
    </main>
  );
}
