'use client';

import Link from "next/link";
import { useState } from "react";
import { Twitter, Github, Mail, Send, Linkedin, Shield, Zap, Lock, Globe, ArrowRight, Heart, CheckCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNewsletterSubmit = () => {
    if (email.trim()) {
      setSuccessMessage(`✨ Thanks for subscribing, ${email.split('@')[0]}! Check your inbox.`);
      setSubmitted(true);
      setEmail('');
      
      // Clear success message after 4 seconds
      setTimeout(() => {
        setSubmitted(false);
        setSuccessMessage('');
      }, 4000);
    }
  };

  const footerLinks = {
    product: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Launch", href: "/launch" },
      { label: "Pricing", href: "/pricing" },
      { label: "Create Vault", href: "/create-vault" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Smart Contracts", href: "/smart-contracts" },
      { label: "Security", href: "/security" },
    ],
    resources: [
      { label: "Documentation", href: "/documentation" },
      { label: "Developer Docs", href: "/docs" },
      { label: "API Quickstart", href: "/docs/quickstart" },
      { label: "API Documentation", href: "/docs/api" },
      { label: "Integrations", href: "/integrations" },
      { label: "Procurement", href: "/procurement" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
      { label: "Trust Center", href: "/trust-center" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    social: [
      { label: "Twitter", href: "https://twitter.com", icon: Twitter, bg: "bg-heirlock-blue" },
      { label: "GitHub", href: "https://github.com", icon: Github, bg: "bg-heirlock-green" },
      { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin, bg: "bg-heirlock-pink" },
      { label: "Email", href: "mailto:support@usetala.in", icon: Mail, bg: "bg-heirlock-yellow" },
    ],
  };

  return (
    <footer className="bg-black border-t-8 border-black text-white relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32 relative z-10">
        
        {/* Massive Brand Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b-8 border-white pb-10 md:pb-16 mb-16">
          <div>
            <h2 className="text-6xl md:text-8xl lg:text-[140px] font-black uppercase tracking-tighter leading-none mb-6 -ml-1 text-white" style={{ textShadow: '8px 8px 0px #FFFACD' }}>T.A.L.A.</h2>
            <p className="text-lg md:text-2xl font-bold max-w-2xl bg-white text-black p-4 inline-block shadow-[8px_8px_0_0_#FFB3BA] leading-snug">
              Zero-trust time capsules for the next generation of public record.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 shrink-0 mt-4 lg:mt-0">
            {footerLinks.social.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-4 border-black ${social.bg} text-black hover:-translate-y-2 transition-transform shadow-[6px_6px_0_0_#FFF] hover:shadow-[10px_10px_0_0_#FFF]`}
                  title={social.label}
                  aria-label={social.label}
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {/* Product */}
            <div>
              <h4 className="text-xl font-black text-heirlock-yellow mb-6 uppercase inline-block bg-white/10 px-2 py-1 border-l-4 border-heirlock-yellow">Product</h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base font-bold text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-heirlock-yellow" strokeWidth={3} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xl font-black text-heirlock-green mb-6 uppercase inline-block bg-white/10 px-2 py-1 border-l-4 border-heirlock-green">Resources</h4>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base font-bold text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-heirlock-green" strokeWidth={3} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xl font-black text-heirlock-blue mb-6 uppercase inline-block bg-white/10 px-2 py-1 border-l-4 border-heirlock-blue">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base font-bold text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-heirlock-blue" strokeWidth={3} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xl font-black text-heirlock-pink mb-6 uppercase inline-block bg-white/10 px-2 py-1 border-l-4 border-heirlock-pink">Legal</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base font-bold text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-heirlock-pink" strokeWidth={3} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 xl:scale-105 xl:origin-right flex flex-col justify-center">
            {/* The pale yellow rotated background layer */}
            <div className="absolute inset-0 bg-[#FFFACD] transform -rotate-2 scale-105 z-0 hidden md:block"></div>
            
            {/* The main white box */}
            <div className="bg-white text-black border-[6px] border-black p-6 md:p-10 relative z-10 h-full flex flex-col justify-center">
              <div className="mb-6">
                <div className="inline-block bg-black text-white px-4 py-1.5 text-sm font-black uppercase tracking-widest shadow-[4px_4px_0_0_#BAE1FF] mb-6">
                  DISPATCH WAITLIST
                </div>
                <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none mb-4">ARCHITECT'S LOG</h3>
                <div className="w-full h-1.5 bg-black mb-6"></div>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-8 leading-snug pr-4">Security audits, protocol upgrades, and zero-knowledge briefings delivered straight to your inbox.</p>
              
              {submitted ? (
                <div className="bg-black text-white border-4 border-black p-5 shadow-[6px_6px_0_0_#98FB98]">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-heirlock-green" strokeWidth={2.5} />
                    <div>
                      <p className="text-xl font-black uppercase">Secured!</p>
                      <p className="text-sm font-bold text-gray-300">{successMessage}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="ENTER.EMAIL@HERE"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubmit()}
                    className="flex-1 px-4 py-4 border-[4px] border-black font-mono text-base font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#000] uppercase placeholder-gray-400"
                  />
                  <button 
                    onClick={handleNewsletterSubmit}
                    className="px-8 py-4 bg-black text-white border-4 border-black font-black hover:bg-heirlock-yellow hover:text-black transition-all shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-lg whitespace-nowrap"
                  >
                    SUBSCRIBE
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t-8 border-white">
          <div className="text-center md:text-left">
            <p className="text-xl font-black uppercase tracking-widest leading-none mb-2">© {currentYear} T.A.L.A. PROTOCOL</p>
            <p className="text-sm font-bold text-gray-400">Not financial advice. Trust the math.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-white/5 border-2 border-white/20 px-4 py-3 font-mono text-xs sm:text-sm font-bold text-gray-300 backdrop-blur-sm">
             <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-heirlock-pink" /> AES-256-GCM</span>
             <span className="hidden sm:inline">|</span>
             <span className="text-heirlock-green">OPEN SOURCE</span>
             <span className="hidden sm:inline">|</span>
             <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-heirlock-yellow" /> IPFS MESH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

