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
      {/* Mobile Footer - Simplified Layout */}
      <div className="md:hidden px-3 py-8 space-y-4">
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
