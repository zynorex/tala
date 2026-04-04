import type { Metadata } from 'next';
import HomeClient from './page.client';

export const metadata: Metadata = {
  title: 'T.A.L.A. | Trust is Code',
  description: 'Time-locked vaults for exams, tenders, and evidence. Client-side encryption, Polygon smart contracts, and verifiable unlock proofs.',
  alternates: { canonical: 'https://usetala.in/' },
  openGraph: {
    title: 'T.A.L.A. | Trust is Code',
    description: 'Time-locked vaults for exams, tenders, and evidence with auditable unlock events.',
    url: 'https://usetala.in/',
    siteName: 'T.A.L.A.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'T.A.L.A. | Trust is Code',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T.A.L.A. | Trust is Code',
    description: 'Time-locked vaults for exams, tenders, and evidence with auditable unlock events.',
    images: ['/opengraph-image'],
    creator: '@usetala',
  },
};

export default function Home() {
  return <HomeClient />;
}
