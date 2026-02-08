/**
 * GET /pricing
 * Pricing page for book.snivel
 */

import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Pricing({ url }) {
  const params = new URL(url).searchParams;
  const upgrade = params.get("upgrade");
  const reason = params.get("reason");

  // Show upgrade message if redirected from solo plan
  const showUpgradePrompt = upgrade === "team";
  const upgradeMessage = reason === "add-users"
    ? "Solo plans include one user. Upgrade to Team to add team members."
    : "Upgrade to Team to unlock more features.";

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

      {/* Upgrade Banner */}
      {showUpgradePrompt && (
        <div class="bg-blue-50 border-b border-blue-200">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-center gap-2 text-blue-800">
              <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span class="font-medium">{upgradeMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div id="main-content" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            {showUpgradePrompt ? "Upgrade Your Plan" : "Simple, Predictable Pricing"}
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Pick your plan. No per-user surprises.
          </p>
        </div>

        {/* Billing Toggle */}
        <div class="flex justify-center mb-10">
          <div class="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              id="toggle-monthly"
              class="px-6 py-2 rounded-md text-sm font-medium transition-all bg-white text-gray-900 shadow-sm"
            >
              Monthly
            </button>
            <button
              id="toggle-annual"
              class="px-6 py-2 rounded-md text-sm font-medium transition-all text-gray-600 hover:text-gray-900"
            >
              Annual <span class="text-green-600 text-xs ml-1">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          {/* Solo Plan */}
          <div class="rounded-2xl border-2 border-gray-200 p-8 bg-white flex flex-col">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Solo</h2>
            <p class="text-gray-600 mb-6">For individuals</p>

            <div class="mb-2">
              <span class="text-4xl font-bold text-gray-900" id="solo-price">$6</span>
              <span class="text-gray-600">/month</span>
            </div>
            <p class="text-sm text-gray-600 mb-6" id="solo-annual-note">
              $72/yr billed monthly
            </p>

            <a
              href="/signup?plan=solo"
              class="block w-full text-center px-6 py-3 font-semibold rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Start Free Trial
            </a>
            <p class="text-xs text-gray-600 text-center mt-2 mb-6">
              30 days free
            </p>

            <ul class="space-y-3 text-sm text-gray-600">
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10003;</span>
                1 user
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10003;</span>
                Unlimited booking pages
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10003;</span>
                Google & Microsoft sync
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10003;</span>
                Custom branding
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10003;</span>
                Email confirmations
              </li>
            </ul>
          </div>

          {/* Team Plan */}
          <div class="rounded-2xl border-2 border-gray-900 p-8 bg-gray-900 text-white ring-4 ring-gray-900/10 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <h2 class="text-2xl font-bold">Team</h2>
              <span class="text-xs font-medium bg-sky-500 text-white px-2 py-1 rounded-full">POPULAR</span>
            </div>
            <p class="text-gray-400 mb-6">For teams of any size</p>

            <div class="mb-2">
              <span class="text-4xl font-bold" id="team-price">$30</span>
              <span class="text-gray-400">/month</span>
            </div>
            <p class="text-sm text-gray-400 mb-6" id="team-annual-note">
              $360/yr billed monthly
            </p>

            <a
              href="/signup?plan=team"
              class="block w-full text-center px-6 py-3 font-semibold rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
            <p class="text-xs text-gray-400 text-center mt-2 mb-6">
              30 days free, up to 5 users during trial
            </p>

            <ul class="space-y-3 text-sm text-gray-300">
              <li class="flex items-center gap-2">
                <span class="text-green-400">&#10003;</span>
                Everything in Solo
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-400">&#10003;</span>
                Multiple users
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-400">&#10003;</span>
                Org-wide settings
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-400">&#10003;</span>
                User permission controls
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-400">&#10003;</span>
                Custom logo on booking pages
              </li>
            </ul>

            {/* Team Size Slider */}
            <div class="mt-auto pt-6">
              <div class="flex justify-between text-sm text-gray-400 mb-2">
                <span>Team size</span>
                <span id="team-size-label" class="font-medium text-white">Up to 5 users</span>
              </div>
              <div class="relative">
                <input
                  type="range"
                  id="team-slider"
                  min="0"
                  max="6"
                  value="0"
                  class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div class="flex justify-between text-xs text-gray-600 mt-2 px-[10px]">
                  <span class="w-0 text-center">5</span>
                  <span class="w-0 text-center">10</span>
                  <span class="w-0 text-center">25</span>
                  <span class="w-0 text-center">50</span>
                  <span class="w-0 text-center">75</span>
                  <span class="w-0 text-center">100</span>
                  <span class="w-0 text-center">100+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison callout */}
        <div class="mt-16 bg-gray-50 rounded-xl p-8 text-center max-w-3xl mx-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Half the price. All the features.</h3>
          <p class="text-gray-600">
            Most scheduling tools charge <strong>$12-16 per user, per month</strong>.
            A 10-person team on Calendly costs $150+/month.
            <br /><br />
            With SNIVEL Book, that same team pays <strong>$45/month</strong> &mdash; less than half the cost.
          </p>
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
              <a href="/accessibility" class="text-gray-600 hover:text-gray-900">Accessibility</a>
              <a href="/login" class="text-gray-600 hover:text-gray-900">Login</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Slider styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}} />

      {/* Pricing logic */}
      <script dangerouslySetInnerHTML={{ __html: `
        const tiers = [
          { seats: 5, monthly: 30, annual: 300, label: "Up to 5 users" },
          { seats: 10, monthly: 54, annual: 540, label: "Up to 10 users" },
          { seats: 25, monthly: 120, annual: 1200, label: "Up to 25 users" },
          { seats: 50, monthly: 210, annual: 2100, label: "Up to 50 users" },
          { seats: 75, monthly: 288, annual: 2880, label: "Up to 75 users" },
          { seats: 100, monthly: 360, annual: 3600, label: "Up to 100 users" },
          { seats: -1, monthly: 3.60, annual: 3, label: "100+ users", perUser: true }
        ];

        let isAnnual = false;
        let currentTier = 0;

        function updatePrices() {
          const tier = tiers[currentTier];
          const soloMonthly = 6;
          const soloAnnual = 60;

          // Solo
          const soloPrice = document.getElementById('solo-price');
          const soloNote = document.getElementById('solo-annual-note');
          if (isAnnual) {
            soloPrice.textContent = '$' + Math.round(soloAnnual / 12);
            soloNote.textContent = '$' + soloAnnual + '/yr billed annually';
          } else {
            soloPrice.textContent = '$' + soloMonthly;
            soloNote.textContent = '$' + (soloMonthly * 12) + '/yr billed monthly';
          }

          // Team
          const teamPrice = document.getElementById('team-price');
          const teamNote = document.getElementById('team-annual-note');
          const teamLabel = document.getElementById('team-size-label');

          teamLabel.textContent = tier.label;

          if (tier.perUser) {
            if (isAnnual) {
              teamPrice.textContent = '$' + tier.annual;
              teamNote.textContent = 'per user/month, billed annually';
            } else {
              teamPrice.textContent = '$' + tier.monthly.toFixed(2);
              teamNote.textContent = 'per user/month';
            }
          } else {
            if (isAnnual) {
              teamPrice.textContent = '$' + Math.round(tier.annual / 12);
              teamNote.textContent = '$' + tier.annual + '/yr billed annually';
            } else {
              teamPrice.textContent = '$' + tier.monthly;
              teamNote.textContent = '$' + (tier.monthly * 12) + '/yr billed monthly';
            }
          }
        }

        // Billing toggle
        document.getElementById('toggle-monthly').addEventListener('click', function() {
          isAnnual = false;
          this.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
          this.classList.remove('text-gray-600');
          document.getElementById('toggle-annual').classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
          document.getElementById('toggle-annual').classList.add('text-gray-600');
          updatePrices();
        });

        document.getElementById('toggle-annual').addEventListener('click', function() {
          isAnnual = true;
          this.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
          this.classList.remove('text-gray-600');
          document.getElementById('toggle-monthly').classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
          document.getElementById('toggle-monthly').classList.add('text-gray-600');
          updatePrices();
        });

        // Team slider
        document.getElementById('team-slider').addEventListener('input', function() {
          currentTier = parseInt(this.value);
          updatePrices();
        });

        // Initial
        updatePrices();
      `}} />
    </div>
  );
});
