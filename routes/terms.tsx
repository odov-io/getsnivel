/**
 * GET /terms
 * Terms of Service page for SNIVEL platform
 * Covers: Book with Snivel, Sigs by Snivel, Snivel (availability)
 */

import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Terms() {
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
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p class="text-gray-500 mb-12">Last updated: February 2026</p>

        <div class="prose prose-gray max-w-none">
          {/* Introduction */}
          <section class="mb-10">
            <p class="text-gray-600 leading-relaxed">
              These Terms of Service ("Terms") govern your use of the Snivel platform, including{" "}
              <strong>Book with Snivel</strong> (scheduling and booking), <strong>Sigs by Snivel</strong>{" "}
              (email signature management), and related services (collectively, the "Services"),
              operated by ODOV LLC, a North Carolina limited liability company ("we," "us," or "our"). By creating an account or using our Services,
              you agree to these Terms. If you do not agree, do not use the Services.
            </p>
          </section>

          {/* Services Description */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Our Services</h2>
            <p class="text-gray-600 mb-3">The Snivel platform provides the following services:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Book with Snivel:</strong> Online scheduling and booking pages with calendar integration, custom intake forms, approval workflows, reminders, and team management.</li>
              <li><strong>Sigs by Snivel:</strong> Email signature creation, management, and deployment to Gmail and Microsoft Outlook, with organization-level template control and branding.</li>
            </ul>
            <p class="text-gray-600 mt-3">
              Additional features and services may be added over time. We will notify you of material changes
              to the Services.
            </p>
          </section>

          {/* Account Terms */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Account Terms</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>You must be at least 18 years old to use the Services.</li>
              <li>You must provide accurate and complete information when creating your account.</li>
              <li>You are responsible for maintaining the security of your account. Notify us immediately at{" "}
                <a href="mailto:support@snivel.com" class="text-blue-600 hover:text-blue-800">support@snivel.com</a>{" "}
                if you suspect unauthorized access.</li>
              <li>You may not use the Services for any unlawful purpose or in violation of these Terms.</li>
              <li>One person or entity may not maintain more than one free trial account.</li>
              <li>If you create an account on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</li>
            </ul>
          </section>

          {/* Free Trial */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. Free Trial</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>All new accounts receive a <strong>30-day free trial</strong> with full access to all features.</li>
              <li>Team plan trials are limited to 5 users during the trial period.</li>
              <li>No credit card is required to start a trial.</li>
              <li>At the end of your trial, you must subscribe to continue using the service.</li>
              <li>If you do not subscribe within 30 days of trial expiration, your account will be frozen.</li>
            </ul>
          </section>

          {/* Subscription Plans */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Subscription Plans</h2>
            <p class="text-gray-600 mb-4">
              We offer <strong>Solo</strong> plans (for individuals) and <strong>Team</strong> plans (for organizations).
              Team plans are priced based on the number of users. Add-on services such as Sigs by Snivel
              may have separate plan tiers.
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Subscriptions are billed on a recurring basis (monthly or annually).</li>
              <li>All prices are in US dollars and exclude applicable taxes.</li>
              <li>Sales tax, VAT, or GST is calculated and collected based on your location where required by law.</li>
              <li>Annual subscriptions are billed upfront for the full year.</li>
              <li>Business customers may provide a tax ID for tax exemption where applicable.</li>
            </ul>
          </section>

          {/* Billing & Payment */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Billing & Payment</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Payments are processed securely through <strong>Stripe</strong>. We do not store your credit card details.</li>
              <li>We accept major credit cards (Visa, Mastercard, American Express, Discover).</li>
              <li>Your subscription will automatically renew at the end of each billing period unless cancelled.</li>
              <li>You will receive an email receipt for each payment.</li>
              <li>You can update your payment method at any time through the billing portal.</li>
            </ul>
          </section>

          {/* Plan Changes */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Plan Changes</h2>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Upgrades</h3>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Upgrades take effect <strong>immediately</strong>.</li>
              <li>You will be charged the <strong>prorated difference</strong> for the remainder of your billing period.</li>
              <li>New features are available right away.</li>
            </ul>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Downgrades</h3>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Downgrades take effect at the <strong>end of your current billing period</strong>.</li>
              <li>You retain access to your current plan until the billing period ends.</li>
              <li><strong>No refunds or credits</strong> are issued for downgrades.</li>
              <li>If downgrading to fewer user seats, you may need to remove users before the change takes effect.</li>
            </ul>
          </section>

          {/* Cancellation */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Cancellation</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>You can cancel your subscription at any time from the billing portal.</li>
              <li>Cancellations take effect at the <strong>end of your current billing period</strong>.</li>
              <li>You retain access to paid features until your billing period ends.</li>
              <li><strong>No refunds</strong> are issued for partial billing periods or unused time.</li>
              <li>After cancellation, your account will be frozen and you will lose access to the Services.</li>
            </ul>
          </section>

          {/* Failed Payments */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Failed Payments</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>You will receive email notifications about failed payments.</li>
              <li>You have <strong>14 days</strong> to update your payment method and resolve the issue.</li>
              <li>If payment is not received within 14 days, your account will be frozen.</li>
              <li>You can reactivate your account at any time by updating your payment method.</li>
            </ul>
          </section>

          {/* Account Status */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Account Status</h2>
            <p class="text-gray-600 mb-3">Your account can be in one of the following states:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Active:</strong> Full access to all features included in your plan.</li>
              <li><strong>Trialing:</strong> Full access during your 30-day free trial period.</li>
              <li><strong>Past Due:</strong> Payment has failed. You have 14 days to resolve.</li>
              <li><strong>Frozen:</strong> Account suspended. Your data is retained but you cannot use the Services.</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. Acceptable Use</h2>
            <p class="text-gray-600 mb-3">You agree not to use the Services to:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Violate any applicable law, regulation, or third-party rights.</li>
              <li>Send spam, phishing messages, or unsolicited communications through booking pages or email signatures.</li>
              <li>Upload or distribute malware, viruses, or malicious code.</li>
              <li>Attempt to gain unauthorized access to other users' accounts or our systems.</li>
              <li>Use automated scripts or bots to access the Services (except through our published APIs).</li>
              <li>Misrepresent your identity or affiliation with any person or organization.</li>
              <li>Use email signature deployment to distribute misleading, fraudulent, or illegal content.</li>
              <li>Circumvent rate limits, usage quotas, or other service restrictions.</li>
              <li>Resell, sublicense, or redistribute the Services without our written consent.</li>
              <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Services.</li>
              <li>Access the Services for the purpose of building a competitive product or service, or for benchmarking.</li>
            </ul>
            <p class="text-gray-600 mt-3">
              We reserve the right to suspend or terminate accounts that violate these terms, with or without notice.
            </p>
          </section>

          {/* Third-Party Integrations */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">11. Third-Party Integrations</h2>
            <p class="text-gray-600 mb-3">
              The Services integrate with third-party platforms including Google Workspace, Microsoft 365,
              and Stripe. Your use of these integrations is also subject to their respective terms:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <a href="https://policies.google.com/terms" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Google Terms of Service</a>
              </li>
              <li>
                <a href="https://www.microsoft.com/en-us/servicesagreement" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Microsoft Services Agreement</a>
              </li>
              <li>
                <a href="https://stripe.com/legal/consumer" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Stripe Services Agreement</a>
              </li>
            </ul>
            <p class="text-gray-600 mt-3">
              We are not responsible for the availability, accuracy, or content of third-party services.
              If a third-party integration becomes unavailable, we will make reasonable efforts to notify you
              but are not liable for resulting service interruptions.
            </p>
          </section>

          {/* Google API Compliance */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">12. Google API Services Compliance</h2>
            <p class="text-gray-600 mb-3">
              Our use of Google API data complies with the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                class="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>, including the Limited Use requirements. Specifically:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Google user data is used only to provide features visible in the Snivel application.</li>
              <li>Google user data is not transferred to third parties except as necessary to provide the Services.</li>
              <li>Google user data is not used for advertising or sold to data brokers.</li>
              <li>You may revoke our access to your Google data at any time.</li>
            </ul>
            <p class="text-gray-600 mt-3">
              For full details on how we handle Google data, see our{" "}
              <a href="/privacy" class="text-blue-600 hover:text-blue-800">Privacy Policy</a>, Section 3.
            </p>
          </section>

          {/* Intellectual Property */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">13. Intellectual Property</h2>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Our Property</h3>
            <p class="text-gray-600 mb-3">
              The Services, including all software, design, branding, and content created by us,
              are owned by SNIVEL and protected by intellectual property laws. These Terms do not
              grant you any rights to our trademarks, logos, or brand features.
            </p>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Your Content</h3>
            <p class="text-gray-600 mb-3">
              You retain ownership of all content you upload or create through the Services, including
              booking page content, signature designs, logos, photos, and custom branding.
              By uploading content, you grant us a limited license to host, display, and transmit
              that content solely for the purpose of providing the Services to you.
            </p>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Signature Templates</h3>
            <p class="text-gray-600">
              Email signature templates provided by Snivel are licensed for use within the Services.
              The HTML output generated for your email signatures may be used freely in your email
              applications. Custom logos, photos, and branding you add to signatures remain your property.
            </p>
          </section>

          {/* Data & Privacy */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">14. Data & Privacy</h2>
            <p class="text-gray-600 mb-3">
              Your use of the Services is also governed by our{" "}
              <a href="/privacy" class="text-blue-600 hover:text-blue-800">Privacy Policy</a>,
              which describes how we collect, use, and protect your data. Key points:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>We use passwordless authentication and do not store passwords.</li>
              <li>Payment data is processed by Stripe; we do not store credit card details.</li>
              <li>OAuth tokens for Google and Microsoft are stored encrypted.</li>
              <li>You can export your data or request deletion at any time.</li>
              <li>Data is retained for 90 days after account cancellation, then permanently deleted.</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">15. Data Retention</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Your data is retained while your account is active.</li>
              <li>After account cancellation or freezing, your data is retained for <strong>90 days</strong>.</li>
              <li>After 90 days of inactivity, your data may be permanently deleted.</li>
              <li>You can request data export at any time while your account is active.</li>
              <li>Payment records are retained for 7 years for legal and tax compliance.</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">16. Disclaimer of Warranties</h2>
            <p class="text-gray-600 leading-relaxed font-semibold uppercase text-sm">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES
              ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE. WE DO NOT WARRANT THAT THE
              SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER
              HARMFUL COMPONENTS.
            </p>
          </section>

          {/* Service Availability */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">17. Service Availability</h2>
            <p class="text-gray-600 leading-relaxed">
              We strive to maintain high availability of the Services but do not guarantee uninterrupted access.
              The Services may be temporarily unavailable due to maintenance, updates, or circumstances beyond
              our control. We will make reasonable efforts to provide advance notice of planned maintenance.
              We are not liable for any damages resulting from service interruptions.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">18. Limitation of Liability</h2>
            <p class="text-gray-600 mb-3">
              To the maximum extent permitted by law:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Neither party is liable to the other for any indirect, incidental, special, consequential, or punitive damages, regardless of the cause of action or theory of liability.</li>
              <li>Each party's total aggregate liability to the other for any claims arising from or related to these Terms or the Services shall not exceed the amount paid by you to us in the 12 months preceding the claim.</li>
              <li>The foregoing limitations shall not apply to (a) either party's indemnification obligations, (b) either party's infringement of the other party's intellectual property rights, (c) liability arising from a party's gross negligence or willful misconduct, or (d) liability that cannot be limited by applicable law.</li>
              <li>We are not liable for missed bookings, failed signature deployments, or calendar synchronization errors.</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">19. Indemnification</h2>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Your Indemnification</h3>
            <p class="text-gray-600 mb-3">
              You agree to indemnify and hold harmless ODOV LLC and its officers, members, employees, and agents
              from any claims, damages, losses, liabilities, and expenses (including reasonable attorney's fees)
              arising from: (a) your violation of these Terms, (b) your violation of any third-party rights, or
              (c) content you upload or transmit through the Services.
            </p>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Our Indemnification</h3>
            <p class="text-gray-600 mb-3">
              We will indemnify and hold harmless you from any third-party claims that the Services, as provided
              by us, infringe any third-party intellectual property right, provided that this obligation does not
              apply to claims arising from: (a) your modification of the Services, (b) your combination of the
              Services with non-Snivel products or services, or (c) your continued use of the Services after
              being notified of the alleged infringement.
            </p>
            <h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">Indemnification Procedure</h3>
            <p class="text-gray-600">
              The indemnified party shall: (i) provide prompt written notice of the claim, (ii) grant the
              indemnifying party sole control of the defense and settlement, and (iii) provide reasonable
              cooperation at the indemnifying party's expense.
            </p>
          </section>

          {/* Termination */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">20. Termination</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>You may terminate your account at any time by cancelling your subscription and requesting account deletion.</li>
              <li>We may suspend or terminate your account if you violate these Terms, with at least 5 business days' written notice, except where immediate suspension is reasonably necessary to prevent harm to other users, our systems, or third parties.</li>
              <li>We may terminate your subscription for convenience upon 30 days' prior written notice, in which case we will refund any prepaid fees for the unused portion of the then-current subscription term.</li>
              <li>Upon termination, your right to use the Services ceases immediately.</li>
              <li>Upon termination or cancellation, you may request a data export within the 90-day retention period by contacting{" "}
                <a href="mailto:support@snivel.com" class="text-blue-600 hover:text-blue-800">support@snivel.com</a>.
                We will provide your data in a standard machine-readable format (e.g., JSON or CSV) within 15 business days.</li>
              <li>Data retention after termination is governed by Section 15 of these Terms.</li>
              <li>Sections that by their nature should survive termination will survive, including intellectual property, limitation of liability, indemnification, dispute resolution, and general provisions.</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">21. Dispute Resolution</h2>
            <p class="text-gray-600 mb-3">
              Any disputes arising from or relating to these Terms or the Services will be resolved as follows:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Informal resolution:</strong> We encourage you to contact us first at{" "}
                <a href="mailto:support@snivel.com" class="text-blue-600 hover:text-blue-800">support@snivel.com</a>{" "}
                to attempt to resolve the dispute informally.</li>
              <li><strong>Governing law:</strong> These Terms are governed by and construed in accordance with the laws of the State of North Carolina, without regard to its conflict of laws provisions.</li>
              <li><strong>Jurisdiction:</strong> Any legal proceedings shall be brought exclusively in the state or federal courts located in North Carolina, and each party irrevocably consents to such jurisdiction and venue.</li>
            </ul>
          </section>

          {/* Force Majeure */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">22. Force Majeure</h2>
            <p class="text-gray-600 leading-relaxed">
              Neither party shall be liable for any delay or failure in performance resulting from causes beyond
              its reasonable control, including but not limited to acts of God, natural disasters, pandemic, war,
              terrorism, government actions, infrastructure or utility failures, Internet disruptions, or
              third-party service outages (including outages of cloud hosting providers, payment processors, or
              calendar API providers). The affected party shall provide prompt notice and use commercially
              reasonable efforts to resume performance.
            </p>
          </section>

          {/* Export Compliance */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">23. Export Compliance</h2>
            <p class="text-gray-600 leading-relaxed">
              The Services may be subject to U.S. export control and sanctions laws. You may not use the Services
              if you are located in, or a national of, a country subject to U.S. embargo, or if you are on any
              U.S. government restricted party list. You agree to comply with all applicable export control and
              sanctions laws.
            </p>
          </section>

          {/* Changes to Terms */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">24. Changes to Terms</h2>
            <p class="text-gray-600 leading-relaxed">
              We may update these Terms from time to time. We will notify you of any material changes by email
              or by posting a notice on our website. Your continued use of the Services after changes take effect
              constitutes acceptance of the new Terms. If you do not agree to the updated Terms, you must
              stop using the Services.
            </p>
          </section>

          {/* General Provisions */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">25. General Provisions</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Entire agreement:</strong> These Terms, together with the{" "}
                <a href="/privacy" class="text-blue-600 hover:text-blue-800">Privacy Policy</a>,
                constitute the entire agreement between you and ODOV LLC regarding the Services and supersede
                all prior or contemporaneous agreements, representations, warranties, and understandings,
                whether oral or written.</li>
              <li><strong>Severability:</strong> If any provision of these Terms is held to be unenforceable or invalid, that provision shall be modified to the minimum extent necessary to make it enforceable, or if modification is not possible, severed from these Terms. All remaining provisions shall continue in full force and effect.</li>
              <li><strong>Waiver:</strong> No failure or delay by either party in exercising any right under these Terms shall constitute a waiver of that right. A waiver of any provision shall not be deemed a waiver of any other provision.</li>
              <li><strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, corporate reorganization, or sale of all or substantially all of our assets, provided the assignee agrees to be bound by these Terms.</li>
              <li><strong>No third-party beneficiaries:</strong> These Terms do not create any third-party beneficiary rights in any individual or entity that is not a party to these Terms.</li>
              <li><strong>Notices:</strong> We may send notices to the email address associated with your account. You may send notices to{" "}
                <a href="mailto:support@snivel.com" class="text-blue-600 hover:text-blue-800">support@snivel.com</a>.</li>
            </ul>
          </section>

          {/* Contact */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">26. Contact Us</h2>
            <p class="text-gray-600 leading-relaxed">
              If you have questions about these Terms or your account, please contact us at{" "}
              <a href="mailto:support@snivel.com" class="text-blue-600 hover:text-blue-800">support@snivel.com</a>.
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
