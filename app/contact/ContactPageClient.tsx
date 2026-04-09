'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Copy,
  Headphones,
  Mail,
  ShieldAlert,
  Sparkles,
  TimerReset,
} from 'lucide-react';

const contactRoutes = [
  {
    title: 'General support',
    description: 'Product questions, troubleshooting, account help, and workflow guidance.',
    subject: 'General Support',
    icon: Headphones,
    tone: 'bg-heirlock-yellow',
    sla: '24-48 hours',
  },
  {
    title: 'Launch onboarding',
    description: 'Setup planning for institutions, pilot programs, and operational rollout.',
    subject: 'Launch Onboarding',
    icon: Sparkles,
    tone: 'bg-heirlock-green',
    sla: '1 business day',
  },
  {
    title: 'Security reporting',
    description: 'Responsible disclosure, suspicious behavior, and high-priority vulnerabilities.',
    subject: 'Security Report',
    icon: ShieldAlert,
    tone: 'bg-heirlock-pink',
    sla: '4-8 hours',
  },
  {
    title: 'Partnerships',
    description: 'Integrations, education partnerships, procurement, and media coordination.',
    subject: 'Partnership Inquiry',
    icon: Briefcase,
    tone: 'bg-heirlock-blue',
    sla: '1-2 business days',
  },
] as const;

const reasonOptions = [
  'General Support',
  'Launch Onboarding',
  'Security Report',
  'Partnership Inquiry',
  'Feature Request',
  'Press / Media',
];

const routingNotes = [
  {
    title: 'Need documentation first?',
    body: 'If your question is implementation-specific, the docs are usually the fastest path.',
    href: '/docs',
    label: 'Open docs',
    icon: BookOpen,
  },
  {
    title: 'Reporting a security issue?',
    body: 'Use a clear subject line and include reproduction steps, impact, and timing details.',
    href: '/trust-center',
    label: 'Read disclosure process',
    icon: ShieldAlert,
  },
  {
    title: 'Want guided rollout help?',
    body: 'Use the onboarding route so the team can prepare for your institution or deployment.',
    href: '/launch',
    label: 'See launch page',
    icon: TimerReset,
  },
] as const;

const supportAddress = 'support@usetala.in';

