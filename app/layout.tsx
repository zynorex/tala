import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./providers/ToastProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AdminShortcutProvider } from "./providers/AdminShortcutProvider";
import { NextAuthSessionProvider } from "./providers/SessionProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import MainLayout from "./components/MainLayout";
import DeviceBlocker from "./components/DeviceBlocker";
import DevelopmentNotification from "./components/DevelopmentNotification";
import CookieConsent from "./components/CookieConsent";
import Web3ClientWrapper from "./components/Web3ClientWrapper";
import LaunchAnnouncementModal from "./components/LaunchAnnouncementModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "T.A.L.A. | Trust is Code",
  description: "Tamper-proof Automated Locking Algorithm for time-locked vaults and verifiable unlock proofs.",
  keywords: ["Web3", "Blockchain", "Exam Security", "Time-Lock", "IPFS", "Polygon", "Unlock proofs", "usetala"],
  authors: [{ name: "T.A.L.A. Team" }],
  metadataBase: new URL("https://usetala.in"),
  openGraph: {
    title: "T.A.L.A. | Trust is Code",
    description: "Decentralized time-locked vaults with auditable unlock events.",
    type: "website",
    url: "https://usetala.in",
    siteName: "T.A.L.A.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "T.A.L.A. - Trust is Code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.A.L.A. | Trust is Code",
    description: "Decentralized time-locked vaults with auditable unlock events.",
    images: ["/opengraph-image"],
    creator: "@usetala",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://usetala.in",
    languages: {
      "en-US": "https://usetala.in",
    },
    types: {
      "application/rss+xml": "https://usetala.in/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'T.A.L.A.',
    url: 'https://usetala.in',
    logo: 'https://usetala.in/logo.png',
    sameAs: [
      'https://x.com/usetala',
      'https://www.linkedin.com/company/usetala',
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <NextAuthSessionProvider>
            <AdminShortcutProvider>
              <ThemeProvider>
                <Web3ClientWrapper>
                  <ToastProvider>
                    <DeviceBlocker />
                    <LaunchAnnouncementModal />
                    <DevelopmentNotification />
                    <CookieConsent />
                    <MainLayout>{children}</MainLayout>
                  </ToastProvider>
                </Web3ClientWrapper>
              </ThemeProvider>
            </AdminShortcutProvider>
          </NextAuthSessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

