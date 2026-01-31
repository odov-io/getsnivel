/**
 * GET /terms
 * Terms of Service page for SNIVEL Book
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
            Book with Snivel
          </span>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p class="text-gray-500 mb-12">Last updated: January 2025</p>

        <div class="prose prose-gray max-w-none">
          {/* Introduction */}
          <section class="mb-10">
            <p class="text-gray-600 leading-relaxed">
              These Terms of Service ("Terms") govern your use of Book with Snivel, a scheduling and booking service
              operated by SNIVEL ("we," "us," or "our"). By using our service, you agree to these Terms.
            </p>
          </section>

          {/* Free Trial */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Free Trial</h2>
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
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Subscription Plans</h2>
            <p class="text-gray-600 mb-4">
              We offer two plan types: <strong>Solo</strong> (for individuals) and <strong>Team</strong> (for organizations).
              Team plans are priced based on the number of users in your organization.
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Subscriptions are billed on a recurring basis (monthly or annually).</li>
              <li>All prices are in US dollars and exclude applicable taxes.</li>
              <li>Sales tax is calculated and collected based on your location where required by law.</li>
              <li>Annual subscriptions are billed upfront for the full year.</li>
            </ul>
          </section>

          {/* Billing & Payment */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Billing & Payment</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Payments are processed securely through Stripe.</li>
              <li>We accept major credit cards (Visa, Mastercard, American Express, Discover).</li>
              <li>Your subscription will automatically renew at the end of each billing period unless cancelled.</li>
              <li>You will receive an email receipt for each payment.</li>
              <li>You can update your payment method at any time through the billing portal.</li>
            </ul>
          </section>

          {/* Plan Changes - Upgrades */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Upgrading Your Plan</h2>
            <p class="text-gray-600 mb-4">
              You can upgrade your plan at any time from your account dashboard.
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Upgrades take effect <strong>immediately</strong>.</li>
              <li>You will be charged the <strong>prorated difference</strong> between your current plan and the new plan for the remainder of your billing period.</li>
              <li>Your new plan features will be available right away.</li>
              <li>Future billing cycles will be charged at the new plan rate.</li>
            </ul>
          </section>

          {/* Plan Changes - Downgrades */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Downgrading Your Plan</h2>
            <p class="text-gray-600 mb-4">
              You can downgrade your plan at any time from your account dashboard.
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Downgrades take effect at the <strong>end of your current billing period</strong>.</li>
              <li>You will retain access to your current plan's features until your billing period ends.</li>
              <li><strong>No refunds or credits</strong> are issued for downgrades.</li>
              <li>Your next billing cycle will be charged at the new, lower plan rate.</li>
              <li>If downgrading to a plan with fewer user seats, you may need to remove users before the change takes effect.</li>
            </ul>
          </section>

          {/* Cancellation */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cancellation</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>You can cancel your subscription at any time from the billing portal.</li>
              <li>Cancellations take effect at the <strong>end of your current billing period</strong>.</li>
              <li>You will retain access to paid features until your billing period ends.</li>
              <li><strong>No refunds</strong> are issued for partial billing periods or unused time.</li>
              <li>After cancellation, your account will be frozen and you will lose access to the service.</li>
            </ul>
          </section>

          {/* Failed Payments */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Failed Payments</h2>
            <p class="text-gray-600 mb-4">
              If a payment fails, we will attempt to notify you and retry the payment.
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>You will receive email notifications about failed payments.</li>
              <li>You have <strong>14 days</strong> to update your payment method and resolve the issue.</li>
              <li>If payment is not received within 14 days, your account will be frozen.</li>
              <li>You can reactivate your account at any time by updating your payment method and paying any outstanding balance.</li>
            </ul>
          </section>

          {/* Account Status */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Account Status</h2>
            <p class="text-gray-600 mb-4">Your account can be in one of the following states:</p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Active:</strong> Full access to all features included in your plan.</li>
              <li><strong>Trialing:</strong> Full access during your 30-day free trial period.</li>
              <li><strong>Past Due:</strong> Payment has failed. Limited functionality until payment is resolved.</li>
              <li><strong>Frozen:</strong> Account access is suspended. Your data is retained but you cannot use the service.</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Your data is retained while your account is active.</li>
              <li>After account cancellation or freezing, your data is retained for <strong>90 days</strong>.</li>
              <li>After 90 days of inactivity, your data may be permanently deleted.</li>
              <li>You can request data export at any time while your account is active.</li>
            </ul>
          </section>

          {/* Taxes */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Taxes</h2>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Prices displayed on our website <strong>exclude taxes</strong>.</li>
              <li>Applicable sales tax, VAT, or GST will be added at checkout based on your location.</li>
              <li>Tax rates are determined by your billing address.</li>
              <li>Business customers may provide a tax ID for tax exemption where applicable.</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p class="text-gray-600 leading-relaxed">
              We may update these Terms from time to time. We will notify you of any material changes by email
              or by posting a notice on our website. Your continued use of the service after changes take effect
              constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact */}
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
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
