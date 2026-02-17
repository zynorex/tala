'use client';

import React, { useMemo, useState } from "react";
import { Calendar, User, ArrowRight, Tag, Clock, Search, Filter, Sparkles, LayoutGrid, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Why Blockchain is Essential for Education Security",
      excerpt:
        "Exam paper leaks cost institutions thousands every year. Learn how blockchain and cryptography solve this problem permanently.",
      author: "Dr. Rajesh Kumar",
      date: "Dec 10, 2024",
      readTime: "5 min read",
      category: "Security",
      image: "Education",
      badge: "BLOCKCHAIN",
    },
    {
      id: 2,
      title: "The Future of Fair Assessment: Time-Locked Education",
      excerpt:
        "Discover how time-lock smart contracts revolutionize exam administration and ensure absolute fairness for all students.",
      author: "Priya Sharma",
      date: "Dec 8, 2024",
      readTime: "7 min read",
      category: "Technology",
      image: "TimeLock",
      badge: "SMART CONTRACTS",
    },
    {
      id: 3,
      title: "T.A.L.A. 1.0 Launch: Polygon Amoy is Live",
      excerpt:
        "We're thrilled to announce that T.A.L.A. is now live on Polygon Amoy testnet. Start deploying vault today.",
      author: "Team T.A.L.A.",
      date: "Dec 5, 2024",
      readTime: "3 min read",
      category: "Announcement",
      image: "Launch",
      badge: "LAUNCH",
    },
    {
      id: 4,
      title: "Non-Custodial Architecture: Why You Don't Have to Trust Us",
      excerpt:
        "Understand the architectural decisions that make T.A.L.A. trustless. Your keys, your security, your papers.",
      author: "Dr. Rajesh Kumar",
      date: "Dec 1, 2024",
      readTime: "6 min read",
      category: "Architecture",
      image: "Trust",
      badge: "ARCHITECTURE",
    },
    {
      id: 5,
      title: "Gas Optimization: Reducing Costs for Educational Institutions",
      excerpt:
        "How we optimized smart contracts to reduce gas costs by 70%. Better security, lower expenses.",
      author: "Priya Sharma",
      date: "Nov 28, 2024",
      readTime: "4 min read",
      category: "Technology",
      image: "Efficiency",
      badge: "OPTIMIZATION",
    },
    {
      id: 6,
      title: "Case Study: How IIT Delhi Uses T.A.L.A. for Exam Security",
      excerpt:
        "A detailed look at how India's leading institute leverages T.A.L.A. to prevent paper leaks and streamline exams.",
      author: "Team T.A.L.A.",
      date: "Nov 25, 2024",
      readTime: "8 min read",
      category: "Case Study",
      image: "CaseStudy",
      badge: "CASE STUDY",
    },
    {
      id: 7,
      title: "Understanding Smart Contracts: The Foundation of T.A.L.A.",
      excerpt:
        "A beginner's guide to smart contracts and how they enable tamper-proof, automated exam administration without intermediaries.",
      author: "Rohan Patel",
      date: "Nov 20, 2024",
      readTime: "6 min read",
      category: "Technology",
      image: "Smart",
      badge: "CONTRACTS",
    },
    {
      id: 8,
      title: "Web3 for Education: From Centralized to Decentralized Systems",
      excerpt:
        "Exploring how Web3 principles are transforming education from bottom-up. Real ownership, real control, real security.",
      author: "Dr. Rajesh Kumar",
      date: "Nov 15, 2024",
      readTime: "7 min read",
      category: "Architecture",
      image: "Web3",
      badge: "WEB3",
    },
    {
      id: 9,
      title: "Polygon Amoy: Why We Chose It for T.A.L.A.",
      excerpt:
        "Technical deep-dive into why Polygon Amoy provides the ideal environment: low gas fees, high throughput, Ethereum security.",
      author: "Priya Sharma",
      date: "Nov 10, 2024",
      readTime: "5 min read",
      category: "Technology",
      image: "Polygon",
      badge: "POLYGON",
    },
    {
      id: 10,
      title: "Cryptographic Hashing: How T.A.L.A. Detects Document Tampering",
      excerpt:
        "Learn how SHA-256 and cryptographic hashing protect exam papers from modification, deletion, or forgery attempts.",
      author: "Rohan Patel",
      date: "Nov 5, 2024",
      readTime: "4 min read",
      category: "Security",
      image: "Hashing",
      badge: "HASHING",
    },
    {
      id: 11,
      title: "Zero-Knowledge Proofs: Verification Without Exposure",
      excerpt:
        "Discover how zero-knowledge cryptography allows document verification while maintaining complete privacy of contents.",
      author: "Dr. Rajesh Kumar",
      date: "Oct 30, 2024",
      readTime: "8 min read",
      category: "Security",
      image: "ZK",
      badge: "ZERO-KNOWLEDGE",
    },
    {
      id: 12,
      title: "T.A.L.A. Roadmap 2026: What's Coming Next",
      excerpt:
        "A preview of our 2026 development roadmap: cross-chain support, zero-knowledge rollups, advanced analytics, and institutional features.",
      author: "Team T.A.L.A.",
      date: "Oct 25, 2024",
      readTime: "5 min read",
      category: "Announcement",
      image: "Roadmap",
      badge: "ROADMAP",
    },
    {
      id: 13,
      title: "GDPR and FERPA Compliance: How T.A.L.A. Meets International Standards",
      excerpt:
        "Educational data protection is paramount. Learn how our platform ensures full compliance with GDPR, FERPA, and other regulatory frameworks.",
      author: "Sarah Mitchell",
      date: "Oct 20, 2024",
      readTime: "7 min read",
      category: "Security",
      image: "Compliance",
      badge: "COMPLIANCE",
    },
    {
      id: 14,
      title: "The Total Cost of Ownership: T.A.L.A. vs Traditional Exam Security",
      excerpt:
        "A comprehensive financial analysis showing how blockchain solutions dramatically reduce operational and infrastructure costs for institutions.",
      author: "Vikram Desai",
      date: "Oct 15, 2024",
      readTime: "6 min read",
      category: "Technology",
      image: "Cost",
      badge: "ECONOMICS",
    },
    {
      id: 15,
      title: "Integration with LMS Platforms: Making T.A.L.A. Your Ecosystem",
      excerpt:
        "Seamless integration with Canvas, Blackboard, and Moodle. Learn how to connect T.A.L.A. with your existing learning management systems.",
      author: "James Chen",
      date: "Oct 10, 2024",
      readTime: "5 min read",
      category: "Technology",
      image: "Integration",
      badge: "INTEGRATION",
    },
    {
      id: 16,
      title: "Decentralized Identity in Education: Self-Sovereign Credentials",
      excerpt:
        "Explore how students can own and control their educational credentials using decentralized identity systems built on blockchain.",
      author: "Dr. Rajesh Kumar",
      date: "Oct 5, 2024",
      readTime: "8 min read",
      category: "Architecture",
      image: "Identity",
      badge: "IDENTITY",
    },
    {
      id: 17,
      title: "Institutional Adoption: A Step-by-Step Implementation Guide",
      excerpt:
        "From planning to deployment. Our comprehensive guide helps institutions implement T.A.L.A. with minimal disruption to existing operations.",
      author: "Priya Sharma",
      date: "Sep 28, 2024",
      readTime: "7 min read",
      category: "Technology",
      image: "Implementation",
      badge: "DEPLOYMENT",
    },
    {
      id: 18,
      title: "Mobile First: Accessing Secure Exams from Any Device",
      excerpt:
        "T.A.L.A. is fully optimized for mobile and tablet devices. Discover how students and administrators can work securely on the go.",
      author: "Aisha Patel",
      date: "Sep 22, 2024",
      readTime: "4 min read",
      category: "Technology",
      image: "Mobile",
      badge: "MOBILE",
    },
    {
      id: 19,
      title: "Faculty Training and Support: Preparing Your Team for Success",
      excerpt:
        "Comprehensive training programs, documentation, and 24/7 support to ensure your faculty masters T.A.L.A. with confidence.",
      author: "Team T.A.L.A.",
      date: "Sep 15, 2024",
      readTime: "5 min read",
      category: "Technology",
      image: "Training",
      badge: "TRAINING",
    },
    {
      id: 20,
      title: "Global Expansion: T.A.L.A. Across Continents and Currencies",
      excerpt:
        "Learn about our international expansion strategy and how T.A.L.A. adapts to different educational systems and regulatory requirements worldwide.",
      author: "Dr. Rajesh Kumar",
      date: "Sep 8, 2024",
      readTime: "6 min read",
      category: "Announcement",
      image: "Global",
      badge: "GLOBAL",
    },
    {
      id: 21,
      title: "Preventing Cheating with AI: Detection Without Surveillance",
      excerpt:
        "Advanced machine learning techniques that detect suspicious exam behavior while respecting student privacy and avoiding oppressive surveillance.",
      author: "Rohan Patel",
      date: "Sep 1, 2024",
      readTime: "7 min read",
      category: "Technology",
      image: "Detection",
      badge: "ANOMALY DETECTION",
    },
    {
      id: 22,
      title: "Student Data Privacy: Your Information, Your Control",
      excerpt:
        "How T.A.L.A. empowers students with complete control over their educational data through end to end encryption and self-sovereign identity.",
      author: "Sarah Mitchell",
      date: "Aug 25, 2024",
      readTime: "6 min read",
      category: "Security",
      image: "Privacy",
      badge: "PRIVACY",
    },
    {
      id: 23,
      title: "The Future of Assessment: From Standardized Tests to Competency Verification",
      excerpt:
        "How blockchain and time-locked assessment are reshaping educational evaluation to focus on real skills and competencies instead of test scores.",
      author: "Priya Sharma",
      date: "Aug 18, 2024",
      readTime: "8 min read",
      category: "Architecture",
      image: "Assessment",
      badge: "ASSESSMENT",
    },
    {
      id: 24,
      title: "Audit Trails and Transparency: Complete Accountability in Exam Administration",
      excerpt:
        "Every action is logged immutably. Understand how comprehensive audit trails protect institutions and ensure fair, transparent exam processes.",
      author: "Vikram Desai",
      date: "Aug 12, 2024",
      readTime: "5 min read",
      category: "Security",
      image: "Audit",
      badge: "TRANSPARENCY",
    },
  ];

  const categories = ["All", "Security", "Technology", "Architecture", "Announcement", "Case Study"] as const;

  const [categoryFilter, setCategoryFilter] = useState<typeof categories[number]>("All");
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;
      const term = search.toLowerCase();
      const haystack = `${post.title} ${post.excerpt} ${post.author} ${post.category}`.toLowerCase();
      const matchesSearch = term ? haystack.includes(term) : true;
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, search, posts]);

  const getCover = (label: string) => {
    const palette = [
      "from-[#dbeafe] to-[#eff6ff]",
      "from-[#ecfdf3] to-[#f0fdf4]",
      "from-[#fff7ed] to-[#fffbeb]",
      "from-[#f5f3ff] to-[#faf5ff]",
      "from-[#eef2ff] to-[#f8fafc]",
    ];
    const color = palette[label.length % palette.length];
    const initials = label.slice(0, 2).toUpperCase();
    return { color, initials };
  };

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-black">
      <section className="border-b-4 border-black bg-white py-12 md:py-16 pt-24 md:pt-28">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full text-xs font-semibold uppercase">
                <Sparkles className="w-4 h-4" /> Editorial
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">T.A.L.A. Briefings and Deep Dives</h1>
              <p className="text-lg md:text-xl text-gray-800 max-w-3xl">
                Research notes, engineering updates, and field learnings on secure exam delivery and time-locked infrastructure.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-white">
                  <LayoutGrid className="w-4 h-4" /> Six categories
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-white">
                  <BookOpen className="w-4 h-4" /> Longform and summaries
                </div>
              </div>
            </div>
            <div className="w-full lg:w-96 border-[3px] border-black rounded-xl bg-heirlock-green p-4 shadow-[10px_10px_0_0_#000] space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Filter className="w-4 h-4" /> Curate your view
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search topics, authors, or titles"
                  className="w-full border-2 border-black rounded-lg py-2.5 pl-10 pr-3 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-black/10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-3 py-1.5 border-2 border-black rounded-full text-sm font-semibold transition-transform ${
                      categoryFilter === category ? "bg-black text-white" : "bg-white hover:-translate-y-0.5"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-800">
                Filter by topic or search to jump directly to the material you need. All posts are edited for clarity and auditability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const cover = getCover(post.image);
              return (
                <Link key={post.id} href={`/blog/${post.id}`} className="block h-full">
                  <article className="h-full border-[3px] border-black bg-white rounded-xl shadow-[10px_10px_0_0_#000] hover:-translate-y-1 transition-transform flex flex-col">
                    <div className={`h-36 rounded-t-lg border-b-2 border-black bg-gradient-to-br ${cover.color} flex items-center justify-between px-4`}>
                      <div className="text-2xl font-black tracking-tight leading-tight max-w-xs">{post.badge}</div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full text-xs font-semibold uppercase">
                        <Tag className="w-4 h-4" />
                        {post.category}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-black leading-snug line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{post.excerpt}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600 border-t-2 border-gray-200 pt-4">
                        <span className="inline-flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</span>
                        <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                        <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
                      </div>
                      <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-black">
                        Read article <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
            {filteredPosts.length === 0 && (
              <div className="col-span-full border-[3px] border-black rounded-xl bg-white p-6 text-gray-700 shadow-[6px_6px_0_0_#000]">
                No posts match your filters. Try a different term or category.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 md:py-20 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-black mb-8">
              Subscribe to our newsletter for weekly updates on T.A.L.A., blockchain education, and security insights.
            </p>
            <div className="flex gap-4 max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white text-black border-4 border-black font-bold placeholder-gray-500"
              />
              <button className="bg-black text-heirlock-green px-6 py-3 font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

