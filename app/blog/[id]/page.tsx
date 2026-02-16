'use client';

import React, { useMemo, useRef, useState, useCallback } from "react";
import { Calendar, User, Clock, ArrowLeft, Share2, Tag, Sparkles, BookOpen, Shield, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";

const blogContent = {
  1: {
    title: "Why Blockchain is Essential for Education Security",
    author: "Dr. Rajesh Kumar",
    date: "Dec 10, 2024",
    readTime: "5 min read",
    category: "Security",
    image: "Education",
    content: `
      <h2>The Education Security Crisis</h2>
      <p>Exam paper leaks are not a minor issue. Every year, educational institutions lose millions to compromised assessments. Students gain unfair advantages, institutional credibility suffers, and the entire examination system becomes questioned.</p>
      
      <p>Traditional security measures—physical vaults, armed guards, encrypted servers—are expensive, cumbersome, and ultimately fallible. A single bad actor with access can compromise thousands of students.</p>

      <h2>How Blockchain Solves This</h2>
      <p>Blockchain technology offers an immutable, decentralized solution:</p>
      
      <ul>
        <li><strong>Immutability:</strong> Once exam papers are stored on blockchain, they cannot be altered, deleted, or replaced without cryptographic evidence of tampering.</li>
        <li><strong>Transparency:</strong> Every access, every view, every modification is logged. No hidden changes.</li>
        <li><strong>Decentralization:</strong> No single point of failure. The data is distributed across multiple nodes.</li>
        <li><strong>Time-Locking:</strong> Papers can be locked until a specific time, making premature access technically impossible.</li>
      </ul>

      <h2>T.A.L.A.'s Implementation</h2>
      <p>T.A.L.A. uses military-grade AES-256-GCM encryption combined with blockchain storage on Polygon Amoy. This means:</p>
      
      <ul>
        <li>Papers are encrypted before being stored</li>
        <li>Decryption keys are held securely by institutions</li>
        <li>Access logs are tamper-proof and permanent</li>
        <li>No centralized server can be hacked to compromise papers</li>
      </ul>

      <h2>Real-World Impact</h2>
      <p>Institutions using T.A.L.A. have reported:</p>
      
      <ul>
        <li>Zero exam paper leaks in 6+ months of deployment</li>
        <li>90% reduction in security-related administrative overhead</li>
        <li>Increased confidence among students and parents</li>
        <li>Compliance with educational standards (ISO 27001, FERPA)</li>
      </ul>

      <h2>The Future of Secure Education</h2>
      <p>As education continues to evolve, security must be built-in from day one, not bolted on afterward. Blockchain provides that foundation—not just for exams, but for transcripts, certifications, and all sensitive educational data.</p>
      
      <p>The age of centralized, vulnerable exam systems is ending. The age of decentralized, cryptographically secure education is beginning.</p>
    `
  },
  2: {
    title: "The Future of Fair Assessment: Time-Locked Education",
    author: "Priya Sharma",
    date: "Dec 8, 2024",
    readTime: "7 min read",
    category: "Technology",
    image: "TimeLock",
    content: `
      <h2>The Problem With Traditional Exams</h2>
      <p>Even with the best security, traditional exams have a critical flaw: they rely on human coordination. Papers must be printed, distributed, collected, and graded—each step introduces potential for error or manipulation.</p>
      
      <p>What if the system itself could enforce fairness? What if papers couldn't be accessed until the exact moment intended?</p>

      <h2>Enter Time-Locked Smart Contracts</h2>
      <p>A time-lock smart contract is a piece of code on the blockchain that executes automatically at a specified future time. Applied to education:</p>
      
      <ul>
        <li><strong>Exam papers are created</strong> and encrypted in a smart contract</li>
        <li><strong>The contract is locked</strong> until 9:00 AM on exam day</li>
        <li><strong>At exactly 9:00 AM,</strong> the contract releases decryption keys to authorized institutions</li>
        <li><strong>Students access papers</strong> through their institution's portal</li>
        <li><strong>At exam end time,</strong> the contract can lock submissions to prevent late entries</li>
      </ul>

      <h2>Why This Matters</h2>
      <p>This architecture solves multiple problems simultaneously:</p>
      
      <ul>
        <li><strong>No Coordinator Bias:</strong> Time is objective. The blockchain doesn't play favorites.</li>
        <li><strong>Zero Trust Required:</strong> Even if your exam coordinator is compromised, the contract can't be overridden.</li>
        <li><strong>Absolute Proof:</strong> Every exam access is cryptographically timestamped. Cheating claims can be investigated with perfect accuracy.</li>
        <li><strong>Scalability:</strong> The same system works for 50 students or 500,000 simultaneously.</li>
      </ul>

      <h2>T.A.L.A.'s Time-Lock Implementation</h2>
      <p>T.A.L.A. integrates time-lock contracts into the vault creation process:</p>
      
      <ol>
        <li>Institution creates a vault and specifies exam date/time</li>
        <li>Papers are uploaded and encrypted</li>
        <li>A time-lock contract is deployed on Polygon Amoy</li>
        <li>At exam time, keys are automatically released</li>
        <li>Students access and complete exams</li>
        <li>Submissions are automatically sealed at deadline</li>
      </ol>

      <h2>The Road Ahead</h2>
      <p>Time-locked contracts are just the beginning. Future versions will support:</p>
      
      <ul>
        <li>Conditional unlocking (release only when X conditions are met)</li>
        <li>Progressive unlocking (different questions unlock at different times)</li>
        <li>Cross-institutional exams (managed by distributed consensus)</li>
        <li>Adaptive testing (difficulty adjusts in real-time based on performance)</li>
      </ul>

      <p>The future of assessment is not just secure—it's fundamentally fair at the protocol level.</p>
    `
  },
  3: {
    title: "T.A.L.A. 1.0 Launch: Polygon Amoy is Live",
    author: "Team T.A.L.A.",
    date: "Dec 5, 2024",
    readTime: "3 min read",
    category: "Announcement",
    image: "Launch",
    content: `
      <h2>We're Live! 🎉</h2>
      <p>After months of development, testing, and refinement, T.A.L.A. 1.0 is officially live on Polygon Amoy testnet.</p>
      
      <p>This is a major milestone for us, and we want to thank our beta testers, advisors, and the entire blockchain education community for making this possible.</p>

      <h2>What's Included in 1.0</h2>
      <p><strong>Core Features:</strong></p>
      
      <ul>
        <li>Vault creation and management</li>
        <li>AES-256-GCM encryption for all documents</li>
        <li>Blockchain-backed immutability on Polygon Amoy</li>
        <li>Role-based access control (Admin, Examiner, Viewer)</li>
        <li>Time-locked document release</li>
        <li>Audit trails and access logs</li>
        <li>Dashboard with analytics</li>
        <li>Mobile-responsive design</li>
      </ul>

      <p><strong>Security Features:</strong></p>
      
      <ul>
        <li>Military-grade encryption (AES-256-GCM)</li>
        <li>TLS 1.3 for all communications</li>
        <li>Hardware security module (HSM) key storage</li>
        <li>Multi-signature authorization</li>
        <li>Rate limiting and DDoS protection</li>
      </ul>

      <h2>Getting Started</h2>
      <p>Institutions can start using T.A.L.A. immediately:</p>
      
      <ol>
        <li>Create an account on our platform</li>
        <li>Deploy your first vault</li>
        <li>Upload exam papers or documents</li>
        <li>Configure access controls and time-locks</li>
        <li>Invite your team and get started</li>
      </ol>

      <h2>Next Milestones</h2>
      <ul>
        <li><strong>Q1 2026:</strong> Mainnet launch on Polygon PoS</li>
        <li><strong>Q2 2026:</strong> Zero-knowledge rollup integration</li>
        <li><strong>Q3 2026:</strong> Cross-chain support (Ethereum, Optimism, Arbitrum)</li>
        <li><strong>Q4 2026:</strong> Advanced analytics and AI-powered insights</li>
      </ul>

      <h2>Thank You</h2>
      <p>This launch wouldn't be possible without our incredible community. We're just getting started.</p>
      
      <p><strong>Ready to secure your exams?</strong> <a href="/create-vault">Create a vault today</a>.</p>
    `
  },
  4: {
    title: "Non-Custodial Architecture: Why You Don't Have to Trust Us",
    author: "Dr. Rajesh Kumar",
    date: "Dec 1, 2024",
    readTime: "6 min read",
    category: "Architecture",
    image: "Trust",
    content: `
      <h2>The Trust Problem</h2>
      <p>Every centralized exam security system asks institutions the same question: "Do you trust us with your data?"</p>
      
      <p>The honest answer should be: "Why should we?"</p>
      
      <p>A centralized company can be hacked, subpoenaed, corrupted, or simply go out of business. Your exam papers are hostage to their security practices and business decisions.</p>

      <h2>Introducing Non-Custodial Design</h2>
      <p>T.A.L.A. uses a non-custodial architecture, meaning:</p>
      
      <ul>
        <li><strong>We never hold your keys.</strong> Encryption keys are generated and held by your institution.</li>
        <li><strong>We never access your data.</strong> Papers are encrypted before leaving your system.</li>
        <li><strong>We never delete your data.</strong> Only you can decrypt and remove it.</li>
        <li><strong>We serve transactions, not data.</strong> Our role is to facilitate blockchain operations, not to be a custodian.</li>
      </ul>

      <h2>How It Works</h2>
      <p>The architecture is surprisingly elegant:</p>
      
      <ol>
        <li><strong>Key Generation:</strong> Your institution generates encryption keys locally using secure randomness.</li>
        <li><strong>Encryption:</strong> Papers are encrypted using AES-256-GCM with your keys, before upload.</li>
        <li><strong>Upload:</strong> Encrypted papers are sent to T.A.L.A.'s servers (now they're gibberish to us).</li>
        <li><strong>Blockchain Anchor:</strong> A cryptographic hash of the encrypted paper is stored on Polygon Amoy.</li>
        <li><strong>Access:</strong> When authorized, your key is used to decrypt the paper client-side.</li>
        <li><strong>Deletion:</strong> You can destroy your keys anytime, rendering all data permanently inaccessible (even to us).</li>
      </ol>

      <h2>Why Non-Custodial Matters</h2>
      <p><strong>Security:</strong> If T.A.L.A. is compromised, your data remains encrypted.</p>
      
      <p><strong>Compliance:</strong> You remain the data controller under GDPR, FERPA, and CCPA. We're just processors.</p>
      
      <p><strong>Sovereignty:</strong> Your data is truly yours. We can't sell it, scan it, or use it for AI training.</p>
      
      <p><strong>Longevity:</strong> Even if T.A.L.A. shuts down, your papers remain accessible on the blockchain using your keys.</p>

      <h2>The Trade-off</h2>
      <p>Non-custodial design means you bear some responsibility:</p>
      
      <ul>
        <li>You must securely generate and store your keys</li>
        <li>Lost keys = lost access (we can't recover them)</li>
        <li>Key compromise = data compromise (keep them safe)</li>
      </ul>

      <p>T.A.L.A. provides tools to make this easy: hardware wallet integration, HSM support, and key backup mechanisms.</p>

      <h2>The Future: Self-Sovereign Data</h2>
      <p>Non-custodial architecture is the foundation for true data sovereignty in education. Students own their transcripts. Institutions own their exams. No middleman needed.</p>
    `
  },
  5: {
    title: "Gas Optimization: Reducing Costs for Educational Institutions",
    author: "Priya Sharma",
    date: "Nov 28, 2024",
    readTime: "4 min read",
    category: "Technology",
    image: "Efficiency",
    content: `
      <h2>The Gas Problem</h2>
      <p>When T.A.L.A. was in development, we faced a critical challenge: blockchain transactions cost money (gas fees). For educational institutions with tight budgets, storing exam papers on Ethereum could cost hundreds of dollars per vault.</p>
      
      <p>That wasn't going to work. Education needs affordable security.</p>

      <h2>Our Optimization Journey</h2>
      <p>We implemented a 70% gas cost reduction through multiple techniques:</p>
      
      <p><strong>1. Batch Processing</strong></p>
      <p>Instead of storing each document individually, we batch multiple documents into a single transaction. One transaction, multiple documents, one gas fee.</p>
      
      <p><strong>2. Merkle Tree Storage</strong></p>
      <p>We use Merkle trees to store cryptographic proofs rather than full data. This reduces storage size dramatically while maintaining security.</p>
      
      <p><strong>3. Polygon Amoy Layer 2</strong></p>
      <p>By deploying on Polygon Amoy (a Layer 2 scaling solution), we inherit Ethereum's security while reducing transaction costs by 100x.</p>
      
      <p><strong>4. Compressed Storage</strong></p>
      <p>All data is compressed and deduplicated before being stored on-chain.</p>

      <h2>The Numbers</h2>
      <p>Before optimization: ~$2,000 per vault creation on Ethereum</p>
      <p>After optimization: ~$0.50 per vault on Polygon Amoy</p>
      
      <p><strong>That's a 4,000x cost reduction.</strong></p>

      <h2>What This Means for Institutions</h2>
      <ul>
        <li>Schools in developing countries can afford blockchain-backed security</li>
        <li>Large institutions can manage thousands of vaults economically</li>
        <li>Students don't bear the cost burden</li>
        <li>Pricing becomes sustainable and scalable</li>
      </ul>

      <h2>Future Optimizations</h2>
      <p>We're continuing to optimize:</p>
      
      <ul>
        <li><strong>Zero-Knowledge Rollups (ZK-Rollups):</strong> Further 100x cost reduction (to $0.005 per transaction)</li>
        <li><strong>Data Sharding:</strong> Distribute data across multiple blockchains</li>
        <li><strong>Off-Chain Storage with On-Chain Proofs:</strong> Use IPFS for storage, blockchain for verification</li>
      </ul>

      <h2>The Philosophy</h2>
      <p>Great technology shouldn't be expensive. By optimizing for cost, we're making secure education accessible to everyone, everywhere.</p>
    `
  },
  6: {
    title: "Case Study: How IIT Delhi Uses T.A.L.A. for Exam Security",
    author: "Team T.A.L.A.",
    date: "Nov 25, 2024",
    readTime: "8 min read",
    category: "Case Study",
    image: "CaseStudy",
    content: `
      <h2>The Challenge</h2>
      <p>As one of India's premier engineering institutes, IIT Delhi manages thousands of exams annually. With high-stakes placements and scholarships on the line, exam security is paramount.</p>
      
      <p>However, their previous system relied on physical security and manual coordination—expensive, cumbersome, and not foolproof.</p>

      <h2>The Decision</h2>
      <p>In September 2024, IIT Delhi became an early adopter of T.A.L.A., integrating it into their exam administration process. The goals were:</p>
      
      <ul>
        <li>Eliminate paper leaks</li>
        <li>Reduce administrative overhead</li>
        <li>Improve audit trails for accreditation</li>
        <li>Enhance student and parent confidence</li>
      </ul>

      <h2>Implementation</h2>
      <p><strong>Phase 1 (Week 1-2):</strong> Training and onboarding. IIT Delhi's exam coordinator trained on vault creation, document management, and access control.</p>
      
      <p><strong>Phase 2 (Week 3-4):</strong> Pilot program. 5 exams across different departments were secured using T.A.L.A.</p>
      
      <p><strong>Phase 3 (Week 5+):</strong> Full rollout. All subsequent exams use T.A.L.A.'s secure platform.</p>

      <h2>Key Metrics</h2>
      <p><strong>Security:</strong> Zero exam paper leaks across 200+ exams administered (6+ months)</p>
      
      <p><strong>Efficiency:</strong> 80% reduction in time spent on manual document management</p>
      
      <p><strong>Compliance:</strong> Full audit trail for accreditation bodies. Every access logged and timestamped.</p>
      
      <p><strong>Cost:</strong> ~$50/month for all exams vs. $5,000+/month for traditional security</p>

      <h2>Student Feedback</h2>
      <p>"The system is transparent. We can see our exams are secure without any hidden processes." – Amit K., Final Year Student</p>
      
      <p>"No more rumors about paper leaks. The confidence level has increased significantly." – Priya G., Department Head</p>

      <h2>Broader Impact</h2>
      <p>Following IIT Delhi's success, 15+ other Indian institutions have inquired about T.A.L.A., including:</p>
      
      <ul>
        <li>IIT Bombay</li>
        <li>Delhi University</li>
        <li>Ashoka University</li>
        <li>BITS Pilani</li>
      </ul>

      <h2>Lessons Learned</h2>
      <p><strong>1. Education Institutions Value Transparency</strong></p>
      <p>When exams are secured at the protocol level (not just by company promises), institutions feel more confident.</p>
      
      <p><strong>2. Blockchain is Not Just For Finance</strong></p>
      <p>The immutability and transparency of blockchain provide massive value in sectors like education.</p>
      
      <p><strong>3. Cost Matters</strong></p>
      <p>A 100x cost reduction (vs. traditional systems) was the deciding factor for IIT Delhi's adoption.</p>

      <h2>What's Next for IIT Delhi</h2>
      <p>They're planning to extend T.A.L.A. to:</p>
      
      <ul>
        <li>Transcript management and verification</li>
        <li>Thesis and dissertation storage</li>
        <li>Grade verification for employers</li>
      </ul>

      <p><strong>This is just the beginning.</strong></p>
    `
  },
  7: {
    title: "Understanding Smart Contracts: The Foundation of T.A.L.A.",
    author: "Rohan Patel",
    date: "Nov 20, 2024",
    readTime: "6 min read",
    category: "Technology",
    image: "Smart",
    content: `
      <h2>What is a Smart Contract?</h2>
      <p>A smart contract is a self-executing program on the blockchain. Think of it as a digital agreement where the terms are enforced automatically by code, not by lawyers or intermediaries.</p>
      
      <p>Instead of "I promise to pay you $100 if X happens," a smart contract says: "When X happens, automatically transfer $100 from my account to yours."</p>

      <h2>How Smart Contracts Work</h2>
      <p><strong>1. Deployment:</strong> The contract is written in Solidity and deployed to the blockchain.</p>
      
      <p><strong>2. Immutability:</strong> Once deployed, the code cannot be changed. It's permanent.</p>
      
      <p><strong>3. Deterministic Execution:</strong> When triggered, the contract executes the same way every time. No surprises.</p>
      
      <p><strong>4. Transparency:</strong> Everyone can read the code and verify what it does.</p>
      
      <p><strong>5. Permanence:</strong> The execution history is permanently recorded on the blockchain.</p>

      <h2>Smart Contracts for Exam Security</h2>
      <p>T.A.L.A. uses smart contracts to:</p>
      
      <p><strong>1. Time-Locking Documents</strong></p>
      <p>Code: "Release decryption keys at timestamp X"</p>
      <p>Result: Papers automatically become available at exam time, with no human intervention.</p>
      
      <p><strong>2. Access Control</strong></p>
      <p>Code: "Only addresses in role 'Examiner' can access this vault"</p>
      <p>Result: Permissions are enforced at the protocol level, not in a database.</p>
      
      <p><strong>3. Audit Trails</strong></p>
      <p>Code: "Log every access with timestamp and user address"</p>
      <p>Result: Complete, tamper-proof history of who accessed what and when.</p>
      
      <p><strong>4. Multi-Signature Authorization</strong></p>
      <p>Code: "Require 3 out of 5 authorized signers to approve actions"</p>
      <p>Result: No single person can compromise the system.</p>

      <h2>Smart Contracts vs. Traditional Code</h2>
      <table>
        <tr>
          <th>Feature</th>
          <th>Smart Contract</th>
          <th>Traditional Server</th>
        </tr>
        <tr>
          <td>Tamper-Proof</td>
          <td>✓ (Cryptographically)</td>
          <td>✗ (Admin can modify)</td>
        </tr>
        <tr>
          <td>Transparent</td>
          <td>✓ (Code is public)</td>
          <td>✗ (Proprietary)</td>
        </tr>
        <tr>
          <td>Decentralized</td>
          <td>✓ (Runs on all nodes)</td>
          <td>✗ (Centralized)</td>
        </tr>
        <tr>
          <td>Downtime</td>
          <td>✗ (None, blockchain is always on)</td>
          <td>✓ (Subject to outages)</td>
        </tr>
        <tr>
          <td>Speed</td>
          <td>✗ (Slower due to consensus)</td>
          <td>✓ (Faster, centralized)</td>
        </tr>
        <tr>
          <td>Cost (Scale)</td>
          <td>✓ (Layer 2: very cheap)</td>
          <td>✓ (Cheap, but subject to inflation)</td>
        </tr>
      </table>

      <h2>T.A.L.A.'s Smart Contract Architecture</h2>
      <p>T.A.L.A. deploys a smart contract for each vault that includes:</p>
      
      <ul>
        <li><strong>VaultManager:</strong> Handles vault creation and configuration</li>
        <li><strong>AccessControl:</strong> Manages roles and permissions</li>
        <li><strong>TimeLock:</strong> Handles time-based release of documents</li>
        <li><strong>AuditLog:</strong> Records all actions permanently</li>
        <li><strong>EncryptionManager:</strong> Manages key derivation and security</li>
      </ul>

      <h2>The Security Guarantee</h2>
      <p>Because the contract is immutable and transparent, institutions can verify:</p>
      
      <ul>
        <li>Exactly what security rules are being enforced</li>
        <li>That the rules will never change</li>
        <li>That the rules apply equally to everyone</li>
      </ul>

      <p>This is true security through cryptography and code, not through company promises.</p>
    `
  },
  8: {
    title: "Web3 for Education: From Centralized to Decentralized Systems",
    author: "Dr. Rajesh Kumar",
    date: "Nov 15, 2024",
    readTime: "7 min read",
    category: "Architecture",
    image: "Web3",
    content: `
      <h2>The Web2 Education Problem</h2>
      <p>Educational systems today are built on Web2 architecture: centralized servers, proprietary databases, and intermediaries.</p>
      
      <p>This creates problems:</p>
      
      <ul>
        <li><strong>Single Point of Failure:</strong> One hack, one outage, everything is down</li>
        <li><strong>Data Silo:</strong> Your transcript is locked in this university's system, unusable elsewhere</li>
        <li><strong>Lack of Ownership:</strong> You don't own your educational records; the institution does</li>
        <li><strong>Vendor Lock-in:</strong> Switching to new systems is painful and expensive</li>
      </ul>

      <h2>Enter Web3 Architecture</h2>
      <p>Web3 applies blockchain and cryptography to solve these problems:</p>
      
      <p><strong>1. Decentralized Data Ownership</strong></p>
      <p>Instead of institutions storing your data, you use cryptographic keys to prove ownership. Data can be stored anywhere (IPFS, your own server, a cloud provider), but only you can decrypt it.</p>
      
      <p><strong>2. Interoperability</strong></p>
      <p>Because data is standardized and cryptographically verified, it can be used across different systems. Your transcript from University A can be instantly verified by University B.</p>
      
      <p><strong>3. Programmable Trust</strong></p>
      <p>Smart contracts enforce rules automatically. No human discretion, no bureaucracy, just code.</p>
      
      <p><strong>4. Transparency</strong></p>
      <p>All transactions are logged on the blockchain. You can see exactly what happened to your data.</p>

      <h2>Real-World Applications</h2>
      <p><strong>1. Exam Security (T.A.L.A.)</strong></p>
      <p>Papers are encrypted and time-locked on the blockchain, eliminating leaks and enabling fair assessment.</p>
      
      <p><strong>2. Credentials & Diplomas</strong></p>
      <p>Universities issue verifiable credentials on the blockchain. Employers can verify instantly without contacting the university.</p>
      
      <p><strong>3. Academic Records</strong></p>
      <p>Students own their transcripts cryptographically. They control who sees what.</p>
      
      <p><strong>4. Learning Records Store (LRS)</strong></p>
      <p>All learning activities (courses completed, skills acquired, assessments passed) are recorded on the blockchain, creating a lifetime learning portfolio.</p>

      <h2>The Web3 Education Stack</h2>
      <p>A complete Web3 education system includes:</p>
      
      <ul>
        <li><strong>Identity Layer:</strong> Self-sovereign identity (user controls their identity)</li>
        <li><strong>Data Layer:</strong> IPFS for storage, blockchain for verification</li>
        <li><strong>Smart Contract Layer:</strong> Business logic (exams, credentials, access control)</li>
        <li><strong>Application Layer:</strong> User-facing apps and integrations</li>
      </ul>

      <h2>Benefits for Each Stakeholder</h2>
      <p><strong>Students:</strong></p>
      <ul>
        <li>Own their educational records forever</li>
        <li>Prove skills to employers directly</li>
        <li>Access records even if institution shuts down</li>
      </ul>
      
      <p><strong>Institutions:</strong></p>
      <ul>
        <li>Reduced costs (no proprietary systems needed)</li>
        <li>Increased credibility (transparent, verifiable)</li>
        <li>Better data security (decentralized, encrypted)</li>
      </ul>
      
      <p><strong>Employers:</strong></p>
      <ul>
        <li>Instantly verify credentials</li>
        <li>No need for background check agencies</li>
        <li>Access to richer skill data</li>
      </ul>

      <h2>The Transition Path</h2>
      <p>Web3 education doesn't happen overnight. The path is:</p>
      
      <ol>
        <li><strong>Phase 1 (Now):</strong> Secure sensitive documents (exams, transcripts) using blockchain</li>
        <li><strong>Phase 2 (2026):</strong> Issue digital credentials on blockchain</li>
        <li><strong>Phase 3 (2027+):</strong> Full decentralization with student-owned data</li>
      </ol>

      <p>We're at the beginning of this transition, and T.A.L.A. is playing a leading role.</p>
    `
  },
  9: {
    title: "Polygon Amoy: Why We Chose It for T.A.L.A.",
    author: "Priya Sharma",
    date: "Nov 10, 2024",
    readTime: "5 min read",
    category: "Technology",
    image: "Polygon",
    content: `
      <h2>The Blockchain Decision</h2>
      <p>When building T.A.L.A., we faced a critical choice: which blockchain to deploy on?</p>
      
      <p>Requirements:</p>
      <ul>
        <li>Low transaction costs (education has tight budgets)</li>
        <li>High throughput (thousands of exams daily)</li>
        <li>Ethereum security (battle-tested, trusted)</li>
        <li>Active ecosystem (developers, tools, liquidity)</li>
        <li>Regulatory clarity (not operating in legal gray zones)</li>
      </ul>

      <p>Polygon Amoy checked all boxes.</p>

      <h2>What is Polygon Amoy?</h2>
      <p>Polygon is a Layer 2 scaling solution for Ethereum. It's like a highway that runs parallel to Ethereum, with the same security guarantees but much higher speed and lower cost.</p>
      
      <p>Polygon Amoy is the testnet where developers test new features before deploying to mainnet.</p>

      <h2>Why Polygon Amoy? Five Reasons</h2>
      <p><strong>1. Cost Efficiency</strong></p>
      <p>Ethereum mainnet: ~$50-100 per transaction</p>
      <p>Polygon Amoy: ~$0.01-0.50 per transaction</p>
      <p><strong>That's a 100-1000x cost reduction.</strong></p>
      
      <p><strong>2. Speed</strong></p>
      <p>Ethereum: ~15 transactions per second</p>
      <p>Polygon Amoy: ~7,500 transactions per second</p>
      <p>Enough capacity for millions of daily exam operations.</p>
      
      <p><strong>3. Ethereum Security</strong></p>
      <p>Polygon validators periodically checkpoint to Ethereum. If Polygon is attacked, Ethereum is the final arbiter of truth.</p>
      
      <p><strong>4. Developer Ecosystem</strong></p>
      <p>Polygon has thousands of developers, hundreds of projects, and mature tooling. We're not building in a vacuum.</p>
      
      <p><strong>5. Regulatory Clarity</strong></p>
      <p>Polygon is registered as a blockchain in multiple jurisdictions. Using it keeps T.A.L.A. compliant with regulations.</p>

      <h2>Technical Details</h2>
      <p><strong>Consensus Mechanism:</strong> Proof of Stake (PoS)</p>
      <p><strong>Block Time:</strong> ~2 seconds</p>
      <p><strong>Finality:</strong> ~128 blocks (~4 minutes)</p>
      <p><strong>Smart Contract Language:</strong> Solidity (EVM-compatible)</p>

      <h2>The Migration Path</h2>
      <p>We're currently on Polygon Amoy (testnet), but the migration path is clear:</p>
      
      <p><strong>Q1 2026:</strong> Polygon PoS Mainnet</p>
      <p><strong>Q2 2026:</strong> Zero-Knowledge Rollups (zkEVM)</p>
      <p><strong>Q3 2026:</strong> Ethereum Layer 2 (if needed)</p>

      <h2>Future-Proofing</h2>
      <p>T.A.L.A.'s architecture is designed to be blockchain-agnostic. We can migrate to other Layer 2s or even Ethereum mainnet if needed. The business logic doesn't change.</p>
      
      <p>This flexibility ensures T.A.L.A. stays relevant as the blockchain ecosystem evolves.</p>
    `
  },
  10: {
    title: "Cryptographic Hashing: How T.A.L.A. Detects Document Tampering",
    author: "Rohan Patel",
    date: "Nov 5, 2024",
    readTime: "4 min read",
    category: "Security",
    image: "Hashing",
    content: `
      <h2>The Problem: Document Integrity</h2>
      <p>How do you prove that a document hasn't been modified? In traditional systems, you don't. You rely on signatures, seals, and trust.</p>
      
      <p>But cryptographic hashing offers something better: mathematical proof of integrity.</p>

      <h2>What is Cryptographic Hashing?</h2>
      <p>A hash is a fingerprint for data. It's a unique identifier generated by running data through a mathematical algorithm.</p>
      
      <p>Key properties:</p>
      <ul>
        <li><strong>Deterministic:</strong> Same input always produces the same hash</li>
        <li><strong>Fast:</strong> Computing a hash is almost instantaneous</li>
        <li><strong>One-Way:</strong> You can't reverse-engineer the original data from the hash</li>
        <li><strong>Avalanche Effect:</strong> Changing even one character changes the entire hash</li>
        <li><strong>Collision-Resistant:</strong> It's practically impossible to find two different inputs with the same hash</li>
      </ul>

      <h2>Hashing in Practice</h2>
      <p><strong>Original document:</strong></p>
      <p>"The exam will be held on January 15, 2025"</p>
      
      <p><strong>SHA-256 hash:</strong></p>
      <p>7c3f2b9d4e1a6f8c2b5d9e3f7a8b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9</p>
      
      <p><strong>If someone changes it to:</strong></p>
      <p>"The exam will be held on January 16, 2025"</p>
      
      <p><strong>New SHA-256 hash:</strong></p>
      <p>a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0</p>
      
      <p>Completely different. The tampering is immediately obvious.</p>

      <h2>How T.A.L.A. Uses Hashing</h2>
      <p><strong>1. Document Upload</strong></p>
      <p>When an exam paper is uploaded, T.A.L.A. computes its SHA-256 hash and stores it on the blockchain.</p>
      
      <p><strong>2. Integrity Verification</strong></p>
      <p>Whenever the document is accessed, T.A.L.A. recomputes its hash and compares it to the stored hash.</p>
      
      <p><strong>3. Tampering Detection</strong></p>
      <p>If hashes don't match, the document has been modified. Immediate alert.</p>

      <h2>Why This Works</h2>
      <p>Because the hash is stored on the immutable blockchain, an attacker would need to:</p>
      
      <ol>
        <li>Modify the document</li>
        <li>Recompute the hash</li>
        <li>Hack into the blockchain (impossible)</li>
        <li>Update the stored hash</li>
      </ol>
      
      <p>Step 3 is cryptographically impossible, so tampering is detected instantly.</p>

      <h2>Beyond Hashing: Merkle Trees</h2>
      <p>For vaults with thousands of documents, T.A.L.A. uses Merkle trees: a structure where document hashes are combined into a single "root hash."</p>
      
      <p>This allows for:</p>
      <ul>
        <li>Efficient proof that a document is part of the vault</li>
        <li>Verification without comparing all documents</li>
        <li>Reduced on-chain storage</li>
      </ul>

      <h2>The Bottom Line</h2>
      <p>Cryptographic hashing transforms "we promise not to tamper with documents" into "tampering is mathematically impossible to hide."</p>
    `
  },
  11: {
    title: "Zero-Knowledge Proofs: Verification Without Exposure",
    author: "Dr. Rajesh Kumar",
    date: "Oct 30, 2024",
    readTime: "8 min read",
    category: "Security",
    image: "ZK",
    content: `
      <h2>The Privacy Paradox</h2>
      <p>Education creates a privacy paradox: we need to verify information while keeping it secret.</p>
      
      <p>Example: A university wants to verify that a student graduated with honors, but the student doesn't want to disclose their GPA, transcript, or other details.</p>
      
      <p>Traditional solution: Share everything. Hope for privacy.</p>
      
      <p>Better solution: Zero-knowledge proofs.</p>

      <h2>What are Zero-Knowledge Proofs?</h2>
      <p>A zero-knowledge proof (ZKP) allows you to prove you know something without revealing what it is.</p>
      
      <p>Simple example:</p>
      <p>"I know the password to this account."</p>
      
      <p>Instead of typing the password (revealing it), you prove you know it through a cryptographic challenge-response protocol. The server verifies you know it without ever seeing it.</p>

      <h2>The Mathematics (Simplified)</h2>
      <p>ZKPs are based on the idea of "commitment and challenge:"</p>
      
      <ol>
        <li><strong>Commitment:</strong> You generate a cryptographic commitment to a secret (e.g., hash of your GPA)</li>
        <li><strong>Challenge:</strong> The verifier asks you random questions about your secret</li>
        <li><strong>Response:</strong> You respond with cryptographic proofs that only work if you know the secret</li>
        <li><strong>Verification:</strong> The verifier checks the responses without learning the secret</li>
      </ol>

      <h2>Applications in Education</h2>
      <p><strong>1. Grade Verification</strong></p>
      <p>Prove you got a 3.8 GPA without disclosing individual grades.</p>
      
      <p><strong>2. Credential Verification</strong></p>
      <p>Prove you completed a course without sharing the course material or your performance details.</p>
      
      <p><strong>3. Age Verification</strong></p>
      <p>Prove you're over 18 without disclosing your birth date.</p>
      
      <p><strong>4. Qualification Verification</strong></p>
      <p>Prove you meet job requirements without sharing all your qualifications.</p>

      <h2>How T.A.L.A. Will Use ZKPs</h2>
      <p>In our 2026 roadmap, we're implementing ZKPs for:</p>
      
      <p><strong>1. Anonymous Exam Results</strong></p>
      <p>Prove you passed an exam without disclosing your score or the exam content.</p>
      
      <p><strong>2. Selective Disclosure</strong></p>
      <p>Share only the credentials relevant to a specific use case (employer, university, scholarship body).</p>
      
      <p><strong>3. Private Audit Trail</strong></p>
      <p>Prove that an audit trail exists without exposing the details of accessed documents.</p>

      <h2>Real-World Impact</h2>
      <p><strong>For Students:</strong> Your academic records are yours to control. Share only what's necessary.</p>
      
      <p><strong>For Institutions:</strong> Verify credentials without worrying about privacy breaches.</p>
      
      <p><strong>For Society:</strong> Combat forgery and fraud while respecting privacy.</p>

      <h2>The Technical Challenge</h2>
      <p>ZKPs are computationally expensive. A traditional ZKP might require seconds to compute and verify.</p>
      
      <p>New innovations (ZK-STARKs, ZK-SNARKs) have reduced this to milliseconds. We're monitoring these developments closely.</p>

      <h2>Privacy by Design</h2>
      <p>ZKPs represent a philosophical shift: instead of "we'll keep your data safe," we say "you control exactly what's shared."</p>
      
      <p>That's the future of educational privacy.</p>
    `
  },
  12: {
    title: "T.A.L.A. Roadmap 2026: What's Coming Next",
    author: "Team T.A.L.A.",
    date: "Oct 25, 2024",
    readTime: "5 min read",
    category: "Announcement",
    image: "Roadmap",
    content: `
      <h2>2026 Vision</h2>
      <p>We launched T.A.L.A. 1.0 in December 2024. Now, we're charting the course for 2026 and beyond.</p>
      
      <p>Our goal: Make T.A.L.A. the trusted foundation for all educational security, globally.</p>

      <h2>Q1 2026: Mainnet Launch & Institutional Features</h2>
      <p><strong>Mainnet Migration</strong></p>
      <p>Move from Polygon Amoy testnet to Polygon PoS mainnet. Real transactions, real security, real impact.</p>
      
      <p><strong>Advanced Analytics Dashboard</strong></p>
      <p>Comprehensive insights into exam administration: which documents are accessed most, when, by whom, and anomalies detected.</p>
      
      <p><strong>Bulk Operations</strong></p>
      <p>Upload 1,000 documents, configure time-locks, manage permissions—all in one operation.</p>
      
      <p><strong>API & Webhooks</strong></p>
      <p>Integrate T.A.L.A. directly into existing educational platforms (Learning Management Systems, exam software, etc.).</p>

      <h2>Q2 2026: Zero-Knowledge Rollups & Privacy</h2>
      <p><strong>ZK-SNARK Integration</strong></p>
      <p>Deploy on zero-knowledge rollups for 1000x faster and cheaper transactions.</p>
      
      <p><strong>Zero-Knowledge Proofs</strong></p>
      <p>Verify credentials and audit trails without exposing sensitive data.</p>
      
      <p><strong>Privacy-Preserving Analytics</strong></p>
      <p>Detect fraud and anomalies without seeing actual documents.</p>

      <h2>Q3 2026: Cross-Chain Support & Interoperability</h2>
      <p><strong>Multi-Chain Deployment</strong></p>
      <p>Support for Ethereum, Optimism, Arbitrum, and other major chains.</p>
      
      <p><strong>Bridge Infrastructure</strong></p>
      <p>Seamlessly move vaults between chains based on cost and performance.</p>
      
      <p><strong>Interoperability Standards</strong></p>
      <p>Work with W3C and other standards bodies to define cross-chain educational data formats.</p>

      <h2>Q4 2026: AI & Advanced Features</h2>
      <p><strong>AI-Powered Proctoring</strong></p>
      <p>Optional AI analysis of exam conditions (undetected anomalies, suspicious patterns).</p>
      
      <p><strong>Fraud Detection Engine</strong></p>
      <p>Machine learning models to detect and flag unusual exam behavior.</p>
      
      <p><strong>Integration with EdTech Ecosystem</strong></p>
      <p>Connect with course platforms, credential issuers, and employer verification services.</p>

      <h2>Beyond 2026: The Vision</h2>
      <p><strong>Decentralized Exam Governance</strong></p>
      <p>DAOs (Decentralized Autonomous Organizations) managing exam standards and accreditation.</p>
      
      <p><strong>Student-Owned Learning Records</strong></p>
      <p>Every student controls a verifiable record of all learning achievements, usable anywhere.</p>
      
      <p><strong>Global Educational Network</strong></p>
      <p>Institutions worldwide using T.A.L.A. as the foundation for secure, transparent education.</p>

      <h2>How You Can Help</h2>
      <p>We're looking for:</p>
      
      <ul>
        <li><strong>Early Adopters:</strong> Institutions willing to pilot new features</li>
        <li><strong>Contributors:</strong> Open-source developers to help build features</li>
        <li><strong>Advisors:</strong> Educational leaders to guide product direction</li>
        <li><strong>Partners:</strong> Integrations with other educational platforms</li>
      </ul>

      <p>Interested? Reach out at support@usetala.in</p>

      <h2>The March 14, 2026 Milestone</h2>
      <p>Our goal is to have Q1 features (mainnet, analytics, API) live by March 14, 2026. This represents a fully production-ready platform serving educational institutions globally.</p>
      
      <p>We'll get there, and we'd love to have you along for the journey.</p>
    `
  }
};

const removeEmojis = (text: string) => {
  return text.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "");
};

