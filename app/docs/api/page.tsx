'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle, Code, Copy, Globe, Key, Server, Shield, Zap } from 'lucide-react';

const codeSamples = {
  curl: `curl -X POST https://api.usetala.in/v1/vaults
  -H "Authorization: Bearer YOUR_API_KEY"
  -H "Content-Type: application/json"
  -d '{
    "cid": "bafy...",
    "checksum": "sha256:2f0c...",
    "unlockAt": 1893456000,
    "metadata": {"label": "Exam Set A"}
  }'`,
  javascript: `import fetch from 'node-fetch';

const res = await fetch('https://api.usetala.in/v1/vaults', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cid: 'bafy...',
    checksum: 'sha256:2f0c...',
    unlockAt: 1893456000,
  }),
});

const data = await res.json();
console.log(data.id);`,
  python: `import requests

payload = {
    "cid": "bafy...",
    "checksum": "sha256:2f0c...",
    "unlockAt": 1893456000,
}

res = requests.post(
    "https://api.usetala.in/v1/vaults",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json=payload,
)
print(res.json())`,
};

const endpoints = [
  { method: 'POST', path: '/vaults', desc: 'Create a vault with CID, checksum, and unlock time.', auth: true },
  { method: 'GET', path: '/vaults/{id}', desc: 'Fetch vault metadata and current status.', auth: true },
  { method: 'POST', path: '/vaults/{id}/files', desc: 'Attach an encrypted file to a vault.', auth: true },
  { method: 'GET', path: '/vaults/{id}/files/{fileId}', desc: 'Download a file after unlock readiness.', auth: true },
  { method: 'DELETE', path: '/vaults/{id}', desc: 'Destroy a vault and its files when policy requires.', auth: true },
];

const rateLimits = [
  { tier: 'Starter', requests: '100 per hour', concurrent: '5', maxSize: '500 MB' },
  { tier: 'Professional', requests: '1,000 per hour', concurrent: '50', maxSize: 'Unlimited' },
  { tier: 'Enterprise', requests: '10,000 per hour', concurrent: '500', maxSize: 'Unlimited' },
];

const statusCodes = [
  { code: 200, message: 'OK', note: 'Request succeeded.' },
  { code: 201, message: 'Created', note: 'Resource created.' },
  { code: 400, message: 'Bad Request', note: 'Invalid payload or missing field.' },
  { code: 401, message: 'Unauthorized', note: 'Missing or invalid token.' },
  { code: 403, message: 'Forbidden', note: 'Caller not allowed for this vault.' },
  { code: 404, message: 'Not Found', note: 'Resource does not exist.' },
  { code: 429, message: 'Too Many Requests', note: 'Back off and retry later.' },
  { code: 500, message: 'Server Error', note: 'Unexpected failure on our side.' },
];

export default function APIDocumentationPage() {
  const [language, setLanguage] = useState<'curl' | 'javascript' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeSamples[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const methodStyle = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-heirlock-blue';
      case 'POST':
        return 'bg-heirlock-yellow';
      case 'PUT':
        return 'bg-heirlock-green';
      case 'DELETE':
        return 'bg-heirlock-pink';
      default:
        return 'bg-black text-white';
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b-4 border-black bg-cream px-4 py-12 md:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-black/60">
            <Code className="h-5 w-5" />
            API reference
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black">Integrate the T.A.L.A. API</h1>
          <p className="max-w-3xl text-lg font-semibold text-black/85">
            Create, monitor, and unlock vaults through a small set of endpoints. Use this page to authenticate correctly, respect rate policy, and ship reliable integrations.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center gap-2 rounded-xl border-3 border-black bg-black px-5 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Follow quick start
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/smart-contract"
              className="inline-flex items-center gap-2 rounded-xl border-3 border-black bg-white px-5 py-3 font-black text-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Contract details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5" />
            <h2 className="text-3xl font-black">Authentication</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[{ title: 'API key', note: 'Server to server calls. Send in Authorization: Bearer <token>.' }, { title: 'OAuth (on request)', note: 'Use for delegated user consent. Reach out for client registration.' }, { title: 'Webhook signature', note: 'Validate X-TALA-Signature using HMAC SHA256.' }].map((item) => (
              <div key={item.title} className="rounded-2xl border-3 border-black bg-cream p-5 shadow-brutal">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="text-sm text-black/80">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-heirlock-yellow px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5" />
            <h2 className="text-3xl font-black">Endpoints</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {endpoints.map((ep) => (
              <div key={ep.path} className="flex h-full flex-col gap-3 rounded-2xl border-3 border-black bg-white p-5 shadow-brutal">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${methodStyle(ep.method)}`}>{ep.method}</span>
                  <code className="font-mono text-sm text-black">{ep.path}</code>
                </div>
                <p className="text-sm text-black/80">{ep.desc}</p>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-black/60">{ep.auth ? 'Auth required' : 'Public'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5" />
            <h2 className="text-3xl font-black">Sample request</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['curl', 'javascript', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`rounded border-2 px-3 py-2 text-xs font-black capitalize transition-colors ${
                  language === lang ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-2xl border-4 border-black bg-black shadow-brutal">
            <div className="flex items-center justify-between border-b-3 border-black bg-black px-4 py-2">
              <span className="font-mono text-sm font-black text-white">Create vault</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-sm bg-heirlock-yellow px-3 py-1 text-sm font-black text-black"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto bg-black px-4 py-3 font-mono text-sm text-heirlock-yellow"><code>{codeSamples[language]}</code></pre>
          </div>
          <p className="text-sm text-black/75">Always keep tokens in server environments. Do not embed them in browser code.</p>
        </div>
      </section>

      <section className="border-b-4 border-black bg-cream px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <h2 className="text-3xl font-black">Rate policy</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-brutal">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 font-black">Tier</th>
                  <th className="px-6 py-3 font-black">Requests</th>
                  <th className="px-6 py-3 font-black">Concurrent</th>
                  <th className="px-6 py-3 font-black">Max file size</th>
                </tr>
              </thead>
              <tbody>
                {rateLimits.map((tier, idx) => (
                  <tr key={tier.tier} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border-t-2 border-black px-6 py-3 font-black">{tier.tier}</td>
                    <td className="border-t-2 border-black px-6 py-3 text-black/80">{tier.requests}</td>
                    <td className="border-t-2 border-black px-6 py-3 text-black/80">{tier.concurrent}</td>
                    <td className="border-t-2 border-black px-6 py-3 text-black/80">{tier.maxSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl border-3 border-black bg-white p-4 text-sm text-black/75 shadow-brutal">
            Include backoff on 429 responses. We return standard X-RateLimit headers so you can plan retries.
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-3xl font-black">HTTP codes</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {statusCodes.map((item) => (
              <div key={item.code} className="rounded-2xl border-3 border-black bg-cream p-4 shadow-brutal">
                <p className="font-black text-black">{item.code} — {item.message}</p>
                <p className="text-sm text-black/80">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-14">
        <div className="mx-auto max-w-6xl space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-heirlock-green">Need help or another SDK?</h2>
          <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
            We support REST in any language. Ask for a new SDK, a security review, or guidance for exam day rehearsals.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-heirlock-green bg-heirlock-green px-6 py-3 font-black text-black shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Contact support
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/security"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-heirlock-green bg-black px-6 py-3 font-black text-white shadow-brutal transition-transform hover:-translate-y-0.5"
            >
              Review security
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
