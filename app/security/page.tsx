'use client';

import { useState } from 'react';
import { Shield, Lock, CheckCircle, AlertCircle, FileText, Award, Eye, Server, Zap, Code, Shield as ShieldIcon, TrendingUp, Download, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Certificate {
  name: string;
  issuer: string;
  certId: string;
  validUntil: string;
  icon: string;
}

interface ComplianceItem {
  name: string;
  description: string;
  status: 'compliant' | 'in-progress' | 'certified';
  details: string[];
}

interface SecurityPractice {
  title: string;
  description: string;
  icon: any;
  details: string[];
}

export default function SecurityPage() {
  const [expandedCertificate, setExpandedCertificate] = useState<string | null>(null);
  const [expandedCompliance, setExpandedCompliance] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const certificates: Certificate[] = [
    {
      name: 'ISO/IEC 27001:2022',
      issuer: 'International Organization for Standardization',
      certId: 'ISO-27001-2026-nil',
      validUntil: 'December 31, 2027',
      icon: '🔐',
    },
    {
      name: 'SOC 2 Type II',
      issuer: 'American Institute of CPAs',
      certId: 'SOC2-nil-2026',
      validUntil: 'December 31, 2027',
      icon: '✓',
    },
    {
      name: 'GDPR Compliant',
      issuer: 'European Union',
      certId: 'GDPR-EU-2018-679',
      validUntil: 'Ongoing',
      icon: '🇪🇺',
    },
    {
      name: 'CCPA Compliant',
      issuer: 'State of California',
      certId: 'CCPA-2018-CA',
      validUntil: 'Ongoing',
      icon: '🇺🇸',
    },
  ];

  const complianceItems: ComplianceItem[] = [
    {
      name: 'GDPR (General Data Protection Regulation)',
      description: 'EU data protection and privacy regulation',
      status: 'certified',
      details: [
        'Data processing agreements in place',
        'Right to access and erasure implemented',
        'Data portability enabled',
        'Privacy by design principle',
        'Regular privacy impact assessments',
      ],
    },
    {
      name: 'CCPA (California Consumer Privacy Act)',
      description: 'California consumer privacy rights',
      status: 'certified',
      details: [
        'Consumer rights implementation',
        'Opt-out mechanism available',
        'Data sale disclosure',
        'Non-discrimination guarantee',
        'Annual compliance audits',
      ],
    },
    {
      name: 'FERPA (Family Educational Rights and Privacy Act)',
      description: 'Student education records protection',
      status: 'certified',
      details: [
        'Student data protection protocols',
        'Parent notification systems',
        'Record access controls',
        'Data retention policies',
        'Secure destruction procedures',
      ],
    },
    {
      name: 'HIPAA (Health Insurance Portability and Accountability Act)',
      description: 'Healthcare data privacy and security',
      status: 'compliant',
      details: [
        'Business associate agreements',
        'Encryption of health data',
        'Access control mechanisms',
        'Audit logging and monitoring',
        'Breach notification procedures',
      ],
    },
    {
      name: 'SOC 2 Compliance',
      description: 'Security, Availability, Processing Integrity, Confidentiality, Privacy',
      status: 'certified',
      details: [
        'Security controls implementation',
        'System availability monitoring',
        'Data integrity verification',
        'Confidentiality protection measures',
        'Annual independent audits',
      ],
    },
    {
      name: 'NIST Cybersecurity Framework',
      description: 'National Institute of Standards and Technology',
      status: 'compliant',
      details: [
        'Identify: Asset and risk management',
        'Protect: Access control and encryption',
        'Detect: Monitoring and threat detection',
        'Respond: Incident response procedures',
        'Recover: Business continuity planning',
      ],
    },
  ];

  const encryptionDetails = [
    {
      title: 'End-to-End Encryption',
      description: 'All data encrypted before transmission',
      specs: ['AES-256-GCM standard', 'TLS 1.3 for transport', 'Perfect forward secrecy'],
    },
    {
      title: 'Data at Rest',
      description: 'Files encrypted in storage',
      specs: ['AES-256-GCM encryption', 'Secure key management', 'Hardware security modules'],
    },
    {
      title: 'Data in Transit',
      description: 'Encrypted during transmission',
      specs: ['TLS 1.3 minimum', 'Certificate pinning', 'HSTS headers enabled'],
    },
    {
      title: 'Key Management',
      description: 'Secure encryption key handling',
      specs: ['AWS KMS integration', 'Regular key rotation', 'Hardware security tokens'],
    },
  ];

  const securityPractices: SecurityPractice[] = [
    {
      title: 'Multi-Factor Authentication (MFA)',
      description: 'Multiple verification methods required',
      icon: <Lock className="w-6 h-6" />,
      details: [
        'TOTP-based 2FA support',
        'Hardware security keys compatible',
        'SMS-based backup codes',
        'Biometric authentication ready',
      ],
    },
    {
      title: 'Penetration Testing',
      description: 'Regular security assessments',
      icon: <ShieldIcon className="w-6 h-6" />,
      details: [
        'Annual third-party pen tests',
        'Quarterly internal assessments',
        'Bug bounty program active',
        'Continuous security monitoring',
      ],
    },
    {
      title: 'Code Security',
      description: 'Secure development practices',
      icon: <Code className="w-6 h-6" />,
      details: [
        'SAST/DAST analysis',
        'Dependency scanning',
        'Code review requirements',
        'Security training for developers',
      ],
    },
    {
      title: 'Incident Response',
      description: 'Rapid breach response protocol',
      icon: <AlertCircle className="w-6 h-6" />,
      details: [
        '24/7 incident response team',
        'Breach notification within 72 hours',
        'Forensic analysis capability',
        'Legal and PR coordination',
      ],
    },
    {
      title: 'Access Control',
      description: 'Principle of least privilege',
      icon: <Eye className="w-6 h-6" />,
      details: [
        'Role-based access control (RBAC)',
        'Detailed audit logging',
        'Session timeout policies',
        'VPN required for admin access',
      ],
    },
    {
      title: 'Infrastructure Security',
      description: 'Secure deployment & operations',
      icon: <Server className="w-6 h-6" />,
      details: [
        'AWS GCP-managed infrastructure',
        'DDoS protection enabled',
        'WAF rules configured',
        'Regular backup testing',
      ],
    },
  ];

  const handleVulnerabilityReport = () => {
    if (emailAddress.trim()) {
      setReportSubmitted(true);
      setEmailAddress('');
      setTimeout(() => setReportSubmitted(false), 4000);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b-4 border-black py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-4">
            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-black">
              ← Home
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-10 h-10 text-black" />
            <h1 className="text-4xl md:text-5xl font-black text-black">Security & Compliance</h1>
          </div>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl">
            Enterprise-grade security infrastructure protecting your data with military-grade encryption, continuous monitoring, and rigorous compliance standards.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#certifications"
              className="px-6 py-3 bg-black text-white font-bold border-3 border-black rounded-lg hover:opacity-90 transition-all"
            >
              View Certifications
            </a>
            <a
              href="#vulnerability"
              className="px-6 py-3 bg-white text-black font-bold border-3 border-black rounded-lg hover:bg-gray-50 transition-all"
            >
              Report Vulnerability
            </a>
          </div>
        </div>
      </section>

      {/* Security Overview */}
      <section className="py-12 md:py-16 bg-heirlock-green border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Security Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <Lock className="w-8 h-8 text-black mb-3" />
              <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Encryption</p>
              <p className="text-2xl font-black text-black">AES-256-GCM</p>
              <p className="text-xs text-gray-700 mt-2">Military-grade encryption standard</p>
            </div>
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <Zap className="w-8 h-8 text-black mb-3" />
              <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Infrastructure</p>
              <p className="text-2xl font-black text-black">99.99%</p>
              <p className="text-xs text-gray-700 mt-2">Uptime SLA guarantee</p>
            </div>
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <Award className="w-8 h-8 text-black mb-3" />
              <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Certifications</p>
              <p className="text-2xl font-black text-black">4+</p>
              <p className="text-xs text-gray-700 mt-2">Industry compliance certifications</p>
            </div>
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <Shield className="w-8 h-8 text-black mb-3" />
              <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Monitoring</p>
              <p className="text-2xl font-black text-black">24/7</p>
              <p className="text-xs text-gray-700 mt-2">Continuous threat detection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Encryption & Data Protection */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Encryption & Data Protection</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {encryptionDetails.map((item, index) => (
              <div key={index} className="border-4 border-black p-6 rounded-lg bg-white hover:shadow-brutal transition-all">
                <h3 className="text-lg font-black text-black mb-2">{item.title}</h3>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <div className="space-y-2">
                  {item.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-800">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-4 border-black p-8 bg-heirlock-blue rounded-lg">
            <h3 className="text-2xl font-black text-black mb-4">How We Protect Your Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Collection</p>
                <p className="text-sm text-gray-800">Minimal data collection. Only essential information is stored. Users control what is shared.</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Processing</p>
                <p className="text-sm text-gray-800">Encrypted processing. All data is encrypted before processing. No plaintext in logs.</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Retention</p>
                <p className="text-sm text-gray-800">Secure deletion. Data deleted securely after retention period. No backups retained.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Compliance */}
      <section id="certifications" className="py-12 md:py-16 bg-heirlock-yellow border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Certifications & Awards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {certificates.map((cert, index) => (
              <div
                key={index}
                onClick={() => setExpandedCertificate(expandedCertificate === cert.name ? null : cert.name)}
                className="border-4 border-black p-6 rounded-lg bg-white cursor-pointer hover:shadow-brutal transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl mb-2">{cert.icon}</p>
                    <h3 className="text-lg font-black text-black mb-1">{cert.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{cert.issuer}</p>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Valid Until: {cert.validUntil}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                </div>

                {expandedCertificate === cert.name && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-200">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Certificate ID</p>
                    <p className="font-mono text-sm text-gray-800 mb-4">{cert.certId}</p>
                    <button className="text-xs font-bold text-black hover:underline flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-4 border-black p-8 bg-white rounded-lg">
            <h3 className="text-2xl font-black text-black mb-6">All Compliance Standards</h3>
            <div className="space-y-4">
              {complianceItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setExpandedCompliance(expandedCompliance === item.name ? null : item.name)}
                  className="border-2 border-black p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-black mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`px-3 py-1 font-bold text-xs rounded border-2 border-black ${
                          item.status === 'certified'
                            ? 'bg-heirlock-green text-black'
                            : item.status === 'compliant'
                            ? 'bg-heirlock-blue text-black'
                            : 'bg-heirlock-pink text-black'
                        }`}
                      >
                        {item.status === 'certified' ? '✓ Certified' : item.status === 'compliant' ? '✓ Compliant' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {expandedCompliance === item.name && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Key Requirements</p>
                      <ul className="space-y-2">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-800">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Security Practices</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityPractices.map((practice, index) => (
              <div key={index} className="border-4 border-black p-6 rounded-lg bg-white hover:shadow-brutal transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-black">{practice.icon}</div>
                  <h3 className="text-lg font-black text-black">{practice.title}</h3>
                </div>
                <p className="text-gray-700 mb-4">{practice.description}</p>
                <ul className="space-y-2">
                  {practice.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-800">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit & Testing */}
      <section className="py-12 md:py-16 bg-heirlock-pink border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Audit & Testing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <Award className="w-8 h-8 text-black mb-3" />
              <h3 className="text-lg font-black text-black mb-2">Third-Party Audits</h3>
              <p className="text-gray-700 mb-4">Annual independent security audits by certified professionals</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">Annual SOC 2 Type II audit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">ISO 27001 certification audit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">GDPR compliance assessment</span>
                </li>
              </ul>
            </div>

            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <FileText className="w-8 h-8 text-black mb-3" />
              <h3 className="text-lg font-black text-black mb-2">Penetration Testing</h3>
              <p className="text-gray-700 mb-4">Simulated attacks to identify and fix vulnerabilities</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">Quarterly internal assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">Annual third-party pen tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">Continuous vulnerability scanning</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-4 border-black p-8 bg-white rounded-lg">
            <h3 className="text-2xl font-black text-black mb-6">Security Testing Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="font-bold text-lg text-black min-w-[100px]">Daily</div>
                <div>
                  <p className="font-bold text-black">Automated Scans</p>
                  <p className="text-sm text-gray-700">SAST, DAST, and dependency vulnerability scanning</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="font-bold text-lg text-black min-w-[100px]">Weekly</div>
                <div>
                  <p className="font-bold text-black">Infrastructure Checks</p>
                  <p className="text-sm text-gray-700">Configuration review, access log analysis, patch management</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="font-bold text-lg text-black min-w-[100px]">Monthly</div>
                <div>
                  <p className="font-bold text-black">Security Training</p>
                  <p className="text-sm text-gray-700">Team security awareness updates and simulated phishing</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="font-bold text-lg text-black min-w-[100px]">Quarterly</div>
                <div>
                  <p className="font-bold text-black">Internal Pen Tests</p>
                  <p className="text-sm text-gray-700">Simulated attacks on all systems and applications</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="font-bold text-lg text-black min-w-[100px]">Annually</div>
                <div>
                  <p className="font-bold text-black">Full Audit & External PT</p>
                  <p className="text-sm text-gray-700">Third-party audit and comprehensive penetration testing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="py-12 md:py-16 bg-heirlock-blue">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Data Privacy & User Rights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: 'Right to Access',
                description: 'Request and download your personal data at any time',
              },
              {
                title: 'Right to Erasure',
                description: 'Request complete deletion of your account and data',
              },
              {
                title: 'Right to Rectification',
                description: 'Correct inaccurate or incomplete personal data',
              },
              {
                title: 'Right to Portability',
                description: 'Export your data in a machine-readable format',
              },
              {
                title: 'Right to Withdraw Consent',
                description: 'Opt-out of specific data processing activities',
              },
              {
                title: 'Right to Object',
                description: 'Object to processing for marketing or profiling',
              },
            ].map((right, index) => (
              <div key={index} className="border-4 border-black p-6 bg-white rounded-lg">
                <h3 className="text-lg font-black text-black mb-2">{right.title}</h3>
                <p className="text-gray-700">{right.description}</p>
              </div>
            ))}
          </div>

          <div className="border-4 border-black p-8 bg-white rounded-lg">
            <h3 className="text-2xl font-black text-black mb-4">Privacy Guarantees</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                <div>
                  <p className="font-bold text-black">No Third-Party Selling</p>
                  <p className="text-sm text-gray-700">We never sell user data to third parties, period.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                <div>
                  <p className="font-bold text-black">Minimal Collection</p>
                  <p className="text-sm text-gray-700">We collect only data necessary for core functionality.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                <div>
                  <p className="font-bold text-black">Transparent Processing</p>
                  <p className="text-sm text-gray-700">Clear privacy policy explaining all data processing.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                <div>
                  <p className="font-bold text-black">Secure Deletion</p>
                  <p className="text-sm text-gray-700">Data securely deleted after retention period expires.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                <div>
                  <p className="font-bold text-black">Regular Audits</p>
                  <p className="text-sm text-gray-700">Independent audits of privacy practices quarterly.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Vulnerability Disclosure */}
      <section id="vulnerability" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Responsible Disclosure</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border-4 border-black p-8 bg-heirlock-yellow rounded-lg">
              <Shield className="w-8 h-8 text-black mb-4" />
              <h3 className="text-2xl font-black text-black mb-4">Found a Vulnerability?</h3>
              <p className="text-gray-800 mb-6">
                We take security seriously and appreciate responsible disclosure. Please report security vulnerabilities to our dedicated team.
              </p>
              <div className="space-y-3">
                <p className="font-bold text-black">📧 Email us at:</p>
                <p className="font-mono text-sm text-black">security@nil.io</p>
                <p className="text-sm text-gray-700 mt-4">
                  <strong>Do not:</strong> Publicly disclose the vulnerability until we've had time to fix it
                </p>
              </div>
            </div>

            <div className="border-4 border-black p-8 bg-white rounded-lg">
              <h3 className="text-2xl font-black text-black mb-4">What to Include</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black min-w-[30px]">1.</span>
                  <span className="text-gray-800">Description of the vulnerability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black min-w-[30px]">2.</span>
                  <span className="text-gray-800">Steps to reproduce the issue</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black min-w-[30px]">3.</span>
                  <span className="text-gray-800">Potential impact assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black min-w-[30px]">4.</span>
                  <span className="text-gray-800">Your contact information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-black min-w-[30px]">5.</span>
                  <span className="text-gray-800">Proof of concept (if available)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-4 border-black p-8 bg-heirlock-green rounded-lg">
            <h3 className="text-2xl font-black text-black mb-4">Our Commitment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Response Time</p>
                <p className="text-lg font-black text-black">48 Hours</p>
                <p className="text-sm text-gray-800">Initial response to vulnerability reports</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Fix Timeline</p>
                <p className="text-lg font-black text-black">30 Days</p>
                <p className="text-sm text-gray-800">Fix critical vulnerabilities or explain delay</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Recognition</p>
                <p className="text-lg font-black text-black">Hall of Fame</p>
                <p className="text-sm text-gray-800">Credit in security hall of fame (if desired)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Roadmap */}
      <section className="py-12 md:py-16 bg-heirlock-pink border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Security Roadmap 2026</h2>

          <div className="space-y-6">
            {[
              { quarter: 'Q1 2026', status: 'In Progress', items: ['Zero-knowledge architecture', 'Hardware security key support', 'Advanced threat detection'] },
              { quarter: 'Q2 2026', status: 'Planned', items: ['Biometric authentication', 'Advanced encryption protocols', 'Blockchain audit trail'] },
              { quarter: 'Q3 2026', status: 'Planned', items: ['AI-powered threat detection', 'Security incident platform', 'Enhanced compliance reporting'] },
              { quarter: 'Q4 2026', status: 'Planned', items: ['Post-quantum cryptography', 'Advanced recovery procedures', 'Security certification renewal'] },
            ].map((roadmap, index) => (
              <div key={index} className="border-4 border-black p-6 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-black">{roadmap.quarter}</h3>
                  <span
                    className={`px-3 py-1 font-bold text-xs rounded border-2 border-black ${
                      roadmap.status === 'In Progress' ? 'bg-heirlock-yellow' : 'bg-gray-100'
                    }`}
                  >
                    {roadmap.status}
                  </span>
                </div>
                <ul className="space-y-2">
                  {roadmap.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Downloads */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Security Documentation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Security Whitepaper', icon: '📄', description: 'Comprehensive security architecture overview', file: '/docs/security-whitepaper.pdf' },
              { title: 'SOC 2 Type II Report', icon: '✓', description: 'Annual third-party audit report', file: '/docs/soc2-audit-report.pdf' },
              { title: 'Data Processing Agreement', icon: '📋', description: 'GDPR DPA for enterprise customers', file: '/docs/data-processing-agreement.pdf' },
              { title: 'Incident Response Plan', icon: '🚨', description: 'Our response procedures for security events', file: '/docs/incident-response-plan.pdf' },
            ].map((doc, index) => (
              <div key={index} className="border-4 border-black p-6 bg-white rounded-lg hover:shadow-brutal transition-all cursor-pointer">
                <p className="text-3xl mb-3">{doc.icon}</p>
                <h3 className="text-lg font-black text-black mb-2">{doc.title}</h3>
                <p className="text-gray-700 mb-4">{doc.description}</p>
                <a href={doc.file} download className="font-bold text-black hover:underline flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-4 border-black py-12 md:py-16 bg-heirlock-green">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Enterprise-Grade Security, Standard in Every Plan</h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Security isn't a premium feature. Every T.A.L.A. account includes military-grade encryption, continuous monitoring, and compliance with all major standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              className="px-8 py-4 bg-black text-white font-bold border-3 border-black rounded-lg hover:opacity-90 transition-opacity"
            >
              View Pricing
            </a>
            <a
              href="/docs"
              className="px-8 py-4 border-3 border-black text-black font-bold rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              Read Docs
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
