import type { NextRequest } from 'next/server';

const site = 'https://usetala.in';

const routes = [
  '/',
  '/about',
  '/team',
  '/trust-center',
  '/integrations',
  '/api-status',
  '/procurement',
  '/docs/quickstart',
  '/status',
  '/documentation',
  '/blog',
  '/changelog',
  '/pricing',
];

function buildXml() {
  const lastmod = new Date().toISOString();
  const urls = routes
    .map(
      (path) => `
    <url>
      <loc>${site}${path}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${path === '/' ? '1.0' : '0.7'}</priority>
    </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;
}

export async function GET(_req: NextRequest) {
  const body = buildXml();
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
