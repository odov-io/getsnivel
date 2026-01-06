import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Snivel() {
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
              <a
                href="/pricing"
                class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="/login"
                class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 hover:border-gray-400 rounded-lg transition-all"
              >
                Login
              </a>
              <a
                href="/signup"
                class="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div class="bg-gradient-to-b from-gray-100 to-white py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Coming Soon
          </span>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Snivel
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Internal availability, PTO tracking, and team scheduling.
            See who's available, approve requests, enforce policies.
          </p>
          <p class="text-gray-500">
            We're building Snivel to work seamlessly with Book with Snivel.
            Sign up for Book with Snivel today and be first to know when Snivel launches.
          </p>
        </div>
      </div>

      {/* Planned Features */}
      <div class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              What We're Building
            </h2>
            <p class="text-lg text-gray-600">
              Internal scheduling designed to work with your external booking pages.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Calendar */}
            <div class="border border-gray-200 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Team Availability Calendar
              </h3>
              <p class="text-gray-600">
                See everyone's availability at a glance. Know who's in, who's out, and plan accordingly. Filter by team, department, or role.
              </p>
            </div>

            {/* PTO Requests */}
            <div class="border border-gray-200 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                PTO Requests & Approvals
              </h3>
              <p class="text-gray-600">
                Digital time-off requests with multi-level approval workflows. No more email chains or paper forms. Track balances automatically.
              </p>
            </div>

            {/* Coverage Rules */}
            <div class="border border-gray-200 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Coverage Rules
              </h3>
              <p class="text-gray-600">
                Define minimum staffing requirements. Automatically flag requests that would leave you short-staffed. Suggest alternatives.
              </p>
            </div>

            {/* Balance Tracking */}
            <div class="border border-gray-200 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Balance Tracking
              </h3>
              <p class="text-gray-600">
                Track vacation, sick, personal days. Accrual rules and carryover policies. Employees see their balances in real-time.
              </p>
            </div>

            {/* Blackout Dates */}
            <div class="border border-gray-200 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Blackout Dates
              </h3>
              <p class="text-gray-600">
                Block off critical periods when time off isn't allowed. Company events, busy seasons, project deadlines.
              </p>
            </div>

            {/* Reporting */}
            <div class="border border-gray-200 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Reports & Analytics
              </h3>
              <p class="text-gray-600">
                Track time-off patterns, approval rates, and coverage metrics. Export for payroll or compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration */}
      <div class="bg-gray-50 py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Works with Book with Snivel
          </h2>
          <p class="text-lg text-gray-600 mb-8">
            When Snivel launches, your internal availability will automatically sync with your external booking pages.
            No double-booking, no manual updates.
          </p>
          <div class="flex justify-center gap-4">
            <a
              href="/signup"
              class="px-8 py-4 bg-gray-900 hover:bg-black text-white text-lg font-semibold rounded-lg transition-colors"
            >
              Get Started with Book with Snivel
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer class="border-t border-gray-200 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">
              2026 SNIVEL. All rights reserved.
            </span>
            <div class="flex gap-6">
              <a href="/pricing" class="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="/terms" class="text-gray-600 hover:text-gray-900">
                Terms
              </a>
              <a href="/login" class="text-gray-600 hover:text-gray-900">
                Login
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});
