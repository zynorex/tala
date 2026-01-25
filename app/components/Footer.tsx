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
      { label: "API Documentation", href: "/docs/api" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
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
      { label: "Email", href: "mailto:hello@TALA.io", icon: Mail, bg: "bg-heirlock-yellow" },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-cream via-white to-gray-100 border-t-4 border-black">
      {/* Desktop Footer */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="text-5xl font-black text-black mb-2 inline-block hover:text-gray-700 transition-colors">
                T.A.L.A.
              </Link>
              <div className="w-16 h-1 bg-black"></div>
            </div>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              Enterprise-grade vault protection for exam papers with blockchain-verified security and military-grade AES-256-GCM encryption.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 border-4 border-black ${social.bg} text-black hover:scale-110 transition-transform shadow-brutal font-bold`}
                    title={social.label}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-4 border-black bg-heirlock-yellow p-8 shadow-brutal flex flex-col justify-center">
            {submitted ? (
              <div className="flex items-center gap-3 animate-pulse">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-lg font-black text-black">Success!</p>
                  <p className="text-sm text-gray-800 font-medium">{successMessage}</p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-black mb-3">Stay Updated</h3>
                <p className="text-gray-800 font-medium mb-6">Get notified about new features and security updates</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubmit()}
                    className="flex-1 px-4 py-3 border-3 border-black font-bold text-sm focus:outline-none"
                  />
                  <button 
                    onClick={handleNewsletterSubmit}
                    className="px-6 py-3 bg-black text-white border-3 border-black font-black hover:bg-gray-900 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Join
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Product */}
          <div className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none transition-all">
            <h4 className="text-lg font-black text-black mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-heirlock-yellow" />
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 font-medium hover:text-black hover:font-black flex items-center gap-2 group transition-all"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none transition-all">
            <h4 className="text-lg font-black text-black mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-heirlock-green" />
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 font-medium hover:text-black hover:font-black flex items-center gap-2 group transition-all"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none transition-all">
            <h4 className="text-lg font-black text-black mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-heirlock-blue" />
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 font-medium hover:text-black hover:font-black flex items-center gap-2 group transition-all"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="border-4 border-black bg-white p-6 shadow-brutal hover:shadow-none transition-all">
            <h4 className="text-lg font-black text-black mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-heirlock-pink" />
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-700 font-medium hover:text-black hover:font-black flex items-center gap-2 group transition-all"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t-4 border-black pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Left - Copyright & Tagline */}
            <div>
              <p className="font-black text-black text-lg">© {currentYear} T.A.L.A.</p>
              <p className="text-gray-600 font-medium mt-2 italic">
                "Securing the future of education, one vault at a time."
              </p>
            </div>

            {/* Center - Features */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Lock className="w-4 h-4 text-heirlock-pink" />
                AES-256-GCM
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Heart className="w-4 h-4 text-heirlock-pink" />
                Open Source
              </div>
            </div>

            {/* Right - Quick Links */}
            <div className="flex justify-center md:justify-end gap-4 flex-wrap">
              <Link
                href="/terms"
                className="text-sm font-bold text-gray-700 hover:text-black border-b-2 border-transparent hover:border-black pb-1 transition-all"
              >
                Terms
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/privacy"
                className="text-sm font-bold text-gray-700 hover:text-black border-b-2 border-transparent hover:border-black pb-1 transition-all"
              >
                Privacy
              </Link>
              <span className="text-gray-400">•</span>
              <a
                href="mailto:hello@TALA.io"
                className="text-sm font-bold text-gray-700 hover:text-black border-b-2 border-transparent hover:border-black pb-1 transition-all"
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

