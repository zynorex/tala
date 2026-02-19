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
            <span className={`px-3 py-1 text-xs font-black rounded-sm transition-all !text-black ${getBadgeColor()}`}>
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

              <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-[94vw] max-w-5xl bg-black text-white border-4 border-black shadow-brutal rounded-xl opacity-0 invisible group-hover/resources:opacity-100 group-hover/resources:visible transition-all duration-200 ease-out z-50 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-heirlock-yellow via-heirlock-green to-heirlock-blue" />
                <div className="grid lg:grid-cols-[1.2fr_1.2fr_1fr] gap-8 p-8">
                  {/* Learn Column */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Learn</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { href: '/learn', label: 'Learn T.A.L.A.', icon: BookOpen, bg: 'hover:bg-heirlock-yellow' },
                        { href: '/documentation', label: 'Documentation', icon: BookOpen, bg: 'hover:bg-heirlock-green' },
                        { href: '/how-it-works', label: 'How It Works', icon: Zap, bg: 'hover:bg-heirlock-blue' },
                        { href: '/launch', label: 'Launch Details', icon: Rocket, bg: 'hover:bg-heirlock-pink' },
                        { href: '/faq', label: 'FAQ', icon: HelpCircle, bg: 'hover:bg-heirlock-yellow' },
                        { href: '/case-studies', label: 'Case Studies', icon: Zap, bg: 'hover:bg-heirlock-pink' },
                        { href: '/pricing', label: 'Pricing', icon: Zap, bg: 'hover:bg-heirlock-pink' },
                        { href: '/team', label: 'Team', icon: LayoutGrid, bg: 'hover:bg-heirlock-green' },
                        { href: '/api-status', label: 'API Status and Limits', icon: Shield, bg: 'hover:bg-heirlock-blue' },
                        { href: '/procurement', label: 'Procurement Pack', icon: BookOpen, bg: 'hover:bg-heirlock-yellow' },
                        { href: '/security', label: 'Security', icon: Shield, bg: 'hover:bg-heirlock-green' },
                        { href: '/trust-center', label: 'Trust Center', icon: Shield, bg: 'hover:bg-heirlock-blue' },
                        { href: '/roadmap', label: 'Roadmap', icon: Zap, bg: 'hover:bg-heirlock-yellow' },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Link href={item.href} onClick={closeMenu} key={idx}>
                            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg border-2 border-transparent ${item.bg} hover:text-black hover:border-black transition-all font-bold cursor-pointer bg-dark/60`}>
                              <Icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Build Column */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Build</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { href: '/docs', label: 'Developer Docs', icon: Code, bg: 'hover:bg-heirlock-green' },
                        { href: '/docs/api', label: 'API Documentation', icon: Code, bg: 'hover:bg-heirlock-blue' },
                        { href: '/docs/quickstart', label: 'API Quickstart', icon: Code, bg: 'hover:bg-heirlock-yellow' },
                        { href: '/integrations', label: 'Integrations', icon: Code, bg: 'hover:bg-heirlock-green' },
                        { href: '/smart-contracts', label: 'Smart Contracts', icon: Code, bg: 'hover:bg-heirlock-pink' },
                        { href: '/admin', label: 'Admin Upload', icon: Shield, bg: 'hover:bg-heirlock-yellow' },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Link href={item.href} onClick={closeMenu} key={idx}>
                            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg border-2 border-transparent ${item.bg} hover:text-black hover:border-black transition-all font-bold cursor-pointer bg-dark/60`}>
                              <Icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stay Updated Column */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Access</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { href: '/access-portal', label: 'Access Portal', icon: Zap, bg: 'hover:bg-heirlock-green' },
                        { href: '/blog', label: 'Blog', icon: Newspaper, bg: 'hover:bg-heirlock-pink' },
                        { href: '/changelog', label: 'Changelog', icon: Code, bg: 'hover:bg-heirlock-yellow' },
                        { href: '/contact', label: 'Contact', icon: Mail, bg: 'hover:bg-heirlock-yellow' },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Link href={item.href} onClick={closeMenu} key={idx}>
                            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg border-2 border-transparent ${item.bg} hover:text-black hover:border-black transition-all font-bold cursor-pointer bg-dark/60`}>
                              <Icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t-4 border-black bg-heirlock-yellow/70 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1 text-black">
                    <p className="text-xs font-black uppercase tracking-wide">Featured</p>
                    <h4 className="text-xl font-black leading-tight">Create a vault in two minutes</h4>
                    <p className="text-sm font-medium max-w-xl">Use the guided flow to lock files with device-side encryption and contract enforced unlocks.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/create-vault" onClick={closeMenu}>
                      <button className="px-4 py-3 bg-black text-heirlock-yellow font-black border-3 border-black rounded-lg shadow-brutal hover:-translate-y-0.5 transition-all text-sm">Start a vault</button>
                    </Link>
                    <Link href="/docs/quickstart" onClick={closeMenu}>
                      <button className="px-4 py-3 bg-white text-black font-black border-3 border-black rounded-lg hover:bg-heirlock-blue transition-all text-sm">View quickstart</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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
                      <div className="w-10 h-10 bg-gradient-to-br from-heirlock-blue to-heirlock-pink rounded-full flex items-center justify-center text-white font-bold">
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

