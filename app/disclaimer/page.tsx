import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | NIL",
  description: "Important disclaimers and risk warnings for NIL",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Link href="/legal" className="inline-flex items-center gap-2 text-black font-bold mb-8 hover:gap-3 transition-all">
          <ChevronLeft className="w-5 h-5" />
          Back to Legal
        </Link>

        <div className="border-4 border-black bg-white p-8 md:p-12 shadow-brutal">
          <h1 className="font-black text-4xl text-black mb-2">Disclaimer</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="bg-red-100 border-4 border-red-500 p-6 mb-8 flex gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-black text-red-800 text-lg">CRITICAL DISCLAIMER</p>
              <p className="text-red-800 font-bold mt-2">
                NIL is a non-custodial platform. Loss of your encryption keys or private keys results in PERMANENT AND IRREVERSIBLE loss of access to your vault and all contents. We cannot recover your data. Use NIL only if you understand and accept this risk.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-gray-800 font-medium">
            <section>
              <h2 className="font-black text-xl text-black mb-3">1. Non-Custodial Nature</h2>
              <p>
                NIL is a non-custodial platform. This means:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>We Do Not Hold Your Assets:</strong> You maintain complete control and responsibility for your encryption keys, private keys, wallet, and vault contents.
                </li>
                <li>
                  <strong>We Cannot Access Your Data:</strong> Your encryption keys are stored only on your device. We cannot access, recover, or decrypt your vault contents.
                </li>
                <li>
                  <strong>We Are Not a Bank or Custodian:</strong> NIL is a software platform, not a financial institution. We provide no safekeeping services or fiduciary duties.
                </li>
                <li>
                  <strong>You Are Responsible:</strong> You alone are responsible for the security, backup, and management of all credentials and data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">2. Permanent Loss of Access</h2>
              <p>
                If you lose your encryption key or private key:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Your Data Is Gone Forever:</strong> There is no "forgot password" option. No recovery mechanism exists. No customer service can help. Your vault and all contents will be permanently inaccessible.
                </li>
                <li>
                  <strong>No Backup Available:</strong> We do not maintain backups of encryption keys or vault contents. Only you have this information.
                </li>
                <li>
                  <strong>Irreversible Decision:</strong> Losing your key is equivalent to destroying all data in your vault. Once lost, recovery is mathematically impossible.
                </li>
                <li>
                  <strong>Your Responsibility Alone:</strong> We are not responsible for lost keys, forgotten passwords, or inaccessible data resulting from your actions or inactions.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">3. Blockchain Risks</h2>
              <p>
                NIL operates on blockchain technology, which carries inherent risks:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Irreversible Transactions:</strong> All blockchain transactions are permanent and cannot be reversed. If you send MATIC to the wrong address, it is permanently lost.
                </li>
                <li>
                  <strong>Gas Fees:</strong> Blockchain transactions require payment of gas fees in MATIC, which fluctuate unpredictably. High network congestion can result in very expensive transactions.
                </li>
                <li>
                  <strong>Network Failures:</strong> Blockchain networks can experience congestion, slowdowns, outages, or other technical issues. During these periods, you may be unable to access or interact with NIL.
                </li>
                <li>
                  <strong>RPC Provider Failures:</strong> NIL relies on third-party RPC providers for blockchain access. If these services fail, you cannot interact with the platform.
                </li>
                <li>
                  <strong>Smart Contract Bugs:</strong> Despite testing, smart contracts may contain undiscovered vulnerabilities. Exploitation could result in loss of funds or data.
                </li>
                <li>
                  <strong>Network Attacks:</strong> Blockchain networks can experience attacks, forks, or other disruptions. These could affect your vault and stored data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">4. Smart Contract Risks</h2>
              <p>
                The NIL smart contract carries specific risks:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>No Formal Audit:</strong> While tested, the NIL smart contract has not undergone formal third-party security audit.
                </li>
                <li>
                  <strong>Undiscovered Vulnerabilities:</strong> Hidden bugs or vulnerabilities could exist despite thorough testing.
                </li>
                <li>
                  <strong>Exploitable Flaws:</strong> Discovered vulnerabilities could be exploited to compromise the contract or vault contents.
                </li>
                <li>
                  <strong>Permanent Fund Loss:</strong> Smart contract failure or exploitation could permanently lock funds or vault access.
                </li>
                <li>
                  <strong>No Recovery Path:</strong> There is no insurance, escrow, or recovery mechanism if the contract fails. No one can reimburse you.
                </li>
                <li>
                  <strong>Contract Upgrades:</strong> We may upgrade the smart contract, which could change behavior or affect existing vaults in unexpected ways.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">5. Encryption and Security Risks</h2>
              <p>
                NIL uses encryption for security, but encryption carries inherent risks:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Encryption Key Loss:</strong> If you lose your encryption key, your data is permanently inaccessible. No one can decrypt it.
                </li>
                <li>
                  <strong>Implementation Flaws:</strong> While using standard encryption libraries, implementation errors could compromise security.
                </li>
                <li>
                  <strong>Future Encryption Weakness:</strong> Current encryption standards may be broken in the future by quantum computers or mathematical breakthroughs. Your data encrypted today may become vulnerable tomorrow.
                </li>
                <li>
                  <strong>Device Compromise:</strong> If your device is compromised by malware, your encryption keys could be stolen without our knowledge or ability to help.
                </li>
                <li>
                  <strong>Memory Exposure:</strong> When decrypting vault contents, the encryption key and plaintext are temporarily in your device's memory. A compromised device could leak this information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">6. IPFS and Distributed Storage Risks</h2>
              <p>
                NIL uses IPFS (via Pinata) for storage, which carries specific risks:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>No Guaranteed Persistence:</strong> IPFS does not guarantee that data will persist indefinitely. If pinned files are unpinned, data could be lost.
                </li>
                <li>
                  <strong>Pinata Service Failure:</strong> If Pinata discontinues service or removes your files, your vault contents are lost forever.
                </li>
                <li>
                  <strong>Data Availability:</strong> Your IPFS data is only as available as the peers hosting it. Unpopular files are likely to be garbage-collected.
                </li>
                <li>
                  <strong>No Backup Guarantee:</strong> While Pinata may maintain copies, this is not guaranteed. We cannot restore lost files.
                </li>
                <li>
                  <strong>IPFS Hash Immutability:</strong> IPFS hashes are immutable. If you want to modify vault contents, you must recreate the vault with new files.
                </li>
                <li>
                  <strong>Third-Party Risk:</strong> We have no control over Pinata's operations, security, or continuity. Their failure affects NIL users.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">7. Wallet and Private Key Risks</h2>
              <p>
                Your wallet and private keys are critical and carry significant risks:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Private Key Exposure:</strong> If someone gains access to your private key, they can control your wallet and all its contents. We have no ability to reverse this or recover your funds.
                </li>
                <li>
                  <strong>Wallet Compromise:</strong> If your wallet provider (MetaMask, etc.) is compromised, your private keys and funds could be stolen.
                </li>
                <li>
                  <strong>Phishing Attacks:</strong> Attackers may impersonate NIL or other services to trick you into revealing your private keys or seed phrases.
                </li>
                <li>
                  <strong>Malware Theft:</strong> Malware on your device could steal private keys, seed phrases, or encryption keys without you knowing.
                </li>
                <li>
                  <strong>Hardware Wallet Failure:</strong> If using hardware wallets for storage, hardware failure could result in permanent loss of access.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">8. Regulatory and Legal Risks</h2>
              <p>
                Using blockchain and cryptocurrency services carries significant legal risks:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Regulatory Uncertainty:</strong> Cryptocurrency and blockchain regulation is unclear and changing rapidly in all jurisdictions. NIL's legal status could change at any time.
                </li>
                <li>
                  <strong>Potential Shutdown:</strong> Regulatory action could force NIL to shut down or change service, affecting your access.
                </li>
                <li>
                  <strong>User Responsibility for Compliance:</strong> You are responsible for complying with all applicable laws in your jurisdiction, including tax reporting and sanctions laws.
                </li>
                <li>
                  <strong>Cross-Border Issues:</strong> If you use NIL while traveling, different jurisdictions may have conflicting legal requirements.
                </li>
                <li>
                  <strong>Financial Regulations:</strong> NIL may be classified as a money service or exchange, triggering compliance obligations on you.
                </li>
                <li>
                  <strong>Tax Implications:</strong> Using NIL likely triggers tax reporting requirements. Consult a tax professional in your jurisdiction.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">9. Technology and Compatibility Risks</h2>
              <p>
                NIL relies on technology that may become incompatible or obsolete:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Browser Compatibility:</strong> NIL may not work on all browsers. You must use a compatible, up-to-date browser.
                </li>
                <li>
                  <strong>Wallet Compatibility:</strong> NIL requires a compatible wallet (MetaMask, etc.). Wallet updates could break compatibility.
                </li>
                <li>
                  <strong>Operating System Changes:</strong> OS updates could affect NIL functionality or security.
                </li>
                <li>
                  <strong>Library Deprecation:</strong> JavaScript and Web3 libraries we use may be deprecated, forcing major updates.
                </li>
                <li>
                  <strong>Blockchain Incompatibility:</strong> If Polygon Amoy testnet is shut down, NIL vaults become inaccessible.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">10. Service Interruption and Availability</h2>
              <p>
                NIL is provided on an "as is" basis with no guarantees of availability or performance:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>No Uptime Guarantee:</strong> We do not guarantee 100% availability. The service may be down for maintenance, updates, or emergency fixes.
                </li>
                <li>
                  <strong>Feature Changes:</strong> We may add, remove, or modify features without advance notice.
                </li>
                <li>
                  <strong>Service Discontinuation:</strong> We may discontinue NIL entirely at any time. You are responsible for securing your data before discontinuation.
                </li>
                <li>
                  <strong>No Compensation:</strong> We are not liable for any damages resulting from service interruptions or unavailability.
                </li>
                <li>
                  <strong>Limited Support:</strong> Support is provided on a best-effort basis with no guarantees of response time or resolution.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">11. Assumption of Risk</h2>
              <p className="font-bold text-red-700 mb-3">
                By using NIL, you explicitly acknowledge and assume all risks described in this disclaimer. You understand that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-red-700 font-bold">
                <li>Loss of your encryption key = permanent loss of data</li>
                <li>Blockchain transactions are irreversible</li>
                <li>Smart contracts may have exploitable vulnerabilities</li>
                <li>IPFS/Pinata may not persist your data indefinitely</li>
                <li>We cannot recover lost keys, funds, or data under any circumstances</li>
                <li>Regulatory changes could affect NIL's availability</li>
              </ul>
              <p className="mt-3 font-bold">
                If you do not accept these risks, do not use NIL.
              </p>
            </section>

            <section className="bg-yellow-50 p-6 border-4 border-yellow-400 mt-8">
              <h2 className="font-black text-xl text-black mb-3">Important Recommendations</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Backup Your Encryption Key:</strong> Keep secure offline copies in multiple safe locations</li>
                <li><strong>Test Your Key:</strong> Verify you can decrypt your vault before storing important data</li>
                <li><strong>Use Strong Security:</strong> Keep your device secure, use antivirus, avoid phishing</li>
                <li><strong>Small Initial Test:</strong> Start with small, non-critical files to learn the system</li>
                <li><strong>Keep Learning:</strong> Understand blockchain and cryptography before using seriously</li>
                <li><strong>Consult Professionals:</strong> For legal/tax questions, consult appropriate professionals</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">12. Limitation of Liability</h2>
              <p className="font-bold mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <p>
                NIL and its developers/operators are not liable for any of the following, even if advised of the possibility:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Loss or corruption of data</li>
                <li>Loss of encryption keys, private keys, or wallet access</li>
                <li>Blockchain network failures or attacks</li>
                <li>Smart contract vulnerabilities or exploits</li>
                <li>IPFS/Pinata service failures or data loss</li>
                <li>Wallet provider failures or compromises</li>
                <li>Gas fees or transaction costs</li>
                <li>Lost profits, revenues, or opportunities</li>
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Any damages arising from regulatory action</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">13. Contact and Questions</h2>
              <p>
                For questions about this disclaimer, please <Link href="/contact" className="text-blue-600 font-black underline">contact us</Link>. This disclaimer does not waive any legal rights you may have under applicable law.
              </p>
            </section>

            <div className="pt-6 border-t-2 border-gray-300 mt-8 bg-gray-50 p-4 border-4 border-gray-300">
              <p className="text-sm font-black text-gray-800">
                ✓ By using NIL, you agree that you have read, understood, and accept all terms in this disclaimer and Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
