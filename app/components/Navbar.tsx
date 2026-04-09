'use client';

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, BookOpen, Zap, Code, Shield, HelpCircle, Newspaper, LayoutGrid, Mail, LogOut, Rocket } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// Dynamic imports to avoid hydration issues with Web3
const WalletButton = dynamic(() => import("./WalletButton"), { 
  ssr: false
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isUserMenuOpen]);

  // Defer session fetch to after mount to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { getSession } = require('next-auth/react');
      getSession().then((ses: any) => {
        setSession(ses);
      });
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => {
    setIsOpen(false);
    setIsResourcesOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b-8 border-black transition-all duration-300 ${
      isScrolled ? "bg-white shadow-[0_8px_0_0_rgba(0,0,0,1)] py-0" : "bg-cream py-2"
    }`}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative h-10 md:h-12 w-auto bg-white border-4 border-transparent group-hover:border-black transition-all p-1">
              <Image 
                src="/logo.png" 
                alt="T.A.L.A. Logo" 
                height={48}
                width={120}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
            <span className="px-3 py-1.5 text-xs font-black border-4 border-black bg-heirlock-yellow text-black shadow-[4px_4px_0_0_#000] rotate-2 group-hover:rotate-0 transition-transform hidden sm:inline-block uppercase tracking-widest">
              BETA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link href="/how-it-works">
              <button className={`px-4 lg:px-5 py-2.5 text-sm lg:text-base font-black uppercase tracking-wider transition-all border-4 ${
                isActive("/how-it-works")
                  ? "border-black bg-heirlock-yellow text-black shadow-[4px_4px_0_0_#000]"
                  : "border-transparent bg-transparent text-black hover:border-black hover:bg-heirlock-yellow hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1"
              }`}>How It Works</button>
            </Link>

            <Link href="/about">
              <button className={`px-4 lg:px-5 py-2.5 text-sm lg:text-base font-black uppercase tracking-wider transition-all border-4 ${
                isActive("/about")
                  ? "border-black bg-heirlock-green text-black shadow-[4px_4px_0_0_#000]"
                  : "border-transparent bg-transparent text-black hover:border-black hover:bg-heirlock-green hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1"
              }`}>About</button>
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative group/resources"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button
                aria-haspopup="true"
                aria-expanded={isResourcesOpen}
                className={`px-4 lg:px-5 py-2.5 text-sm lg:text-base font-black uppercase tracking-wider transition-all border-4 flex items-center gap-2 ${
                  isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")
                    ? "border-black bg-heirlock-pink text-black shadow-[4px_4px_0_0_#000]"
                    : "border-transparent bg-transparent text-black hover:border-black hover:bg-heirlock-pink hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1"
                }`}
              >
                Resources
                <ChevronDown className="w-5 h-5 group-hover/resources:rotate-180 transition-transform" strokeWidth={3} />
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-[96vw] max-w-[90rem] text-black border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] opacity-0 invisible group-hover/resources:opacity-100 group-hover/resources:visible transition-all duration-200 ease-out z-50 flex flex-col bg-white max-h-[85vh] overflow-hidden">
                {/* Colorful Header Bar */}
                <div className="flex shrink-0 h-3 w-full border-b-4 border-black">
                  <div className="flex-1 bg-heirlock-yellow" />
                  <div className="flex-1 bg-heirlock-green" />
                  <div className="flex-1 bg-heirlock-blue" />
                  <div className="flex-1 bg-heirlock-pink" />
                </div>

                <div className="flex-1 overflow-y-auto resources-scroll">
                  <div className="grid md:grid-cols-4 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                    {/* Column 1: Product & Company */}
                    <div className="p-5 lg:p-6 bg-heirlock-yellow/20 hover:bg-heirlock-yellow/40 transition-colors">
                      <h3 className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3 mb-6">
                        <div className="p-1.5 bg-heirlock-yellow border-2 border-black rounded-sm shadow-[2px_2px_0_0_#000]"><BookOpen className="w-4 h-4" /></div>
                        Product & Team
                      </h3>
                      <div className="flex flex-col gap-3">
                        {[
                          { href: '/', label: 'Home Page' },
                          { href: '/about', label: 'About Us' },
                          { href: '/learn', label: 'Learn T.A.L.A.' },
                          { href: '/how-it-works', label: 'How It Works' },
                          { href: '/case-studies', label: 'Case Studies' },
                          { href: '/pricing', label: 'Pricing & Plans' },
                          { href: '/launch', label: 'Launch Program' },
                          { href: '/student', label: 'Student Program' },
                          { href: '/team', label: 'Our Team' },
                          { href: '/faq', label: 'FAQ' },
                          { href: '/donate', label: 'Support & Donate' },
                        ].map((item) => (
                          <Link href={item.href} onClick={closeMenu} key={item.label} className="group/link flex items-center gap-2.5 w-fit">
                            <span className="w-2 h-2 border-[1.5px] border-black bg-white group-hover/link:bg-heirlock-yellow transition-colors" />
                            <span className="font-bold text-sm text-gray-800 group-hover/link:text-black group-hover/link:-translate-y-0.5 transition-transform">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Developers */}
                    <div className="p-5 lg:p-6 bg-heirlock-green/20 hover:bg-heirlock-green/40 transition-colors">
                      <h3 className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3 mb-6">
                        <div className="p-1.5 bg-heirlock-green border-2 border-black rounded-sm shadow-[2px_2px_0_0_#000]"><Code className="w-4 h-4" /></div>
                        Developers
                      </h3>
                      <div className="flex flex-col gap-3">
                        {[
                          { href: '/docs', label: 'Core Docs' },
                          { href: '/documentation', label: 'Legacy Docs' },
                          { href: '/docs/api', label: 'API Reference' },
                          { href: '/docs/architecture', label: 'Architecture' },
                          { href: '/docs/quickstart', label: 'Quickstarts' },
                          { href: '/docs/security', label: 'Dev Security' },
                          { href: '/docs/smart-contract', label: 'Contract Guides' },
                          { href: '/smart-contracts', label: 'Smart Contracts' },
                          { href: '/integrations', label: 'Integrations' },
                        ].map((item) => (
                          <Link href={item.href} onClick={closeMenu} key={item.label} className="group/link flex items-center gap-2.5 w-fit">
                            <span className="w-2 h-2 border-[1.5px] border-black bg-white group-hover/link:bg-heirlock-green transition-colors" />
                            <span className="font-bold text-sm text-gray-800 group-hover/link:text-black group-hover/link:-translate-y-0.5 transition-transform">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Platform & Portals */}
                    <div className="p-5 lg:p-6 bg-heirlock-blue/20 hover:bg-heirlock-blue/40 transition-colors">
                      <h3 className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3 mb-6">
                        <div className="p-1.5 bg-heirlock-blue border-2 border-black rounded-sm shadow-[2px_2px_0_0_#000]"><LayoutGrid className="w-4 h-4" /></div>
                        Platform Portals
                      </h3>
                      <div className="flex flex-col gap-3">
                        {[
                          { href: '/dashboard', label: 'Main Dashboard' },
                          { href: '/dashboard/activity', label: 'Global Activity' },
                          { href: '/dashboard/analytics', label: 'Analytics' },
                          { href: '/dashboard/security', label: 'Platform Security' },
                          { href: '/create-vault', label: 'Create Vault' },
                          { href: '/access-portal', label: 'Access Portal' },
                          { href: '/admin', label: 'Admin Panel' },
                          { href: '/profile', label: 'Your Profile' },
                          { href: '/auth/login', label: 'Sign In' },
                          { href: '/auth/logout', label: 'Sign Out' },
                        ].map((item) => (
                          <Link href={item.href} onClick={closeMenu} key={item.label} className="group/link flex items-center gap-2.5 w-fit">
                            <span className="w-2 h-2 border-[1.5px] border-black bg-white group-hover/link:bg-heirlock-blue transition-colors" />
                            <span className="font-bold text-sm text-gray-800 group-hover/link:text-black group-hover/link:-translate-y-0.5 transition-transform">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 4: Trust, Info & Legal */}
                    <div className="p-5 lg:p-6 bg-heirlock-pink/20 hover:bg-heirlock-pink/40 transition-colors">
                      <h3 className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3 mb-6">
                        <div className="p-1.5 bg-heirlock-pink border-2 border-black rounded-sm shadow-[2px_2px_0_0_#000]"><Shield className="w-4 h-4" /></div>
                        Trust & Legal
                      </h3>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase font-black tracking-widest text-black/40">Status & Info</h4>
                          {[
                            { href: '/security', label: 'Security' },
                            { href: '/trust-center', label: 'Trust Center' },
                            { href: '/api-status', label: 'API Status' },
                            { href: '/status', label: 'System Status' },
                            { href: '/changelog', label: 'Changelog' },
                            { href: '/roadmap', label: 'Roadmap' },
                            { href: '/blog', label: 'Blog' },
                            { href: '/procurement', label: 'Procurement' },
                          ].map((item) => (
                            <Link href={item.href} onClick={closeMenu} key={item.label} className="group/link flex items-center gap-2 w-fit">
                              <span className="w-1.5 h-1.5 border-[1px] border-black bg-white group-hover/link:bg-heirlock-pink transition-colors shrink-0" />
                              <span className="font-bold text-xs text-gray-800 group-hover/link:text-black hover:underline">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase font-black tracking-widest text-black/40">Legal & Auth</h4>
                          {[
                            { href: '/contact', label: 'Contact Us' },
                            { href: '/support', label: 'Support' },
                            { href: '/legal', label: 'Legal Hub' },
                            { href: '/terms', label: 'Terms' },
                            { href: '/privacy', label: 'Privacy' },
                            { href: '/cookies', label: 'Cookies' },
                            { href: '/disclaimer', label: 'Disclaimer' },
                          ].map((item) => (
                            <Link href={item.href} onClick={closeMenu} key={item.label} className="group/link flex items-center gap-2 w-fit">
                              <span className="w-1.5 h-1.5 border-[1px] border-black bg-white group-hover/link:bg-heirlock-pink transition-colors shrink-0" />
                              <span className="font-bold text-xs text-gray-800 group-hover/link:text-black hover:underline">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Featured Action Footer */}
                <div className="shrink-0 bg-heirlock-pink p-4 lg:p-6 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-black font-black uppercase tracking-wider text-base lg:text-lg">Ready to experiment?</h4>
                    <p className="text-black/80 font-bold mt-1 text-sm">Lock files with device-side encryption securely.</p>
                  </div>
                  <Link href="/create-vault" onClick={closeMenu}>
                    <button className="px-6 py-2.5 bg-black text-white font-black text-sm uppercase tracking-wider hover:-translate-y-1 transition-transform border-4 border-white shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
                      Create Vault Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Middle Section: Create Vault | Dashboard | Profile */}
            <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-center">
              <Link href="/create-vault">
                <button className={`px-4 lg:px-6 py-2.5 text-sm lg:text-base font-black border-4 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all whitespace-nowrap bg-heirlock-yellow text-black border-black uppercase tracking-wider`}>
                  Create Vault
                </button>
              </Link>

              {/* Dashboard Button - shown only when logged in */}
              {mounted && session?.user && (
                <Link href="/dashboard">
                  <button className={`px-4 lg:px-6 py-2.5 text-sm lg:text-base font-black border-4 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all whitespace-nowrap flex items-center gap-2 bg-heirlock-blue text-black border-black uppercase tracking-wider`}>
                    <LayoutGrid className="w-4 h-4" strokeWidth={3} />
                    Dashboard
                  </button>
                </Link>
              )}

              {/* Profile Avatar - shown only when logged in */}
              {mounted && session?.user && (
                <div className="relative group/profile" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1.5 rounded-none border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:bg-heirlock-pink transition-all bg-white"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="w-9 h-9 border-2 border-black"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-heirlock-yellow border-2 border-black flex items-center justify-center text-black font-black uppercase">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>

                  {/* User menu dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border-4 border-black shadow-[8px_8px_0_0_#000] z-50">
                      <div className="p-4 border-b-4 border-black bg-cream">
                        <p className="text-black font-black text-sm uppercase truncate">{session.user.name}</p>
                        <p className="text-gray-600 font-bold text-xs truncate mt-1">{session.user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut({ redirect: true, callbackUrl: '/' });
                        }}
                        className="w-full text-left px-4 py-3 text-black hover:bg-heirlock-red hover:text-white transition-all text-sm font-black flex items-center gap-2 uppercase"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={3} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section: Wallet Button or Sign In */}
            <div className="flex items-center gap-3 lg:gap-4 justify-end">
              {/* Show wallet button only if not logged in with Google */}
              {mounted && !session && <WalletButton isScrolled={isScrolled} />}

              {/* Show Sign In button if not logged in */}
              {mounted && !session && (
                <Link href="/auth/login">
                  <button className="px-5 lg:px-7 py-3 text-sm lg:text-base font-black border-4 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap bg-black text-white hover:bg-heirlock-green hover:text-black border-black uppercase tracking-wider">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 transition-all border-4 shadow-[4px_4px_0_0_#000] border-black text-black bg-white hover:bg-heirlock-yellow`}
          >
            {isOpen ? <X className="w-6 h-6" strokeWidth={3} /> : <Menu className="w-6 h-6" strokeWidth={3} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t-8 border-black bg-white absolute top-full left-0 right-0 shadow-[0_12px_0_0_rgba(0,0,0,1)] max-h-[85vh] overflow-y-auto border-b-8">
            <div className="flex flex-col gap-0 p-4">
              {/* Quick Actions - Top of Mobile Menu */}
              <Link href="/create-vault" onClick={closeMenu}>
                <button className="w-full px-4 py-4 text-base font-black border-4 shadow-[4px_4px_0_0_#000] transition-all bg-heirlock-yellow text-black border-black uppercase mb-4 active:translate-y-1 active:shadow-none">
                  Create Vault
                </button>
              </Link>

              <Link href="/dashboard" onClick={closeMenu}>
                <button className="w-full px-4 py-4 text-base font-black border-4 shadow-[4px_4px_0_0_#000] transition-all bg-heirlock-blue text-black border-black uppercase mb-4 active:translate-y-1 active:shadow-none">
                  Dashboard
                </button>
              </Link>

              <div className="border-b-4 border-black my-2"></div>

              {/* Main Navigation */}
              <Link href="/how-it-works" onClick={closeMenu}>
                <button className={`w-full text-left px-4 py-3 text-sm font-black uppercase tracking-wider transition-all border-l-8 ${
                  isActive("/how-it-works")
                    ? "text-black bg-heirlock-yellow border-l-black"
                    : "text-black hover:bg-cream border-l-transparent hover:border-l-black"
                }`}>How It Works</button>
              </Link>

              <Link href="/about" onClick={closeMenu}>
                <button className={`w-full text-left px-4 py-3 text-sm font-black uppercase tracking-wider transition-all border-l-8 ${
                  isActive("/about")
                    ? "text-black bg-heirlock-green border-l-black"
                    : "text-black hover:bg-cream border-l-transparent hover:border-l-black"
                }`}>About</button>
              </Link>

              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`w-full text-left px-4 py-3 text-sm font-black uppercase tracking-wider transition-all border-l-8 flex justify-between items-center ${
                  isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")
                    ? "text-black bg-heirlock-pink border-l-black"
                    : "text-black hover:bg-cream border-l-transparent hover:border-l-black"
                }`}
              >
                Resources
                <ChevronDown className={`w-5 h-5 transition-transform ${isResourcesOpen ? "rotate-180" : ""}`} strokeWidth={3} />
              </button>

              {isResourcesOpen && (
                <div className="space-y-1 pl-4 pr-2 py-2 bg-cream border-y-4 border-black my-2">
                  <Link href="/documentation" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-yellow transition-all border-2 border-black mb-1 shadow-[2px_2px_0_0_#000]">Docs</button>
                  </Link>
                  <Link href="/smart-contracts" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-blue transition-all border-2 border-black mb-1 shadow-[2px_2px_0_0_#000]">Smart Contracts</button>
                  </Link>
                  <Link href="/team" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-green transition-all border-2 border-black mb-1 shadow-[2px_2px_0_0_#000]">Team</button>
                  </Link>
                  <Link href="/procurement" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-yellow transition-all border-2 border-black mb-1 shadow-[2px_2px_0_0_#000]">Procurement Pack</button>
                  </Link>
                  <Link href="/docs/quickstart" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-pink transition-all border-2 border-black mb-1 shadow-[2px_2px_0_0_#000]">API Quickstart</button>
                  </Link>
                  <Link href="/integrations" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-green transition-all border-2 border-black mb-1 shadow-[2px_2px_0_0_#000]">Integrations</button>
                  </Link>
                  <Link href="/faq" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-yellow transition-all border-2 border-black mb-1 shadow-[2px_2px_0_0_#000]">FAQ</button>
                  </Link>
                  <Link href="/donate" onClick={closeMenu}>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-blue transition-all border-2 border-black shadow-[2px_2px_0_0_#000]">Support & Donate</button>
                  </Link>
                </div>
              )}

              <div className="border-b-4 border-black my-2"></div>

              {/* Secondary Links */}
              <Link href="/contact" onClick={closeMenu}>
                <button className={`w-full text-left px-4 py-3 text-sm font-black uppercase tracking-wider transition-all border-l-8 ${
                  isActive("/contact")
                    ? "text-black bg-heirlock-yellow border-l-black"
                    : "text-black hover:bg-cream border-l-transparent hover:border-l-black"
                }`}>Contact</button>
              </Link>

              <Link href="/terms" onClick={closeMenu}>
                <button className={`w-full text-left px-4 py-3 text-sm font-black uppercase tracking-wider transition-all border-l-8 ${
                  isActive("/terms")
                    ? "text-black bg-gray-200 border-l-black"
                    : "text-black hover:bg-cream border-l-transparent hover:border-l-black"
                }`}>Terms</button>
              </Link>

              <Link href="/privacy" onClick={closeMenu}>
                <button className={`w-full text-left px-4 py-3 text-sm font-black uppercase tracking-wider transition-all border-l-8 ${
                  isActive("/privacy")
                    ? "text-black bg-gray-200 border-l-black"
                    : "text-black hover:bg-cream border-l-transparent hover:border-l-black"
                }`}>Privacy</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

