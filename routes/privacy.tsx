/**
 * GET /privacy
 * Privacy Policy page for SNIVEL Book
 */

import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Privacy() {
  return (
    <div class="min-h-screen bg-white">
      {/* Navigation */}
      <nav class="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <div class="flex items-center">
              <a href="/" class="flex items-center gap-2">
                <Logo size="md" class="text-gray-900" />
              </a>
            </div>
            <div class="flex items-center gap-4">
              <a href="/pricing" class="text-gray-700 hover:text-gray-900 font-medium">
                Pricing
              </a>
              <a href="/login" class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 hover:border-gray-400 rounded-lg">
                Login
              </a>
              <a href="/signup" class="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="mb-6">
          <span class="inline-block bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            Book with Snivel
          </span>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p class="text-gray-500 mb-12">Last updated: January 2025</p>

        <div class="prose prose-gray max-w-none">
          {/* Introduction */}
          <section class="mb-10">
            <p class="text-gray-600 leading-relaxed">
              This Privacy Policy describes how SNIVEL ("we," "us," or "our") collects, uses, and shares your
              personal information when you use Book with Snivel, our scheduling and booking service.
            </p>
          </section>

          {/* Information We Collect */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Account Information</h3>
            <p class="text-gray-600 mb-4">When you create an account, we collect:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Email address</strong> – Used for account access, notifications, and billing communications</li>
              <li><strong>Name</strong> – Used to personalize your experience and identify your booking pages</li>
              <li><strong>Organization name</strong> – For team accounts</li>
              <li><strong>Password</strong> – Stored securely using industry-standard hashing</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Calendar Integration Data</h3>
            <p class="text-gray-600 mb-4">When you connect your calendar (Google or Microsoft), we collect:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>OAuth access tokens</strong> – Encrypted and stored in Deno KV to access your calendar</li>
              <li><strong>Calendar availability</strong> – Read-only access to check your free/busy times</li>
              <li><strong>Event metadata</strong> – To create bookings and avoid conflicts</li>
            </ul>
            <p class="text-gray-600 mt-4">
              We <strong>do not</strong> read the contents of your existing calendar events. We only check availability
              and create new events when bookings are made.
            </p>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Booking Data</h3>
            <p class="text-gray-600 mb-4">When someone books time with you, we collect:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Guest name and email</strong> – To send booking confirmations and calendar invites</li>
              <li><strong>Booking notes</strong> – Optional information provided by guests when booking</li>
              <li><strong>Time zone</strong> – To correctly schedule meetings across time zones</li>
              <li><strong>Meeting preferences</strong> – Location, duration, and other settings you configure</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Payment Information</h3>
            <p class="text-gray-600 mb-4">
              Payment processing is handled by <strong>Stripe</strong>. We do not store your credit card details.
              Stripe collects and stores payment information securely in compliance with PCI-DSS standards.
              We only store:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Stripe customer ID (to manage your subscription)</li>
              <li>Subscription status and billing cycle dates</li>
              <li>Last 4 digits of your payment method (for display purposes)</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Usage Data</h3>
            <p class="text-gray-600 mb-4">We automatically collect:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Log data</strong> – IP addresses, browser type, pages visited, timestamps</li>
              <li><strong>Device information</strong> – Operating system, screen resolution</li>
              <li><strong>Cookies</strong> – Session cookies for authentication (no third-party tracking cookies)</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p class="text-gray-600 mb-4">We use your information to:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Provide the service</strong> – Enable booking, calendar sync, and notifications</li>
              <li><strong>Process payments</strong> – Manage subscriptions and billing</li>
              <li><strong>Send communications</strong> – Account updates, booking confirmations, receipts</li>
              <li><strong>Improve the service</strong> – Analyze usage patterns and fix bugs</li>
              <li><strong>Ensure security</strong> – Detect fraud and prevent unauthorized access</li>
              <li><strong>Comply with legal obligations</strong> – Respond to legal requests and enforce our terms</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p class="text-gray-600 mb-4">
              We use the following third-party services to operate Book with Snivel:
            </p>
            
            <div class="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Google Calendar & Microsoft Calendar</h4>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Purpose:</strong> Calendar integration and availability checking
              </p>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Data shared:</strong> OAuth tokens, calendar availability, booking event details
              </p>
              <p class="text-gray-600 text-sm">
                <strong>Privacy policies:</strong>{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">Google</a>,{" "}
                <a href="https://privacy.microsoft.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">Microsoft</a>
              </p>
            </div>

            <div class="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Stripe</h4>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Purpose:</strong> Payment processing and subscription management
              </p>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Data shared:</strong> Email, name, payment method
              </p>
              <p class="text-gray-600 text-sm">
                <strong>Privacy policy:</strong>{" "}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">Stripe Privacy</a>
              </p>
            </div>

            <div class="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Resend</h4>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Purpose:</strong> Transactional email delivery
              </p>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Data shared:</strong> Email addresses, message content (booking confirmations, receipts)
              </p>
              <p class="text-gray-600 text-sm">
                <strong>Privacy policy:</strong>{" "}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">Resend Privacy</a>
              </p>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Deno Deploy</h4>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Purpose:</strong> Application hosting and data storage
              </p>
              <p class="text-gray-600 text-sm mb-2">
                <strong>Data shared:</strong> All application data (accounts, bookings, OAuth tokens)
              </p>
              <p class="text-gray-600 text-sm">
                <strong>Privacy policy:</strong>{" "}
                <a href="https://deno.com/deploy/docs/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">Deno Privacy</a>
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p class="text-gray-600 mb-4">We implement security measures to protect your data:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Encryption in transit</strong> – All data is transmitted over HTTPS/TLS</li>
              <li><strong>Encryption at rest</strong> – OAuth tokens and sensitive data are encrypted in storage</li>
              <li><strong>Access controls</strong> – Limited employee access to production data</li>
              <li><strong>Regular updates</strong> – We promptly apply security patches</li>
            </ul>
            <p class="text-gray-600 mt-4">
              While we strive to protect your data, no system is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Active accounts:</strong> Data is retained as long as your account is active</li>
              <li><strong>Cancelled accounts:</strong> Data is retained for 90 days after cancellation, then deleted</li>
              <li><strong>Booking history:</strong> Retained for 12 months for operational purposes</li>
              <li><strong>Payment records:</strong> Retained for 7 years for tax and legal compliance</li>
              <li><strong>Logs:</strong> Automatically deleted after 30 days</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p class="text-gray-600 mb-4">You have the right to:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Access your data</strong> – Request a copy of your personal information</li>
              <li><strong>Correct your data</strong> – Update inaccurate or incomplete information</li>
              <li><strong>Delete your data</strong> – Request account deletion (see Data Retention above)</li>
              <li><strong>Export your data</strong> – Download your booking history and settings</li>
              <li><strong>Revoke calendar access</strong> – Disconnect your Google or Microsoft calendar at any time</li>
              <li><strong>Opt out of emails</strong> – Unsubscribe from marketing emails (transactional emails cannot be disabled)</li>
            </ul>
            <p class="text-gray-600 mt-4">
              To exercise these rights, email us at{" "}
              <a href="mailto:privacy@snivel.com" class="text-blue-600 hover:text-blue-800">privacy@snivel.com</a>.
            </p>
          </section>

          {/* GDPR & CCPA Compliance */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">GDPR & CCPA Compliance</h2>
            
            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">European Users (GDPR)</h3>
            <p class="text-gray-600 mb-4">
              If you are located in the European Economic Area (EEA), you have additional rights under the
              General Data Protection Regulation (GDPR):
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to data portability</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p class="text-gray-600 mt-4">
              <strong>Legal basis for processing:</strong> We process your data based on contract performance
              (to provide the service), consent (calendar integrations), and legitimate interests (service improvement).
            </p>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">California Users (CCPA)</h3>
            <p class="text-gray-600 mb-4">
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Right to know what personal information we collect, use, disclose, and sell</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p class="text-gray-600 leading-relaxed">
              Book with Snivel is not intended for use by individuals under 18 years of age. We do not knowingly
              collect personal information from children. If you believe we have inadvertently collected data from
              a child, please contact us immediately.
            </p>
          </section>

          {/* Cookies */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
            <p class="text-gray-600 mb-4">
              We use cookies minimally and only for essential functions:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Session cookies</strong> – Keep you logged in (required for the service to work)</li>
              <li><strong>Authentication tokens</strong> – Stored securely in HTTP-only cookies</li>
            </ul>
            <p class="text-gray-600 mt-4">
              We <strong>do not use</strong> third-party tracking cookies, analytics cookies, or advertising cookies.
            </p>
          </section>

          {/* International Data Transfers */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
            <p class="text-gray-600 leading-relaxed">
              Your data may be stored and processed in the United States and other countries where our service
              providers operate. By using Book with Snivel, you consent to the transfer of your data to these
              locations. We ensure that our service providers maintain adequate data protection standards.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p class="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by
              email or by posting a prominent notice on our website. Your continued use of the service after changes
              take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div class="bg-gray-50 rounded-lg p-6">
              <p class="text-gray-600">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@snivel.com" class="text-blue-600 hover:text-blue-800">privacy@snivel.com</a>
              </p>
              <p class="text-gray-600 mt-2">
                <strong>Support:</strong>{" "}
                <a href="mailto:support@snivel.com" class="text-blue-600 hover:text-blue-800">support@snivel.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer class="border-t border-gray-200 py-8 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">2025 SNIVEL. All rights reserved.</span>
            <div class="flex gap-6">
              <a href="/pricing" class="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="/terms" class="text-gray-600 hover:text-gray-900">Terms</a>
              <a href="/privacy" class="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="/login" class="text-gray-600 hover:text-gray-900">Login</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});
