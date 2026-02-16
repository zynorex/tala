import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "T.A.L.A. Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const posts: Record<string, { title: string; author: string; category: string; readTime: string; date: string }> = {
  "1": { title: "Why Blockchain is Essential for Education Security", author: "Dr. Rajesh Kumar", category: "Security", readTime: "5 min read", date: "Dec 10, 2024" },
  "2": { title: "The Future of Fair Assessment: Time-Locked Education", author: "Priya Sharma", category: "Technology", readTime: "7 min read", date: "Dec 8, 2024" },
  "3": { title: "T.A.L.A. 1.0 Launch: Polygon Amoy is Live", author: "Team T.A.L.A.", category: "Announcement", readTime: "3 min read", date: "Dec 5, 2024" },
  "4": { title: "Non-Custodial Architecture: Why You Don't Have to Trust Us", author: "Dr. Rajesh Kumar", category: "Architecture", readTime: "6 min read", date: "Dec 1, 2024" },
  "5": { title: "Gas Optimization: Reducing Costs for Educational Institutions", author: "Priya Sharma", category: "Technology", readTime: "4 min read", date: "Nov 28, 2024" },
  "6": { title: "Case Study: How IIT Delhi Uses T.A.L.A. for Exam Security", author: "Team T.A.L.A.", category: "Case Study", readTime: "8 min read", date: "Nov 25, 2024" },
  "7": { title: "Understanding Smart Contracts: The Foundation of T.A.L.A.", author: "Rohan Patel", category: "Technology", readTime: "6 min read", date: "Nov 20, 2024" },
  "8": { title: "Web3 for Education: From Centralized to Decentralized Systems", author: "Dr. Rajesh Kumar", category: "Architecture", readTime: "7 min read", date: "Nov 15, 2024" },
  "9": { title: "Polygon Amoy: Why We Chose It for T.A.L.A.", author: "Priya Sharma", category: "Technology", readTime: "5 min read", date: "Nov 10, 2024" },
  "10": { title: "Cryptographic Hashing: How T.A.L.A. Detects Document Tampering", author: "Rohan Patel", category: "Security", readTime: "4 min read", date: "Nov 5, 2024" },
  "11": { title: "Zero-Knowledge Proofs: Verification Without Exposure", author: "Dr. Rajesh Kumar", category: "Security", readTime: "8 min read", date: "Oct 30, 2024" },
  "12": { title: "T.A.L.A. Roadmap 2026: What's Coming Next", author: "Team T.A.L.A.", category: "Announcement", readTime: "5 min read", date: "Oct 25, 2024" },
};

const categoryColor: Record<string, string> = {
  Security: "#fecaca",
  Technology: "#bfdbfe",
  Architecture: "#d9f99d",
  Announcement: "#fde68a",
  "Case Study": "#c4b5fd",
};

export default function BlogOGImage({ params }: { params: { id: string } }) {
  const post = posts[params.id];
  const title = post?.title ?? "T.A.L.A. Blog";
  const author = post?.author ?? "T.A.L.A. Team";
  const category = post?.category ?? "Blog";
  const readTime = post?.readTime ?? "";
  const date = post?.date ?? "";
  const catBg = categoryColor[category] ?? "#e5e7eb";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 0,
          background: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Thick black border frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "8px solid #000000",
            display: "flex",
          }}
        />

        {/* Subtle grid pattern background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Top section: Logo + category */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "40px 48px 0 48px",
            position: "relative",
          }}
        >
          {/* Logo mark top left */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                border: "4px solid #000000",
                background: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: -1,
              }}
            >
              T
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#000000",
                  letterSpacing: -0.5,
                  lineHeight: 1,
                }}
              >
                T.A.L.A.
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: 1,
                  textTransform: "uppercase" as const,
                  marginTop: 2,
                }}
              >
                Trust is Code
              </div>
            </div>
          </div>

          {/* Category pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "8px 20px",
                border: "3px solid #000000",
                background: catBg,
                fontSize: 16,
                fontWeight: 800,
                color: "#000000",
                textTransform: "uppercase" as const,
                letterSpacing: 1,
              }}
            >
              {category}
            </div>
            <div
              style={{
                padding: "8px 20px",
                border: "3px solid #000000",
                background: "#000000",
                fontSize: 16,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: 0.5,
              }}
            >
              Blog
            </div>
          </div>
        </div>

        {/* Center: Title */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 48px",
            position: "relative",
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              width: 64,
              height: 6,
              backgroundColor: "#000000",
              marginBottom: 20,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: title.length > 50 ? 44 : 52,
              fontWeight: 900,
              color: "#000000",
              lineHeight: 1.15,
              letterSpacing: -1,
              maxWidth: "90%",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom section: Meta left, TALA branding right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 48px 40px 48px",
            position: "relative",
          }}
        >
          {/* Author + meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Initials avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  border: "3px solid #000000",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#000000",
                }}
              >
                {author
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#000000" }}>{author}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{date}</span>
                  <span style={{ color: "#d1d5db" }}>|</span>
                  <span>{readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TALA branding bottom right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#9ca3af",
                letterSpacing: 2,
                textTransform: "uppercase" as const,
              }}
            >
              usetala.in
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#000000",
                letterSpacing: -1.5,
                lineHeight: 1,
              }}
            >
              TALA
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
