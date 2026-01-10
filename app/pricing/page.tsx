'use client';

import { CheckCircle, Lock, Upload, Users, BarChart3, Shield, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
  features: string[];
  highlighted?: boolean;
}

export default function PricingPage() {
  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: 4999,
      description: 'Perfect for individuals and small teams getting started with vault protection.',
      color: 'bg-heirlock-blue',
      icon: Lock,
      features: [
        'Up to 5 vaults',
        'Up to 100MB per vault',
        'Basic encryption (AES-256)',
        'Community support',
        'Single user account',
        'Standard IPFS storage',
        'Monthly reports',
      ],
    },
    {
      name: 'Professional',
      price: 14999,
      description: 'Ideal for institutions and organizations with moderate vault needs.',
      color: 'bg-heirlock-yellow',
      icon: Shield,
      highlighted: true,
      features: [
        'Unlimited vaults',
        'Up to 1GB per vault',
        'Military-grade encryption (AES-256-GCM)',
        'Priority email support',
        'Up to 10 team members',
        'Advanced IPFS pinning',
        'Weekly analytics reports',
        'Custom unlock schedules',
        'Audit logs',
        'API access',
      ],
    },
    {
      name: 'Enterprise',
      price: 49999,
      description: 'Complete solution for large-scale operations with advanced security needs.',
      color: 'bg-heirlock-green',
      icon: Zap,
      features: [
        'Unlimited everything',
        'Unlimited storage',
        'Enterprise-grade encryption',
        'Dedicated 24/7 support',
        'Unlimited team members',
        'Premium IPFS infrastructure',
        'Real-time analytics dashboard',
        'Batch vault creation',
        'Advanced access controls',
        'Full API with webhooks',
        'Custom integrations',
        'SLA guarantee',
        'Multi-chain support',
        'Security audits',
      ],
    },
    {
      name: 'Government',
      price: 99999,
      description: 'Tailored for government agencies and critical infrastructure protection.',
      color: 'bg-heirlock-pink',
      icon: BarChart3,
      features: [
        'Unlimited everything',
        'Dedicated infrastructure',
        'Compliance certifications (ISO 27001, SOC 2)',
        'On-premise deployment option',
        'Dedicated account manager',
        'White-label solutions',
        'Custom compliance reports',
        'Advanced threat detection',
        'Multi-signature approvals',
        'Blockchain audit trails',
        'Custom encryption standards',
        'Zero-knowledge proofs',
        'Annual security assessments',
        'Political incident response team',
      ],
    },
  ];

  const comparisonFeatures = [
    {
      feature: 'Number of Vaults',
      starter: '5',
      professional: 'Unlimited',
      enterprise: 'Unlimited',
      government: 'Unlimited',
    },
    {
      feature: 'Storage per Vault',
      starter: '100 MB',
      professional: '1 GB',
      enterprise: 'Unlimited',
      government: 'Unlimited',
    },
    {
      feature: 'Team Members',
      starter: '1',
      professional: '10',
      enterprise: 'Unlimited',
      government: 'Unlimited',
    },
    {
      feature: 'Support Level',
      starter: 'Community',
      professional: 'Priority Email',
      enterprise: '24/7 Phone',
      government: 'Dedicated',
    },
    {
      feature: 'API Access',
      starter: false,
      professional: true,
      enterprise: true,
      government: true,
    },
    {
      feature: 'Batch Operations',
      starter: false,
      professional: false,
      enterprise: true,
      government: true,
    },
    {
      feature: 'SLA Guarantee',
      starter: false,
      professional: false,
      enterprise: true,
      government: true,
    },
    {
      feature: 'White Label',
      starter: false,
      professional: false,
      enterprise: false,
      government: true,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b-4 border-black py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Choose the perfect plan for your vault protection needs. All plans include military-grade encryption and blockchain-verified security.
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-lg font-bold text-black">Pay Monthly</span>
            <div className="w-12 h-8 bg-heirlock-yellow border-2 border-black rounded-full flex items-center">
              <div className="w-6 h-6 bg-black rounded-full ml-1"></div>
            </div>
            <span className="text-lg font-bold text-gray-500">Pay Yearly (Save 20%)</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div
                  key={index}
                  className={`border-4 border-black rounded-lg p-8 relative transition-all hover:shadow-brutal ${
                    tier.highlighted
                      ? `${tier.color} transform scale-105 shadow-brutal`
                      : 'bg-white hover:shadow-brutal'
                  }`}
                >
                  {/* Highlighted Badge */}
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-black">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Icon */}
                  <Icon className="w-8 h-8 text-black mb-4" />

                  {/* Tier Name */}
                  <h3 className="text-2xl font-black text-black mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-6">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-black">
                        ₹{tier.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-700 font-medium">/month</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Billed monthly. No credit card required.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-gray-400 text-white border-3 border-black rounded-lg font-bold cursor-not-allowed opacity-70 mb-8 flex items-center justify-center gap-2"
                  >
                    Coming Soon
                  </button>

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-black uppercase tracking-widest">
                      Includes:
                    </p>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-24 bg-heirlock-yellow border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-12">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-4 border-black">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left font-black border-r-2 border-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center font-black border-r-2 border-white">
                    Starter
                  </th>
                  <th className="px-6 py-4 text-center font-black border-r-2 border-white">
                    Professional
                  </th>
                  <th className="px-6 py-4 text-center font-black border-r-2 border-white">
                    Enterprise
                  </th>
                  <th className="px-6 py-4 text-center font-black">
                    Government
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-b-2 border-black ${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-black border-r-2 border-black">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center border-r-2 border-black">
                      {typeof row.starter === 'string' ? (
                        <span className="text-gray-800">{row.starter}</span>
                      ) : row.starter ? (
                        <CheckCircle className="w-5 h-5 text-black mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center border-r-2 border-black">
                      {typeof row.professional === 'string' ? (
                        <span className="text-gray-800">{row.professional}</span>
                      ) : row.professional ? (
                        <CheckCircle className="w-5 h-5 text-black mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center border-r-2 border-black">
                      {typeof row.enterprise === 'string' ? (
                        <span className="text-gray-800">{row.enterprise}</span>
                      ) : row.enterprise ? (
                        <CheckCircle className="w-5 h-5 text-black mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.government === 'string' ? (
                        <span className="text-gray-800">{row.government}</span>
                      ) : row.government ? (
                        <CheckCircle className="w-5 h-5 text-black mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Yes, you can change your plan at any time. Changes take effect at your next billing cycle. If you upgrade, you will be prorated for the difference.',
              },
              {
                question: 'Do you offer discounts for annual billing?',
                answer: 'Yes! We offer a 20% discount when you pay annually. That is a savings of 2.4 months of service.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Coming soon! Once our billing system launches, all new users will get a 14-day free trial on any plan.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We will accept UPI, Credit Card, Debit Card, and Bank Transfer. All payments are secure and encrypted.',
              },
              {
                question: 'Can I get a custom plan?',
                answer: 'For organizations with unique requirements, we offer custom plans. Contact our sales team at sales@tala.io to discuss your needs.',
              },
              {
                question: 'What happens if I exceed my storage limit?',
                answer: 'You will be notified when you reach 80% of your limit. You can then upgrade your plan or delete old vaults. No automatic overage charges.',
              },
            ].map((faq, index) => (
              <div key={index} className="border-4 border-black p-6 rounded-lg hover:shadow-brutal transition-all">
                <h3 className="text-lg font-black text-black mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-4 border-black py-16 md:py-24 bg-heirlock-blue">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
            Ready to Secure Your Vaults?
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Choose a plan and start protecting your sensitive documents with military-grade encryption today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-black text-white font-bold border-3 border-black rounded-lg hover:opacity-90 transition-opacity cursor-not-allowed opacity-70">
              Coming Soon
            </button>
            <Link
              href="/contact"
              className="px-8 py-4 border-3 border-black text-black font-bold rounded-lg bg-white hover:bg-heirlock-yellow transition-colors flex items-center justify-center gap-2"
            >
              Contact Sales
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
