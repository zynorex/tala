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

              <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-[94vw] max-w-5xl text-white border-4 border-black shadow-brutal rounded-xl opacity-0 invisible group-hover/resources:opacity-100 group-hover/resources:visible transition-all duration-200 ease-out z-50 overflow-hidden">
                <div className="h-2 bg-linear-to-r from-heirlock-yellow via-heirlock-green to-heirlock-blue" />
                <div className="bg-black/95 backdrop-blur-sm resources-scroll max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 md:px-8 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white text-black font-black flex items-center justify-center shadow-brutal">R</div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black">Resources</p>
                        <p className="text-sm md:text-base text-white/80 font-semibold">Guides, launch notes, and build-ready docs.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 bg-white/5">
                        <Shield className="w-4 h-4" />
                        Security-first content
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 bg-white/5">
                        <Zap className="w-4 h-4" />
                        Updated weekly
                      </span>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-[1.1fr_1.1fr_0.95fr] gap-6 md:gap-7 px-6 md:px-8 py-6 md:py-8">
                    {/* Learn Column */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Learn</h3>
                        <span className="text-[11px] text-white/60">Orientation</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { href: '/learn', label: 'Learn T.A.L.A.', icon: BookOpen, desc: 'Overview of the platform and where to start.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                          { href: '/documentation', label: 'Documentation', icon: BookOpen, desc: 'Full product docs and onboarding flows.', accent: 'hover:border-heirlock-green/60 hover:bg-heirlock-green/10' },
                          { href: '/how-it-works', label: 'How It Works', icon: Zap, desc: 'Concepts, guarantees, and threat model.', accent: 'hover:border-heirlock-blue/60 hover:bg-heirlock-blue/10' },
                          { href: '/launch', label: 'Launch Details', icon: Rocket, desc: 'Release plans, timelines, and readiness.', accent: 'hover:border-heirlock-pink/60 hover:bg-heirlock-pink/10' },
                          { href: '/faq', label: 'FAQ', icon: HelpCircle, desc: 'Answers to the most common questions.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                          { href: '/case-studies', label: 'Case Studies', icon: Zap, desc: 'Proof points from real deployments.', accent: 'hover:border-heirlock-pink/60 hover:bg-heirlock-pink/10' },
                          { href: '/pricing', label: 'Pricing', icon: Zap, desc: 'Plans, usage, and billing breakdown.', accent: 'hover:border-heirlock-pink/60 hover:bg-heirlock-pink/10' },
                          { href: '/team', label: 'Team', icon: LayoutGrid, desc: 'Meet the builders and advisors.', accent: 'hover:border-heirlock-green/60 hover:bg-heirlock-green/10' },
                          { href: '/api-status', label: 'API Status and Limits', icon: Shield, desc: 'Availability, limits, and uptime.', accent: 'hover:border-heirlock-blue/60 hover:bg-heirlock-blue/10' },
                          { href: '/procurement', label: 'Procurement Pack', icon: BookOpen, desc: 'Security, legal, and procurement docs.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                          { href: '/security', label: 'Security', icon: Shield, desc: 'Security practices and attestations.', accent: 'hover:border-heirlock-green/60 hover:bg-heirlock-green/10' },
                          { href: '/trust-center', label: 'Trust Center', icon: Shield, desc: 'Compliance, policies, and audits.', accent: 'hover:border-heirlock-blue/60 hover:bg-heirlock-blue/10' },
                          { href: '/roadmap', label: 'Roadmap', icon: Zap, desc: 'What is shipping next.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                        ].map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link href={item.href} onClick={closeMenu} key={idx}>
                              <div className={`group/link flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/3 hover:border-white/40 hover:bg-white/10 transition-all ${item.accent}`}>
                                <div className="h-10 w-10 rounded-md bg-linear-to-br from-white/15 to-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-white">{item.label}</span>
                                    <span className="w-2 h-2 rounded-full bg-white/30 group-hover/link:bg-heirlock-yellow" />
                                  </div>
                                  <p className="text-xs text-white/70 leading-snug">{item.desc}</p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Build Column */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Build</h3>
                        <span className="text-[11px] text-white/60">For developers</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { href: '/docs', label: 'Developer Docs', icon: Code, desc: 'SDKs, auth, environments, and examples.', accent: 'hover:border-heirlock-green/60 hover:bg-heirlock-green/10' },
                          { href: '/docs/api', label: 'API Documentation', icon: Code, desc: 'Reference with request/response samples.', accent: 'hover:border-heirlock-blue/60 hover:bg-heirlock-blue/10' },
                          { href: '/docs/quickstart', label: 'API Quickstart', icon: Code, desc: 'Ship in minutes with guided steps.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                          { href: '/integrations', label: 'Integrations', icon: Code, desc: 'Prebuilt connectors and recipes.', accent: 'hover:border-heirlock-green/60 hover:bg-heirlock-green/10' },
                          { href: '/smart-contracts', label: 'Smart Contracts', icon: Code, desc: 'Contract ABIs, audits, deployment info.', accent: 'hover:border-heirlock-pink/60 hover:bg-heirlock-pink/10' },
                          { href: '/admin', label: 'Admin Upload', icon: Shield, desc: 'Operational tooling for admin actions.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                        ].map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link href={item.href} onClick={closeMenu} key={idx}>
                              <div className={`group/link flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/3 hover:border-white/40 hover:bg-white/10 transition-all ${item.accent}`}>
                                <div className="h-10 w-10 rounded-md bg-linear-to-br from-white/15 to-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-white">{item.label}</span>
                                    <span className="w-2 h-2 rounded-full bg-white/30 group-hover/link:bg-heirlock-green" />
                                  </div>
                                  <p className="text-xs text-white/70 leading-snug">{item.desc}</p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Access Column */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Access</h3>
                        <span className="text-[11px] text-white/60">Stay current</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { href: '/access-portal', label: 'Access Portal', icon: Zap, desc: 'Manage your workspace and vaults.', accent: 'hover:border-heirlock-green/60 hover:bg-heirlock-green/10' },
                          { href: '/blog', label: 'Blog', icon: Newspaper, desc: 'Product thinking and release stories.', accent: 'hover:border-heirlock-pink/60 hover:bg-heirlock-pink/10' },
                          { href: '/changelog', label: 'Changelog', icon: Code, desc: 'What shipped this week.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                          { href: '/contact', label: 'Contact', icon: Mail, desc: 'Talk with the team or request access.', accent: 'hover:border-heirlock-yellow/60 hover:bg-heirlock-yellow/10' },
                        ].map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link href={item.href} onClick={closeMenu} key={idx}>
                              <div className={`group/link flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/3 hover:border-white/40 hover:bg-white/10 transition-all ${item.accent}`}>
                                <div className="h-10 w-10 rounded-md bg-linear-to-br from-white/15 to-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-white">{item.label}</span>
                                    <span className="w-2 h-2 rounded-full bg-white/30 group-hover/link:bg-heirlock-pink" />
                                  </div>
                                  <p className="text-xs text-white/70 leading-snug">{item.desc}</p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="p-4 rounded-xl border border-white/10 bg-white/5 mt-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 font-black">
                          Featured action
                          <span className="w-2 h-2 rounded-full bg-heirlock-yellow" />
                        </div>
                        <p className="text-lg font-black text-white leading-tight">Create a vault in two minutes</p>
                        <p className="text-sm text-white/70">Lock files with device-side encryption and contract-enforced unlocks. Guided flow, ready now.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href="/create-vault" onClick={closeMenu}>
                            <button className="w-full sm:w-auto px-4 py-3 bg-heirlock-yellow text-black font-black border-3 border-black rounded-lg shadow-brutal hover:-translate-y-0.5 transition-all text-sm">Start a vault</button>
                          </Link>
                          <Link href="/docs/quickstart" onClick={closeMenu}>
                            <button className="w-full sm:w-auto px-4 py-3 bg-white text-black font-black border-3 border-black rounded-lg hover:bg-heirlock-blue transition-all text-sm">View quickstart</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <style jsx global>{`
              .resources-scroll::-webkit-scrollbar {
                width: 10px;
              }
              .resources-scroll::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
              }
              .resources-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #F2E85C, #5BE39D, #61A5FF);
                border-radius: 999px;
                border: 2px solid rgba(0, 0, 0, 0.6);
              }
              .resources-scroll::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #F7F0A0, #7AF7B6, #8AC2FF);
              }
            `}</style>

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
          <div className="md:hidden border-t-8 border-black bg-white absolute top-[100%] left-0 right-0 shadow-[0_12px_0_0_rgba(0,0,0,1)] max-h-[85vh] overflow-y-auto border-b-8">
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
                    <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-heirlock-yellow transition-all border-2 border-black shadow-[2px_2px_0_0_#000]">FAQ</button>
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

