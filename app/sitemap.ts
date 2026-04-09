import type { MetadataRoute } from 'next';

const baseUrl = 'https://usetala.in';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
