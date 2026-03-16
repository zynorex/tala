'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

const LAUNCH_DATE_ISO = '2026-04-20T00:00:00+05:30';
const LAUNCH_LABEL = '20 April 2026 • 12:00 AM IST';

const launchHighlights = [
  {
    title: 'On-device encryption',
    description: 'Plaintext stays off the platform from the start.',
    tone: 'bg-heirlock-yellow',
  },
  {
    title: 'Timed unlocks',
    description: 'Release behavior follows policy, not operator mood.',
    tone: 'bg-heirlock-blue',
  },
  {
    title: 'Auditable custody',
    description: 'Teams can review when and why a vault became available.',
    tone: 'bg-heirlock-green',
  },
];

const scrollNotes = [
  {
    label: 'What opens on launch',
    title: 'The full vault flow goes live.',
    description: 'Create, encrypt, lock, wait, unlock, and decrypt in one production-ready path.',
  },
  {
    label: 'Who it is for',
    title: 'Teams that cannot afford timing mistakes.',
    description: 'Universities, legal teams, public bodies, and operators handling high-trust documents.',
  },
  {
    label: 'What to do now',
    title: 'Test the flow before the public release window.',
    description: 'Run a short demo vault or talk to the team if you need launch support.',
  },
];

function getCountdownParts() {
  const target = new Date(LAUNCH_DATE_ISO).getTime();
  const now = Date.now();
  const difference = Math.max(0, target - now);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    complete: difference === 0,
  };
}

function formatUnit(value: number) {
  return String(value).padStart(2, '0');
}

