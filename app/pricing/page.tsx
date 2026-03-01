'use client';

import { CheckCircle, Lock, BarChart3, Shield, Zap, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RazorpayButton } from '@/app/components/RazorpayCheckout';
import type { PlanTier, BillingInterval } from '@/lib/payments/types';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
  features: string[];
  highlighted?: boolean;
  /** Corresponding PlanTier key; null means contact-sales only */
  planTierKey: PlanTier | null;
  contactSales?: boolean;
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [activatedPlan, setActivatedPlan] = useState<PlanTier | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handlePaymentSuccess = useCallback(
    (planTier: PlanTier) => (data: { planTier: PlanTier; planExpiresAt: string }) => {
      setActivatedPlan(data.planTier);
      // Redirect to dashboard after a short celebration delay
      setTimeout(() => router.push('/dashboard?upgrade=success'), 2000);
    },
    [router],
  );

  const billingInterval: BillingInterval = isYearly ? 'YEARLY' : 'MONTHLY';

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: 99,
      description: 'Perfect for individuals getting started with vault protection.',
      color: 'bg-heirlock-blue',
      icon: Lock,
      planTierKey: 'STARTER' as PlanTier,
      features: [
        'Up to 99 vaults',
        'Up to 500MB per vault',
        'Basic encryption (AES-256)',
        'Community support',
        'Single user account',
        'Standard IPFS storage',
        'Monthly reports',
      ],
    },
    {
      name: 'Professional',
      price: 499,
      description: 'Ideal for institutions and organizations with moderate vault needs.',
      color: 'bg-heirlock-yellow',
      icon: Shield,
      highlighted: true,
      planTierKey: 'PROFESSIONAL' as PlanTier,
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
      price: 999,
      description: 'Complete solution for large-scale operations with advanced security needs.',
      color: 'bg-heirlock-green',
      icon: Zap,
      planTierKey: 'ENTERPRISE' as PlanTier,
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
      price: 9999,
      description: 'Tailored for government agencies and critical infrastructure protection.',
      color: 'bg-heirlock-pink',
      icon: BarChart3,
      planTierKey: null,
      contactSales: true,
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
      starter: '99',
      professional: 'Unlimited',
      enterprise: 'Unlimited',
      government: 'Unlimited',
    },
    {
      feature: 'Storage per Vault',
      starter: '500 MB',
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
            <span className={`text-lg font-bold ${!isYearly ? 'text-black' : 'text-gray-500'}`}>Pay Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-8 bg-heirlock-yellow border-2 border-black rounded-full flex items-center cursor-pointer transition-all"
            >
              <div className={`w-6 h-6 bg-black rounded-full transition-all ${isYearly ? 'ml-5' : 'ml-1'}`}></div>
            </button>
            <span className={`text-lg font-bold ${isYearly ? 'text-black' : 'text-gray-500'}`}>Pay Yearly (Save 20%)</span>
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
                  className={`border-4 border-black rounded-lg p-8 relative transition-all ${
                    tier.highlighted
                      ? `${tier.color} transform scale-105 shadow-brutal`
                      : `${tier.color} hover:shadow-brutal`
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
                        ₹{isYearly ? Math.round(tier.price * 12 * 0.8).toLocaleString('en-IN') : tier.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-700 font-medium">/{isYearly ? 'year' : 'month'}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {isYearly ? 'Billed annually. Save 20%!' : 'Billed monthly. No credit card required.'}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-8">
                    {tier.contactSales ? (
                      <Link
                        href="/contact"
                        className="w-full px-4 py-3 bg-black text-white border-2 border-black rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                      >
                        Contact Sales
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    ) : !session ? (
                      <Link
                        href={`/auth/login?redirect=/pricing`}
                        className="w-full px-4 py-3 bg-black text-white border-2 border-black rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                      >
                        Sign in to Subscribe
                      </Link>
                    ) : activatedPlan === tier.planTierKey ? (
                      <div className="w-full px-4 py-3 bg-green-400 text-black border-2 border-black rounded-lg font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Plan Activated!
                      </div>
                    ) : (
                      <RazorpayButton
                        planTier={tier.planTierKey!}
                        billingInterval={billingInterval}
                        label={`Get ${tier.name}`}
                        onSuccess={handlePaymentSuccess(tier.planTierKey!)}
                      />
                    )}
                  </div>

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
                answer: 'Yes! All new users start on a 14-day free trial. No credit card required for the trial period.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept UPI, Credit Card, Debit Card, Net Banking, and Wallets via Razorpay — India\'s most trusted payment gateway. All payments are fully encrypted and PCI-DSS compliant.',
              },
              {
                question: 'Can I get a custom plan?',
                answer: 'For organizations with unique requirements, we offer custom plans. Contact our team at support@usetala.in to discuss your needs.',
              },
              {
                question: 'What happens if I exceed my storage limit?',
                answer: 'You will be notified when you reach 80% of your limit. You can then upgrade your plan or delete old vaults. No automatic overage charges.',
              },
              {
                question: 'How is my data encrypted and stored?',
                answer: 'All vaults use military-grade AES-256 encryption. Your data is encrypted on your device before being sent to our servers. We use IPFS for decentralized storage, ensuring your data is secure and immutable.',
              },
              {
                question: 'Can I export my vaults?',
                answer: 'Yes! You can export your vaults anytime in encrypted format. The Professional plan and above also support bulk export operations for batch vault management.',
              },
              {
                question: 'What happens if I delete a vault?',
                answer: 'Deleted vaults are moved to trash for 30 days. You can restore them within this period. After 30 days, they are permanently deleted from all servers.',
              },
              {
                question: 'Is T.A.L.A. compliant with international regulations?',
                answer: 'Yes, our Enterprise and Government plans comply with ISO 27001, SOC 2, GDPR, and other international data protection standards. Contact us for specific compliance requirements.',
              },
              {
                question: 'Can I invite team members to access my vaults?',
                answer: 'The Professional plan includes up to 10 team members, Enterprise supports unlimited team members. You can set granular permissions for each member (view-only, edit, admin).',
              },
              {
                question: 'What is included in the API access?',
                answer: 'API access allows you to programmatically create, manage, and retrieve vaults. The Professional plan includes up to 1,000 API calls/month. Enterprise includes unlimited API calls with webhook support.',
              },
              {
                question: 'Do you offer white-label solutions?',
                answer: 'Yes! White-label solutions are available on our Government and custom Enterprise plans. You can customize branding, colors, and domain.',
              },
              {
                question: 'What is your uptime guarantee?',
                answer: 'Enterprise plans come with 99.9% uptime SLA. Government plans include 99.99% uptime guarantee with dedicated infrastructure.',
              },
              {
                question: 'Can I use T.A.L.A. for business purposes?',
                answer: 'Absolutely! T.A.L.A. is designed for businesses, educational institutions, government agencies, and legal firms. Choose a plan that matches your needs.',
              },
              {
                question: 'What support options are available?',
                answer: 'Starter: Community forum. Professional: Priority email support. Enterprise: 24/7 phone and email. Government: Dedicated account manager with 24/7 phone support.',
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
            <Link
              href={session ? '/dashboard' : '/auth/login?redirect=/pricing'}
              className="px-8 py-4 bg-black text-white font-bold border-2 border-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {session ? 'Go to Dashboard' : 'Get Started Free'}
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-black text-black font-bold rounded-lg bg-white hover:bg-heirlock-yellow transition-colors flex items-center justify-center gap-2"
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

