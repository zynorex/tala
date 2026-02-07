import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | TALA',
  description: 'Get in touch with the TALA team. Send us a message and we\'ll respond within 24 hours.',
};

export default function Contact() {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'support@usetala.in',
      link: 'mailto:support@usetala.in',
      color: 'bg-heirlock-yellow',
    },
    {
      icon: Mail,
      label: 'Security Issues',
      value: 'support@usetala.in',
      link: 'mailto:support@usetala.in',
      color: 'bg-heirlock-pink',
    },
    {
      icon: Phone,
      label: 'Discord',
      value: 'Join our community',
      link: 'https://discord.gg/TALA',
      color: 'bg-heirlock-blue',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Global / Remote',
      link: '#',
      color: 'bg-heirlock-green',
    },
  ];

  const responseAreas = [
    'General Inquiries',
    'Technical Support',
    'Feature Requests',
    'Bug Reports',
    'Partnership Opportunities',
    'Media & Press',
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-black text-cream py-16 px-4 border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-4">GET IN TOUCH</h1>
          <p className="text-xl text-cream/90 max-w-2xl">
            Have a question or suggestion? We'd love to hear from you. Send us a message anytime.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
        {/* Contact Methods */}
        <section className="space-y-8">
          <h2 className="text-4xl font-black text-black uppercase">Contact Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.label}
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div
                    className={`${method.color} border-4 border-black p-8 shadow-brutal hover:shadow-lg hover:translate-y-[-3px] transition-all duration-200 cursor-pointer`}
                  >
                    <Icon className="w-8 h-8 text-black mb-4" />
                    <h3 className="font-black text-black text-lg mb-2">{method.label}</h3>
                    <p className="text-sm text-gray-800 font-medium">{method.value}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Main Contact Form Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-4xl font-black text-black uppercase mb-2">Send us a Message</h2>
            <p className="text-lg text-gray-800 font-medium">
              Fill out the form below and we'll get back to you as soon as possible, typically within 24 hours.
            </p>
          </div>

          <form className="space-y-6 border-4 border-black p-8 bg-white shadow-brutal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-black text-black text-sm uppercase block">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="font-black text-black text-sm uppercase block">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-black text-black text-sm uppercase block">Subject *</label>
              <select
                required
                className="w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <option value="">Select a subject</option>
                {responseAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-black text-black text-sm uppercase block">Message *</label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 border-3 border-black bg-cream font-medium text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black resize-none"
                placeholder="Tell us what you're thinking..."
              ></textarea>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="agree" className="w-5 h-5 border-3 border-black cursor-pointer" required />
              <label htmlFor="agree" className="text-sm text-gray-800 font-medium cursor-pointer">
                I agree to the privacy policy and terms of service
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-black text-heirlock-yellow font-black border-4 border-black shadow-brutal hover:translate-y-[-3px] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </section>

        {/* Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal">
            <h3 className="font-black text-black text-2xl mb-4 uppercase">Response Time</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">General inquiries: 24-48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">Bug reports: 12-24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">Security issues: 4-8 hours</span>
              </li>
            </ul>
          </div>

          <div className="border-4 border-black p-8 bg-heirlock-pink shadow-brutal">
            <h3 className="font-black text-black text-2xl mb-4 uppercase">What We Handle</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">Technical support & troubleshooting</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">Feature requests & feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">Security vulnerability reports</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Back to Support */}
        <div className="text-center border-t-4 border-black pt-8">
          <p className="text-gray-800 font-medium mb-4">Looking for answers to common questions?</p>
          <Link href="/support">
            <button className="px-8 py-4 bg-black text-heirlock-yellow font-black border-4 border-black shadow-brutal hover:translate-y-[-3px] hover:shadow-lg transition-all duration-200">
              Visit Support Center
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

