import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "T.A.L.A. | API Status and Limits",
  description: "Rate limits, environments, headers, error codes, and retry guidance for T.A.L.A. APIs—enterprise ready and observable.",
  alternates: { canonical: "https://usetala.in/api-status" },
  openGraph: {
    title: "T.A.L.A. | API Status and Limits",
    description: "Understand T.A.L.A. API limits, error semantics, required headers, and operational practices across sandbox and production.",
    url: "https://usetala.in/api-status",
    siteName: "T.A.L.A.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "T.A.L.A. API Status and Limits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.A.L.A. | API Status and Limits",
    description: "Understand T.A.L.A. API limits, error semantics, required headers, and operational practices across sandbox and production.",
    images: ["/twitter-image"],
    creator: "@usetala",
  },
};

const rateLimitTiers = [
  {
    title: "Production",
    limit: "600 requests/min per project",
    burst: "120 requests in a 10-second window",
    note: "Enterprise plans can request custom ceilings and dedicated lanes for exam windows.",
    bg: "bg-heirlock-green",
  },
  {
    title: "Sandbox",
    limit: "120 requests/min per project",
    burst: "40 requests in a 10-second window",
    note: "For integration and QA. Same endpoints and headers, isolated data plane.",
    bg: "bg-heirlock-blue",
  },
  {
    title: "Elevated",
    limit: "Contact us",
    burst: "SLO-backed dedicated capacity",
    note: "For proctoring peaks or migration cutovers. Reach out with load profiles and timelines.",
    bg: "bg-heirlock-yellow",
  },
];

const errorCodes = [
  { code: "400", label: "Bad Request", detail: "Validation failed. Fix the payload shape or required fields." },
  { code: "401", label: "Unauthorized", detail: "Missing or invalid credentials. Check Authorization header and token scope." },
  { code: "403", label: "Forbidden", detail: "Credential valid but lacks permission. Confirm role or resource scoping." },
  { code: "404", label: "Not Found", detail: "Resource not present or not accessible in this environment." },
  { code: "409", label: "Conflict", detail: "Idempotency replay or conflicting state. Retry with a new idempotency key if appropriate." },
  { code: "422", label: "Unprocessable Entity", detail: "Semantics are invalid. Correct business rules before retrying." },
  { code: "429", label: "Rate Limited", detail: "Too many requests. Respect Retry-After and backoff with jitter." },
  { code: "500", label: "Internal Error", detail: "Unexpected fault. Safe to retry with exponential backoff and idempotency." },
  { code: "503", label: "Unavailable", detail: "Transient capacity or dependency issue. Retry after the Retry-After window." },
];

const responseHeaders = [
  { name: "X-RateLimit-Limit", note: "Ceiling for the current window." },
  { name: "X-RateLimit-Remaining", note: "Calls left in the current window." },
  { name: "X-RateLimit-Reset", note: "Unix epoch seconds when the window resets." },
  { name: "Retry-After", note: "Seconds until it is safe to retry after 429 or 503." },
  { name: "X-Request-Id", note: "Trace token to include in support tickets and logs." },
];

const requiredHeaders = [
  { name: "Authorization", value: "Bearer <token>" },
  { name: "Content-Type", value: "application/json" },
  { name: "Idempotency-Key", value: "Required for POST/PUT/PATCH that create or mutate resources." },
  { name: "User-Agent", value: "App name and version for diagnostics." },
];

