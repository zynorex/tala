'use client';

import { Calendar, User, ArrowRight, Tag, Clock, Share2, ChevronRight } from "lucide-react";
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
      image: "📚",
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
      image: "🔐",
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
      image: "🚀",
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
      image: "🛡️",
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
      image: "⚡",
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
      image: "🎓",
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
      image: "🧠",
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
      image: "🌐",
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
      image: "⛓️",
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
      image: "🔒",
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
      image: "🎯",
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
      image: "📋",
    },
  ];

  const categories = [
    "All",
    "Security",
    "Technology",
    "Architecture",
    "Announcement",
    "Case Study",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-green border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              T.A.L.A. <br />
              Blog
            </h1>
            <p className="text-lg md:text-xl text-black max-w-3xl">
              Latest news, technical deep dives, and insights on blockchain education security.
            </p>
          </div>
        </div>
      </section>

      {/* Categories and Posts */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          {/* Categories */}
          <div className="mb-16 flex flex-wrap gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 font-bold rounded border-4 transition-colors ${
                  index === 0
                    ? "bg-heirlock-green text-black border-black"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <a key={post.id} href={`/blog/${post.id}`}>
                <div className="border-4 border-black bg-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-full flex flex-col cursor-pointer group">
                  {/* Image */}
                  <div className="bg-gray-100 p-8 text-6xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    {post.image}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Category Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-heirlock-green" />
                      <span className="text-xs font-bold text-heirlock-green uppercase">
                        {post.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 group-hover:text-heirlock-green transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-700 text-sm mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="space-y-2 text-xs text-gray-500 mb-4 border-t-2 border-gray-300 pt-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-heirlock-green font-bold group-hover:gap-3 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
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