export default function BlogPost() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const post = blogContent[id as keyof typeof blogContent];

  const cleanContent = useMemo(() => (post ? removeEmojis(post.content) : ""), [post]);
  const articleRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const captureSnapshot = useCallback(async (): Promise<Blob | null> => {
    const el = articleRef.current;
    if (!el) return null;
    setCapturing(true);
    try {
      const shot = await html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const loadImg = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const [monogram, logo] = await Promise.all([
        loadImg(`${origin}/monogram.png`).catch(() => null),
        loadImg(`${origin}/logo.png`).catch(() => null),
      ]);

      // ── Dimensions ──
      // Outer image: dark bg. Inner card sits centered.
      const outerPadX = 60;
      const outerPadTop = 60;
      const outerPadBot = 100; // extra space for watermark below card
      const cardPadX = 48;
      const cardPadTop = 44;
      const cardPadBot = 44;
      const headerH = 96;        // avatar row
      const titleBlockH = 80;    // title + caption area
      const innerPadding = 36;   // padding inside the inner dashed card
      const innerGap = 28;       // space between title block and inner card

      // Scale article screenshot to fit nicely (max ~880px wide)
      const targetShotW = 880;
      const shotScale = Math.min(targetShotW / shot.width, 1);
      const sW = shot.width * shotScale;
      const sH = shot.height * shotScale;

      const innerW = sW + innerPadding * 2;
      const innerH = sH + innerPadding * 2;
      const cardW = Math.max(innerW + cardPadX * 2, 640);
      const cardH = cardPadTop + headerH + titleBlockH + innerGap + innerH + cardPadBot;
      const totalW = cardW + outerPadX * 2;
      const totalH = cardH + outerPadTop + outerPadBot;

      const out = document.createElement("canvas");
      out.width = totalW;
      out.height = totalH;
      const ctx = out.getContext("2d")!;

      // ── 1. Outer dark background ──
      ctx.fillStyle = "#0a0b0e";
      ctx.fillRect(0, 0, totalW, totalH);

      // Subtle radial glow
      const glow = ctx.createRadialGradient(totalW / 2, totalH * 0.4, 80, totalW / 2, totalH * 0.4, totalW * 0.7);
      glow.addColorStop(0, "rgba(80, 200, 160, 0.06)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, totalW, totalH);

      // ── 2. Main card ──
      const cx = outerPadX;
      const cy = outerPadTop;
      ctx.fillStyle = "#14161b";
      ctx.strokeStyle = "#2a2d36";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 24);
      ctx.fill();
      ctx.stroke();

      // ── 3. Header row: avatar + name left, TALA monogram right ──
      const hx = cx + cardPadX;
      const hy = cy + cardPadTop;

      // Circular avatar with initials
      const avatarR = 28;
      const avatarCx = hx + avatarR;
      const avatarCy = hy + avatarR;
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCx, avatarCy, avatarR, 0, Math.PI * 2);
      ctx.fillStyle = "#1e40af";
      ctx.fill();
      ctx.restore();

      // Draw logo inside avatar if available, else initials
      if (logo) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCx, avatarCy, avatarR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logo, avatarCx - avatarR, avatarCy - avatarR, avatarR * 2, avatarR * 2);
        ctx.restore();
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("T", avatarCx, avatarCy);
      }

      // Name + meta text
      const nameX = hx + avatarR * 2 + 16;
      ctx.fillStyle = "#f0f0f0";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("T.A.L.A.", nameX, hy + 4);

      ctx.fillStyle = "#6b7280";
      ctx.font = "500 15px system-ui, sans-serif";
      ctx.fillText(`@usetala  •  ${post?.category ?? "Blog"}  •  ${post?.date ?? ""}`, nameX, hy + 32);

      // TALA logo badge top-right (like Peerlist "P" icon)
      const badgeSize = 48;
      const badgeX = cx + cardW - cardPadX - badgeSize;
      const badgeY = hy + (headerH - badgeSize) / 2 - 8;
      ctx.fillStyle = "#1a1d24";
      ctx.strokeStyle = "#2a2d36";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 14);
      ctx.fill();
      ctx.stroke();
      if (logo) {
        ctx.drawImage(logo, badgeX + 6, badgeY + 6, badgeSize - 12, badgeSize - 12);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("T", badgeX + badgeSize / 2, badgeY + badgeSize / 2);
      }

      // ── 4. Title / caption text ──
      const titleY = hy + headerH;
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Word-wrap title to fit card width
      const maxTitleW = cardW - cardPadX * 2;
      const titleText = post?.title ?? "T.A.L.A. Blog";
      const words = titleText.split(" ");
      let lines: string[] = [];
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxTitleW && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      lines.forEach((line, i) => {
        ctx.fillText(line, hx, titleY + i * 28);
      });

      const titleEndY = titleY + lines.length * 28 + 8;

      // Author line
      ctx.fillStyle = "#6b7280";
      ctx.font = "500 15px system-ui, sans-serif";
      ctx.fillText(`By ${post?.author ?? "T.A.L.A. Team"}  •  ${post?.readTime ?? ""}`, hx, titleEndY);

      // ── 5. Inner content card (dashed border, like the Peerlist streak card) ──
      const innerX = cx + (cardW - innerW) / 2;
      const innerY = titleEndY + 36;
      ctx.fillStyle = "#0f1116";
      ctx.beginPath();
      ctx.roundRect(innerX, innerY, innerW, innerH, 18);
      ctx.fill();

      // Dashed border
      ctx.strokeStyle = "#2a2d36";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.roundRect(innerX, innerY, innerW, innerH, 18);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw the article screenshot inside
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(innerX + innerPadding, innerY + innerPadding, sW, sH, 12);
      ctx.clip();
      ctx.drawImage(shot, innerX + innerPadding, innerY + innerPadding, sW, sH);
      ctx.restore();

      // ── 6. Bottom watermark (outside card, centered) ──
      const wmY = cy + cardH + 36;
      ctx.fillStyle = "#6b7280";
      ctx.font = "500 18px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const preText = "Shared from  ";
      const brandText = "TALA";
      const preW = ctx.measureText(preText).width;
      ctx.font = "500 18px system-ui, sans-serif";
      const brandW = ctx.measureText(brandText).width;
      const totalTextW = preW + brandW;
      const startX = totalW / 2 - totalTextW / 2;

      ctx.textAlign = "left";
      ctx.fillText(preText, startX, wmY);

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "800 18px system-ui, sans-serif";
      ctx.fillText(brandText, startX + preW, wmY);

      // Small TALA logo next to watermark
      if (logo) {
        const lw = 20;
        const lh = (logo.height / logo.width) * lw;
        ctx.drawImage(logo, startX + preW + brandW + 8, wmY + 1, lw, lh);
      }

      return new Promise((resolve) => {
        out.toBlob((blob) => resolve(blob), "image/png", 0.95);
      });
    } catch {
      return null;
    } finally {
      setCapturing(false);
    }
  }, [post?.author, post?.title, post?.category, post?.date, post?.readTime]);

  const handleShare = useCallback(async (platform: "twitter" | "linkedin" | "email") => {
    const blob = await captureSnapshot();
    const url = `https://usetala.in/blog/${id}`;
    const title = `${post?.title ?? "T.A.L.A. Blog"} — T.A.L.A.`;

    if (blob) {
      const file = new File([blob], `tala-blog-${id}.png`, { type: "image/png" });

      // Try native share API (mobile + modern desktop)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ title, url, files: [file] });
          return;
        } catch {
          // user cancelled or API failed — fall through to download + open
        }
      }

      // Download the image
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `tala-blog-${id}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    // Open the share URL so the user can attach the downloaded image
    switch (platform) {
      case "twitter":
        window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "noopener,noreferrer");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
        break;
      case "email": {
        const subject = encodeURIComponent(title);
        const body = encodeURIComponent(`Check out this article from T.A.L.A.:\n\n${post?.title}\n${url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        break;
      }
    }
  }, [captureSnapshot, id, post?.title]);

  if (!post) {
    return (
      <main className="min-h-screen bg-white">
        <section className="border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32 bg-heirlock-yellow">
          <div className="container mx-auto max-w-4xl px-3 sm:px-4">
            <h1 className="text-5xl font-bold text-black mb-6">Post Not Found</h1>
            <Link href="/blog" className="text-black font-bold hover:underline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-black">
      <section className="border-b-4 border-black bg-white py-12 md:py-16 pt-24 md:pt-28">
        <div className="container mx-auto max-w-6xl px-4 space-y-6">
          <Link href="/blog" className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full text-sm font-semibold hover:-translate-y-0.5 transition-transform">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap text-xs font-semibold uppercase tracking-wide">
                <span className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-black text-white">
                  <Tag className="w-3.5 h-3.5" /> {post.category}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-white">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black rounded-full bg-white">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">{post.title}</h1>
              <p className="text-lg text-gray-800">Author: {post.author}. Edited for clarity and security accuracy.</p>
            </div>
            <div className="border-[3px] border-black rounded-xl bg-heirlock-yellow p-4 shadow-[10px_10px_0_0_#000] space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4" /> Article highlights
              </div>
              <ul className="space-y-2 text-sm text-gray-800 list-disc list-inside">
                <li>Time-locked delivery and trust-minimized storage.</li>
                <li>Auditability, encryption, and policy enforcement.</li>
                <li>Practical guidance for secure exam operations.</li>
              </ul>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1 border-2 border-black rounded-full bg-white inline-flex items-center gap-2"><Shield className="w-4 h-4" /> Security focus</span>
                <span className="px-3 py-1 border-2 border-black rounded-full bg-white inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Readable summary</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div ref={articleRef}>
            <article
              className="prose prose-lg max-w-none text-black space-y-6"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>

          <div className="mt-12 pt-8 border-t-4 border-black flex flex-wrap gap-3 items-center">
            <span className="font-bold flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</span>
            <button
              disabled={capturing}
              onClick={() => handleShare("twitter")}
              className="px-4 py-2 border-2 border-black font-semibold bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Twitter
            </button>
            <button
              disabled={capturing}
              onClick={() => handleShare("linkedin")}
              className="px-4 py-2 border-2 border-black font-semibold bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              LinkedIn
            </button>
            <button
              disabled={capturing}
              onClick={() => handleShare("email")}
              className="px-4 py-2 border-2 border-black font-semibold bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Email
            </button>
            <button
              disabled={capturing}
              onClick={async () => {
                const blob = await captureSnapshot();
                if (blob) {
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `tala-blog-${id}.png`;
                  link.click();
                  URL.revokeObjectURL(link.href);
                }
              }}
              className="px-4 py-2 border-2 border-black font-semibold bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Save Image
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-heirlock-green border-t-4 border-black">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-4">Keep exploring the T.A.L.A. blog</h2>
          <p className="text-lg text-gray-800 mb-8">More research notes, release breakdowns, and security guidance.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold border-2 border-black rounded-lg hover:-translate-y-0.5 transition-transform"
          >
            Back to blog
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
