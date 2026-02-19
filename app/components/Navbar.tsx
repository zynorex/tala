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

  const getNavBgColor = () => {
    if (isScrolled) return "bg-black";
    if (isActive("/")) return "bg-heirlock-yellow";
    if (isActive("/about")) return "bg-heirlock-green";
    if (isActive("/how-it-works")) return "bg-heirlock-blue";
    if (isActive("/team")) return "bg-heirlock-blue";
    if (isActive("/admin")) return "bg-heirlock-pink";
    if (isActive("/access-portal")) return "bg-heirlock-green";
    if (isActive("/create-vault")) return "bg-gradient-to-r from-heirlock-blue to-heirlock-green";
    if (isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")) return "bg-heirlock-green";
    if (isActive("/dashboard")) return "bg-heirlock-pink";
    return "bg-heirlock-yellow";
  };

  const getNavTextColor = () => (isScrolled ? "text-white" : "hover:text-white");

  const getBadgeColor = () => {
    if (isScrolled) return "bg-heirlock-yellow text-black border-2 border-heirlock-yellow group-hover:text-black group-hover:bg-heirlock-yellow";
    if (isActive("/")) return "bg-heirlock-yellow text-black border-4 border-heirlock-yellow group-hover:text-black";
    if (isActive("/about")) return "bg-heirlock-green text-black border-4 border-heirlock-green group-hover:text-black";
    if (isActive("/how-it-works")) return "bg-heirlock-blue text-black border-4 border-heirlock-blue group-hover:text-black";
    if (isActive("/team")) return "bg-heirlock-blue text-black border-4 border-heirlock-blue group-hover:text-black";
    if (isActive("/admin")) return "bg-heirlock-pink text-black border-4 border-heirlock-pink group-hover:text-black";
    if (isActive("/access-portal")) return "bg-heirlock-green text-black border-4 border-heirlock-green group-hover:text-black";
    if (isActive("/create-vault")) return "bg-heirlock-blue text-black border-4 border-heirlock-blue group-hover:text-black";
    if (isActive("/dashboard")) return "bg-heirlock-pink text-black border-4 border-heirlock-pink group-hover:text-black";
    if (isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")) return "bg-heirlock-green text-black border-4 border-heirlock-green group-hover:text-black";
    return "bg-heirlock-yellow text-black border-4 border-heirlock-yellow group-hover:text-black";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b-4 border-transparent transition-all duration-300 group hover:bg-black hover:border-b-black hover:text-white ${getNavBgColor()} ${getNavTextColor()} group-hover:text-white`}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 md:h-12 w-auto">
              <Image 
                src="/logo.png" 
                alt="T.A.L.A. Logo" 
                height={48}
                width={120}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
            <span className={`px-3 py-1 text-xs font-black rounded-sm transition-all text-black! ${getBadgeColor()}`}>
              BETA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link href="/how-it-works">
              <button className={`px-4 lg:px-6 py-2 text-sm lg:text-base font-bold transition-all border-b-4 ${
                isActive("/how-it-works")
                  ? isScrolled ? "border-heirlock-yellow text-white" : "border-black"
                  : isScrolled ? "border-transparent hover:bg-heirlock-yellow hover:text-black" : "border-transparent group-hover:text-white"
              }`}>How It Works</button>
            </Link>

            <Link href="/about">
              <button className={`px-4 lg:px-6 py-2 text-sm lg:text-base font-bold transition-all border-b-4 ${
                isActive("/about")
                  ? isScrolled ? "border-heirlock-green text-white" : "border-black"
                  : isScrolled ? "border-transparent hover:bg-heirlock-green hover:text-black" : "border-transparent group-hover:text-white"
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
                className={`px-4 lg:px-6 py-2 text-sm lg:text-base font-bold transition-all border-b-4 flex items-center gap-2 ${
                  isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")
                    ? isScrolled ? "border-heirlock-pink text-white" : "border-black"
                    : isScrolled ? "border-transparent hover:bg-heirlock-pink hover:text-black" : "border-transparent group-hover:text-white"
                }`}
              >
                Resources
                <ChevronDown className="w-4 h-4 group-hover/resources:rotate-180 transition-transform" />
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
                <button className={`px-4 lg:px-6 py-2 text-sm lg:text-base font-bold border-4 shadow-brutal transition-all whitespace-nowrap ${
                  isScrolled ? "bg-heirlock-yellow text-black border-black hover:bg-heirlock-yellow hover:text-black hover:border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "bg-heirlock-yellow text-black border-black hover:bg-heirlock-pink hover:text-black hover:border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                }`}>Create Vault</button>
              </Link>

              {/* Dashboard Button - shown only when logged in */}
              {mounted && session?.user && (
                <Link href="/dashboard">
                  <button className={`px-4 lg:px-6 py-2 text-sm lg:text-base font-bold border-4 shadow-brutal transition-all whitespace-nowrap flex items-center gap-1 ${
                    isScrolled ? "bg-heirlock-blue text-black border-black hover:bg-heirlock-blue hover:text-black hover:border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "bg-heirlock-blue text-black border-black hover:bg-heirlock-green hover:text-black hover:border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  }`}>
                    <LayoutGrid className="w-4 h-4" />
                    Dashboard
                  </button>
                </Link>
              )}

              {/* Profile Avatar - shown only when logged in */}
              {mounted && session?.user && (
                <div className="relative group/profile" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`p-2 rounded-full border-4 shadow-brutal transition-all ${
                      isScrolled ? "border-black hover:bg-heirlock-yellow" : "border-black hover:bg-heirlock-pink"
                    }`}
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-linear-to-br from-heirlock-blue to-heirlock-pink rounded-full flex items-center justify-center text-white font-bold">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>

                  {/* User menu dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black border-4 border-black shadow-brutal z-50">
                      <div className="p-4 border-b-2 border-white">
                        <p className="text-white font-bold text-sm">{session.user.name}</p>
                        <p className="text-gray-400 text-xs">{session.user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut({ redirect: true, callbackUrl: '/' });
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-heirlock-pink transition-all text-sm font-bold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
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
                  <button className={`px-5 lg:px-7 py-3 text-sm lg:text-base font-bold border-4 shadow-brutal transition-all flex items-center gap-2 whitespace-nowrap ${
                    isScrolled ? "bg-heirlock-green text-black border-black hover:bg-heirlock-green hover:text-white hover:border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "bg-heirlock-green text-black border-black hover:bg-heirlock-blue hover:text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  }`}>
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 transition-all border-2 ${
              isScrolled
                ? "border-white hover:bg-heirlock-yellow hover:text-black"
                : "border-black text-black group-hover:border-white group-hover:text-white group-hover:hover:bg-white group-hover:hover:bg-opacity-20"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden border-t-4 transition-all duration-200 ${
            isScrolled ? "border-white bg-black" : "border-black bg-heirlock-yellow"
          }`}>
            <div className="flex flex-col gap-1 p-2">
              {/* Quick Actions - Top of Mobile Menu */}
              <Link href="/create-vault" onClick={closeMenu}>
                <button className={`w-full px-3 py-3 text-sm font-bold border-4 shadow-brutal transition-all ${
                  isActive("/create-vault") ? (isScrolled ? "bg-heirlock-yellow text-black border-black" : "bg-black text-white border-black") : (isScrolled ? "bg-heirlock-yellow text-black border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "bg-heirlock-yellow text-black border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none")
                }`}>Create Vault</button>
              </Link>

              <Link href="/dashboard" onClick={closeMenu}>
                <button className={`w-full px-3 py-3 text-sm font-bold border-4 shadow-brutal transition-all ${
                  isActive("/dashboard") 
                    ? (isScrolled ? "bg-heirlock-blue text-white border-black" : "bg-black text-heirlock-blue border-black") 
                    : (isScrolled ? "bg-heirlock-blue text-white border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "bg-black text-white border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none")
                }`}>Dashboard</button>
              </Link>

              <div className="border-2 border-current opacity-30 my-1"></div>

              {/* Main Navigation */}
              <Link href="/how-it-works" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/how-it-works")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-heirlock-yellow" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-heirlock-yellow hover:text-black hover:border-l-heirlock-yellow" : "text-black hover:bg-heirlock-yellow hover:text-black hover:border-l-black"
                }`}>How It Works</button>
              </Link>

              <Link href="/about" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/about")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-heirlock-green" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-heirlock-green hover:text-black hover:border-l-heirlock-green" : "text-black hover:bg-heirlock-green hover:text-black hover:border-l-black"
                }`}>About</button>
              </Link>

              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 flex justify-between items-center ${
                  isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-heirlock-pink" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-heirlock-pink hover:text-black hover:border-l-heirlock-pink" : "text-black hover:bg-heirlock-pink hover:text-black hover:border-l-black"
                }`}
              >
                Resources
                <ChevronDown className={`w-3 h-3 transition-transform ${isResourcesOpen ? "rotate-180" : ""}`} />
              </button>

              {isResourcesOpen && (
                <div className="space-y-1 pl-3">
                  <Link href="/documentation" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-yellow hover:text-black transition-all border-l-2 border-heirlock-yellow">Docs</button>
                  </Link>
                  <Link href="/smart-contracts" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-blue hover:text-black transition-all border-l-2 border-heirlock-blue">Smart Contracts</button>
                  </Link>
                  <Link href="/team" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-green hover:text-black transition-all border-l-2 border-heirlock-green">Team</button>
                  </Link>
                  <Link href="/procurement" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-yellow hover:text-black transition-all border-l-2 border-heirlock-yellow">Procurement Pack</button>
                  </Link>
                  <Link href="/docs/quickstart" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-yellow hover:text-black transition-all border-l-2 border-heirlock-yellow">API Quickstart</button>
                  </Link>
                  <Link href="/integrations" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-green hover:text-black transition-all border-l-2 border-heirlock-green">Integrations</button>
                  </Link>
                  <Link href="/trust-center" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-blue hover:text-black transition-all border-l-2 border-heirlock-blue">Trust Center</button>
                  </Link>
                  <Link href="/faq" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-green hover:text-black transition-all border-l-2 border-heirlock-green">FAQ</button>
                  </Link>
                  <Link href="/admin" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-pink hover:text-black transition-all border-l-2 border-heirlock-pink">Admin Upload</button>
                  </Link>
                  <Link href="/access-portal" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-green hover:text-black transition-all border-l-2 border-heirlock-green">Access Portal</button>
                  </Link>
                  <Link href="/blog" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-pink hover:text-black transition-all border-l-2 border-heirlock-pink">Blog</button>
                  </Link>
                  <Link href="/changelog" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-yellow hover:text-black transition-all border-l-2 border-heirlock-yellow">Changelog</button>
                  </Link>
                  <Link href="/pricing" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-pink hover:text-black transition-all border-l-2 border-heirlock-pink">Pricing</button>
                  </Link>
                </div>
              )}

              <div className="border-2 border-current opacity-30 my-1"></div>

              {/* Secondary Links */}
              <Link href="/contact" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/contact")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-heirlock-yellow" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-heirlock-yellow hover:text-black hover:border-l-heirlock-yellow" : "text-black hover:bg-heirlock-yellow hover:text-black hover:border-l-black"
                }`}>Contact</button>
              </Link>

              <Link href="/terms" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/terms")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-gray-500" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-gray-700 hover:text-white hover:border-l-gray-500" : "text-black hover:bg-gray-200 hover:text-black hover:border-l-black"
                }`}>Terms</button>
              </Link>

              <Link href="/privacy" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/privacy")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-gray-500" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-gray-700 hover:text-white hover:border-l-gray-500" : "text-black hover:bg-gray-200 hover:text-black hover:border-l-black"
                }`}>Privacy</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

