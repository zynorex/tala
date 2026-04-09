import type { Metadata } from "next";

const posts: Record<string, { title: string; author: string; category: string; description: string }> = {
  "1": {
    title: "Why Blockchain is Essential for Education Security",
    author: "Dr. Rajesh Kumar",
    category: "Security",
    description:
      "Exam paper leaks cost institutions millions every year. Discover how blockchain technology offers an immutable, decentralized solution for education security.",
  },
  "2": {
    title: "The Future of Fair Assessment: Time-Locked Education",
    author: "Priya Sharma",
    category: "Technology",
    description:
      "Time-locked encryption ensures exam papers stay sealed until the scheduled moment. Explore how T.A.L.A. makes fair assessment a technical guarantee.",
  },
  "3": {
    title: "T.A.L.A. 1.0 Launch: Polygon Amoy is Live",
    author: "Team T.A.L.A.",
    category: "Announcement",
    description:
      "T.A.L.A. 1.0 is officially live on Polygon Amoy. Read about the launch, initial features, and what this means for secure education.",
  },
  "4": {
    title: "Non-Custodial Architecture: Why You Don't Have to Trust Us",
    author: "Dr. Rajesh Kumar",
    category: "Architecture",
    description:
      "T.A.L.A. is built so you never have to trust us with your data. Learn how non-custodial architecture keeps control in your hands.",
  },
  "5": {
    title: "Gas Optimization: Reducing Costs for Educational Institutions",
    author: "Priya Sharma",
    category: "Technology",
    description:
      "Blockchain transactions cost gas. See how T.A.L.A. optimizes smart contract operations to keep costs minimal for schools and universities.",
  },
  "6": {
    title: "Case Study: How IIT Delhi Uses T.A.L.A. for Exam Security",
    author: "Team T.A.L.A.",
    category: "Case Study",
    description:
      "IIT Delhi adopted T.A.L.A. for exam paper security. This case study covers the implementation, results, and lessons learned.",
  },
  "7": {
    title: "Understanding Smart Contracts: The Foundation of T.A.L.A.",
    author: "Rohan Patel",
    category: "Technology",
    description:
      "Smart contracts power every vault, lock, and unlock in T.A.L.A. A clear explanation of how they work and why they matter.",
  },
  "8": {
    title: "Web3 for Education: From Centralized to Decentralized Systems",
    author: "Dr. Rajesh Kumar",
    category: "Architecture",
    description:
      "Education systems are still centralized and vulnerable. Explore the shift to Web3 and what decentralization means for academic integrity.",
  },
  "9": {
    title: "Polygon Amoy: Why We Chose It for T.A.L.A.",
    author: "Priya Sharma",
    category: "Technology",
    description:
      "Why Polygon Amoy over Ethereum mainnet? The technical and economic reasoning behind T.A.L.A.'s chain selection.",
  },
  "10": {
    title: "Cryptographic Hashing: How T.A.L.A. Detects Document Tampering",
    author: "Rohan Patel",
    category: "Security",
    description:
      "SHA-256 hashing makes tampering detectable instantly. Learn how T.A.L.A. uses cryptographic hashes to verify document integrity.",
  },
  "11": {
    title: "Zero-Knowledge Proofs: Verification Without Exposure",
    author: "Dr. Rajesh Kumar",
    category: "Security",
    description:
      "Verify that a document exists without revealing its contents. An introduction to zero-knowledge proofs and their role in T.A.L.A.",
  },
  "12": {
    title: "T.A.L.A. Roadmap 2026: What's Coming Next",
    author: "Team T.A.L.A.",
    category: "Announcement",
    description:
      "Multi-chain support, mobile apps, institutional dashboards, and more. A look at what the T.A.L.A. team is building next.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = posts[id];

  if (!post) {
    return {
      title: "Blog | T.A.L.A.",
      description: "Read the latest from the T.A.L.A. team.",
    };
  }

  const title = `${post.title} | T.A.L.A. Blog`;

  return {
    title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description: post.description,
      type: "article",
      siteName: "T.A.L.A.",
      url: `https://usetala.in/blog/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
