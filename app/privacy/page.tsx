import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | NIL",
  description: "Privacy Policy for NIL vault system",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Link href="/legal" className="inline-flex items-center gap-2 text-black font-bold mb-8 hover:gap-3 transition-all">
          <ChevronLeft className="w-5 h-5" />
          Back to Legal
        </Link>

        <div className="border-4 border-black bg-white p-8 md:p-12 shadow-brutal">
          <h1 className="font-black text-4xl text-black mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="space-y-6 text-gray-800 font-medium">
            <section>
              <h2 className="font-black text-xl text-black mb-3">1. Introduction</h2>
              <p>
                NIL ("we", "our", or "us") operates as a non-custodial vault platform. This Privacy Policy explains how we collect, use, disclose, and otherwise handle information. Since NIL is non-custodial, we do not have access to your vault contents or encryption keys.
              </p>
              <p className="mt-3">
                We are committed to protecting your privacy and ensuring you have a positive experience on our platform. Please read this policy carefully to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">2. Information We Collect</h2>
              <p>
                We collect minimal information and only what is necessary to operate the Service:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Wallet Address:</strong> Your blockchain wallet address (publicly visible on-chain). We collect this when you connect your wallet.
                </li>
                <li>
                  <strong>Transaction Data:</strong> Records of vault creation, access times, and transaction hashes (stored permanently on-chain and immutable).
                </li>
                <li>
                  <strong>Analytics Data:</strong> Anonymous usage statistics including pages visited, features used, time spent on platform (via Google Analytics).
                </li>
                <li>
                  <strong>Device Information:</strong> Browser type, operating system, IP address (for analytics and security purposes).
                </li>
                <li>
                  <strong>Email Address (Optional):</strong> Only if you voluntarily subscribe to our newsletter or contact us.
                </li>
                <li>
                  <strong>Interaction Data:</strong> How you interact with features, error logs, and performance metrics.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">3. Information We DO NOT Collect</h2>
              <p>
                The following information is explicitly NOT collected or stored by NIL:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Encryption keys (stored only on your device)</li>
                <li>Private keys or seed phrases</li>
                <li>Vault contents or encrypted data</li>
                <li>File contents or detailed metadata</li>
                <li>Personal identification information (name, email, address) unless voluntarily provided</li>
                <li>Payment information beyond gas fees on the blockchain</li>
              </ul>
              <p className="mt-3 font-bold text-green-600">
                ✓ Your data stays under your control. We cannot access what happens inside your vault.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">4. How We Collect Information</h2>
              <p>
                We collect information through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Wallet Connection:</strong> When you connect your wallet to NIL</li>
                <li><strong>Smart Contract Interaction:</strong> When you create or access vaults</li>
                <li><strong>Website Browsing:</strong> Cookies and analytics when you visit our website</li>
                <li><strong>Email Communications:</strong> When you voluntarily subscribe or contact us</li>
                <li><strong>Error Reporting:</strong> When errors occur, we collect diagnostic data</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">5. How We Use Your Information</h2>
              <p>
                We use collected information for:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Service Operation:</strong> Processing transactions, managing vaults, and providing core functionality
                </li>
                <li>
                  <strong>Improvement:</strong> Analyzing usage patterns to improve user experience and identify bugs
                </li>
                <li>
                  <strong>Security:</strong> Detecting fraud, preventing abuse, and maintaining platform security
                </li>
                <li>
                  <strong>Communications:</strong> Sending important updates about the Service (never spam)
                </li>
                <li>
                  <strong>Compliance:</strong> Complying with legal obligations and law enforcement requests
                </li>
                <li>
                  <strong>Analytics:</strong> Understanding how users interact with NIL to enhance features
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">6. Data Storage and Security</h2>
              <p>
                Your data is managed as follows:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Blockchain Storage:</strong> All vault transactions are permanently stored on the blockchain and cannot be deleted or modified.
                </li>
                <li>
                  <strong>Server Security:</strong> We use industry-standard security measures including encryption, firewalls, and regular security audits.
                </li>
                <li>
                  <strong>Access Controls:</strong> Only authorized personnel can access your data, and access is logged and monitored.
                </li>
                <li>
                  <strong>Data Retention:</strong> We retain data only as long as necessary to provide the Service and comply with legal obligations.
                </li>
              </ul>
              <p className="mt-3 font-bold text-red-600">
                ⚠️ No security system is impenetrable. We cannot guarantee absolute security, and you use NIL at your own risk.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">7. Third-Party Services</h2>
              <p>
                NIL integrates with third-party services that may collect or process data:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>IPFS/Pinata:</strong> Your encrypted files are stored on IPFS through Pinata. Review their privacy policy: https://pinata.cloud/privacy
                </li>
                <li>
                  <strong>Blockchain RPC Providers:</strong> We use third-party RPC providers for blockchain interactions. They may collect IP addresses and transaction data.
                </li>
                <li>
                  <strong>Google Analytics:</strong> We use Google Analytics to track anonymous usage. See their privacy policy: https://policies.google.com/privacy
                </li>
                <li>
                  <strong>Wallet Providers:</strong> MetaMask and other wallets have their own privacy policies. We don't control their data practices.
                </li>
                <li>
                  <strong>Email Services:</strong> Newsletter communications use third-party email services with their own privacy practices.
                </li>
              </ul>
              <p className="mt-3">
                We are not responsible for third-party privacy practices. Always review their privacy policies independently.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">8. Blockchain Transparency</h2>
              <p>
                Since NIL operates on blockchain:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Public Visibility:</strong> All vault transactions are publicly visible on the blockchain. Anyone can view them.
                </li>
                <li>
                  <strong>Wallet Association:</strong> Your wallet address is permanently associated with all vault transactions.
                </li>
                <li>
                  <strong>Immutability:</strong> Blockchain data cannot be deleted, modified, or changed once recorded.
                </li>
                <li>
                  <strong>Transaction Details:</strong> Transaction times, amounts, and recipient addresses are permanently public record.
                </li>
              </ul>
              <p className="mt-3">
                This is inherent to blockchain technology and not something we can change. Consider using wallet mixers or privacy coins if you want to obfuscate transaction history (though this may have legal implications).
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">9. Your Privacy Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Access:</strong> You can request a copy of personal data we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> You can request we correct inaccurate data
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of personal data (though blockchain data cannot be deleted)
                </li>
                <li>
                  <strong>Opt-Out:</strong> You can opt out of analytics and non-essential communications
                </li>
                <li>
                  <strong>Portability:</strong> You can request your data in a portable format
                </li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please <Link href="/contact" className="text-blue-600 font-black underline">contact us</Link>.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">10. GDPR Compliance (EU Users)</h2>
              <p>
                If you're in the EU, you have additional rights under GDPR:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Right to be forgotten (with blockchain limitations)</li>
                <li>Right to restrict processing</li>
                <li>Right to object to processing</li>
                <li>Right to data portability</li>
              </ul>
              <p className="mt-3">
                We process data only with your consent or as necessary to provide the Service. Blockchain data is processed under legitimate interest and cannot be deleted.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">11. CCPA Compliance (California Users)</h2>
              <p>
                If you're a California resident, you have rights under the California Consumer Privacy Act:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information collected from you</li>
                <li>Right to opt-out of the "sale" of personal information</li>
                <li>Right not to be discriminated against for exercising your rights</li>
              </ul>
              <p className="mt-3">
                We do not "sell" personal information. Contact us to exercise your CCPA rights.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">12. Cookies and Tracking</h2>
              <p>
                We use minimal cookies for essential functionality. See our <Link href="/cookies" className="text-blue-600 font-black underline">Cookie Policy</Link> for detailed information about:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>What cookies we use</li>
                <li>How to manage cookies in your browser</li>
                <li>Third-party tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">13. Children's Privacy</h2>
              <p>
                NIL is not intended for users under 18 years of age. We do not knowingly collect information from minors. If we become aware that we have collected information from a minor, we will take steps to delete it immediately.
              </p>
              <p className="mt-3">
                If you believe we have collected information from a child, please <Link href="/contact" className="text-blue-600 font-black underline">contact us</Link> immediately.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">14. Data Breaches</h2>
              <p>
                In the event of a data breach that affects your personal information, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Notify you promptly via email or website notice</li>
                <li>Explain what information was affected</li>
                <li>Describe the measures we're taking to secure your information</li>
                <li>Provide guidance on steps you can take</li>
              </ul>
              <p className="mt-3">
                We also comply with legal notification requirements in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">15. International Data Transfers</h2>
              <p>
                Your information may be transferred, stored, and processed in countries other than your country of residence. By using NIL, you consent to such transfers.
              </p>
              <p className="mt-3">
                We implement appropriate safeguards for international data transfers, including standard contractual clauses where applicable.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">16. Policy Changes</h2>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. Changes will be effective immediately upon posting. Continued use of NIL constitutes your acceptance of updated policies.
              </p>
              <p className="mt-3">
                We encourage you to review this policy regularly to stay informed about how we protect your information.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">17. Contact Us</h2>
              <p>
                For privacy concerns, questions, or to exercise your privacy rights, please <Link href="/contact" className="text-blue-600 font-black underline">contact us</Link>.
              </p>
            </section>

            <div className="pt-6 border-t-2 border-gray-300 mt-8 bg-blue-50 p-4 border-4 border-blue-300">
              <p className="text-sm font-black text-blue-800">
                Your privacy matters to us. We're committed to transparent data practices and protecting your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
