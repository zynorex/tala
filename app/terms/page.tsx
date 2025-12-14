import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | TALA",
  description: "Terms of Service for TALA vault system",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Link href="/legal" className="inline-flex items-center gap-2 text-black font-bold mb-8 hover:gap-3 transition-all">
          <ChevronLeft className="w-5 h-5" />
          Back to Legal
        </Link>

        <div className="border-4 border-black bg-white p-8 md:p-12 shadow-brutal">
          <h1 className="font-black text-4xl text-black mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="space-y-6 text-gray-800 font-medium">
            <section>
              <h2 className="font-black text-xl text-black mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using TALA ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Service. Your use of TALA constitutes your acceptance of these terms, our Privacy Policy, Disclaimer, and all other policies referenced herein.
              </p>
              <p className="mt-3">
                TALA reserves the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes have been posted constitutes your acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">2. Service Description</h2>
              <p>
                TALA is a time-locked, non-custodial vault system built on blockchain technology (primarily Polygon network). The Service allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Encrypt files using AES-256-GCM encryption</li>
                <li>Upload encrypted files to IPFS (via Pinata)</li>
                <li>Create time-locked vaults with blockchain-based unlock conditions</li>
                <li>Access vault contents only after the specified unlock time</li>
                <li>Manage multiple vaults through a user dashboard</li>
              </ul>
              <p className="mt-3">
                TALA does not store your encryption keys, wallet credentials, or have custody of your files. You maintain complete control and responsibility for your vault's contents and encryption keys at all times.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">3. Eligibility and Account Requirements</h2>
              <p>
                To use TALA, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Be at least 18 years old (or the legal age in your jurisdiction)</li>
                <li>Have a compatible blockchain wallet (MetaMask, WalletConnect, etc.)</li>
                <li>Have sufficient MATIC tokens for gas fees on Polygon network</li>
                <li>Not be a resident of sanctioned countries or on any sanctions list</li>
                <li>Comply with all applicable laws and regulations in your jurisdiction</li>
              </ul>
              <p className="mt-3">
                We reserve the right to refuse service or terminate accounts that violate these requirements.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">4. User Responsibilities</h2>
              <p>
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Wallet Security:</strong> Maintaining the confidentiality of your wallet's private keys, seed phrases, and access credentials. We cannot recover lost or compromised wallets.
                </li>
                <li>
                  <strong>Encryption Keys:</strong> Keeping your encryption keys secure and creating reliable backups. Loss of encryption keys results in permanent inability to access vault contents.
                </li>
                <li>
                  <strong>Account Activity:</strong> All activity that occurs under your wallet address is your responsibility. You are liable for all transactions and actions performed.
                </li>
                <li>
                  <strong>Compliance:</strong> Ensuring your use of TALA complies with all applicable laws, regulations, and sanctions requirements in your jurisdiction and any jurisdiction where the recipient of your vault may be located.
                </li>
                <li>
                  <strong>Content Responsibility:</strong> You are solely responsible for ensuring that vault contents do not violate laws, infringe on intellectual property, or contain illegal materials.
                </li>
                <li>
                  <strong>Gas Fee Monitoring:</strong> Monitoring and paying appropriate gas fees for all transactions. Network congestion may increase fees significantly.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">5. Non-Custodial Nature</h2>
              <p>
                TALA is explicitly a non-custodial service. This means:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>We do not control, store, or have access to your encrypted files</li>
                <li>We do not control, store, or have access to your encryption keys</li>
                <li>We do not control or have custody of your wallet or assets</li>
                <li>You have complete control and full responsibility for your vaults</li>
                <li>We cannot recover, restore, or access vault contents for any reason</li>
                <li>Smart contract code handles all unlock logic - we cannot override or modify it</li>
              </ul>
              <p className="mt-3 font-bold text-red-600">
                This means if you lose your encryption key, vault access is permanently impossible, and we cannot help you recover it.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">6. Blockchain Network Risks</h2>
              <p>
                TALA operates on blockchain networks, primarily Polygon. You acknowledge and accept:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Transaction Irreversibility:</strong> All blockchain transactions are permanent and cannot be reversed, refunded, or cancelled once confirmed.
                </li>
                <li>
                  <strong>Gas Fees:</strong> You are responsible for all gas fees. These are not refundable and may be high during network congestion.
                </li>
                <li>
                  <strong>Network Failures:</strong> Blockchain networks may experience congestion, outages, or technical failures beyond our control.
                </li>
                <li>
                  <strong>Network Changes:</strong> Blockchain networks may undergo updates, forks, or changes that could affect TALA functionality.
                </li>
                <li>
                  <strong>RPC Provider Issues:</strong> TALA relies on RPC providers that may experience downtime or service degradation.
                </li>
                <li>
                  <strong>Smart Contract Risk:</strong> While our smart contracts are thoroughly tested, all smart contracts carry inherent security risks.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">7. Limitations of Liability</h2>
              <p className="font-bold text-red-600 mb-3">
                TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL LIABILITY FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Loss or inability to access encryption keys or vault contents</li>
                <li>Data loss, corruption, or deletion</li>
                <li>Blockchain network failures or exploits</li>
                <li>Smart contract vulnerabilities or attacks</li>
                <li>Third-party service failures (IPFS, Pinata, RPC providers)</li>
                <li>High or unexpected gas fees</li>
                <li>Lost profits, opportunities, or revenue</li>
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Any damages arising from use or inability to use the Service</li>
              </ul>
              <p className="mt-3 font-bold text-red-600">
                IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO USE TALA (IF ANY).
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">8. Prohibited Activities</h2>
              <p>
                You agree not to use TALA to:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>Store, distribute, or access illegal content or materials</li>
                <li>Violate any applicable laws or regulations (including sanctions laws)</li>
                <li>Harass, threaten, defame, or harm others</li>
                <li>Engage in fraud, deception, or misrepresentation</li>
                <li>Attempt to circumvent security measures or access unauthorized systems</li>
                <li>Use TALA for money laundering, sanctions evasion, or terrorist financing</li>
                <li>Infringe on intellectual property rights</li>
                <li>Use bots or automated systems without permission</li>
                <li>Reverse engineer or attempt to extract the source code</li>
                <li>Interfere with or disrupt the normal operation of TALA</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">9. Intellectual Property Rights</h2>
              <p>
                The TALA platform, including its source code, design, documentation, logos, and branding, is protected by copyright and other intellectual property laws. You may:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Use the Service for personal, non-commercial purposes</li>
                <li>Review our open-source smart contracts</li>
                <li>Use TALA documentation for educational purposes</li>
              </ul>
              <p className="mt-3">
                You may NOT:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Copy or reproduce any part of TALA without permission</li>
                <li>Modify or create derivative works</li>
                <li>Use TALA for commercial purposes without authorization</li>
                <li>Remove copyright or attribution notices</li>
                <li>Claim TALA or its components as your own</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">10. Third-Party Services</h2>
              <p>
                TALA integrates with third-party services. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>IPFS/Pinata failures or service disruptions</li>
                <li>Blockchain RPC provider outages</li>
                <li>Wallet provider security issues</li>
                <li>Third-party terms or privacy policies</li>
              </ul>
              <p className="mt-3">
                You are responsible for reviewing and understanding the terms and privacy policies of all third-party services you use with TALA.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">11. Modifications and Discontinuation</h2>
              <p>
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Modify, suspend, or discontinue TALA at any time, with or without notice</li>
                <li>Change features, functionality, or pricing</li>
                <li>Remove content or accounts that violate these terms</li>
              </ul>
              <p className="mt-3">
                We are not liable for any modification, suspension, or discontinuation of the Service. Your only recourse is to stop using TALA.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">12. Regulatory Compliance</h2>
              <p>
                You are responsible for understanding and complying with all applicable laws and regulations in your jurisdiction regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Use of cryptocurrency and blockchain</li>
                <li>Data storage and encryption</li>
                <li>Taxation of transactions</li>
                <li>Sanctions and export control laws</li>
                <li>Consumer protection laws</li>
              </ul>
              <p className="mt-3">
                We make no representations regarding TALA's legality in any jurisdiction. Consult with local legal counsel before using TALA.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">13. Dispute Resolution</h2>
              <p>
                These Terms are governed by applicable law. By using TALA, you irrevocably consent to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Exclusive jurisdiction in relevant courts</li>
                <li>Arbitration of disputes (if applicable)</li>
                <li>Waiver of jury trial rights (if applicable)</li>
              </ul>
              <p className="mt-3">
                You agree that any claims must be brought within one year of the cause of action arising.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">14. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will continue in full effect.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">15. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, Disclaimer, and Cookie Policy, constitute the entire agreement between you and TALA regarding your use of the Service. These Terms supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">16. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please <Link href="/contact" className="text-blue-600 font-black underline">contact us</Link>.
              </p>
            </section>

            <div className="pt-6 border-t-2 border-gray-300 mt-8 bg-yellow-50 p-4 border-4 border-yellow-300">
              <p className="text-sm font-black text-yellow-800">
                ✓ By using TALA, you agree that you have read, understood, and accept all terms in this agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
