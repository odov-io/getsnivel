import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Home() {
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

      {/* Hero Section */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Scheduling That Works
          </h1>
          <p class="text-xl text-gray-600">
            Two products, one platform. External bookings and internal scheduling, connected.
          </p>
        </div>

        {/* Products Grid */}
        <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Book with Snivel */}
          <div class="bg-white rounded-2xl border-2 border-gray-900 p-10 relative">
            <span class="absolute -top-3 left-8 bg-gray-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
              Available Now
            </span>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Book with Snivel
            </h2>
            <p class="text-gray-600 mb-6 text-lg">
              Professional booking pages for clients and customers.
              Calendar sync, custom intake forms, approval workflows, and team management.
            </p>
            <ul class="text-gray-600 mb-8 space-y-2">
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Google & Microsoft calendar sync
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Custom intake forms & questions
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Approval workflows & booking limits
              </li>
            </ul>
            <div class="flex gap-4">
              <a
                href="/signup"
                class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors"
              >
                Get Started
              </a>
              <a
                href="/book-with-snivel"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Snivel */}
          <div class="bg-white rounded-2xl border border-gray-200 p-10 relative">
            <span class="absolute -top-3 left-8 bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full">
              Coming Soon
            </span>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Snivel
            </h2>
            <p class="text-gray-600 mb-6 text-lg">
              Internal availability, PTO tracking, and team scheduling.
              See who's available, approve requests, enforce policies.
            </p>
            <ul class="text-gray-500 mb-8 space-y-2">
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Team availability calendar
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PTO requests & approvals
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Coverage rules & policies
              </li>
            </ul>
            <a
              href="/snivel"
              class="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p class="text-lg text-gray-600 mb-8">
            Set up your booking page in minutes. Free to start.
          </p>
          <div class="flex justify-center gap-4">
            <a
              href="/signup"
              class="px-8 py-4 bg-gray-900 hover:bg-black text-white text-lg font-semibold rounded-lg transition-colors"
            >
              Create Your Booking Page
            </a>
            <a
              href="/pricing"
              class="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-white text-lg font-semibold rounded-lg transition-colors"
            >
              View Pricing
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
