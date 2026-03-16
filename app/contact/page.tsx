import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'T.A.L.A. | Contact',
  description:
    'Reach the T.A.L.A. team for support, onboarding, security reporting, partnerships, and implementation questions.',
  alternates: { canonical: 'https://usetala.in/contact' },
  openGraph: {
    title: 'T.A.L.A. | Contact',
    description:
      'Direct channels for support, launch onboarding, security reporting, and enterprise coordination.',
    url: 'https://usetala.in/contact',
    siteName: 'T.A.L.A.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Contact T.A.L.A.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T.A.L.A. | Contact',
    description:
      'Direct channels for support, launch onboarding, security reporting, and enterprise coordination.',
    images: ['/opengraph-image'],
    creator: '@usetala',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
