import type { NextRequest } from 'next/server';

const site = 'https://usetala.in';

const items = [
  {
    title: 'T.A.L.A. Home',
    link: `${site}/`,
    description: 'Time-locked vaults for exams, tenders, and evidence with verifiable unlock proofs.',
  },
  {
    title: 'Trust Center',
    link: `${site}/trust-center`,
    description: 'Security posture, disclosure process, and verification artifacts.',
  },
  {
    title: 'API Status and Limits',
    link: `${site}/api-status`,
    description: 'Rate limits, environments, headers, error codes, and retry guidance.',
  },
  {
    title: 'API Quickstart',
    link: `${site}/docs/quickstart`,
    description: 'Build against T.A.L.A. APIs with staging keys, webhooks, and sample calls.',
  },
  {
    title: 'Integrations',
    link: `${site}/integrations`,
    description: 'Supported chains, wallets, monitoring hooks, and storage gateways.',
  },
  {
    title: 'Procurement Pack',
    link: `${site}/procurement`,
    description: 'Security, legal, and procurement materials for vendor review.',
  },
  {
    title: 'Status',
    link: `${site}/status`,
    description: 'Live uptime, incidents, and maintenance windows.',
  },
  {
    title: 'Team',
    link: `${site}/team`,
    description: 'Meet the T.A.L.A. team and advisors.',
  },
  {
    title: 'About',
    link: `${site}/about`,
    description: 'Trust is Code: mission, architecture, and impact.',
  },
];

function rssXml() {
  const updated = new Date().toUTCString();
  const itemsXml = items
    .map(
      (item) => `
      <item>
        <title><![CDATA[${item.title}]]></title>
        <link>${item.link}</link>
        <guid>${item.link}</guid>
        <description><![CDATA[${item.description}]]></description>
        <pubDate>${updated}</pubDate>
      </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>T.A.L.A.</title>
      <link>${site}</link>
      <description>Time-locked vaults for exams, tenders, and evidence.</description>
      <lastBuildDate>${updated}</lastBuildDate>
      <language>en-us</language>
      ${itemsXml}
    </channel>
  </rss>`;
}

export async function GET(_req: NextRequest) {
  const body = rssXml();
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
