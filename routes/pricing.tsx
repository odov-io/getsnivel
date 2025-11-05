import { Head } from "$fresh/runtime.ts";

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing - SNIVEL</title>
        <meta name="description" content="Simple, transparent pricing for military leave management." />
      </Head>

      <div class="min-h-screen bg-white dark:bg-gray-900">
        {/* Navigation */}
        <nav class="border-b border-gray-200 dark:border-gray-700">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center">
                <a href="/">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">SNIVEL</span>
                </a>
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

        {/* Pricing Section */}
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="text-center mb-16">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-8">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Free
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Perfect for trying it out
              </p>
              <div class="mb-6">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                <span class="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-gray-600 dark:text-gray-400">Up to 10 users</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-gray-600 dark:text-gray-400">Basic calendar</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-gray-600 dark:text-gray-400">Email notifications</span>
                </li>
              </ul>
              <a
                href="https://snivel.app/signup/role"
                class="block w-full text-center px-4 py-2 border-2 border-gray-900 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Pro Tier */}
            <div class="bg-gray-900 dark:bg-black rounded-lg border-2 border-gray-900 dark:border-gray-700 p-8 relative">
              <div class="absolute top-0 right-0 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">
                Pro
              </h3>
              <p class="text-gray-400 mb-6">
                For active units
              </p>
              <div class="mb-6">
                <span class="text-4xl font-bold text-white">$49</span>
                <span class="text-gray-400">/month</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Up to 50 users</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Advanced calendar</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Policy enforcement</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Priority support</span>
                </li>
              </ul>
              <a
                href="https://snivel.app/signup/role"
                class="block w-full text-center px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Enterprise Tier */}
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-8">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Enterprise
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                For large organizations
              </p>
              <div class="mb-6">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-gray-600 dark:text-gray-400">Unlimited users</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-gray-600 dark:text-gray-400">Custom integrations</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-gray-600 dark:text-gray-400">Dedicated support</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-gray-600 dark:text-gray-400">SLA guarantee</span>
                </li>
              </ul>
              <a
                href="mailto:hello@getsnivel.com"
                class="block w-full text-center px-4 py-2 border-2 border-gray-900 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
              >
                Contact Sales
              </a>
            </div>
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
