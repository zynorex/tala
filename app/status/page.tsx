import type { Metadata } from 'next';
import StatusClient from './page.client';

export const metadata: Metadata = {
  title: 'T.A.L.A. | Status',
  description: 'Live uptime, incidents, and maintenance for T.A.L.A. services with historical summaries and refresh cadence.',
  alternates: { canonical: 'https://usetala.in/status' },
  openGraph: {
    title: 'T.A.L.A. | Status',
    description: 'Live uptime, incidents, and maintenance for T.A.L.A. services with historical summaries and refresh cadence.',
    url: 'https://usetala.in/status',
    siteName: 'T.A.L.A.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'T.A.L.A. Status',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T.A.L.A. | Status',
    description: 'Live uptime, incidents, and maintenance for T.A.L.A. services with historical summaries and refresh cadence.',
    images: ['/twitter-image'],
    creator: '@usetala',
  },
};

export default function StatusPage() {
  return <StatusClient />;
}
