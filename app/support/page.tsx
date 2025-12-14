import { Mail, MessageSquare, Clock, Zap, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | T.A.L.A.',
  description: 'Get help and support from the T.A.L.A. team. FAQ, documentation, and contact options.',
};

export default function Support() {
  const faqItems = [
    {
      question: 'How do I create a vault?',
      answer: 'Navigate to the "Create Vault" section, set your unlock date, add your content, and deploy to the blockchain. The process takes just a few minutes.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use AES-256-GCM encryption, non-custodial architecture, and IPFS for distributed storage. You maintain full control of your encryption keys.',
    },
    {
      question: 'What happens if I lose my wallet?',
      answer: 'You can recover your vault using your wallet recovery phrases. Always backup your seed phrase in a secure location.',
    },
    {
      question: 'Can I modify a vault after creation?',
      answer: 'Vaults are immutable by design for security. You can create a new vault with updated content if needed.',
    },
    {
      question: 'What blockchain network do you use?',
      answer: 'T.A.L.A. is built on the Polygon network for fast, low-cost transactions with EVM compatibility.',
    },
    {
      question: 'How long can I lock a vault?',
      answer: 'You can lock a vault for any duration, from hours to years. The unlock timestamp is secured on-chain.',
    },
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Discord Community',
      description: 'Join our Discord for real-time support and community discussions.',
      link: 'https://discord.gg/tala',
      color: 'bg-heirlock-blue',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Email our team directly at support@tala.protocol for detailed assistance.',
      link: 'mailto:support@tala.protocol',
      color: 'bg-heirlock-pink',
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Browse existing discussions and ask questions in our community forum.',
      link: '#',
      color: 'bg-heirlock-green',
    },
    {
      icon: Zap,
      title: 'Documentation',
      description: 'Comprehensive guides, tutorials, and technical documentation available.',
      link: '/docs',
      color: 'bg-heirlock-yellow',
    },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-black text-cream py-16 px-4 border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-4">SUPPORT CENTER</h1>
          <p className="text-xl text-cream/90 max-w-2xl">
            Get help, answers, and support from the T.A.L.A. community and team.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto py-16 px-4 space-y-20">
        {/* Support Channels */}
        <section className="space-y-8">
          <h2 className="text-4xl font-black text-black uppercase">How to Get Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.title}
                  href={channel.link}
                  target={channel.link.startsWith('http') ? '_blank' : undefined}
                  rel={channel.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div
                    className={`${channel.color} border-4 border-black p-8 shadow-brutal hover:shadow-lg hover:translate-y-[-3px] transition-all duration-200 cursor-pointer h-full`}
                  >
                    <Icon className="w-10 h-10 text-black mb-4" />
                    <h3 className="font-black text-black text-xl mb-2">{channel.title}</h3>
                    <p className="text-sm text-gray-800 font-medium mb-4">{channel.description}</p>
                    <div className="flex items-center gap-2 font-black text-black">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <h2 className="text-4xl font-black text-black uppercase">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="border-4 border-black p-6 bg-white shadow-brutal hover:shadow-lg transition-all duration-200 group"
              >
                <summary className="font-black text-black text-lg cursor-pointer flex items-center justify-between">
                  <span>{item.question}</span>
                  <span className="text-2xl group-open:rotate-180 transition-transform duration-200">+</span>
                </summary>
                <p className="text-gray-800 font-medium mt-4 pt-4 border-t-3 border-black">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="space-y-8">
          <h2 className="text-4xl font-black text-black uppercase">We're Here to Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal text-center">
              <Clock className="w-10 h-10 text-black mx-auto mb-3" />
              <h3 className="font-black text-black text-2xl mb-2">24/7</h3>
              <p className="text-sm text-gray-800 font-medium">Community support available round the clock</p>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-pink shadow-brutal text-center">
              <Users className="w-10 h-10 text-black mx-auto mb-3" />
              <h3 className="font-black text-black text-2xl mb-2">5000+</h3>
              <p className="text-sm text-gray-800 font-medium">Active community members ready to help</p>
            </div>
            <div className="border-4 border-black p-8 bg-heirlock-blue shadow-brutal text-center">
              <Zap className="w-10 h-10 text-black mx-auto mb-3" />
              <h3 className="font-black text-black text-2xl mb-2">Quick</h3>
              <p className="text-sm text-gray-800 font-medium">Avg response time under 2 hours</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-4 border-black bg-black text-cream p-12 shadow-brutal space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">Didn't find your answer?</h2>
          <p className="text-lg text-cream/90 max-w-2xl">
            Contact our support team directly. We're here to help with any questions about T.A.L.A.
          </p>
          <Link href="/contact">
            <button className="px-8 py-4 bg-heirlock-yellow text-black font-black border-4 border-heirlock-yellow shadow-brutal hover:translate-y-[-3px] hover:shadow-lg transition-all duration-200">
              Get in Touch
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
