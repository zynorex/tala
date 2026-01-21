import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | TALA",
  description: "Cookie Policy for TALA vault system",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Link href="/legal" className="inline-flex items-center gap-2 text-black font-bold mb-8 hover:gap-3 transition-all">
          <ChevronLeft className="w-5 h-5" />
          Back to Legal
        </Link>

        <div className="border-4 border-black bg-white p-8 md:p-12 shadow-brutal">
          <h1 className="font-black text-4xl text-black mb-2">Cookie Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="space-y-6 text-gray-800 font-medium">
            <section>
              <h2 className="font-black text-xl text-black mb-3">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device when you visit a website. They contain data that can be retrieved by the website or service that created them. Cookies serve many purposes including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Remembering login information and preferences</li>
                <li>Tracking user behavior and preferences</li>
                <li>Delivering personalized content</li>
                <li>Measuring website performance and engagement</li>
              </ul>
              <p className="mt-3">
                Cookies can be categorized as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Session Cookies:</strong> Temporary cookies deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Stored on your device for a specified duration</li>
                <li><strong>First-Party Cookies:</strong> Set by TALA directly</li>
                <li><strong>Third-Party Cookies:</strong> Set by external services we use</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">2. Why We Use Cookies</h2>
              <p>
                TALA uses cookies to:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Maintain Your Session:</strong> Keep you logged in and maintain your connection state with our servers
                </li>
                <li>
                  <strong>Security:</strong> Detect and prevent fraud, unauthorized access, and suspicious activities
                </li>
                <li>
                  <strong>Wallet Connection:</strong> Remember your connected wallet and authentication status
                </li>
                <li>
                  <strong>User Preferences:</strong> Store your theme choice, language preference, and layout settings
                </li>
                <li>
                  <strong>Analytics:</strong> Understand how users interact with TALA to improve the service
                </li>
                <li>
                  <strong>Performance:</strong> Track page load times, errors, and service performance metrics
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">3. Types of Cookies We Use</h2>
              <p className="font-bold mb-3">Essential Cookies (Required):</p>
              <p className="mb-3">
                These cookies are absolutely necessary for TALA to function. You cannot disable them without severely impacting Service functionality:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Session ID:</strong> Identifies your session (expires when you close browser)</li>
                <li><strong>Authentication Token:</strong> Verifies your wallet connection and identity</li>
                <li><strong>Security Token:</strong> Prevents CSRF attacks and unauthorized requests</li>
                <li><strong>Consent Cookie:</strong> Remembers your cookie preferences</li>
              </ul>

              <p className="font-bold mb-3">Performance/Analytics Cookies (Non-Essential):</p>
              <p className="mb-3">
                These cookies help us understand how TALA is used and identify performance issues:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Google Analytics:</strong> Tracks anonymous user behavior and usage statistics</li>
                <li><strong>Performance Metrics:</strong> Measures page load times and API response times</li>
                <li><strong>Error Logging:</strong> Captures JavaScript errors and stack traces for debugging</li>
                <li><strong>Feature Usage:</strong> Tracks which features are most popular</li>
              </ul>

              <p className="font-bold mb-3">Preference Cookies (Non-Essential):</p>
              <p>
                These cookies remember your choices:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Theme Preference:</strong> Dark/light mode selection</li>
                <li><strong>Language:</strong> Your preferred language</li>
                <li><strong>Layout:</strong> View preferences (list vs. grid, expanded vs. collapsed)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">4. Third-Party Cookies</h2>
              <p>
                Third-party services we integrate with may set their own cookies:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Google Analytics:</strong> Cookie name "_ga", "_gat", "_gid". Tracks anonymous usage statistics. See <a href="https://policies.google.com/privacy" className="text-blue-600 font-black underline">Google's Privacy Policy</a>
                </li>
                <li>
                  <strong>MetaMask/Wallet Providers:</strong> May set cookies for wallet connection state and security. Review their privacy policies.
                </li>
                <li>
                  <strong>CDN Services:</strong> Content delivery networks may set performance-related cookies
                </li>
                <li>
                  <strong>RPC Providers:</strong> Blockchain RPC providers may track requests via cookies or identifiers
                </li>
              </ul>
              <p className="mt-3">
                These third parties have their own privacy policies over which we have no control. We are not responsible for their cookie practices.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">5. Detailed Cookie Inventory</h2>
              <p className="font-bold mb-3">First-Party Cookies Set by TALA:</p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-black">
                      <th className="border-r border-gray-400 p-2 text-left font-bold">Cookie Name</th>
                      <th className="border-r border-gray-400 p-2 text-left font-bold">Duration</th>
                      <th className="border-r border-gray-400 p-2 text-left font-bold">Purpose</th>
                      <th className="p-2 text-left font-bold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">session_id</td>
                      <td className="border-r border-gray-300 p-2">Session</td>
                      <td className="border-r border-gray-300 p-2">User session management</td>
                      <td className="p-2">Essential</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">auth_token</td>
                      <td className="border-r border-gray-300 p-2">Session</td>
                      <td className="border-r border-gray-300 p-2">Authentication and security</td>
                      <td className="p-2">Essential</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">csrf_token</td>
                      <td className="border-r border-gray-300 p-2">Session</td>
                      <td className="border-r border-gray-300 p-2">CSRF protection</td>
                      <td className="p-2">Essential</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">theme_preference</td>
                      <td className="border-r border-gray-300 p-2">1 year</td>
                      <td className="border-r border-gray-300 p-2">Theme selection (dark/light)</td>
                      <td className="p-2">Preference</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">language</td>
                      <td className="border-r border-gray-300 p-2">1 year</td>
                      <td className="border-r border-gray-300 p-2">Language preference</td>
                      <td className="p-2">Preference</td>
                    </tr>
                    <tr>
                      <td className="border-r border-gray-300 p-2">cookie_consent</td>
                      <td className="border-r border-gray-300 p-2">1 year</td>
                      <td className="border-r border-gray-300 p-2">Cookie consent choice</td>
                      <td className="p-2">Essential</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">6. Local Storage and Session Storage</h2>
              <p>
                Beyond cookies, we use browser storage technologies:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Local Storage:</strong> Persistent browser storage (persists until manually cleared). Used for user preferences and theme settings.
                </li>
                <li>
                  <strong>Session Storage:</strong> Temporary browser storage (cleared when browser closes). Used for current session data.
                </li>
                <li>
                  <strong>IndexedDB:</strong> Larger database for client-side storage. May store vault metadata and cache.
                </li>
              </ul>
              <p className="mt-3">
                These storage methods are managed similarly to cookies through browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">7. How to Manage Cookies</h2>
              <p className="font-bold mb-3">Browser-Level Controls:</p>
              <p className="mb-3">
                Most modern browsers allow you to view, manage, and delete cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>View Cookies:</strong> See all cookies stored for TALA</li>
                <li><strong>Delete Cookies:</strong> Remove cookies from your device</li>
                <li><strong>Block Cookies:</strong> Prevent TALA from setting new cookies</li>
                <li><strong>Clear On Exit:</strong> Automatically delete cookies when closing browser</li>
              </ul>

              <p className="font-bold mb-3">Important Note:</p>
              <p>
                Disabling essential cookies will prevent TALA from functioning properly. You may not be able to log in, maintain your session, or use vault features.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">8. Browser-Specific Instructions</h2>
              <p className="font-bold mb-3">Google Chrome:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Click menu icon (⋮) → Settings</li>
                <li>Select "Privacy and security" → "Cookies and other site data"</li>
                <li>View, manage, or delete cookies</li>
              </ol>

              <p className="font-bold mb-3">Mozilla Firefox:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Click menu icon (≡) → Preferences</li>
                <li>Select "Privacy & Security" → "Cookies and Site Data"</li>
                <li>Manage cookies and storage</li>
              </ol>

              <p className="font-bold mb-3">Apple Safari:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Select Safari → Preferences</li>
                <li>Click "Privacy" tab</li>
                <li>Click "Manage Website Data"</li>
              </ol>

              <p className="font-bold mb-3">Microsoft Edge:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Click menu icon (⋯) → Settings</li>
                <li>Select "Privacy, search, and services" → "Cookies and other site data"</li>
                <li>Manage cookies</li>
              </ol>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">9. Opt-Out and Privacy Controls</h2>
              <p className="font-bold mb-3">Google Analytics Opt-Out:</p>
              <p>
                Install the <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 font-black underline">Google Analytics Opt-out Browser Add-on</a> to prevent Google Analytics tracking.
              </p>

              <p className="font-bold mb-3 mt-4">Do Not Track (DNT):</p>
              <p>
                You can enable "Do Not Track" in your browser. However, we note that this is not a universal standard and many services (including TALA) do not honor DNT requests.
              </p>

              <p className="font-bold mb-3 mt-4">Privacy Browser Extensions:</p>
              <p>
                Consider using privacy-focused tools:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>uBlock Origin:</strong> Blocks ads and trackers</li>
                <li><strong>Privacy Badger:</strong> Automatically blocks tracking</li>
                <li><strong>Brave Browser:</strong> Built-in privacy protections</li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">10. GDPR and Privacy Law Compliance</h2>
              <p>
                If you're subject to GDPR (EU users) or other privacy laws:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  <strong>Cookie Consent:</strong> We obtain your explicit consent for non-essential cookies before setting them
                </li>
                <li>
                  <strong>Data Subject Rights:</strong> You have rights to access, delete, and port your data (see our <Link href="/privacy" className="text-blue-600 font-black underline">Privacy Policy</Link>)
                </li>
                <li>
                  <strong>Right to Object:</strong> You can object to cookies at any time
                </li>
                <li>
                  <strong>CCPA Compliance:</strong> California residents have additional rights regarding personal information
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">11. Changes to This Policy</h2>
              <p>
                As TALA evolves, we may update this Cookie Policy to reflect new features, technologies, or legal requirements. Changes will be effective immediately upon posting.
              </p>
              <p className="mt-3">
                Continued use of TALA after policy updates constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="font-black text-xl text-black mb-3">12. Contact Us</h2>
              <p>
                If you have questions about our cookie practices or how to manage cookies, please <Link href="/contact" className="text-blue-600 font-black underline">contact us</Link>.
              </p>
            </section>

            <div className="pt-6 border-t-2 border-gray-300 mt-8 bg-green-50 p-4 border-4 border-green-300">
              <p className="text-sm font-black text-green-800">
                ✓ We are committed to transparent cookie practices and protecting your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

