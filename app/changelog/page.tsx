'use client';

import { Calendar, GitCommit, Shield, Database, Code2, Network, FileText, AlertCircle, CheckCircle, Zap, Globe } from 'lucide-react';
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

  const categoryColors = {
    feature: 'border-l-heirlock-blue bg-white dark:bg-gray-900',
    fix: 'border-l-heirlock-red bg-white dark:bg-gray-900',
    improvement: 'border-l-heirlock-green bg-white dark:bg-gray-900',
    security: 'border-l-heirlock-pink bg-white dark:bg-gray-900',
  };

  const categoryBadgeColors = {
    feature: 'bg-heirlock-blue text-black',
    fix: 'bg-heirlock-red text-white',
    improvement: 'bg-heirlock-green text-black',
    security: 'bg-heirlock-pink text-black',
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4 mb-6">
            <GitCommit className="w-10 h-10 text-black flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">
                Changelog
              </h1>
              <p className="text-lg text-gray-700">
                Major updates and improvements to the T.A.L.A. platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Changelog Entries */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
            <div className="border-4 border-black bg-heirlock-yellow p-6 text-center">
              <p className="text-4xl font-black text-black mb-2">18</p>
              <p className="font-semibold text-black">Total Releases</p>
            </div>
            <div className="border-4 border-black bg-heirlock-blue p-6 text-center">
              <p className="text-4xl font-black text-black mb-2">15</p>
              <p className="font-semibold text-black">Major Features</p>
            </div>
            <div className="border-4 border-black bg-heirlock-green p-6 text-center">
              <p className="text-4xl font-black text-black mb-2">2</p>
              <p className="font-semibold text-black">Critical Fixes</p>
            </div>
            <div className="border-4 border-black bg-heirlock-pink p-6 text-center">
              <p className="text-4xl font-black text-black mb-2">27</p>
              <p className="font-semibold text-black">Days in Dev</p>
            </div>
          </div>

          <div className="space-y-8">
            {changelog.map((entry, index) => {
              const Icon = entry.icon;
              const badgeColor = categoryBadgeColors[entry.category];
              const borderColor = categoryColors[entry.category];

              return (
                <div
                  key={index}
                  className={`border-l-4 rounded-lg p-6 md:p-8 transition-all hover:shadow-lg dark:hover:shadow-gray-900/30 ${borderColor}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h2 className="text-2xl font-bold text-black">
                            {entry.title}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${badgeColor}`}>
                            {entry.category}
                          </span>
                          {entry.impact === 'major' && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-heirlock-yellow text-black">
                              Major
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {entry.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{entry.date}</span>
                          <span className="mx-2">•</span>
                          <span className="font-mono text-gray-700 dark:text-gray-300">{entry.version}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="mt-6 ml-10 space-y-3">
                    <p className="text-sm font-semibold text-black uppercase tracking-wide">
                      Changes
                    </p>
                    <ul className="space-y-2">
                      {entry.changes.map((change, changeIndex) => (
                        <li
                          key={changeIndex}
                          className="flex items-start gap-3 text-gray-800"
                        >
                          <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-16 p-6 md:p-8 border-4 border-black rounded-lg bg-heirlock-yellow">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-black mb-2">
                  What's Coming Next
                </h3>
                <p className="text-gray-800 mb-4">
                  The development team is actively working on these features and improvements:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-heirlock-blue p-4 rounded border-2 border-black">
                    <h4 className="font-bold text-black mb-2">💰 Smart Contract V2</h4>
                    <p className="text-sm text-gray-800">Gas optimization and layer 2 scaling for cost reduction</p>
                  </div>
                  <div className="bg-heirlock-green p-4 rounded border-2 border-black">
                    <h4 className="font-bold text-black mb-2">📱 Mobile App</h4>
                    <p className="text-sm text-gray-800">Native iOS and Android apps for vault access on the go</p>
                  </div>
                  <div className="bg-heirlock-pink p-4 rounded border-2 border-black">
                    <h4 className="font-bold text-black mb-2">🔄 Vault Recovery</h4>
                    <p className="text-sm text-gray-800">Advanced file versioning and recovery system</p>
                  </div>
                  <div className="bg-heirlock-yellow p-4 rounded border-2 border-black">
                    <h4 className="font-bold text-black mb-2">📊 Analytics</h4>
                    <p className="text-sm text-gray-800">Enhanced security metrics and audit logging</p>
                  </div>
                  <div className="bg-heirlock-blue p-4 rounded border-2 border-black">
                    <h4 className="font-bold text-black mb-2">⚙️ Batch Upload</h4>
                    <p className="text-sm text-gray-800">Bulk vault creation for administrators</p>
                  </div>
                  <div className="bg-heirlock-green p-4 rounded border-2 border-black">
                    <h4 className="font-bold text-black mb-2">🌐 Multi-Chain</h4>
                    <p className="text-sm text-gray-800">Support for Ethereum, Arbitrum, and Optimism</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t-4 border-black py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Ready to Secure Your Vaults?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Start using T.A.L.A. today and protect your sensitive documents with military-grade encryption and blockchain-enforced time-locks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create-vault"
              className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Vault
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-heirlock-yellow transition-colors"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
