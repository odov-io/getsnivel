/**
 * GET /privacy
 * Privacy Policy page for SNIVEL platform
 * Covers: Book with Snivel, Sigs by Snivel, Snivel (availability)
 * Meets Google OAuth restricted scope verification requirements
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
            Snivel Platform
          </span>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p class="text-gray-500 mb-12">Last updated: February 2026</p>

        <div class="prose prose-gray max-w-none">
          {/* Introduction */}
          <section class="mb-10">
            <p class="text-gray-600 leading-relaxed">
              This Privacy Policy describes how SNIVEL ("we," "us," or "our") collects, uses, stores, and protects
              your information when you use the Snivel platform, including <strong>Book with Snivel</strong> (scheduling and booking),{" "}
              <strong>Sigs by Snivel</strong> (email signature management), and related services
              (collectively, the "Services"). By using our Services, you agree to the collection and use of
              information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">1.1 Account Information</h3>
            <p class="text-gray-600 mb-3">When you create an account, we collect:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Email address</li>
              <li>Full name</li>
              <li>Organization name (for team accounts)</li>
              <li>Authentication method preference (magic link, email code, or OAuth provider)</li>
            </ul>
            <p class="text-gray-600 mt-3">
              We use passwordless authentication. We do not collect or store passwords.
            </p>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">1.2 Calendar Integration Data (Book with Snivel)</h3>
            <p class="text-gray-600 mb-3">When you connect a calendar, we access:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>OAuth tokens</strong> (access token and refresh token) to maintain your calendar connection</li>
              <li><strong>Calendar event metadata</strong> (start/end times, free/busy status) to determine your availability</li>
              <li><strong>Calendar identifiers</strong> (calendar ID, email address, provider) to manage your connected calendars</li>
            </ul>
            <p class="text-gray-600 mt-3">
              We access the minimum calendar data necessary to check availability and create booking events.
              We do not read event titles, descriptions, attendee lists, or other event content
              beyond what is needed for availability checking.
            </p>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">1.3 Booking Data</h3>
            <p class="text-gray-600 mb-3">When bookings are made through your pages, we collect:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Booker's name and email address</li>
              <li>Timezone</li>
              <li>Notes or messages provided by the booker</li>
              <li>Responses to custom intake questions (configured by you)</li>
              <li>Additional attendee information (if provided)</li>
              <li>Recording consent acknowledgment (if applicable)</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">1.4 Email Signature Data (Sigs by Snivel)</h3>
            <p class="text-gray-600 mb-3">When using our email signature management service, we collect:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Professional contact information (job title, department, phone numbers, address)</li>
              <li>Social media profile URLs (LinkedIn, Twitter)</li>
              <li>Avatar/photo URLs</li>
              <li>Signature template preferences and branding settings</li>
              <li>OAuth tokens for Gmail or Microsoft Outlook (for signature deployment only)</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">1.5 Payment Information</h3>
            <p class="text-gray-600 mb-3">
              Payment processing is handled entirely by Stripe. We do <strong>not</strong> collect, store,
              or have access to your full credit card number or payment credentials. We store only:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Stripe customer ID (a reference identifier)</li>
              <li>Subscription status and plan type</li>
              <li>Billing period dates</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">1.6 Usage and Log Data</h3>
            <p class="text-gray-600 mb-3">We automatically collect minimal technical data:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>IP address (for rate limiting and security only)</li>
              <li>Request timestamps</li>
              <li>Browser type and device information</li>
            </ul>
            <p class="text-gray-600 mt-3">
              Log data is retained for a maximum of 30 days and is used exclusively for
              security monitoring and abuse prevention. We do not use analytics tracking
              or third-party analytics services.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p class="text-gray-600 mb-3">We use the information we collect to:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Provide our Services:</strong> Manage your account, display availability, process bookings, deploy email signatures, and deliver the core functionality you signed up for.</li>
              <li><strong>Authenticate you:</strong> Verify your identity via magic links, email codes, or OAuth provider authentication.</li>
              <li><strong>Process payments:</strong> Manage your subscription through Stripe.</li>
              <li><strong>Send transactional communications:</strong> Booking confirmations, reminders, authentication links, and account notifications.</li>
              <li><strong>Maintain security:</strong> Rate-limit authentication attempts, detect abuse, and protect against unauthorized access.</li>
              <li><strong>Comply with legal obligations:</strong> Respond to lawful requests and enforce our Terms of Service.</li>
            </ul>
            <p class="text-gray-600 mt-4">
              We do <strong>not</strong> use your information for advertising, profiling, or selling to third parties.
            </p>
          </section>

          {/* Google API Services - Limited Use Disclosure */}
          <section class="mb-10 border-l-4 border-gray-900 pl-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. Google API Services &mdash; Limited Use Disclosure</h2>
            <p class="text-gray-600 mb-4">
              Snivel's use and transfer to any other app of information received from Google APIs will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                class="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>, including the Limited Use requirements.
            </p>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">3.1 What Google Data We Access</h3>
            <p class="text-gray-600 mb-3">
              When you connect your Google account, we request access to the following scopes depending on the
              features you use:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Google Calendar</strong> (<code class="text-sm bg-gray-100 px-1 rounded">calendar.events</code>):
                To read your calendar events for availability checking and to create booking events on your behalf.
              </li>
              <li>
                <strong>Gmail Settings</strong> (<code class="text-sm bg-gray-100 px-1 rounded">gmail.settings.basic</code>):
                To deploy email signatures to your Gmail account when you use Sigs by Snivel.
              </li>
              <li>
                <strong>Basic Profile</strong> (<code class="text-sm bg-gray-100 px-1 rounded">email</code>,{" "}
                <code class="text-sm bg-gray-100 px-1 rounded">profile</code>,{" "}
                <code class="text-sm bg-gray-100 px-1 rounded">openid</code>):
                To identify your account and pre-fill your name and email.
              </li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">3.2 How We Use Google Data</h3>
            <p class="text-gray-600 mb-3">
              Data obtained through Google APIs is used <strong>exclusively</strong> to provide and improve
              user-facing features of Snivel that are visible in the application's interface:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Calendar data is used only to check your availability and create/manage booking events.</li>
              <li>Gmail Settings access is used only to set your email signature in Gmail.</li>
              <li>Profile data is used only to identify your account within Snivel.</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">3.3 Limited Use Compliance</h3>
            <p class="text-gray-600 mb-3">
              In compliance with Google's Limited Use requirements, we confirm that:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>We do <strong>not</strong> transfer Google user data to advertising platforms, data brokers, or information resellers.</li>
              <li>We do <strong>not</strong> use Google user data for serving advertisements, including retargeting, personalized, or interest-based advertising.</li>
              <li>We do <strong>not</strong> use Google user data to determine creditworthiness or for lending purposes.</li>
              <li>We do <strong>not</strong> use Google user data for training artificial intelligence or machine learning models.</li>
              <li>We do <strong>not</strong> allow humans to read Google user data except: (a) with the user's affirmative agreement to view specific data, (b) for security purposes such as investigating abuse, (c) to comply with applicable law, or (d) when the data is aggregated and used for internal operations.</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">3.4 Revoking Google Access</h3>
            <p class="text-gray-600">
              You can revoke Snivel's access to your Google account at any time by:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2 mt-2">
              <li>Disconnecting your calendar or email from the Snivel settings page.</li>
              <li>Removing Snivel from your Google account's{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  class="text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  third-party app permissions
                </a>.
              </li>
            </ul>
            <p class="text-gray-600 mt-2">
              Upon revocation, we will delete your stored Google OAuth tokens. Previously created booking events
              or deployed signatures will remain in your Google account but Snivel will no longer have access to
              modify them.
            </p>
          </section>

          {/* Microsoft API Services */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Microsoft API Services</h2>
            <p class="text-gray-600 mb-3">
              When you connect your Microsoft account, we request access to:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Outlook Calendar</strong> (<code class="text-sm bg-gray-100 px-1 rounded">Calendars.ReadWrite</code>):
                To read your calendar for availability checking and to create booking events.
              </li>
              <li>
                <strong>Mailbox Settings</strong> (<code class="text-sm bg-gray-100 px-1 rounded">MailboxSettings.ReadWrite</code>):
                To deploy email signatures to your Outlook account when you use Sigs by Snivel.
              </li>
              <li>
                <strong>User Profile</strong> (<code class="text-sm bg-gray-100 px-1 rounded">User.Read</code>):
                To identify your account.
              </li>
            </ul>
            <p class="text-gray-600 mt-3">
              Microsoft data is subject to the same use restrictions described for Google data above. We do not
              transfer, sell, or use Microsoft user data for advertising, profiling, or any purpose beyond
              providing the Snivel Services. You can revoke access at any time from your{" "}
              <a
                href="https://account.live.com/consent/Manage"
                class="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft account permissions
              </a>.
            </p>
          </section>

          {/* Third-Party Services */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p class="text-gray-600 mb-4">
              We use the following third-party services to operate Snivel. Each processes only the minimum
              data necessary for their function:
            </p>

            <div class="space-y-4">
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900">Stripe</h4>
                <p class="text-gray-600 text-sm mt-1"><strong>Purpose:</strong> Payment processing and subscription management</p>
                <p class="text-gray-600 text-sm"><strong>Data shared:</strong> Email address for customer creation; all payment details are collected directly by Stripe</p>
                <p class="text-gray-600 text-sm">
                  <a href="https://stripe.com/privacy" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a>
                </p>
              </div>

              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900">Resend</h4>
                <p class="text-gray-600 text-sm mt-1"><strong>Purpose:</strong> Transactional email delivery (authentication links, booking confirmations, reminders)</p>
                <p class="text-gray-600 text-sm"><strong>Data shared:</strong> Recipient email address and email content</p>
                <p class="text-gray-600 text-sm">
                  <a href="https://resend.com/legal/privacy-policy" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Resend Privacy Policy</a>
                </p>
              </div>

              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900">Deno Deploy</h4>
                <p class="text-gray-600 text-sm mt-1"><strong>Purpose:</strong> Application hosting and data storage (Deno KV)</p>
                <p class="text-gray-600 text-sm"><strong>Data shared:</strong> All application data is stored in Deno KV on Deno Deploy infrastructure</p>
                <p class="text-gray-600 text-sm">
                  <a href="https://deno.com/deploy/docs/privacy-policy" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Deno Privacy Policy</a>
                </p>
              </div>

              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900">Google (Calendar API, Gmail API)</h4>
                <p class="text-gray-600 text-sm mt-1"><strong>Purpose:</strong> Calendar synchronization and email signature deployment</p>
                <p class="text-gray-600 text-sm"><strong>Data shared:</strong> OAuth tokens, calendar availability queries, signature HTML content</p>
                <p class="text-gray-600 text-sm">
                  <a href="https://policies.google.com/privacy" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
                </p>
              </div>

              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900">Microsoft (Outlook Calendar API, Graph API)</h4>
                <p class="text-gray-600 text-sm mt-1"><strong>Purpose:</strong> Calendar synchronization and email signature deployment</p>
                <p class="text-gray-600 text-sm"><strong>Data shared:</strong> OAuth tokens, calendar availability queries, signature HTML content</p>
                <p class="text-gray-600 text-sm">
                  <a href="https://privacy.microsoft.com/en-us/privacystatement" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Microsoft Privacy Statement</a>
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Encryption in transit:</strong> All data transmitted between your browser and our servers is encrypted using HTTPS/TLS.</li>
              <li><strong>Encryption at rest:</strong> OAuth tokens are stored encrypted in Deno KV. All data at rest is protected by Deno Deploy's infrastructure encryption.</li>
              <li><strong>Passwordless authentication:</strong> We use magic links and email codes rather than passwords, eliminating password-based attack vectors.</li>
              <li><strong>Two-factor authentication:</strong> Optional TOTP-based two-factor authentication is available for additional account security.</li>
              <li><strong>Rate limiting:</strong> Authentication endpoints are rate-limited by IP address to prevent brute-force attacks.</li>
              <li><strong>Minimal access:</strong> Employee access to user data is restricted to what is necessary for support and operations.</li>
              <li><strong>Token management:</strong> OAuth tokens are automatically refreshed and old tokens are invalidated. Authentication tokens (magic links, email codes) expire after 10 minutes.</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full text-gray-600 text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-2 pr-4 font-semibold text-gray-900">Data Type</th>
                    <th class="text-left py-2 font-semibold text-gray-900">Retention Period</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr><td class="py-2 pr-4">Account data</td><td class="py-2">Retained while account is active</td></tr>
                  <tr><td class="py-2 pr-4">Calendar OAuth tokens</td><td class="py-2">Until disconnected by user or account deletion</td></tr>
                  <tr><td class="py-2 pr-4">Booking history</td><td class="py-2">12 months after booking date</td></tr>
                  <tr><td class="py-2 pr-4">Signature templates & data</td><td class="py-2">Retained while account is active</td></tr>
                  <tr><td class="py-2 pr-4">Payment records</td><td class="py-2">7 years (legal/tax compliance)</td></tr>
                  <tr><td class="py-2 pr-4">Log/usage data</td><td class="py-2">30 days</td></tr>
                  <tr><td class="py-2 pr-4">Authentication tokens</td><td class="py-2">10 minutes (auto-expire)</td></tr>
                  <tr><td class="py-2 pr-4">Data after account cancellation</td><td class="py-2">90 days, then permanently deleted</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Cookies */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
            <p class="text-gray-600 mb-3">
              We use only <strong>essential, session-based cookies</strong> for authentication and session management.
              We do not use:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Third-party tracking cookies</li>
              <li>Advertising cookies</li>
              <li>Analytics cookies</li>
              <li>Persistent cookies beyond your login session</li>
            </ul>
            <p class="text-gray-600 mt-3">
              Our cookies are HTTP-only and Secure-flagged, meaning they cannot be accessed by JavaScript
              and are only transmitted over encrypted connections.
            </p>
          </section>

          {/* Your Rights */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Your Rights</h2>
            <p class="text-gray-600 mb-3">You have the right to:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate personal data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data and account.</li>
              <li><strong>Data export:</strong> Export your data in a machine-readable format.</li>
              <li><strong>Revoke access:</strong> Disconnect Google or Microsoft calendar/email integrations at any time.</li>
              <li><strong>Opt out:</strong> Unsubscribe from marketing emails (transactional emails necessary for the service cannot be opted out).</li>
              <li><strong>Restrict processing:</strong> Request that we limit how we process your data.</li>
              <li><strong>Object:</strong> Object to processing of your data for specific purposes.</li>
            </ul>
            <p class="text-gray-600 mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@snivel.com" class="text-blue-600 hover:text-blue-800">privacy@snivel.com</a>.
              We will respond within 30 days.
            </p>
          </section>

          {/* GDPR */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. GDPR Compliance (European Economic Area)</h2>
            <p class="text-gray-600 mb-3">If you are located in the EEA, you have additional rights under the General Data Protection Regulation:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Lawful basis:</strong> We process your data based on (a) your consent (for OAuth connections), (b) performance of our contract with you (providing the Services), and (c) our legitimate interests (security and fraud prevention).</li>
              <li><strong>Data portability:</strong> You can request your data in a structured, commonly used, machine-readable format.</li>
              <li><strong>Right to erasure:</strong> You can request complete deletion of your data ("right to be forgotten").</li>
              <li><strong>Supervisory authority:</strong> You have the right to lodge a complaint with your local data protection authority.</li>
              <li><strong>Withdrawal of consent:</strong> Where processing is based on consent, you may withdraw consent at any time without affecting the lawfulness of processing carried out before withdrawal.</li>
            </ul>
          </section>

          {/* CCPA */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">11. CCPA Compliance (California Residents)</h2>
            <p class="text-gray-600 mb-3">If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Right to know:</strong> You may request that we disclose what personal information we collect, use, and share.</li>
              <li><strong>Right to delete:</strong> You may request deletion of your personal information.</li>
              <li><strong>Right to opt-out:</strong> You have the right to opt out of the "sale" of personal information. <strong>We do not sell personal information.</strong></li>
              <li><strong>Non-discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
            </ul>
            <p class="text-gray-600 mt-3">
              <strong>Categories of information collected:</strong> Identifiers (name, email), commercial information
              (subscription data), internet activity (log data), and professional information (job title, company for signatures).
            </p>
            <p class="text-gray-600 mt-2">
              <strong>We do not sell personal information.</strong> We do not share personal information with third parties
              for their own marketing purposes.
            </p>
          </section>

          {/* Organization-Managed Accounts */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">12. Organization-Managed Accounts</h2>
            <p class="text-gray-600 mb-3">
              If your account is part of an organization (team or enterprise plan), your organization's
              administrator may:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>View your booking activity and availability settings</li>
              <li>Manage your email signature templates and deployed signatures</li>
              <li>Set field permissions (which signature fields you can edit)</li>
              <li>Deploy signatures to your email account on your behalf (with your consent via OAuth)</li>
              <li>Configure booking policies, approval workflows, and intake forms</li>
              <li>Remove your account from the organization</li>
            </ul>
            <p class="text-gray-600 mt-3">
              Your organization's use of your data is also subject to their own privacy policies. If you have
              questions about how your organization handles your data, contact your administrator.
            </p>
          </section>

          {/* International Data Transfers */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">13. International Data Transfers</h2>
            <p class="text-gray-600 leading-relaxed">
              Our Services are hosted on Deno Deploy, which may process data in multiple regions. If you are
              accessing our Services from outside the United States, please be aware that your information may
              be transferred to, stored, and processed in the United States or other countries where our
              infrastructure is located. By using our Services, you consent to this transfer. We ensure appropriate
              safeguards are in place for international data transfers in compliance with applicable data
              protection laws.
            </p>
          </section>

          {/* Children's Privacy */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">14. Children's Privacy</h2>
            <p class="text-gray-600 leading-relaxed">
              Our Services are not directed to individuals under the age of 18. We do not knowingly collect
              personal information from children. If we become aware that we have collected personal information
              from a child under 18, we will take steps to delete that information promptly. If you believe we
              have inadvertently collected information from a child, please contact us at{" "}
              <a href="mailto:privacy@snivel.com" class="text-blue-600 hover:text-blue-800">privacy@snivel.com</a>.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">15. Changes to This Privacy Policy</h2>
            <p class="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or
              applicable laws. We will notify you of material changes by email or by posting a prominent notice
              on our website prior to the change becoming effective. The "Last updated" date at the top of this
              page indicates when this policy was last revised. Your continued use of the Services after changes
              take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">16. Contact Us</h2>
            <p class="text-gray-600 mb-3">
              If you have questions about this Privacy Policy or wish to exercise your data rights, contact us:
            </p>
            <ul class="list-none text-gray-600 space-y-1">
              <li><strong>Privacy inquiries:</strong>{" "}
                <a href="mailto:privacy@snivel.com" class="text-blue-600 hover:text-blue-800">privacy@snivel.com</a>
              </li>
              <li><strong>General support:</strong>{" "}
                <a href="mailto:support@snivel.com" class="text-blue-600 hover:text-blue-800">support@snivel.com</a>
              </li>
            </ul>
            <p class="text-gray-600 mt-3">
              We aim to respond to all privacy-related inquiries within 30 days.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer class="border-t border-gray-200 py-8 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">2026 SNIVEL. All rights reserved.</span>
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
