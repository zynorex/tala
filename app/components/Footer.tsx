'use client';

import Link from "next/link";
import { Twitter, Github, Mail, Send, Linkedin, Shield, Zap, Lock, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "How It Works", href: "/how-it-works", color: "heirlock-blue" },
      { label: "Create Vault", href: "/create-vault", color: "heirlock-yellow" },
      { label: "Dashboard", href: "/dashboard", color: "heirlock-pink" },
      { label: "Smart Contracts", href: "/smart-contracts", color: "heirlock-green" },
    ],
    resources: [
      { label: "Documentation", href: "/documentation", color: "heirlock-green" },
      { label: "Developer Docs", href: "/docs", color: "heirlock-blue" },
      { label: "FAQ", href: "/faq", color: "heirlock-yellow" },
      { label: "Blog", href: "/blog", color: "heirlock-pink" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms", color: "gray-400" },
      { label: "Privacy Policy", href: "/privacy", color: "gray-400" },
      { label: "Disclaimer", href: "/disclaimer", color: "gray-400" },
    ],
    company: [
      { label: "About", href: "/about", color: "heirlock-green" },
      { label: "Contact", href: "/contact", color: "heirlock-pink" },
    ],
    social: [
      { label: "Twitter", href: "https://twitter.com", icon: Twitter, bg: "bg-heirlock-blue" },
      { label: "GitHub", href: "https://github.com", icon: Github, bg: "bg-heirlock-green" },
      { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin, bg: "bg-heirlock-pink" },
      { label: "Email", href: "mailto:hello@tala.io", icon: Mail, bg: "bg-heirlock-yellow" },
    ],
  };

  return (
    <footer className="bg-black text-white border-t-4 border-black">
      {/* CTA Section - Hero Band */}
      <div className="border-b-4 border-heirlock-yellow bg-gradient-to-r from-black via-heirlock-blue via-black to-heirlock-pink opacity-80">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* Left - Messaging */}
            <div className="md:col-span-1">
              <h3 className="text-2xl md:text-3xl font-black mb-2 text-white">
                Secure Your <span className="text-heirlock-yellow">Exams</span>
              </h3>
              <p className="text-sm md:text-base text-gray-300">
                Enterprise-grade vault protection with blockchain security
              </p>
            </div>

            {/* Center - Email Signup */}
            <div className="md:col-span-1">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 bg-black border-4 border-heirlock-yellow text-white placeholder-gray-500 font-bold focus:outline-none focus:bg-heirlock-yellow focus:text-black transition-all"
                  />
                  <button className="px-5 py-3 bg-heirlock-yellow text-black font-bold border-4 border-heirlock-yellow hover:bg-black hover:text-heirlock-yellow transition-all shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400">Join 5,000+ security-conscious users</p>
              </div>
            </div>

            {/* Right - Quick Stats */}
            <div className="md:col-span-1 grid grid-cols-2 gap-3">
              <div className="bg-black bg-opacity-70 border-4 border-heirlock-green p-3 text-center">
                <p className="text-xl font-black text-heirlock-green">10MB+</p>
                <p className="text-xs text-gray-400 font-bold">Max File Size</p>
              </div>
              <div className="bg-black bg-opacity-70 border-4 border-heirlock-blue p-3 text-center">
                <p className="text-xl font-black text-heirlock-blue">256-bit</p>
                <p className="text-xs text-gray-400 font-bold">Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section - Hidden on Mobile */}
      <div className="hidden md:block border-b-4 border-heirlock-yellow">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm md:text-base mb-4">
                Get the latest updates on vault security and blockchain encryption.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-900 border-2 border-heirlock-yellow text-white placeholder-gray-500 font-bold focus:outline-none focus:bg-heirlock-yellow focus:text-black"
                />
                <button className="px-4 py-3 bg-heirlock-yellow text-black font-bold border-2 border-heirlock-yellow hover:bg-black hover:text-heirlock-yellow transition-all flex items-center gap-2 shadow-brutal hover:shadow-none">
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Simplified Layout */}
      <div className="md:hidden px-3 py-8 space-y-4">
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-heirlock-blue to-heirlock-pink border-4 border-heirlock-yellow p-4 shadow-brutal">
          <h3 className="text-lg font-black text-white mb-2">Secure Now</h3>
          <p className="text-xs text-gray-200 mb-3">Create your vault in seconds</p>
          <Link href="/create-vault">
            <button className="w-full px-3 py-2 bg-heirlock-yellow text-black border-4 border-black font-bold text-xs shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              🔒 CREATE VAULT
            </button>
          </Link>
        </div>

        {/* Brand Section */}
        <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-yellow p-4 shadow-brutal">
          <Link href="/" className="text-2xl font-black block mb-2 text-heirlock-yellow">
            T.A.L.A.
          </Link>
          <p className="text-xs text-gray-400 mb-4 font-bold">
            Enterprise-grade vault protection with blockchain security
          </p>
          <div className="flex gap-2">
            {footerLinks.social.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 border-4 border-black ${social.bg} text-black hover:translate-x-1 hover:translate-y-1 transition-all shadow-brutal hover:shadow-none font-bold`}
                  title={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/dashboard">
            <button className="w-full px-3 py-3 bg-heirlock-blue text-white border-4 border-black font-bold text-xs shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              📊 DASHBOARD
            </button>
          </Link>
          <Link href="/how-it-works">
            <button className="w-full px-3 py-3 bg-heirlock-green text-black border-4 border-black font-bold text-xs shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              ⚡ LEARN
            </button>
          </Link>
        </div>

        {/* Product Links */}
        <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-yellow p-3 shadow-brutal">
          <h4 className="text-xs font-black text-heirlock-yellow mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3" /> PRODUCT
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {footerLinks.product.map((link) => (
              <Link key={link.label} href={link.href}>
                <button className="w-full text-left px-2 py-2 text-xs font-bold text-gray-400 hover:text-heirlock-yellow hover:bg-black border-2 border-transparent hover:border-heirlock-yellow transition-all">
                  {link.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Resources Links */}
        <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-green p-3 shadow-brutal">
          <h4 className="text-xs font-black text-heirlock-green mb-3 flex items-center gap-2">
            <Globe className="w-3 h-3" /> RESOURCES
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {footerLinks.resources.map((link) => (
              <Link key={link.label} href={link.href}>
                <button className="w-full text-left px-2 py-2 text-xs font-bold text-gray-400 hover:text-heirlock-green hover:bg-black border-2 border-transparent hover:border-heirlock-green transition-all">
                  {link.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-pink p-3 shadow-brutal">
          <h4 className="text-xs font-black text-heirlock-pink mb-3 flex items-center gap-2">
            <Shield className="w-3 h-3" /> LEGAL
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href}>
                <button className="w-full text-left px-2 py-2 text-xs font-bold text-gray-400 hover:text-heirlock-pink hover:bg-black border-2 border-transparent hover:border-heirlock-pink transition-all">
                  {link.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="border-t-4 border-heirlock-yellow pt-4 text-center">
          <p className="text-xs font-bold text-heirlock-yellow">
            © {currentYear} T.A.L.A.
          </p>
          <p className="text-xs text-gray-500 mt-2 font-bold">
            Securing education with blockchain security
          </p>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-heirlock-yellow font-bold">
              Terms
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-heirlock-yellow font-bold">
              Privacy
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block container mx-auto max-w-7xl px-3 sm:px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">

          {/* Brand Section */}
          <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-yellow p-5 shadow-brutal">
            <Link href="/" className="text-3xl font-black block mb-3 text-heirlock-yellow hover:text-yellow-300 transition-colors">
              T.A.L.A.
            </Link>
            <p className="text-xs text-gray-400 mb-4 font-bold leading-relaxed">
              Enterprise-grade vault protection for exam papers with blockchain-verified security and military-grade encryption.
            </p>
            <div className="flex gap-2">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 border-4 border-black ${social.bg} text-black hover:translate-x-1 hover:translate-y-1 transition-all shadow-brutal hover:shadow-none font-bold`}
                    title={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-yellow p-5 shadow-brutal">
            <h4 className="text-xs font-black uppercase tracking-widest text-heirlock-yellow mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-xs font-bold text-gray-400 hover:text-${link.color} hover:translate-x-1 transition-all inline-block`}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-green p-5 shadow-brutal">
            <h4 className="text-xs font-black uppercase tracking-widest text-heirlock-green mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-xs font-bold text-gray-400 hover:text-${link.color} hover:translate-x-1 transition-all inline-block`}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-pink p-5 shadow-brutal">
            <h4 className="text-xs font-black uppercase tracking-widest text-heirlock-pink mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold text-gray-400 hover:text-heirlock-pink hover:translate-x-1 transition-all inline-block"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-heirlock-blue p-5 shadow-brutal">
            <h4 className="text-xs font-black uppercase tracking-widest text-heirlock-blue mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-xs font-bold text-gray-400 hover:text-${link.color} hover:translate-x-1 transition-all inline-block`}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t-4 border-heirlock-yellow pt-8 md:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left items-center">
            {/* Left - Copyright */}
            <div className="text-xs md:text-sm font-bold">
              <p className="text-heirlock-yellow">© {currentYear} T.A.L.A.</p>
              <p className="text-gray-500 mt-2">
                Enterprise Vault Protection
              </p>
            </div>

            {/* Center - Tagline */}
            <div className="text-xs md:text-sm text-gray-400 italic font-bold">
              "Securing the future of education, one vault at a time."
            </div>

            {/* Right - Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 text-xs md:text-sm font-bold">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-heirlock-yellow transition-colors border-b-2 border-transparent hover:border-heirlock-yellow pb-1"
              >
                Terms
              </Link>
              <span className="text-gray-700">•</span>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-heirlock-yellow transition-colors border-b-2 border-transparent hover:border-heirlock-yellow pb-1"
              >
                Privacy
              </Link>
              <span className="text-gray-700">•</span>
              <a
                href="mailto:hello@tala.io"
                className="text-gray-400 hover:text-heirlock-yellow transition-colors border-b-2 border-transparent hover:border-heirlock-yellow pb-1"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
