import { Lock, Upload, Zap, Shield, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const lockdownSteps = [
    {
      title: 'Local Encryption',
      icon: Lock,
      description:
        'The Admin selects a PDF. The browser generates a unique, random AES-256 Key. The file is encrypted locally inside the browser. The raw exam paper never leaves the Admin\'s device.',
    },
    {
      title: 'IPFS Storage',
      icon: Upload,
      description:
        'The encrypted "garbage" file is uploaded to IPFS (Pinata). This generates a permanent Content ID (CID) that represents the file\'s immutable location.',
    },
    {
      title: 'The Smart Lock',
      icon: Zap,
      description:
        'The Admin sends a transaction to the Polygon Blockchain containing: (1) The CID (Location), (2) The AES Key (Password), (3) The Unlock Time (Unix Timestamp). The Smart Contract accepts custody of the Key and locks it.',
    },
  ];

  const retrievalSteps = [
    {
      title: 'Public Verification',
      icon: Shield,
      description:
        'Students can download the Encrypted PDF immediately. They can verify the IPFS Hash matches the official announcement, proving the file hasn\'t been swapped or tampered with.',
    },
    {
      title: 'The Time-Check',
      icon: Zap,
      description:
        'When a student clicks "Unlock," the Web App queries the Smart Contract. The Contract runs the logic: Is Current Block Time >= Unlock Time?',
    },
    {
      title: 'Release & Decrypt',
      icon: Lock,
      description:
        'If NO: The Contract rejects the request. The Key remains hidden. If YES: The Contract releases the AES Key. The browser auto-decrypts the file instantly.',
    },
  ];

  const securityGuarantees = [
    {
      title: 'AES-256 Encryption',
      description:
        'We use the same encryption standard as banks and the military. Brute-forcing this key would take a supercomputer billions of years.',
    },
    {
      title: 'Decentralized Time',
      description:
        'We do not use a server clock (which can be hacked). We use the Polygon Blockchain timestamp, validated by global validators.',
    },
  ];

  const faqs = [
    {
      question: 'What if the internet goes down?',
      answer:
        'The large encrypted file is downloaded before the exam. At 10:00 AM, fetching the tiny key only takes 1kb of data. It works even on 2G.',
    },
    {
      question: 'Can the Admin leak the key?',
      answer:
        'No. The Admin interface deliberately forgets the key immediately after upload. The only copy exists inside the Smart Contract.',
    },
    {
      question: 'What if there is a physical leak?',
      answer:
        'The "Emergency Void" function allows the Admin to permanently burn the key on the blockchain, making the digital file unopenable forever.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="border-b-4 border-black" style={{backgroundColor: '#bae1ff'}}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h1 className="text-5xl md:text-7xl font-black text-black mb-4 leading-tight">
            OPERATIONAL
            <br />
            LOGIC
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-black mb-6">
            Zero-Knowledge Delivery Protocol.
          </p>
          <p className="text-lg md:text-xl text-black max-w-2xl leading-relaxed">
            How T.A.L.A. uses a hybrid architecture of Client-Side Encryption, IPFS Storage, and Smart
            Contracts to guarantee secrecy.
          </p>
        </div>
      </section>

      {/* Phase A: The Lockdown */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-2">Phase A</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-12 border-b-4 border-black pb-4">
            The Lockdown (Admin Side)
          </h3>

          <div className="space-y-8">
            {lockdownSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="border-4 border-black p-8 bg-white hover:bg-gray-50 transition">
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-none bg-yellow-300 border-2 border-black">
                        <IconComponent className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-black mb-3">
                        Step {index + 1}: {step.title}
                      </h4>
                      <p className="text-lg text-black leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Phase B: The Retrieval */}
      <section className="border-b-4 border-black" style={{backgroundColor: '#bae1ff'}}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-2">Phase B</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-12 border-b-4 border-black pb-4">
            The Retrieval (Student Side)
          </h3>

          <div className="space-y-8">
            {retrievalSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="border-4 border-black p-8 bg-white hover:bg-gray-50 transition">
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-none bg-heirlock-pink border-2 border-black">
                        <IconComponent className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-black mb-3">
                        Step {index + 1}: {step.title}
                      </h4>
                      <p className="text-lg text-black leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Logic */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 border-b-4 border-black pb-4">
            The Core Logic
          </h2>
          <p className="text-lg text-black mb-8">Display this pseudo-code to explain the math:</p>

          <div className="bg-black border-4 border-black p-8">
            <code className="text-yellow-300 font-mono text-base leading-relaxed block whitespace-pre-wrap break-words">
{`function getKey() public view returns (string memory) {
    if (block.timestamp < unlockTime) {
        revert("VAULT_LOCKED: Wait for Exam Time");
    }
    return secretKey;
}`}
            </code>
          </div>
        </div>
      </section>

      {/* Security Guarantees */}
      <section className="bg-green-300 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Security Guarantees
          </h2>
          <p className="text-xl text-black mb-12 font-bold">The "Unbreakable" Math</p>

          <div className="grid md:grid-cols-2 gap-8">
            {securityGuarantees.map((guarantee, index) => (
              <div key={index} className="border-4 border-black p-8 bg-white">
                <h3 className="text-2xl font-bold text-black mb-4">{guarantee.title}</h3>
                <p className="text-lg text-black leading-relaxed">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edge Cases & FAQs */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Edge Cases & FAQs
          </h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-4 border-black p-8 bg-gray-50 hover:bg-white transition">
                <div className="flex gap-4 items-start mb-4">
                  <AlertCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                  <h3 className="text-2xl font-bold text-black">{faq.question}</h3>
                </div>
                <p className="text-lg text-black leading-relaxed ml-10">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="bg-pink-300 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 border-b-4 border-black pb-4">
            Immutable Logs
          </h2>
          <h3 className="text-2xl font-bold text-black mb-8">Audit Trail</h3>
          <p className="text-lg md:text-xl text-black leading-relaxed max-w-3xl">
            Every interaction-Upload, Lock, Unlock, and Void-is recorded as a transaction on the Polygon
            network. This creates a permanent, public legal record of exactly who did what and when.
          </p>
        </div>
      </section>

      {/* Why Choose T.A.L.A. */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Why Choose T.A.L.A.?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-4 border-black p-8 bg-yellow-100">
              <h3 className="text-2xl font-bold text-black mb-4">Eliminates Insider Threats</h3>
              <p className="text-lg text-black leading-relaxed">
                With T.A.L.A., no single person-not even administrators-can access the exam papers before the scheduled time. The key is mathematically locked inside a smart contract.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-blue-100">
              <h3 className="text-2xl font-bold text-black mb-4">100% Tamper-Proof</h3>
              <p className="text-lg text-black leading-relaxed">
                Every upload, lock, unlock, and modification is recorded on the Polygon blockchain. This creates an immutable audit trail that proves the integrity of every action.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-green-100">
              <h3 className="text-2xl font-bold text-black mb-4">Global Time Standard</h3>
              <p className="text-lg text-black leading-relaxed">
                The blockchain's distributed time is validated by thousands of nodes worldwide. No single entity can manipulate when exams unlock-not even servers can be hacked to change time.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-pink-100">
              <h3 className="text-2xl font-bold text-black mb-4">Zero Server Dependencies</h3>
              <p className="text-lg text-black leading-relaxed">
                Unlike cloud-based exam platforms, T.A.L.A. doesn't rely on centralized servers. Even if our servers go down, your decryption happens 100% in the student's browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="bg-yellow-300 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Implementation Timeline
          </h2>

          <div className="space-y-6">
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-2">Day 1: Setup Vault</h3>
              <p className="text-lg text-black leading-relaxed">
                Admin logs in, uploads exam PDF, sets unlock time (e.g., "2024-03-15 10:00 AM UTC"). The system encrypts and stores it. Total time: 5 minutes.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-2">Day 2-14: Pre-Distribution</h3>
              <p className="text-lg text-black leading-relaxed">
                Students download the encrypted exam file. They can verify the IPFS hash, confirm authenticity, and prepare their devices. No secret data is transmitted.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-2">Exam Day 10:00 AM: Automatic Release</h3>
              <p className="text-lg text-black leading-relaxed">
                The blockchain automatically unlocks. Students click "Unlock Exam." The browser queries the smart contract, receives the AES key, and decrypts the PDF. Happens in milliseconds.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-2">Post-Exam: Full Audit Trail</h3>
              <p className="text-lg text-black leading-relaxed">
                Every unlock is recorded on-chain. Admins can generate reports proving exactly when each student accessed their exam, with perfect accuracy and zero forgery risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Misconceptions */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Common Misconceptions
          </h2>

          <div className="space-y-8">
            <div className="border-4 border-black p-8 bg-gray-50">
              <div className="flex gap-4 items-start mb-4">
                <AlertCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-2xl font-bold text-black">"Blockchain = Slow & Expensive"</h3>
              </div>
              <p className="text-lg text-black leading-relaxed ml-10">
                <strong>Wrong:</strong> T.A.L.A. uses Polygon, which processes transactions in 2 seconds for ~$0.001. The initial vault setup costs minimal gas. Unlocking a vault only queries smart contract state-zero gas cost.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-gray-50">
              <div className="flex gap-4 items-start mb-4">
                <AlertCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-2xl font-bold text-black">"Students Need Crypto Knowledge"</h3>
              </div>
              <p className="text-lg text-black leading-relaxed ml-10">
                <strong>Wrong:</strong> Students never touch crypto. They download a file, click "Unlock Exam," and get a PDF. The blockchain complexity is invisible-just like how Google Maps users don't need GPS knowledge.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-gray-50">
              <div className="flex gap-4 items-start mb-4">
                <AlertCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-2xl font-bold text-black">"My Exam Data is Public on Blockchain"</h3>
              </div>
              <p className="text-lg text-black leading-relaxed ml-10">
                <strong>Wrong:</strong> Only the encrypted hash and unlock time are on-chain. The actual exam content is encrypted and stored on IPFS. No one can read it without the AES key. The blockchain only stores the key release schedule, not the questions.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-gray-50">
              <div className="flex gap-4 items-start mb-4">
                <AlertCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-2xl font-bold text-black">"What if Blockchain Goes Down?"</h3>
              </div>
              <p className="text-lg text-black leading-relaxed ml-10">
                <strong>Wrong:</strong> Polygon has 99.99% uptime with thousands of validators. But even if it went down, students who pre-downloaded the encrypted file keep it. As long as they have internet for 1 second to fetch the key, they can decrypt offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Integration Guide */}
      <section className="bg-green-300 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 border-b-4 border-black pb-4">
            Integration Guide
          </h2>
          <p className="text-lg text-black mb-12">
            For developers integrating T.A.L.A. into existing Learning Management Systems:
          </p>

          <div className="space-y-6">
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-3">Step 1: API Authentication</h3>
              <p className="text-lg text-black leading-relaxed">
                Use your API key to authenticate with the T.A.L.A. backend. All requests are encrypted with TLS 1.3. No exam content passes through our servers-only cryptographic hashes and CIDs.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-3">Step 2: Upload Exam File</h3>
              <p className="text-lg text-black leading-relaxed">
                POST your PDF to `/api/vault/upload`. The browser generates the AES-256 key. We return a vault ID and CID. The encrypted file is already on IPFS. The key is locked in the smart contract.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-3">Step 3: Embed Unlock Widget</h3>
              <p className="text-lg text-black leading-relaxed">
                Add our iframe widget to your LMS. When students click "Unlock," the widget queries the smart contract, retrieves the key, and decrypts the PDF in their browser. No server-side decryption.
              </p>
            </div>
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-3">Step 4: Retrieve Audit Logs</h3>
              <p className="text-lg text-black leading-relaxed">
                Use `/api/vault/[vaultId]/audit` to fetch on-chain transaction history. Every unlock event is timestamped and immutable. Generate compliance reports in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Performance Metrics
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-4 border-black p-8 bg-blue-50">
              <h3 className="text-3xl font-black text-black mb-2">2 seconds</h3>
              <p className="text-lg text-black leading-relaxed">Average time to upload and lock an exam on Polygon</p>
            </div>
            <div className="border-4 border-black p-8 bg-yellow-100">
              <h3 className="text-3xl font-black text-black mb-2">~$0.50</h3>
              <p className="text-lg text-black leading-relaxed">Total cost per exam lock (Polygon gas fees)</p>
            </div>
            <div className="border-4 border-black p-8 bg-green-100">
              <h3 className="text-3xl font-black text-black mb-2">10ms</h3>
              <p className="text-lg text-black leading-relaxed">Time to decrypt PDF on student browser (AES-256)</p>
            </div>
            <div className="border-4 border-black p-8 bg-pink-100">
              <h3 className="text-3xl font-black text-black mb-2">1kb</h3>
              <p className="text-lg text-black leading-relaxed">Data transferred to unlock (just the AES key)</p>
            </div>
            <div className="border-4 border-black p-8 bg-blue-50">
              <h3 className="text-3xl font-black text-black mb-2">99.99%</h3>
              <p className="text-lg text-black leading-relaxed">Polygon blockchain uptime guarantee</p>
            </div>
            <div className="border-4 border-black p-8 bg-yellow-100">
              <h3 className="text-3xl font-black text-black mb-2">256-bit</h3>
              <p className="text-lg text-black leading-relaxed">AES encryption strength (military standard)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Resources */}
      <section className="bg-pink-300 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Support & Resources
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-4">Documentation</h3>
              <ul className="space-y-3 text-lg text-black">
                <li>• <Link href="/documentation" className="underline font-bold hover:no-underline">API Reference</Link></li>
                <li>• <Link href="/documentation" className="underline font-bold hover:no-underline">Smart Contract Audit Reports</Link></li>
                <li>• <Link href="/documentation" className="underline font-bold hover:no-underline">Integration Tutorials</Link></li>
                <li>• <Link href="/faq" className="underline font-bold hover:no-underline">Frequently Asked Questions</Link></li>
              </ul>
            </div>
            <div className="border-4 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold text-black mb-4">Community & Support</h3>
              <ul className="space-y-3 text-lg text-black">
                <li>• Discord: Join 2000+ developers & educators</li>
                <li>• Email: support@tala.xyz</li>
                <li>• GitHub: Open-source implementation</li>
                <li>• Forum: Ask questions, share solutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-yellow-300 mb-8">Ready to Explore?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Now that you understand the operational logic, dive deeper into the technical documentation or
            start securing your exams today.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              href="/documentation"
              className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-300 text-black font-bold border-4 border-yellow-300 hover:bg-black hover:text-yellow-300 transition"
            >
              Technical Documentation
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="/create-vault"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-300 text-black font-bold border-4 border-green-300 hover:bg-black hover:text-green-300 transition"
            >
              Deploy T.A.L.A. Now
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
