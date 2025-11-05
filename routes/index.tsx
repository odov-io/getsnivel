import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>SNIVEL - Military Leave Management Made Simple</title>
        <meta name="description" content="Stop using paper calendars. Manage PTO, leave requests, and approvals digitally for your military unit." />
      </Head>

      <div class="min-h-screen bg-white dark:bg-gray-900">
        {/* Navigation */}
        <nav class="border-b border-gray-200 dark:border-gray-700">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">SNIVEL</span>
              </div>
              <div class="flex items-center gap-4">
                <a
                  href="/pricing"
                  class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  Pricing
                </a>
                <a
                  href="https://snivel.app/login"
                  class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  Login
                </a>
                <a
                  href="https://snivel.app/signup/role"
                  class="px-4 py-2 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="text-center max-w-3xl mx-auto">
            <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Stop Using Paper Calendars for Leave Tracking
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
              SNIVEL brings your military unit's PTO and leave management into the 21st century.
              Digital requests, instant approvals, and real-time visibility.
            </p>
            <div class="flex justify-center gap-4">
              <a
                href="https://snivel.app/signup/role"
                class="px-8 py-4 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-lg font-semibold rounded-lg transition-colors"
              >
                Start Your Organization
              </a>
              <a
                href="/pricing"
                class="px-8 py-4 border-2 border-gray-900 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 text-lg font-semibold rounded-lg transition-colors"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>

        {/* Problem Section */}
        <div class="bg-gray-50 dark:bg-gray-800 py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                The Paper Calendar Problem
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We've all been there: red ink on a paper calendar, sticky notes for special requests,
                and last-minute scrambles when someone needs emergency leave.
              </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
              <div class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No Visibility
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Sailors can't see who's already requested time off. Leaders can't see patterns or manning levels at a glance.
                </p>
              </div>
              <div class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Lost Requests
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Paper chits get lost. Emails get buried. Nothing to reference when there's a dispute about approval.
                </p>
              </div>
              <div class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Manual Everything
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Counting days, checking policies, tracking balances - all done by hand. Every. Single. Time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div class="py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                How SNIVEL Works
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Simple, digital leave management that actually works for military units.
              </p>
            </div>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                    <span class="text-2xl">📅</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Visual Calendar
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    See everyone's leave at a glance. No more squinting at red ink on paper.
                  </p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                    <span class="text-2xl">✓</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Digital Approvals
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Approve or deny requests with one click. Automatic notifications keep everyone in the loop.
                  </p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                    <span class="text-2xl">⚙️</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Policy Enforcement
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Built-in rules for blackout periods, advance notice requirements, and manning levels.
                  </p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                    <span class="text-2xl">📊</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Audit Trail
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Complete history of every request, approval, and change. No more "he said, she said."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div class="bg-gray-900 dark:bg-black py-20">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-white mb-4">
              Ready to Ditch the Paper Calendar?
            </h2>
            <p class="text-xl text-gray-300 mb-8">
              Get your unit set up in minutes. No credit card required to start.
            </p>
            <a
              href="https://snivel.app/signup/role"
              class="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 text-lg font-semibold rounded-lg transition-colors"
            >
              Start Your Organization
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer class="border-t border-gray-200 dark:border-gray-700 py-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">
                2024 SNIVEL. All rights reserved.
              </span>
              <div class="flex gap-6">
                <a href="/pricing" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Pricing
                </a>
                <a href="https://snivel.app/login" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Login
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