export default function ApiStatusPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-heirlock-blue border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">API Status and Limits</h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Current platform limits, headers to send and observe, environment differences, and how to stay within SLOs during peaks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/status" className="px-4 py-2 bg-black text-white font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity text-sm">Live Status</Link>
              <Link href="/docs/quickstart" className="px-4 py-2 bg-heirlock-yellow text-black font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity text-sm">API Quickstart</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">Rate Limits</h2>
              <p className="text-lg text-gray-700 max-w-3xl">
                Limits are enforced per project and environment. Use Retry-After and the X-RateLimit headers to stay within budget and smooth load during assessments.
              </p>
            </div>
            <div className="text-sm text-gray-700 bg-heirlock-yellow border-4 border-black px-4 py-3 font-bold rounded-lg">
              Need higher ceilings for exam windows? Email support@usetala.in with projected RPS and schedules.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rateLimitTiers.map((tier) => (
              <div key={tier.title} className={`border-4 border-black rounded-lg p-6 shadow-brutal ${tier.bg}`}>
                <h3 className="text-2xl font-bold text-black mb-2">{tier.title}</h3>
                <p className="text-sm font-black uppercase text-black mb-1">Throughput</p>
                <p className="text-lg font-bold text-black mb-3">{tier.limit}</p>
                <p className="text-sm font-black uppercase text-black mb-1">Burst</p>
                <p className="text-lg font-bold text-black mb-3">{tier.burst}</p>
                <p className="text-sm text-black">{tier.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-black bg-heirlock-green p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-2">Environments</h3>
              <ul className="space-y-2 text-black text-sm">
                <li><strong>Sandbox:</strong> Auth, payloads, and headers match production. Data is isolated. Lower limits to protect shared tenants.</li>
                <li><strong>Production:</strong> Higher SLOs, monitored for latency and error budgets. Observability headers are identical.</li>
                <li><strong>Cutover:</strong> For migrations, coordinate dual writes and backfills with an agreed maintenance window.</li>
              </ul>
            </div>

            <div className="border-4 border-black bg-heirlock-pink p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-2">Retries and Backoff</h3>
              <ul className="space-y-2 text-black text-sm">
                <li><strong>429 or 503:</strong> Honor Retry-After. Use exponential backoff with jitter.</li>
                <li><strong>Idempotency:</strong> Send Idempotency-Key on POST/PUT/PATCH to make retries safe.</li>
                <li><strong>Timeouts:</strong> Default client timeout of 30 seconds recommended; avoid hammering on transient errors.</li>
              </ul>
            </div>
          </div>

          <div className="border-4 border-black bg-heirlock-yellow p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-black mb-3">Headers to Send</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredHeaders.map((h) => (
                <div key={h.name} className="border-2 border-black bg-white p-3 rounded">
                  <p className="text-sm font-black text-black uppercase">{h.name}</p>
                  <p className="text-sm text-gray-800">{h.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 rounded-lg shadow-brutal">
            <h3 className="text-2xl font-bold text-black mb-3">Headers to Watch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {responseHeaders.map((h) => (
                <div key={h.name} className="border-2 border-black bg-heirlock-blue p-3 rounded">
                  <p className="text-sm font-black text-black uppercase">{h.name}</p>
                  <p className="text-sm text-black">{h.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-heirlock-green p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-black mb-3">Error Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {errorCodes.map((err) => (
                <div key={err.code} className="border-2 border-black bg-white p-3 rounded h-full">
                  <p className="text-sm font-black text-black uppercase">{err.code} — {err.label}</p>
                  <p className="text-sm text-gray-800 mt-1">{err.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-black bg-white p-6 rounded-lg shadow-brutal">
              <h3 className="text-2xl font-bold text-black mb-2">Payload Guidance</h3>
              <ul className="space-y-2 text-black text-sm">
                <li><strong>Size:</strong> Keep bodies under 1 MB. Use pagination or chunking for larger datasets.</li>
                <li><strong>Pagination:</strong> Use limit and cursor parameters when available to avoid heavy scans.</li>
                <li><strong>Idempotency:</strong> One unique Idempotency-Key per logical operation; reuse to replay safely after errors.</li>
              </ul>
            </div>

            <div className="border-4 border-black bg-heirlock-yellow p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-2">Operational Tips</h3>
              <ul className="space-y-2 text-black text-sm">
                <li><strong>Observability:</strong> Log X-Request-Id and X-RateLimit headers for support investigations.</li>
                <li><strong>Clock Skew:</strong> Sync to NTP to honor Retry-After and Reset correctly.</li>
                <li><strong>Rollouts:</strong> Ramp traffic gradually; avoid sudden spikes at minute boundaries.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
