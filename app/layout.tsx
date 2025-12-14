import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ToastProvider } from "./providers/ToastProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageSkeleton from "./components/PageSkeleton";
import DevelopmentNotification from "./components/DevelopmentNotification";
import CookieConsent from "./components/CookieConsent";

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
  description: "Tamper-proof Automated Locking Algorithm - Eliminating exam paper leaks through mathematical time-locking",
  keywords: ["Web3", "Blockchain", "Exam Security", "Time-Lock", "IPFS", "Polygon"],
  authors: [{ name: "T.A.L.A. Team" }],
  openGraph: {
    title: "T.A.L.A. | Trust is Code",
    description: "Decentralized time-locked vault for exam papers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <ErrorBoundary>
          <Web3Provider>
            <ToastProvider>
              <PageSkeleton />
              <Navbar />
              <DevelopmentNotification />
              <CookieConsent />
              <div className="pt-16 md:pt-20">
                {children}
              </div>
              <Footer />
            </ToastProvider>
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
