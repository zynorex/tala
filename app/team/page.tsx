import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Linkedin, Twitter, Github, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "T.A.L.A. | Team",
  description: "Meet the builders behind T.A.L.A.—security, cryptography, and product leads advancing time-locked vaults for exams, tenders, and evidence.",
  alternates: { canonical: "https://usetala.in/team" },
  openGraph: {
    title: "T.A.L.A. | Team",
    description: "Security and cryptography leadership delivering verifiable unlocks and privacy-first vaults.",
    url: "https://usetala.in/team",
    siteName: "T.A.L.A.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "T.A.L.A. Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.A.L.A. | Team",
    description: "Security and cryptography leadership delivering verifiable unlocks and privacy-first vaults.",
    images: ["/opengraph-image"],
    creator: "@usetala",
  },
};

type Member = {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
};

type Advisor = {
  name: string;
  role: string;
  expertise: string;
  github?: string;
};

const teamMembers: Member[] = [
  {
    name: "Ayush",
    role: "Founder & Lead Developer",
    bio: "Founder and lead developer driving TALA's secure education stack-smart contracts, vault security, and full-stack delivery with a privacy-first posture.",
    expertise: ["Blockchain", "Security", "Full-stack"],
    website: "https://iayush.in",
    github: "ayushedith",
    linkedin: "https://www.linkedin.com/in/ayushxlinks",
    twitter: "https://x.com/ayushedith",
    email: "hi@ayushx.me",
  },
  {
    name: "Amir",
    role: "Data Privacy Engineer",
    bio: "Data privacy engineer specializing in secure data handling, encryption, and compliance to ensure user information is protected and never misused.",
    expertise: ["Data Privacy", "Encryption", "Compliance"],
    website: "https://amirvishwas.site",
    github: "calvintakasi",
    linkedin: "https://www.linkedin.com/in/amirvishwas",
    twitter: "https://twitter.com/calvintakasi",
    email: "amirvishwas25@gmail.com",
  },
  {
    name: "Aryan",
    role: "Security and Compliance Lead",
    bio: "Security and compliance lead ensuring TALA's security and compliance standards are met, including audits, incident response, and governance.",
    expertise: ["Security", "Compliance", "Audits"],
    website: "https://aryansingh.me",
    github: "AryaN-a005", 
    linkedin: "https://www.linkedin.com/in/aryan-singh-675b24328",
    twitter: "https://x.com/AryaN_a005",
    email: "aryan20051234@gmail.com",

  },
];

const advisors: Advisor[] = [
  {
    name: "Amir",
    role: "Security and Compliance",
    expertise: "Audits, incident response, and governance.",
    github: "calvintakasi",
  },
  {
    name: "Aryan",
    role: "Policy and Education",
    expertise: "Curriculum security and exam integrity.",
    github: "AryaN-a005",
  },
];

function githubAvatar(username?: string) {
  if (!username) return "https://avatars.githubusercontent.com/u/0?v=4";
  return `https://github.com/${username}.png?size=200`;
}

export default function TeamPage() {

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-blue border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Meet the Team
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Cryptographers, engineers, and changemakers building the future of secure education.
            </p>
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Core Team</h2>
            <p className="text-lg text-gray-700 max-w-2xl">
              Six professionals with decades of combined experience in blockchain, security, and education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="border-4 border-black bg-white shadow-brutal p-8 rounded-lg flex flex-col h-full">
                <div className="w-20 h-20 mb-4 border-4 border-black rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={githubAvatar(member.github)}
                    alt={`${member.name} avatar`}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-black">{member.name}</h3>
                  <span className="text-xs font-black uppercase px-2 py-1 border-2 border-black bg-heirlock-yellow text-black rounded-sm">{member.role}</span>
                </div>
                <p className="text-sm font-black text-heirlock-green uppercase mb-4">Core Team</p>

                <p className="text-gray-700 text-sm mb-4 flex-1">
                  {member.bio}
                </p>

                <div className="mb-6 border-t-2 border-gray-300 pt-4">
                  <p className="text-xs font-bold text-black uppercase mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-heirlock-yellow text-black text-xs font-bold rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 border-t-2 border-gray-300 pt-4">
                  {member.website && (
                    <a href={member.website} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="Website">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="Email">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="Twitter">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.github && (
                    <a href={`https://github.com/${member.github}`} className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity" title="GitHub">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-12 md:py-20 bg-heirlock-yellow border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Advisory Board</h2>
            <p className="text-lg text-gray-800 max-w-2xl">
              Guided by leaders in blockchain, policy, and governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisors.map((advisor) => (
              <div key={advisor.name} className="border-4 border-black bg-white p-6 rounded-lg flex flex-col gap-2">
                <div className="w-16 h-16 border-4 border-black rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={githubAvatar(advisor.github)}
                    alt={`${advisor.name} avatar`}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black mb-1">{advisor.name}</h3>
                <p className="text-sm font-black text-heirlock-green uppercase mb-1">{advisor.role}</p>
                <p className="text-gray-700 text-sm">{advisor.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">Our Culture</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-black bg-heirlock-green p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-4">We Believe In</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Decentralization:</strong> Power should be distributed, not centralized.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Privacy:</strong> Your data is yours. We never sell or misuse it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Transparency:</strong> Open source where possible. Code is law.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">→</span>
                  <span className="text-black"><strong>Impact:</strong> We measure success by lives improved, not just revenue.</span>
                </li>
              </ul>
            </div>

            <div className="border-4 border-black bg-heirlock-pink p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-4">We Avoid</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Hype:</strong> We build solid technology, not marketing fluff.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Shortcuts:</strong> Security cannot be compromised for speed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Surveillance:</strong> We don't track, analyze, or profile users.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-black mt-1">✗</span>
                  <span className="text-black"><strong>Enshittification:</strong> We won't degrade service for profit.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-heirlock-blue border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Join Us</h2>
          <p className="text-lg text-black max-w-2xl mx-auto mb-8">
            We're hiring engineers, product managers, and security researchers. Interested in building the future of education security?
          </p>
          <a
            href="mailto:support@usetala.in"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </main>
  );
}

