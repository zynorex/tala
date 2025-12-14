import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal | TALA",
  description: "Legal information for TALA vault system",
};

export default function LegalHub() {
  const legalPages = [
    {
      title: "Terms of Service",
      description: "Our terms and conditions",
      href: "/terms",
      color: "yellow",
    },
    {
      title: "Privacy Policy",
      description: "How we handle your data",
      href: "/privacy",
      color: "blue",
    },
    {
      title: "Disclaimer",
      description: "Important legal disclaimers",
      href: "/disclaimer",
      color: "pink",
    },
    {
      title: "Cookie Policy",
      description: "How we use cookies",
      href: "/cookies",
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="font-black text-4xl md:text-5xl text-black mb-4">
          Legal Information
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-12">
          Review our legal documents and policies
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {legalPages.map((page) => {
            const colorMap: { [key: string]: string } = {
              yellow: "bg-heirlock-yellow border-heirlock-yellow",
              blue: "bg-heirlock-blue border-heirlock-blue",
              pink: "bg-heirlock-pink border-heirlock-pink",
              green: "bg-heirlock-green border-heirlock-green",
            };

            return (
              <Link key={page.href} href={page.href}>
                <div
                  className={`h-full border-4 border-black ${colorMap[page.color]} p-6 shadow-brutal cursor-pointer hover:translate-y-[-3px] hover:shadow-lg transition-all`}
                >
                  <h2 className="font-black text-xl text-black mb-2">
                    {page.title}
                  </h2>
                  <p className="text-gray-800 font-medium">{page.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="border-4 border-black bg-heirlock-yellow p-6 shadow-brutal">
          <h3 className="font-black text-black text-xl mb-4">Need Help?</h3>
          <p className="text-gray-800 font-medium mb-4">
            Can't find what you're looking for?
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-black text-heirlock-yellow border-3 border-black font-black hover:translate-y-[-2px] transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
