'use client';

import { Lock, Upload, Zap, Shield, AlertCircle, ChevronRight, Check, Globe, FileText } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const lockdownSteps = [
    {
      number: 1,
      title: 'Local Encryption',
      icon: Lock,
      description:
        'The Admin (or Official) selects a file. The browser generates a unique AES-256 Key. The file is encrypted locally inside the browser. The raw document never leaves the device.',
      details: [
        'Random 256-bit key generated in-browser',
        'File encrypted using AES-256 standard',
        'Original plaintext never transmitted',
        'Key stored temporarily in memory'
      ]
    },
    {
      number: 2,
      title: 'IPFS Storage',
      icon: Upload,
      description:
        'The encrypted "garbage" file is uploaded to IPFS. This generates a permanent Content ID (CID).',
      details: [
        'Encrypted ciphertext sent to IPFS via Pinata',
        'Content hash (CID) ensures immutability',
        'File becomes permanently accessible & undeletable',
        'Distributed across thousands of nodes'
      ]
    },
    {
      number: 3,
      title: 'The Smart Lock',
      icon: Zap,
      description:
        'The Uploader sends the [CID], [Key], and [Unlock Time] to the Polygon Blockchain. The Smart Contract accepts custody of the Key.',
      details: [
        'Transaction includes: CID, AES Key, Unix Timestamp',
        'Key locked inside immutable smart contract',
        'Unlock time stored on blockchain (cannot be changed)',
        'Admin receives vault ID for future reference'
      ]
    },
  ];

  const retrievalSteps = [
    {
      number: 1,
      title: 'Verification',
      icon: Shield,
      description:
        'Users (Students/Contractors) can download the Encrypted File immediately. They verify the Hash to prove no tampering has occurred.',
      details: [
        'Encrypted PDF available on IPFS immediately',
        'Students verify IPFS hash matches official announcement',
        'Hash mismatch proves tampering = reject file',
        'Download happens in minutes (prepare in advance)'
      ]
    },
    {
      number: 2,
      title: 'The Time-Check',
      icon: Zap,
      description:
        'When a user clicks "Unlock," the Contract checks: Is Current Block Time >= Unlock Time?',
      details: [
        'Browser queries smart contract state',
        'Contract reads current blockchain timestamp (UTC)',
        'Compares: block.timestamp vs. unlockTime',
        'Zero gas cost (read-only operation)'
      ]
    },
    {
      number: 3,
      title: 'Decryption',
      icon: Lock,
      description:
        'If YES: The Key is released. The browser auto-decrypts the PDF. If NO: The Key remains mathematically inaccessible.',
      details: [
        'If time not reached: Contract reverts with "VAULT_LOCKED"',
        'If time reached: Contract returns AES-256 key',
        'Browser decrypts file instantly (10ms)',
        'PDF ready to view. No server involvement.'
      ]
    },
  ];

  const securityGuarantees = [
    {
      title: 'AES-256 Encryption',
      icon: Lock,
      description: 'Military-grade encryption standard. Same as banks and defense systems. Brute-forcing would take billions of years with current technology.'
    },
    {
      title: 'Decentralized Time',
      icon: Globe,
      description: 'Uses Polygon Blockchain timestamp, validated by 1000+ global validators. No single server clock can be hacked to fake the unlock time.'
    },
    {
      title: 'Audit Trail',
      icon: FileText,
      description: 'Every upload and unlock recorded on-chain as permanent, non-repudiable legal proof. Impossible to forge or delete transaction history.'
    },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="bg-heirlock-blue py-12 md:py-20 px-4 border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-6xl md:text-7xl font-black text-black mb-4 leading-tight">
            OPERATIONAL<br />LOGIC
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Zero-Knowledge Delivery Protocol.
          </h2>
          <p className="text-lg md:text-xl text-black leading-relaxed max-w-3xl">
            How T.A.L.A. uses a hybrid architecture of Client-Side Encryption, IPFS Storage, and Smart Contracts to guarantee absolute secrecy until the exact moment intended.
          </p>
        </div>
      </section>

      {/* Phase A: The Lockdown */}
      <section className="py-12 md:py-20 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-2">Phase A</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-black border-b-4 border-black pb-4">
              The Lockdown (The Uploader)
            </h3>
          </div>

          <div className="space-y-6">
            {lockdownSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="border-4 border-black bg-white shadow-brutal hover:shadow-brutal-lg transition-all">
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-heirlock-yellow border-4 border-black shadow-brutal">
                          <Icon className="w-6 h-6 text-black" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl md:text-3xl font-bold text-black mb-2">
                          Step {step.number}: {step.title}
                        </h4>
                        <p className="text-base md:text-lg text-black leading-relaxed mb-4">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base text-black">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Phase B: The Retrieval */}
      <section className="py-12 md:py-20 px-4 bg-heirlock-pink border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-2">Phase B</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-black border-b-4 border-black pb-4">
              The Retrieval (The Public)
            </h3>
          </div>

          <div className="space-y-6">
            {retrievalSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="border-4 border-black bg-white shadow-brutal hover:shadow-brutal-lg transition-all">
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-heirlock-green border-4 border-black shadow-brutal">
                          <Icon className="w-6 h-6 text-black" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl md:text-3xl font-bold text-black mb-2">
                          Step {step.number}: {step.title}
                        </h4>
                        <p className="text-base md:text-lg text-black leading-relaxed mb-4">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base text-black">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Smart Contract Logic */}
      <section className="py-12 md:py-20 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4 border-b-4 border-black pb-4">
              The Smart Contract Logic
            </h2>
            <p className="text-lg text-black font-bold">The core function that makes everything work:</p>
          </div>

          <div className="border-4 border-black bg-black p-8 shadow-brutal">
            <code className="text-heirlock-yellow font-mono text-base leading-relaxed block">
{`function unlockVault() public view returns (bytes32) {
    require(
        block.timestamp >= unlockTime,
        "VAULT_LOCKED: Cannot access before unlock time"
    );
    return aesKey;
}`}
            </code>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-black bg-white p-6 shadow-brutal">
              <h4 className="text-xl font-bold text-black mb-3">What This Means</h4>
              <p className="text-black leading-relaxed">
                The blockchain checks the current time. If it hasn't reached the unlock time yet, the function reverts (fails) and refuses to return the key. If the time has passed, it returns the encryption key.
              </p>
            </div>
            <div className="border-4 border-black bg-heirlock-yellow p-6 shadow-brutal">
              <h4 className="text-xl font-bold text-black mb-3">Why It's Unbreakable</h4>
              <p className="text-black leading-relaxed">
                No amount of hacking or bribery can change `block.timestamp`. It's validated by 1000+ independent nodes worldwide. No single entity controls the time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Guarantees */}
      <section className="py-12 md:py-20 px-4 bg-heirlock-yellow border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-4 border-b-4 border-black pb-4">
            Security Guarantees
          </h2>
          <p className="text-lg text-black font-bold mb-12">The cryptographic assurances that make T.A.L.A. unbreakable:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityGuarantees.map((guarantee, idx) => {
              const Icon = guarantee.icon;
              return (
                <div key={idx} className="border-4 border-black bg-white p-8 shadow-brutal hover:shadow-brutal-lg transition-all">
                  <Icon className="w-10 h-10 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-3">{guarantee.title}</h3>
                  <p className="text-black leading-relaxed">{guarantee.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-4 border-black bg-black p-8 shadow-brutal">
            <h3 className="text-2xl font-bold text-heirlock-yellow mb-4">The Bottom Line</h3>
            <p className="text-white text-lg leading-relaxed">
              Once a file is locked in T.A.L.A., there is <span className="text-heirlock-yellow font-bold">no mechanism</span> on Earth to unlock it before the scheduled time. Not hacking. Not bribery. Not executive orders. Only mathematics.
            </p>
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="py-12 md:py-20 px-4 bg-heirlock-green border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-4 border-b-4 border-black pb-4">
            Immutable Audit Trail
          </h2>
          <div className="border-4 border-black bg-white p-8 shadow-brutal">
            <p className="text-lg text-black leading-relaxed mb-6">
              Every interaction—Upload, Lock, Unlock, Emergency Void—is recorded as a permanent transaction on the Polygon network. This creates an immutable, public audit trail that proves exactly who did what and when.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-black p-4">
                <h4 className="font-bold text-black mb-2">Event: Vault Created</h4>
                <p className="text-sm text-gray-700">Admin uploads file → Transaction Hash proves upload time and CID</p>
              </div>
              <div className="border-2 border-black p-4">
                <h4 className="font-bold text-black mb-2">Event: Key Locked</h4>
                <p className="text-sm text-gray-700">Smart Contract locks AES key → Unlock time is set in stone on-chain</p>
              </div>
              <div className="border-2 border-black p-4">
                <h4 className="font-bold text-black mb-2">Event: Unlock Query</h4>
                <p className="text-sm text-gray-700">Student clicks "Unlock" → Every unlock is timestamped on-chain</p>
              </div>
              <div className="border-2 border-black p-4">
                <h4 className="font-bold text-black mb-2">Event: Emergency Void</h4>
                <p className="text-sm text-gray-700">Admin triggers cancellation → Key destroyed on blockchain (permanent record)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-12 md:py-20 px-4 bg-cream border-b-4 border-black">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-12 border-b-4 border-black pb-4">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="border-4 border-black bg-white p-6 shadow-brutal">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-black">Can an admin leak the key before the unlock time?</h3>
              </div>
              <p className="text-black ml-10 leading-relaxed">
                No. The admin interface deliberately does NOT store the key locally. After encryption, the key exists in two places only: (1) locked in the smart contract, (2) nowhere else. Even the admin cannot retrieve it early.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-brutal">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-black">What if the blockchain gets hacked?</h3>
              </div>
              <p className="text-black ml-10 leading-relaxed">
                The blockchain (Polygon) has 1000+ validators running independently worldwide. Hacking it would require simultaneously compromising the majority of these independent servers—impossible. No single entity controls the time.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-brutal">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-black">What if internet goes down on exam day?</h3>
              </div>
              <p className="text-black ml-10 leading-relaxed">
                Students pre-download the encrypted file (hours in advance). On exam day, they only need 1 second of internet to fetch the 1kb AES key. Even 2G internet suffices. Decryption happens offline in their browser.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-brutal">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-black">Can someone tamper with the encrypted file on IPFS?</h3>
              </div>
              <p className="text-black ml-10 leading-relaxed">
                No. The file's IPFS hash is immutable. If anyone modifies even 1 bit, the hash changes completely. Students can verify the file matches the official hash announced beforehand. Tampering = immediately detectable.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-brutal">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-black">What if the exam needs to be cancelled?</h3>
              </div>
              <p className="text-black ml-10 leading-relaxed">
                The admin can trigger the "Emergency Void" function, which permanently destroys the encryption key on the blockchain. The file becomes absolutely unopenable by anyone, forever. This action is recorded on-chain as permanent proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-heirlock-blue border-t-4 border-black">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
            Ready to Implement?
          </h2>
          <p className="text-lg text-black mb-8 font-bold max-w-2xl mx-auto">
            Now that you understand the operational logic, explore the technical documentation or deploy T.A.L.A. for your institution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/documentation">
              <button className="px-8 py-4 bg-black text-white font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2">
                View Docs <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/create-vault">
              <button className="px-8 py-4 bg-white text-black font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2">
                Create Vault <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
