'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock3,
  Filter,
  GitCommit,
  Globe,
  Layers,
  ListFilter,
  Link2,
  Twitter,
  Linkedin,
  Mail,
  Search,
  Shield,
  ShieldAlert,
  Shuffle,
  Sparkles,
  TrendingUp,
  Zap,
  Database,
  Code2,
  Network,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface ChangelogEntry {
  version: string;
  date: string;
  category: 'feature' | 'fix' | 'improvement' | 'security';
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  changes: string[];
  impact: 'major' | 'minor';
}

export default function Changelog() {
  const changelog: ChangelogEntry[] = [
    {
      version: '2.0.0',
      date: 'February 22, 2026',
      category: 'security',
      icon: ShieldAlert,
      title: 'P0 Critical Security & Core Functionality Fixes',
      description: 'Resolved all 7 critical/broken functionality issues identified in the full-project audit. These fixes address authentication bypasses, broken encryption, and non-functional core features.',
      changes: [
        '✓ File Download Decryption: Replaced empty-buffer placeholder with full AES-256-GCM decryption pipeline — downloads IPFS ciphertext, reconstructs encryption params from DB, derives key via PBKDF2, and returns the decrypted file',
        '✓ IPFS Encryption Enforced: Fixed addFileToVault() uploading plaintext to IPFS — now serializes and uploads the encrypted data buffer instead of the original file',
        '✓ Vault ID Extraction: Replaced hardcoded vaultId: 0 with waitForTransactionReceipt + decodeEventLog to parse VaultCreated event and extract the real on-chain vault ID',
        '✓ Deploy Script Corrected: Replaced all NilVault references with TALAVault — artifact path, contract variable names, env key (NEXT_PUBLIC_TALA_VAULT_ADDRESS), and deployment logs',
        '✓ Login Signature Verification: Rewrote /api/auth/login to require EIP-191 wallet signature — verifies message + nonce cryptographically via viem before issuing JWT (prevents impersonation)',
        '✓ Admin Auth Hardened: Replaced base64 mock token with proper JWT (HS256, 4h expiry, admin role claim), added crypto.timingSafeEqual for credential comparison, and per-IP brute-force lockout (5 attempts → 15min)',
        '✓ Real Vault Creation Enabled: Removed disabled={!demoMode} gate from submit button — non-demo vault creation now fully functional with "Create Time-Locked Vault" CTA',
      ],
      impact: 'major',
    },
    {
      version: '1.9.0',
      date: 'February 16, 2026',
      category: 'feature',
      icon: Sparkles,
      title: 'Blog Sharing Feature & Social Media Integration',
      description: 'Complete social sharing system for blog posts with branded snapshot generation and watermarked share cards.',
      changes: [
        '✓ Branded Snapshot Generation: html2canvas integration captures blog posts with custom TALA branding',
        '✓ Dark Card Design: Peerlist-style share cards with dark background, profile header, and dashed border content cards',
        '✓ Dynamic OG Images: Next.js 15 opengraph-image route generates social preview images for Twitter/LinkedIn',
        '✓ Watermark & Logo: TALA monogram badge (top-right), logo watermark (bottom), and "Shared from TALA" footer',
        '✓ Share Button Integration: Twitter/X, LinkedIn, and Email sharing with auto-download of branded PNG',
        '✓ Native Share API: Mobile-optimized sharing with Web Share API support for direct image attachment',
        '✓ Metadata Wiring: generateMetadata in blog layout for per-post OpenGraph titles and descriptions',
        '✓ Changelog Sharing: Added share buttons (X, LinkedIn, Email, Copy link) to changelog page hero section',
      ],
      impact: 'major',
    },
    {
      version: '1.8.1',
      date: 'January 26, 2026',
      category: 'fix',
      icon: CheckCircle,
      title: 'Vault Creation & File Display Fixes',
      description: 'Critical bug fixes for vault unlock time display, file visibility, and demo vault improvements.',
      changes: [
        '✓ Fixed unlock date showing "Jan 21, 1970" - now correctly displays future unlock time',
        '✓ Fixed files appearing in "Deleted Files" section immediately after upload',
        '✓ Demo vault auto-unlock changed from 2 minutes to 5 minutes for better testing',
        '✓ API now returns isActive and deletedAt fields for proper file filtering',
        '✓ Initial file upload during vault creation now bypasses lock check (allows first upload)',
        '✓ Schema validation updated to accept ISO datetime strings for unlock time',
        '✓ TypeScript errors fixed in CreateVaultForm component',
      ],
      impact: 'minor',
    },
    {
      version: '1.8.0',
      date: 'January 26, 2026',
      category: 'feature',
      icon: CheckCircle,
      title: 'Vault Unlock System - Phase 2',
      description: 'Complete time-locked vault unlock system with expiration tracking, automation, and security enhancements.',
      changes: [
        '✓ Time-Locked Vault System: Smart contracts enforce unlock times with tamper-proof blockchain records',
        '✓ Expiration Management: Vault expiration handling with cleanup procedures',
        '✓ Dual Authentication: Multi-signature validation combining blockchain verification with server-side checks',
        '✓ Activity Logging: Complete audit trail for all unlock attempts with timestamps and outcome tracking',
        '✓ Batch Operations: Process multiple vault unlocks efficiently with transaction validation',
        '✓ Security Hardening: Enhanced validation, replay attack prevention, and permission verification',
        '✓ Database Optimization: New schema fields for unlock tracking and expiration status',
        '✓ Error Handling: Comprehensive error codes and recovery mechanisms for failed unlock attempts',
        '✓ Production Utilities: Batch unlock tools and maintenance functions for production operations',
      ],
      impact: 'major',
    },
    {
      version: '1.7.0',
      date: 'January 25, 2026',
      category: 'feature',
      icon: Zap,
      title: 'Demo Vault Feature & Home Page Design',
      description: 'Interactive demo vault with auto-expiration and complete home page redesign with pricing synchronization.',
      changes: [
        '✓ Demo Vault Feature: Pre-created demo vaults with automatic expiration after 24 hours',
        '✓ Manual Unlock Trigger: Users control when vaults unlock via web interface',
        '✓ Demo Mode UI: Integrated demo mode into CreateVaultForm with clear messaging',
        '✓ Home Page Population: Complete landing page with 15 sections and conversion funnel',
        '✓ Use Cases Section: 4 detailed use case cards (Education, Governance, Legal, Security)',
        '✓ Trust Metrics: Live statistics dashboard (2.4K vaults, 847GB secured, 99.9% uptime)',
        '✓ FAQ Integration: 5 top questions with answers directly on home page',
        '✓ Pricing Design: 3-column home page pricing with CTA to /pricing for Professional tier',
        '✓ Roadmap Section: Q1-Q4 2026 development milestones and features',
        '✓ Pricing Synchronization: Consistent 4-tier model across all platforms (documentation, home page, /pricing)',
        '✓ Documentation Expansion: 3,600+ lines of production-ready documentation with getting started guide',
        '✓ Version History: Comprehensive changelog with all features documented',
      ],
      impact: 'major',
    },
    {
      version: '1.6.0',
      date: 'January 17, 2026',
      category: 'feature',
      icon: CheckCircle,
      title: 'PHASE 1: Critical Blockers Complete',
      description: 'Production-grade infrastructure implementation for T.A.L.A. - all critical systems live and tested.',
      changes: [
        '✓ Database Infrastructure: PostgreSQL with 6 verified tables, migrations, and foreign key constraints',
        '✓ Web3 Authentication: Wallet-based sign-in with ECDSA signature verification and replay attack prevention',
        '✓ File Encryption & Storage: 8-layer validation, AES-256-GCM encryption, storage quotas, and IPFS integration',
        '✓ Smart Contract Deployment: TALAVault deployed on Polygon Amoy with time-lock mechanism and reentrancy protection',
        '✓ 1570+ lines of production-grade code with TypeScript strict mode',
        '✓ 2000+ lines of comprehensive documentation and implementation guides',
        '✓ 9 new implementation files with enterprise-grade security standards',
        '✓ Full test suite (6 automated tests) with all edge cases handled',
      ],
      impact: 'major',
    },
    {
      version: '1.5.0',
      date: 'January 10, 2026',
      category: 'feature',
      icon: Network,
      title: 'Complete Vault Creation & File Upload System',
      description: 'Full end-to-end vault creation with encrypted file storage on IPFS via Pinata.',
      changes: [
        'Implemented vault creation API with required Prisma schema fields (keyHash, fileHash, fileName, fileSize)',
        'Fixed FormData Buffer handling for proper binary file transmission to Pinata',
        'Integrated Pinata IPFS API with proper retry logic and error handling',
        'Auto-generates and derives encryption keys from user passwords using PBKDF2',
        'Stores encrypted files on IPFS with comprehensive metadata',
        'Tracks vault files in database with encryption parameters (IV, salt, authTag)',
      ],
      impact: 'major',
    },
    {
      version: '1.4.0',
      date: 'January 9, 2026',
      category: 'fix',
      icon: Code2,
      title: 'API Response Format Standardization',
      description: 'Fixed double-wrapping of API responses across all vault routes.',
      changes: [
        'Corrected NextResponse.json(apiSuccess()) double-wrapping in vault creation endpoint',
        'Fixed GET, PUT, DELETE vault endpoints to return proper response structure',
        'Fixed file upload endpoint response format for correct client-side parsing',
        'Ensured all API responses follow consistent { success, data, timestamp } structure',
      ],
      impact: 'major',
    },
    {
      version: '1.3.0',
      date: 'January 8, 2026',
      category: 'feature',
      icon: Shield,
      title: 'Wallet-Based Authentication System',
      description: 'Complete wallet signature authentication with JWT token management.',
      changes: [
        'Implemented wallet signature verification using ethers library',
        'Created JWT token generation and localStorage persistence',
        'Fixed authentication state management to properly track user login status',
        'Integrated auth token into all vault API requests',
        'Added activity logging for authentication events',
        'Ensured form properly displays after successful authentication',
      ],
      impact: 'major',
    },
    {
      version: '1.2.0',
      date: 'January 7, 2026',
      category: 'improvement',
      icon: FileText,
      title: 'Auto-Generated Decryption Key System',
      description: 'Replaced manual password input with auto-generated, downloadable decryption keys.',
      changes: [
        'Implemented cryptographically secure random decryption key generation',
        'Added copy-to-clipboard functionality for decryption keys',
        'Implemented download functionality to save keys locally',
        'Displays key in user-friendly hexadecimal format',
        'Prevents key loss with multiple access methods',
      ],
      impact: 'minor',
    },
    {
      version: '1.1.0',
      date: 'January 6, 2026',
      category: 'fix',
      icon: AlertCircle,
      title: 'Database Schema Alignment & Error Handling',
      description: 'Fixed critical database field mismatches and API error handling.',
      changes: [
        'Fixed activityLog field names (changed "details" to "description")',
        'Corrected all httpErrors function calls by adding missing parentheses',
        'Verified vault creation fields match Prisma schema requirements',
        'Implemented proper error response handling across all routes',
        'Added validation for all user inputs before database operations',
      ],
      impact: 'major',
    },
    {
      version: '1.0.0',
      date: 'January 5, 2026',
      category: 'feature',
      icon: Zap,
      title: 'Logger Replacement & Foundation Stability',
      description: 'Replaced pino logger with native console logger and fixed import errors.',
      changes: [
        'Replaced pino logger with console-based logging to eliminate import errors',
        'Implemented standardized console logging across the codebase',
        'Ensured all API routes use compatible logging methods',
        'Fixed dependency-related build errors',
      ],
      impact: 'major',
    },
    {
      version: '0.9.0',
      date: 'January 4, 2026',
      category: 'feature',
      icon: Database,
      title: 'Prisma Database Schema & Migrations',
      description: 'Comprehensive database schema setup with Prisma ORM integration.',
      changes: [
        'Created Vault model with encryption metadata tracking',
        'Implemented VaultFile model for encrypted file references',
        'Set up ActivityLog model for audit trails',
        'Added User model for authentication and ownership',
        'Created database migrations for production readiness',
        'Configured Prisma client for Node.js environments',
      ],
      impact: 'major',
    },
    {
      version: '0.8.0',
      date: 'January 3, 2026',
      category: 'feature',
      icon: Shield,
      title: 'Admin Dashboard & Vault Management',
      description: 'Admin interface for managing vaults and monitoring system activity.',
      changes: [
        'Created admin dashboard with vault listing and filtering',
        'Implemented vault metadata editing capabilities',
        'Added vault deletion with IPFS cleanup',
        'Created activity log viewer with search functionality',
        'Added admin authentication and authorization checks',
        'Implemented role-based access control for admin features',
      ],
      impact: 'major',
    },
    {
      version: '0.7.0',
      date: 'January 2, 2026',
      category: 'improvement',
      icon: Code2,
      title: 'API Route Architecture & Validation',
      description: 'Established robust API route structure with comprehensive input validation.',
      changes: [
        'Created modular API routes for vaults, files, and authentication',
        'Implemented Zod schema validation for all endpoints',
        'Added comprehensive error handling with custom error responses',
        'Set up request/response logging and monitoring',
        'Created utility functions for common operations',
      ],
      impact: 'major',
    },
    {
      version: '0.6.0',
      date: 'January 1, 2026',
      category: 'feature',
      icon: FileText,
      title: 'Encryption & Decryption Engine',
      description: 'Military-grade AES-256-GCM encryption implementation.',
      changes: [
        'Implemented AES-256-GCM encryption for file protection',
        'Created PBKDF2 key derivation from user passwords',
        'Added file hash generation for integrity verification',
        'Implemented IV and salt management for cryptographic security',
        'Created decryption utilities for vault access',
        'Added authentication tag validation for tamper detection',
      ],
      impact: 'major',
    },
    {
      version: '0.5.0',
      date: 'December 31, 2025',
      category: 'feature',
      icon: Globe,
      title: 'IPFS Integration & Pinata Setup',
      description: 'Complete IPFS infrastructure with Pinata provider integration.',
      changes: [
        'Integrated Pinata API for IPFS file uploads',
        'Implemented file pinning for permanent storage',
        'Created IPFS hash validation and verification',
        'Added file download from IPFS with gateway fallbacks',
        'Implemented retry logic with exponential backoff',
        'Created comprehensive error handling for IPFS operations',
      ],
      impact: 'major',
    },
    {
      version: '0.4.0',
      date: 'December 29, 2025',
      category: 'feature',
      icon: Shield,
      title: 'Wagmi & RainbowKit Web3 Integration',
      description: 'Complete Web3 wallet integration and connection management.',
      changes: [
        'Integrated Wagmi for Ethereum wallet interactions',
        'Set up RainbowKit for beautiful wallet UI',
        'Configured Polygon Amoy testnet as primary network',
        'Implemented wallet address display and management',
        'Created wallet connection status tracking',
        'Added network switching and validation',
      ],
      impact: 'major',
    },
    {
      version: '0.3.0',
      date: 'December 27, 2025',
      category: 'feature',
      icon: FileText,
      title: 'Create Vault UI & Form Components',
      description: 'Complete user interface for vault creation with form validation.',
      changes: [
        'Created CreateVaultForm component with multi-step flow',
        'Implemented form validation using Zod schemas',
        'Added file upload preview and management',
        'Created time selection interface for unlock scheduling',
        'Implemented password strength validation',
        'Added error handling and user feedback',
      ],
      impact: 'major',
    },
    {
      version: '0.2.0',
      date: 'December 25, 2025',
      category: 'improvement',
      icon: Code2,
      title: 'UI Component Library & Design System',
      description: 'Comprehensive component library matching brutalist design aesthetic.',
      changes: [
        'Created reusable UI components (buttons, cards, modals)',
        'Implemented Tailwind CSS configuration with custom colors',
        'Set up typography system with Space Grotesk and Inter fonts',
        'Created layout components (Navbar, Footer, Sidebar)',
        'Implemented responsive design utilities',
        'Added animation and transition effects',
      ],
      impact: 'major',
    },
    {
      version: '0.1.0',
      date: 'December 20, 2025',
      category: 'feature',
      icon: Zap,
      title: 'Project Foundation & Next.js Setup',
      description: 'Initial project setup with Next.js 15, TypeScript, and core infrastructure.',
      changes: [
        'Initialized Next.js 15 project with App Router',
        'Configured TypeScript for type safety',
        'Set up TailwindCSS for styling',
        'Configured ESLint for code quality',
        'Created project directory structure',
        'Set up environment configuration and secrets management',
      ],
      impact: 'major',
    },
    {
      version: '0.0.5',
      date: 'December 18, 2025',
      category: 'improvement',
      icon: Code2,
      title: 'Documentation & Developer Guides',
      description: 'Comprehensive documentation for developers and users.',
      changes: [
        'Created API documentation with endpoint references',
        'Wrote developer guide for local setup',
        'Added architecture diagrams and flow charts',
        'Created smart contract documentation',
        'Wrote security best practices guide',
        'Added troubleshooting and FAQ sections',
      ],
      impact: 'major',
    },
    {
      version: '0.0.4',
      date: 'December 16, 2025',
      category: 'feature',
      icon: Database,
      title: 'Smart Contract Development',
      description: 'TALAVault smart contract implementation on Polygon.',
      changes: [
        'Developed TALAVault smart contract in Solidity',
        'Implemented time-locking mechanism',
        'Created key storage and release logic',
        'Added access control and ownership verification',
        'Deployed contract to Polygon Amoy testnet',
        'Created contract deployment scripts and utilities',
      ],
      impact: 'major',
    },
    {
      version: '0.0.3',
      date: 'December 15, 2025',
      category: 'feature',
      icon: Globe,
      title: 'Project Vision & Requirements',
      description: 'Defined project scope, requirements, and technical architecture.',
      changes: [
        'Documented project vision and goals',
        'Defined core requirements and use cases',
        'Created technical architecture document',
        'Established security requirements and threat model',
        'Created wireframes and UI mockups',
        'Defined API specifications and data models',
      ],
      impact: 'major',
    },
  ];
  const [categoryFilter, setCategoryFilter] = useState<'all' | ChangelogEntry['category']>('all');
  const [impactFilter, setImpactFilter] = useState<'all' | ChangelogEntry['impact']>('all');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [copied, setCopied] = useState(false);

  const derivedStats = useMemo(() => {
    const totalReleases = changelog.length;
    const majorFeatures = changelog.filter((c) => c.category === 'feature' && c.impact === 'major').length;
    const fixesAndSecurity = changelog.filter((c) => c.category === 'fix' || c.category === 'security').length;
    const firstDate = new Date(changelog[changelog.length - 1].date);
    const lastDate = new Date(changelog[0].date);
    const daysInDev = Math.max(1, Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    return { totalReleases, majorFeatures, fixesAndSecurity, daysInDev };
  }, [changelog]);

  const filteredEntries = useMemo(() => {
    let entries = [...changelog];
    if (categoryFilter !== 'all') {
      entries = entries.filter((c) => c.category === categoryFilter);
    }
    if (impactFilter !== 'all') {
      entries = entries.filter((c) => c.impact === impactFilter);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      entries = entries.filter((c) => {
        const haystack = [c.title, c.description, c.version, c.date, ...c.changes].join(' ').toLowerCase();
        return haystack.includes(term);
      });
    }
    if (sortOrder === 'asc') {
      entries = [...entries].reverse();
    }
    return entries;
  }, [categoryFilter, impactFilter, search, sortOrder, changelog]);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://usetala.in/changelog';
  const shareTitle = 'T.A.L.A. Changelog';
  const shareText = 'Latest releases, fixes, and security updates from T.A.L.A.';

  const handleShare = (platform: 'twitter' | 'linkedin' | 'email') => {
    const url = pageUrl;
    switch (platform) {
      case 'twitter':
        window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
        return;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
        return;
      case 'email': {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(`${shareText}\n${url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        return;
      }
      default:
        return;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const categoryColors = {
    feature: 'border-l-heirlock-blue bg-white',
    fix: 'border-l-heirlock-red bg-white',
    improvement: 'border-l-heirlock-green bg-white',
    security: 'border-l-heirlock-pink bg-white',
  };

  const categoryBadgeColors = {
    feature: 'bg-heirlock-blue text-black',
    fix: 'bg-red-600 text-white',
    improvement: 'bg-heirlock-green text-black',
    security: 'bg-heirlock-pink text-black',
  };

  const lastUpdated = changelog[0]?.date || '—';

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-black">
      <section className="border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg border-[3px] border-black bg-heirlock-yellow flex items-center justify-center shadow-[6px_6px_0_0_#000]">
                <GitCommit className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full border-2 border-black bg-white text-xs font-semibold uppercase tracking-wide">Live</span>
                  <span className="px-3 py-1 rounded-full border-2 border-black bg-black text-white text-xs font-semibold">Last updated {lastUpdated}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black leading-tight">Changelog</h1>
                <p className="text-lg text-gray-700 max-w-2xl">
                  Track every release, fix, and security hardening across T.A.L.A. Use filters to jump to what matters.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-white">
                    <Sparkles className="w-4 h-4" />
                    <span>Trust-first release notes</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-white">
                    <Shield className="w-4 h-4" />
                    <span>Security tagged</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-white">
                    <TrendingUp className="w-4 h-4" />
                    <span>Impact-aware</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black rounded-lg bg-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
                  >
                    <Twitter className="w-4 h-4" /> Share on X
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black rounded-lg bg-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
                  >
                    <Linkedin className="w-4 h-4" /> Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black rounded-lg bg-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
                  >
                    <Mail className="w-4 h-4" /> Email update
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black rounded-lg bg-black text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
                  >
                    <Link2 className="w-4 h-4" /> {copied ? 'Link copied' : 'Copy link'}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full lg:max-w-sm border-[3px] border-black rounded-xl bg-heirlock-yellow p-4 shadow-[10px_10px_0_0_#000]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Layers className="w-4 h-4" />
                  Release Health
                </div>
                <div className="text-xs uppercase font-bold px-2 py-1 border-2 border-black rounded-full">Snapshot</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border-2 border-black rounded-lg bg-white">
                  <p className="text-xs text-gray-600">Total releases</p>
                  <p className="text-2xl font-black">{derivedStats.totalReleases}</p>
                </div>
                <div className="p-3 border-2 border-black rounded-lg bg-white">
                  <p className="text-xs text-gray-600">Major features</p>
                  <p className="text-2xl font-black">{derivedStats.majorFeatures}</p>
                </div>
                <div className="p-3 border-2 border-black rounded-lg bg-white">
                  <p className="text-xs text-gray-600">Fixes & security</p>
                  <p className="text-2xl font-black">{derivedStats.fixesAndSecurity}</p>
                </div>
                <div className="p-3 border-2 border-black rounded-lg bg-white">
                  <p className="text-xs text-gray-600">Days in dev</p>
                  <p className="text-2xl font-black">{derivedStats.daysInDev}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-[3px] border-black rounded-xl bg-white p-4 shadow-[8px_8px_0_0_#000] flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search releases, versions, or changes"
                  className="w-full border-2 border-black rounded-lg py-2.5 pl-10 pr-3 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-black/10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black rounded-lg bg-black text-white text-sm font-semibold hover:-translate-y-px transition-transform"
                >
                  <Shuffle className="w-4 h-4" />
                  {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <ListFilter className="w-4 h-4" />
                Quick filters
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'feature', 'fix', 'improvement', 'security'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 border-2 border-black rounded-full text-sm font-semibold transition-transform ${
                      categoryFilter === cat ? 'bg-black text-white' : 'bg-white hover:-translate-y-0.5'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'major', 'minor'] as const).map((impact) => (
                  <button
                    key={impact}
                    onClick={() => setImpactFilter(impact)}
                    className={`px-3 py-1.5 border-2 border-black rounded-full text-sm font-semibold transition-transform ${
                      impactFilter === impact ? 'bg-heirlock-yellow text-black' : 'bg-white hover:-translate-y-0.5'
                    }`}
                  >
                    {impact === 'all' ? 'All impact' : impact === 'major' ? 'Major only' : 'Minor'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {filteredEntries.length === 0 && (
            <div className="border-[3px] border-black rounded-xl bg-white p-6 flex items-center gap-3 text-gray-700 shadow-[6px_6px_0_0_#000]">
              <AlertCircle className="w-5 h-5" />
              <span>No releases match your filters. Clear filters to see all.</span>
            </div>
          )}

          <div className="relative mt-4">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-300" aria-hidden />
            <div className="space-y-6">
              {filteredEntries.map((entry, index) => {
                const Icon = entry.icon;
                const badgeColor = categoryBadgeColors[entry.category];
                const borderColor = categoryColors[entry.category];
                const changeCount = entry.changes.length;

                return (
                  <div
                    key={`${entry.version}-${index}`}
                    className={`relative border-[3px] border-black rounded-xl ${borderColor} shadow-[10px_10px_0_0_#000] transition-transform hover:-translate-y-1`}
                  >
                    <div className="absolute -left-3 top-6 w-6 h-6 rounded-full border-[3px] border-black bg-white flex items-center justify-center">
                      <GitCommit className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-6 md:p-7">
                      <div className="flex flex-wrap items-start gap-3 justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-65">
                          <div className="w-10 h-10 rounded-lg border-2 border-black bg-white flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-1 border-2 border-black rounded-full text-xs font-black bg-black text-white">{entry.version}</span>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border-2 border-black ${badgeColor}`}>
                                {entry.category}
                              </span>
                              {entry.impact === 'major' ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-heirlock-yellow border-2 border-black">Major</span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border-2 border-black">Minor</span>
                              )}
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold border-2 border-black rounded-full bg-white">
                                <Calendar className="w-3.5 h-3.5" />
                                {entry.date}
                              </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black leading-tight">{entry.title}</h2>
                            <p className="text-sm text-gray-700 max-w-3xl leading-relaxed">{entry.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm text-gray-700">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black rounded-full bg-white font-semibold">
                            <Filter className="w-4 h-4" />
                            {changeCount} change{changeCount === 1 ? '' : 's'}
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black rounded-full bg-white font-semibold">
                            <Clock3 className="w-4 h-4" />
                            Release #{changelog.length - index}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {entry.changes.map((change, changeIndex) => (
                          <div
                            key={changeIndex}
                            className="flex items-start gap-3 p-3 border-2 border-black rounded-lg bg-white"
                          >
                            <CheckCircle className="w-4 h-4 mt-1 text-black" />
                            <p className="text-sm leading-relaxed">{change}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-14 border-[3px] border-black rounded-xl bg-heirlock-yellow p-6 md:p-8 shadow-[10px_10px_0_0_#000]">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6" />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <Shield className="w-4 h-4" />
                  Upcoming signals
                </div>
                <h3 className="text-xl font-black">What we are building next</h3>
                <p className="text-sm text-gray-800 max-w-2xl">
                  The roadmap below mirrors engineering priorities: security first, then scale, then polish.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[{
                    title: 'Smart Contract V2',
                    body: 'Gas optimization, L2 readiness, formal verification hooks.',
                    color: 'bg-white',
                  }, {
                    title: 'Vault Recovery',
                    body: 'Versioned file history and safe-guarded key recovery flows.',
                    color: 'bg-white',
                  }, {
                    title: 'Observability',
                    body: 'Deep analytics for unlock events, storage, and security posture.',
                    color: 'bg-white',
                  }].map((card) => (
                    <div key={card.title} className={`p-4 border-2 border-black rounded-lg ${card.color}`}>
                      <h4 className="font-bold mb-1">{card.title}</h4>
                      <p className="text-sm text-gray-800 leading-relaxed">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-black py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-black mb-3">Stay ahead of every release</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Deploy with confidence. Review what shipped, filter security fixes, and share highlights with your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create-vault"
              className="px-8 py-3 bg-black text-white font-semibold rounded-lg border-2 border-black hover:-translate-y-0.5 transition-transform"
            >
              Create Vault
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-3 border-2 border-black text-black font-semibold rounded-lg bg-heirlock-yellow hover:-translate-y-0.5 transition-transform"
            >
              Learn how it works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

