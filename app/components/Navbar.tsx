'use client';

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, BookOpen, Zap, Code, Shield, HelpCircle, Newspaper, LayoutGrid, Mail, LogOut } from "lucide-react";
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
    if (isActive("/admin")) return "bg-heirlock-pink";
    if (isActive("/student")) return "bg-heirlock-green";
    if (isActive("/create-vault")) return "bg-gradient-to-r from-heirlock-blue to-heirlock-green";
    if (isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")) return "bg-heirlock-green";
    if (isActive("/dashboard")) return "bg-heirlock-pink";
    return "bg-heirlock-yellow";
  };

  const getNavTextColor = () => (isScrolled ? "text-white" : "text-black");

  const getBadgeColor = () => {
    if (isScrolled) return "bg-heirlock-yellow text-black border-2 border-heirlock-yellow group-hover:text-black group-hover:bg-heirlock-yellow";
    if (isActive("/")) return "bg-heirlock-yellow text-black border-4 border-heirlock-yellow group-hover:text-black";
    if (isActive("/about")) return "bg-heirlock-green text-black border-4 border-heirlock-green group-hover:text-black";
    if (isActive("/how-it-works")) return "bg-heirlock-blue text-black border-4 border-heirlock-blue group-hover:text-black";
    if (isActive("/admin")) return "bg-heirlock-pink text-black border-4 border-heirlock-pink group-hover:text-black";
    if (isActive("/student")) return "bg-heirlock-green text-black border-4 border-heirlock-green group-hover:text-black";
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
            <div className="relative group/resources">
              <button className={`px-4 lg:px-6 py-2 text-sm lg:text-base font-bold transition-all border-b-4 flex items-center gap-2 ${
                isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")
                  ? isScrolled ? "border-heirlock-pink text-white" : "border-black"
                  : isScrolled ? "border-transparent hover:bg-heirlock-pink hover:text-black" : "border-transparent group-hover:text-white"
              }`}>
                Resources
                <ChevronDown className="w-4 h-4 group-hover/resources:rotate-180 transition-transform" />
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-[90vw] max-w-4xl bg-black text-white border-4 border-black shadow-brutal opacity-0 invisible group-hover/resources:opacity-100 group-hover/resources:visible transition-all duration-200 z-50">
                <div className="grid grid-cols-3 gap-8 p-8">
                  {/* Learn Column */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Learn</h3>
                    <div className="space-y-3">
                      <Link href="/documentation" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-green hover:text-black transition-all font-bold cursor-pointer">
                          <BookOpen className="w-5 h-5" />
                          <span>Documentation</span>
                        </div>
                      </Link>
                      <Link href="/how-it-works" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-blue hover:text-black transition-all font-bold cursor-pointer">
                          <Zap className="w-5 h-5" />
                          <span>How It Works</span>
                        </div>
                      </Link>
                      <Link href="/faq" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-yellow hover:text-black transition-all font-bold cursor-pointer">
                          <HelpCircle className="w-5 h-5" />
                          <span>FAQ</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Build Column */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Build</h3>
                    <div className="space-y-3">
                      <Link href="/docs" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-500 hover:text-black transition-all font-bold cursor-pointer">
                          <Code className="w-5 h-5" />
                          <span>Developer Docs</span>
                        </div>
                      </Link>
                      <Link href="/smart-contracts" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-blue hover:text-black transition-all font-bold cursor-pointer">
                          <Code className="w-5 h-5" />
                          <span>Smart Contracts</span>
                        </div>
                      </Link>
                      <Link href="/admin" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-pink hover:text-black transition-all font-bold cursor-pointer">
                          <Shield className="w-5 h-5" />
                          <span>Admin Upload</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Stay Updated Column */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Access</h3>
                    <div className="space-y-3">
                      <Link href="/student" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-green hover:text-black transition-all font-bold cursor-pointer">
                          <Zap className="w-5 h-5" />
                          <span>Student Download</span>
                        </div>
                      </Link>
                      <Link href="/blog" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-pink hover:text-black transition-all font-bold cursor-pointer">
                          <Newspaper className="w-5 h-5" />
                          <span>Blog</span>
                        </div>
                      </Link>
                      <Link href="/contact" onClick={closeMenu}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-heirlock-yellow hover:text-black transition-all font-bold cursor-pointer">
                          <Mail className="w-5 h-5" />
                          <span>Contact</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Featured Guide Section */}
                <div className="border-t-4 border-black p-8 bg-heirlock-yellow bg-opacity-50">
                  <div className="grid grid-cols-2 gap-6 items-center">
                    <div>
                      <h4 className="text-sm font-bold text-black mb-2">Get Started</h4>
                      <h3 className="text-xl font-bold mb-3 leading-tight text-black">Secure Your Exams Today</h3>
                      <p className="text-sm text-black  mb-4">Create your first vault and start protecting exam papers in just 2 minutes.</p>
                      <Link href="/create-vault" onClick={closeMenu}>
                        <button className="px-4 py-2 bg-heirlock-green text-black font-bold border-2 border-black rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm">
                          Create Vault →
                        </button>
                      </Link>
                    </div>
                    <div className="bg-heirlock-pink rounded-3xl border-4 border-black h-40 flex items-center justify-center hover:shadow-brutal transition-all">
                      <Image src="/404.png" alt="Hero Image" width={200} height={200} />
                    </div>
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
                }`}>🔒 CREATE VAULT</button>
              </Link>

              <Link href="/dashboard" onClick={closeMenu}>
                <button className={`w-full px-3 py-3 text-sm font-bold border-4 shadow-brutal transition-all ${
                  isActive("/dashboard") 
                    ? (isScrolled ? "bg-heirlock-blue text-white border-black" : "bg-black text-heirlock-blue border-black") 
                    : (isScrolled ? "bg-heirlock-blue text-white border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "bg-black text-white border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none")
                }`}>📊 DASHBOARD</button>
              </Link>

              <div className="border-2 border-current opacity-30 my-1"></div>

              {/* Main Navigation */}
              <Link href="/how-it-works" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/how-it-works")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-heirlock-yellow" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-heirlock-yellow hover:text-black hover:border-l-heirlock-yellow" : "text-black hover:bg-heirlock-yellow hover:text-black hover:border-l-black"
                }`}>⚡ How It Works</button>
              </Link>

              <Link href="/about" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/about")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-heirlock-green" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-heirlock-green hover:text-black hover:border-l-heirlock-green" : "text-black hover:bg-heirlock-green hover:text-black hover:border-l-black"
                }`}>ℹ️ About</button>
              </Link>

              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 flex justify-between items-center ${
                  isActive("/documentation") || isActive("/smart-contracts") || isActive("/faq") || isActive("/blog")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-heirlock-pink" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-heirlock-pink hover:text-black hover:border-l-heirlock-pink" : "text-black hover:bg-heirlock-pink hover:text-black hover:border-l-black"
                }`}
              >
                📚 Resources
                <ChevronDown className={`w-3 h-3 transition-transform ${isResourcesOpen ? "rotate-180" : ""}`} />
              </button>

              {isResourcesOpen && (
                <div className="space-y-1 pl-3">
                  <Link href="/documentation" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-yellow hover:text-black transition-all border-l-2 border-heirlock-yellow">📖 Docs</button>
                  </Link>
                  <Link href="/smart-contracts" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-blue hover:text-black transition-all border-l-2 border-heirlock-blue">⚙️ Smart Contracts</button>
                  </Link>
                  <Link href="/faq" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-green hover:text-black transition-all border-l-2 border-heirlock-green">❓ FAQ</button>
                  </Link>
                  <Link href="/admin" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-pink hover:text-black transition-all border-l-2 border-heirlock-pink">🔐 Admin Upload</button>
                  </Link>
                  <Link href="/student" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-green hover:text-black transition-all border-l-2 border-heirlock-green">📥 Student Download</button>
                  </Link>
                  <Link href="/blog" onClick={closeMenu}>
                    <button className="w-full text-left px-3 py-2 text-xs font-bold bg-black text-white hover:bg-heirlock-pink hover:text-black transition-all border-l-2 border-heirlock-pink">📰 Blog</button>
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
                }`}>✉️ Contact</button>
              </Link>

              <Link href="/terms" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/terms")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-gray-500" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-gray-700 hover:text-white hover:border-l-gray-500" : "text-black hover:bg-gray-200 hover:text-black hover:border-l-black"
                }`}>📋 Terms</button>
              </Link>

              <Link href="/privacy" onClick={closeMenu}>
                <button className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border-l-4 ${
                  isActive("/privacy")
                    ? isScrolled ? "text-white bg-black bg-opacity-20 border-l-gray-500" : "text-black bg-black bg-opacity-10 border-l-black"
                    : isScrolled ? "text-white hover:bg-gray-700 hover:text-white hover:border-l-gray-500" : "text-black hover:bg-gray-200 hover:text-black hover:border-l-black"
                }`}>🔐 Privacy</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