export default function ContactPageClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [reason, setReason] = useState(reasonOptions[0]);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const draftHref = useMemo(() => {
    const subject = `[TALA] ${reason}`;
    const lines = [
      `Name: ${name || 'Not provided'}`,
      `Email: ${email || 'Not provided'}`,
      `Organization: ${organization || 'Not provided'}`,
      `Reason: ${reason}`,
      '',
      'Message:',
      message || 'Please describe your request.',
    ];

    return `mailto:${supportAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }, [email, message, name, organization, reason]);

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText(supportAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function applyRoutePreset(subject: string) {
    setReason(subject);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-black selection:bg-black selection:text-heirlock-yellow">
      <section className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] md:text-xs">
          <span className="inline-flex items-center gap-2 text-heirlock-yellow">
            <Mail className="h-4 w-4" />
            Direct team contact
          </span>
          <span className="inline-flex items-center gap-2 text-heirlock-green">
            <CheckCircle2 className="h-4 w-4" />
            support@usetala.in
          </span>
          <span className="inline-flex items-center gap-2 text-heirlock-blue">
            <TimerReset className="h-4 w-4" />
            Routed by urgency and topic
          </span>
        </div>
      </section>

      <section className="relative overflow-hidden border-b-4 border-black bg-[linear-gradient(180deg,#fffacd_0%,#f5f3c1_48%,#ffffff_100%)] px-4 py-12 md:px-8 md:py-16">
        <div className="absolute -left-16 top-20 h-44 w-44 rotate-12 border-4 border-black bg-heirlock-pink opacity-80 md:h-64 md:w-64" />
        <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full border-4 border-black bg-heirlock-blue opacity-90 md:h-56 md:w-56" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-size-[34px_34px] opacity-45" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-8">
              <div className="inline-flex -rotate-1 items-center gap-3 border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[6px_6px_0_0_#000] md:text-sm">
                Contact the right lane
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] md:text-7xl xl:text-[5.6rem]">
                  Reach TALA without falling into a generic inbox.
                </h1>
                <p className="max-w-3xl border-l-8 border-black bg-white p-5 text-lg font-medium shadow-brutal md:text-2xl">
                  Use the right route, open a structured draft, and give the team enough signal to respond quickly.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {contactRoutes.map((route) => {
                  const Icon = route.icon;

                  return (
                    <button
                      key={route.title}
                      type="button"
                      onClick={() => applyRoutePreset(route.subject)}
                      className={`${route.tone} text-left border-4 border-black p-5 shadow-brutal transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_0_#000]">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-black/65">
                          {route.sla}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black uppercase leading-tight">{route.title}</h2>
                      <p className="mt-2 text-sm font-medium text-black/75">{route.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${supportAddress}`}
                  className="inline-flex items-center justify-center gap-3 border-4 border-black bg-black px-7 py-4 text-lg font-black uppercase tracking-wide text-heirlock-yellow shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
                >
                  Email support directly
                  <ArrowRight className="h-5 w-5" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center justify-center gap-3 border-4 border-black bg-heirlock-green px-7 py-4 text-lg font-black uppercase tracking-wide shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
                >
                  <Copy className="h-5 w-5" />
                  {copied ? 'Address copied' : 'Copy address'}
                </button>
              </div>
            </div>

            <div className="relative lg:pt-4">
              <div className="absolute -left-3 top-6 hidden h-full w-full rotate-2 border-4 border-black bg-black lg:block" />
              <div className="relative border-8 border-black bg-white p-6 shadow-[12px_12px_0_0_#000] md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-black/60">Structured draft</p>
                    <h2 className="mt-2 text-3xl font-black uppercase md:text-4xl">Build Your Message</h2>
                  </div>
                  <div className="rotate-3 border-4 border-black bg-heirlock-yellow px-3 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-brutal">
                    mailto workflow
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-black/60">Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="w-full border-4 border-black bg-cream px-4 py-3 font-bold outline-none transition-all focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-black/60">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full border-4 border-black bg-cream px-4 py-3 font-bold outline-none transition-all focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-black/60">Organization</span>
                    <input
                      type="text"
                      value={organization}
                      onChange={(event) => setOrganization(event.target.value)}
                      placeholder="Optional"
                      className="w-full border-4 border-black bg-cream px-4 py-3 font-bold outline-none transition-all focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-black/60">Reason</span>
                    <select
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      className="w-full border-4 border-black bg-cream px-4 py-3 font-bold outline-none transition-all focus:bg-white"
                    >
                      {reasonOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-black/60">Message</span>
                  <textarea
                    rows={7}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell the team what you need, what environment you are working in, and any deadlines that matter."
                    className="w-full resize-none border-4 border-black bg-cream px-4 py-3 font-bold outline-none transition-all focus:bg-white"
                  />
                </label>

                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <p className="border-4 border-black bg-black px-4 py-3 text-sm font-bold text-white">
                    The draft opens in your mail app with the subject and message prefilled. No message is stored on the site.
                  </p>
                  <a
                    href={draftHref}
                    className="inline-flex items-center justify-center gap-3 border-4 border-black bg-heirlock-pink px-6 py-4 text-lg font-black uppercase shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
                  >
                    Open draft
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border-4 border-black bg-heirlock-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-brutal md:text-sm">
                Before you send
              </div>
              <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.05em] md:text-6xl">
                Route faster. Resolve faster.
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium text-black/75 md:text-lg">
              The page is designed to help you reach the right path quickly instead of sending vague requests into a queue.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {routingNotes.map((note, index) => {
              const Icon = note.icon;
              const tones = ['bg-heirlock-blue', 'bg-heirlock-pink', 'bg-heirlock-green'];

              return (
                <article
                  key={note.title}
                  className={`${tones[index]} flex h-full flex-col border-4 border-black p-6 shadow-brutal transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]`}
                >
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_0_#000]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-tight">{note.title}</h3>
                  <p className="mt-3 flex-1 text-base font-medium text-black/75">{note.body}</p>
                  <Link href={note.href} className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase underline underline-offset-4">
                    {note.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-4 py-16 text-white md:px-8 md:py-20">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(255,250,205,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(186,255,201,0.18),transparent_36%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-4 border-white bg-black p-8 shadow-[10px_10px_0_0_#fff] md:p-10">
            <div className="inline-flex -rotate-1 items-center gap-2 border-4 border-white bg-heirlock-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[6px_6px_0_0_#ffb3ba] md:text-sm">
              Human response, not a maze
            </div>
            <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-[-0.05em] md:text-5xl">
              Serious requests deserve a clean route.
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium text-white/75 md:text-lg">
              If you are evaluating TALA for launch, security review, institutional rollout, or implementation planning, send the brief with context and timing. That gets you the fastest useful response.
            </p>
          </div>

          <div className="grid gap-4">
            <a
              href={`mailto:${supportAddress}?subject=${encodeURIComponent('[TALA] Launch Onboarding')}`}
              className="inline-flex items-center justify-between gap-3 border-4 border-black bg-heirlock-yellow px-6 py-5 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#fff] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#fff]"
            >
              Email launch onboarding
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              href="/support"
              className="inline-flex items-center justify-between gap-3 border-4 border-white bg-transparent px-6 py-5 text-lg font-black uppercase text-white shadow-[8px_8px_0_0_#bae1ff] transition-all hover:-translate-y-1 hover:bg-white hover:text-black"
            >
              Visit support center
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/trust-center"
              className="inline-flex items-center justify-between gap-3 border-4 border-black bg-heirlock-green px-6 py-5 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#ffb3ba] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#ffb3ba]"
            >
              Review security process
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}