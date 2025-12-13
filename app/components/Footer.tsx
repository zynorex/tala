'use client';

import Link from "next/link";
import { Twitter, Github, Mail, Send, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Create Vault", href: "/create-vault" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Roadmap", href: "/roadmap" },
    ],
    resources: [
      { label: "Documentation", href: "/documentation" },
      { label: "Smart Contracts", href: "/smart-contracts" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Contact", href: "/contact" },
    ],
    social: [
      { label: "Twitter", href: "https://twitter.com", icon: Twitter },
      { label: "GitHub", href: "https://github.com", icon: Github },
      { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
      { label: "Email", href: "mailto:hello@relic.io", icon: Mail },
    ],
  };

  return (
    <footer className="bg-black text-white border-t-4 border-heirlock-yellow">
      {/* Newsletter Section - Hidden on Mobile */}
      <div className="hidden md:block border-b-4 border-heirlock-yellow">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm md:text-base mb-4">
                Get the latest updates on inheritance protocols and crypto security.
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
      <div className="md:hidden px-3 py-8">
        <div className="space-y-4">
          {/* Brand Section */}
          <div className="bg-gray-900 border-4 border-heirlock-yellow p-4">
            <Link href="/" className="text-2xl font-bold block mb-3">
              Relic
            </Link>
            <p className="text-xs text-gray-400 mb-4">
              Gas-optimized inheritance for crypto
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
                    className="p-2 border-2 border-heirlock-yellow text-heirlock-yellow hover:bg-heirlock-yellow hover:text-black transition-all"
                    title={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Link href="/create-vault">
              <button className="w-full px-3 py-3 bg-heirlock-yellow text-black border-4 border-black font-bold text-xs shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                🔒 CREATE VAULT
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="w-full px-3 py-3 bg-heirlock-blue text-white border-4 border-black font-bold text-xs shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                📊 DASHBOARD
              </button>
            </Link>
          </div>

          {/* Product Links */}
          <div className="bg-gray-900 border-4 border-gray-700 p-3">
            <h4 className="text-xs font-bold text-heirlock-yellow mb-3">PRODUCT</h4>
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
          <div className="bg-gray-900 border-4 border-gray-700 p-3">
            <h4 className="text-xs font-bold text-heirlock-green mb-3">RESOURCES</h4>
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

          {/* Company Links */}
          <div className="bg-gray-900 border-4 border-gray-700 p-3">
            <h4 className="text-xs font-bold text-heirlock-blue mb-3">COMPANY</h4>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.company.map((link) => (
                <Link key={link.label} href={link.href}>
                  <button className="w-full text-left px-2 py-2 text-xs font-bold text-gray-400 hover:text-heirlock-blue hover:bg-black border-2 border-transparent hover:border-heirlock-blue transition-all">
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="border-t-2 border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-500">
              © {currentYear} Relic Protocol
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Built with ❤️ for crypto inheritance
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Footer - Original Layout */}
      <div className="hidden md:block container mx-auto max-w-7xl px-3 sm:px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Brand & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold mb-4 inline-block hover:scale-105 transition-transform">
              Relic
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              The first gas-optimized inheritance protocol for crypto assets.
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
                    className="p-2 border-2 border-heirlock-yellow text-heirlock-yellow hover:bg-heirlock-yellow hover:text-black transition-all"
                    title={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-heirlock-yellow mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-heirlock-yellow transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-heirlock-green mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-heirlock-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-heirlock-blue mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-heirlock-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t-2 border-gray-800 pt-8 md:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
            <div className="text-xs md:text-sm text-gray-500">
              <p>© {currentYear} Relic Protocol. All rights reserved.</p>
              <p className="mt-2">
                Built with ❤️ for crypto inheritance.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs md:text-sm">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-heirlock-yellow transition-colors"
              >
                Terms
              </Link>
              <span className="text-gray-700">•</span>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-heirlock-yellow transition-colors"
              >
                Privacy
              </Link>
              <span className="text-gray-700">•</span>
              <a
                href="mailto:hello@relic.io"
                className="text-gray-500 hover:text-heirlock-yellow transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