export default function LaunchPage() {
  const [countdown, setCountdown] = useState(getCountdownParts());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-black selection:bg-black selection:text-heirlock-yellow">
      <section className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] md:text-xs">
          <span className="inline-flex items-center gap-2 text-heirlock-yellow">
            <Sparkles className="h-4 w-4" />
            Launch protocol is locked
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-heirlock-green" />
            {LAUNCH_LABEL}
          </span>
          <span className="inline-flex items-center gap-2 text-heirlock-blue">
            <ShieldCheck className="h-4 w-4" />
            No override. No early access.
          </span>
        </div>
      </section>

      <section className="relative overflow-hidden border-b-4 border-black bg-[linear-gradient(180deg,#fffacd_0%,#f5f3c1_52%,#ffffff_100%)] px-4 py-10 md:px-8 md:py-16 lg:min-h-[calc(100vh-52px)] lg:flex lg:items-center">
        <div className="absolute -left-20 top-24 h-48 w-48 rotate-12 border-4 border-black bg-heirlock-pink opacity-80 md:h-72 md:w-72" />
        <div className="absolute -bottom-16 -right-5 h-40 w-40 rounded-full border-4 border-black bg-heirlock-blue md:h-64 md:w-64" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.07)_1px,transparent_1px)] bg-size-[36px_36px] opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-brutal transition-all hover:-translate-y-1 hover:bg-black hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="inline-flex w-fit items-center gap-2 border-4 border-black bg-heirlock-green px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-brutal md:text-sm">
              <ShieldCheck className="h-4 w-4" />
              Public launch confirmed
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex -rotate-1 items-center gap-3 border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[6px_6px_0_0_#000] md:text-sm">
                Countdown to launch
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] md:text-7xl xl:text-[5.75rem]">
                  TALA launches on
                  <span className="mx-2 inline-block -rotate-1 border-4 border-black bg-heirlock-yellow px-3 py-1 leading-none shadow-[6px_6px_0_0_#000]">
                    20 April
                  </span>
                  at midnight IST.
                </h1>

                <p className="max-w-2xl border-l-8 border-black bg-white p-5 text-lg font-medium text-black shadow-brutal md:text-2xl">
                  The page is simple for a reason: the date matters first. Everything else can wait until you scroll.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/create-vault"
                  className="inline-flex items-center justify-center gap-3 border-4 border-black bg-black px-7 py-4 text-lg font-black uppercase tracking-wide text-heirlock-yellow shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
                >
                  Run the five-minute demo
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 border-4 border-black bg-heirlock-green px-7 py-4 text-lg font-black uppercase tracking-wide shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
                >
                  Request launch onboarding
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-black/65 md:text-sm">
                <Sparkles className="h-4 w-4" />
                Scroll for the essentials
              </div>
            </div>

            <div className="relative space-y-5 lg:pt-8">
              <div className="absolute -left-3 top-10 hidden h-full w-full rotate-2 border-4 border-black bg-black lg:block" />

              <div className="relative border-8 border-black bg-heirlock-blue p-6 shadow-[12px_12px_0_0_#000] md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-black/65">Launch countdown</p>
                    <h2 className="mt-2 text-3xl font-black uppercase md:text-4xl">
                      {countdown.complete ? 'Now Live' : 'Protocol Opens In'}
                    </h2>
                  </div>
                  <div className="rotate-3 border-4 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-brutal">
                    {LAUNCH_LABEL}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Days', value: formatUnit(countdown.days) },
                    { label: 'Hours', value: formatUnit(countdown.hours) },
                    { label: 'Minutes', value: formatUnit(countdown.minutes) },
                    { label: 'Seconds', value: formatUnit(countdown.seconds) },
                  ].map((unit) => (
                    <div key={unit.label} className="border-4 border-black bg-white px-4 py-5 text-center shadow-[4px_4px_0_0_#000]">
                      <p className="text-4xl font-black leading-none md:text-5xl">{unit.value}</p>
                      <p className="mt-3 text-[11px] font-black uppercase tracking-[0.22em] text-black/55 md:text-xs">
                        {unit.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-4 border-black bg-black p-4 text-white shadow-brutal">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-heirlock-yellow">Launch note</p>
                  <p className="mt-3 text-base font-bold text-white/85 md:text-lg">
                    TALA opens with the full vault flow, clear timing guarantees, and production-facing onboarding paths.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border-4 border-black bg-heirlock-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-brutal md:text-sm">
                More if you keep scrolling
              </div>
              <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.05em] md:text-6xl">
                Just the essentials.
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium text-black/75 md:text-lg">
              The top of the page is now date-first. These are the only supporting details you need below it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {launchHighlights.map((item) => (
              <article
                key={item.title}
                className={`${item.tone} flex h-full flex-col border-4 border-black p-6 shadow-brutal transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]`}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Launch highlight</p>
                <h3 className="mt-3 text-2xl font-black uppercase leading-tight">{item.title}</h3>
                <p className="mt-3 text-base font-medium text-black/75">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-black px-4 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {scrollNotes.map((item, index) => (
              <article
                key={item.label}
                className={`border-4 border-black p-6 text-black shadow-[10px_10px_0_0_#fff] ${index === 0 ? 'bg-white' : index === 1 ? 'bg-heirlock-blue' : 'bg-heirlock-pink'}`}
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-black/60">{item.label}</p>
                <h3 className="mt-3 text-3xl font-black uppercase leading-none">{item.title}</h3>
                <p className="mt-4 text-base font-medium text-black/75">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-4 py-16 text-white md:px-8 md:py-24">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(255,250,205,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(186,225,255,0.22),transparent_38%)]" />
        <div className="relative mx-auto max-w-5xl border-4 border-white bg-black p-8 shadow-[12px_12px_0_0_#fff] md:p-12">
          <div className="space-y-6 text-center">
            <div className="inline-flex -rotate-1 items-center gap-2 border-4 border-white bg-heirlock-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[6px_6px_0_0_#ffb3ba] md:text-sm">
              Ready before launch
            </div>
            <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.05em] md:text-6xl">
              Test the flow now, then come back on launch day.
            </h2>
            <p className="mx-auto max-w-2xl text-base font-medium text-white/75 md:text-lg">
              If the date is what you came for, you have it. If you need confidence before then, use the demo or contact the team.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/create-vault"
                className="inline-flex items-center justify-between gap-3 border-4 border-black bg-heirlock-yellow px-6 py-5 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#fff] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#fff]"
              >
                Start the demo vault
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-between gap-3 border-4 border-black bg-heirlock-green px-6 py-5 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#ffb3ba] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#ffb3ba]"
              >
                Talk to the launch team
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
