import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function BookWithSnivel() {
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
      <div class="bg-gray-900 py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="inline-block bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Available Now
          </span>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Book with Snivel
          </h1>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional booking pages for clients and customers. Calendar sync, custom intake forms, approval workflows, and team management.
          </p>
          <a
            href="/signup"
            class="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 text-lg font-semibold rounded-lg transition-colors"
          >
            Start Free
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p class="text-lg text-gray-600">
              A complete booking solution, not a half-baked MVP.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Calendar Sync */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Calendar Sync
              </h3>
              <p class="text-gray-600 mb-4">
                Real-time two-way sync with Google Calendar and Microsoft 365. Your availability is always accurate.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Google Calendar integration</li>
                <li>• Microsoft 365 / Outlook</li>
                <li>• Automatic Google Meet links</li>
                <li>• Automatic Microsoft Teams links</li>
                <li>• Real-time busy time detection</li>
              </ul>
            </div>

            {/* Custom Intake Forms */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Custom Intake Forms
              </h3>
              <p class="text-gray-600 mb-4">
                Collect exactly what you need before the meeting. Standard fields and custom questions.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Text, textarea, select, checkbox</li>
                <li>• Grouped question sections</li>
                <li>• Per-duration custom fields</li>
                <li>• Required/optional fields</li>
                <li>• Responses in emails & calendar</li>
              </ul>
            </div>

            {/* Approval Workflows */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Approval Workflows
              </h3>
              <p class="text-gray-600 mb-4">
                Control which bookings need your approval before they're confirmed.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Per-duration approval rules</li>
                <li>• Auto-approve after X hours</li>
                <li>• One-click approve/reject</li>
                <li>• Rejection with reason</li>
                <li>• Email notifications</li>
              </ul>
            </div>

            {/* Flexible Availability */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Flexible Availability
              </h3>
              <p class="text-gray-600 mb-4">
                Define exactly when you're available for bookings with granular controls.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Available days of week</li>
                <li>• Start and end hours</li>
                <li>• Buffer time between meetings</li>
                <li>• Minimum notice period</li>
                <li>• Maximum advance booking</li>
              </ul>
            </div>

            {/* Booking Limits */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Booking Limits
              </h3>
              <p class="text-gray-600 mb-4">
                Protect your time with daily and weekly booking caps.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Daily booking limit</li>
                <li>• Weekly booking limit</li>
                <li>• Automatic enforcement</li>
                <li>• Clear messaging to bookers</li>
              </ul>
            </div>

            {/* Team Management */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Team Management
              </h3>
              <p class="text-gray-600 mb-4">
                Manage booking settings for your entire organization from one place.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Org-wide default settings</li>
                <li>• Per-user overrides</li>
                <li>• Control which settings users can change</li>
                <li>• Push updates to all users</li>
                <li>• Role-based permissions</li>
              </ul>
            </div>

            {/* Email Notifications */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Email Notifications
              </h3>
              <p class="text-gray-600 mb-4">
                Keep everyone informed with automatic email notifications.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Booking confirmations</li>
                <li>• Reminder emails</li>
                <li>• Cancellation notices</li>
                <li>• Approval requests</li>
                <li>• Form responses included</li>
              </ul>
            </div>

            {/* Policies & Disclosures */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Policies & Disclosures
              </h3>
              <p class="text-gray-600 mb-4">
                Display important information and require acknowledgment before booking.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Custom policy text</li>
                <li>• Required acknowledgments</li>
                <li>• Cancellation policies</li>
                <li>• Recording consent</li>
              </ul>
            </div>

            {/* Meeting Durations */}
            <div class="bg-gray-50 rounded-xl p-8">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Meeting Durations
              </h3>
              <p class="text-gray-600 mb-4">
                Offer multiple meeting lengths with unique settings for each.
              </p>
              <ul class="text-sm text-gray-500 space-y-2">
                <li>• Multiple duration options</li>
                <li>• Per-duration descriptions</li>
                <li>• Per-duration custom questions</li>
                <li>• Per-duration approval rules</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Embed Widget */}
      <div class="bg-gray-50 py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="inline-block bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                Embed Widget
              </span>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Add Booking to Your Own Website
              </h2>
              <p class="text-lg text-gray-600 mb-6">
                Drop a single script tag into your site and let visitors book directly without leaving your page. Perfect for service businesses, consultants, and agencies.
              </p>
              <ul class="space-y-3 text-gray-600">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-900 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>One line of code to embed</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-900 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Auto-resizing iframe for seamless integration</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-900 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Popup modal or inline options</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-900 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>JavaScript events for booking completion</span>
                </li>
              </ul>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="bg-gray-900 text-white px-4 py-2 text-sm font-mono flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
                <span class="ml-2 text-gray-400">embed.html</span>
              </div>
              <div class="p-6 font-mono text-sm overflow-x-auto">
                <div class="text-gray-500 mb-4">{`<!-- Simple inline embed -->`}</div>
                <div>
                  <span class="text-blue-600">&lt;div</span>
                  <span class="text-purple-600"> data-snivel-book</span>
                  <span class="text-gray-600">=</span>
                  <span class="text-green-600">"username/orgslug"</span>
                  <span class="text-blue-600">&gt;&lt;/div&gt;</span>
                </div>
                <div>
                  <span class="text-blue-600">&lt;script</span>
                  <span class="text-purple-600"> src</span>
                  <span class="text-gray-600">=</span>
                  <span class="text-green-600">"https://book.snivel.app/widget.js"</span>
                  <span class="text-blue-600">&gt;&lt;/script&gt;</span>
                </div>

                <div class="border-t border-gray-200 my-6"></div>

                <div class="text-gray-500 mb-4">{`<!-- Or popup button -->`}</div>
                <div>
                  <span class="text-blue-600">&lt;button</span>
                  <span class="text-purple-600"> onclick</span>
                  <span class="text-gray-600">=</span>
                  <span class="text-green-600">"SnivelBook.open('username/org')"</span>
                  <span class="text-blue-600">&gt;</span>
                </div>
                <div class="pl-4">Book a Meeting</div>
                <div>
                  <span class="text-blue-600">&lt;/button&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div class="bg-gray-900 py-16">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-3xl font-bold text-white">Unlimited</div>
              <div class="text-gray-400">Bookings</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white">2</div>
              <div class="text-gray-400">Calendar Integrations</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white">Custom</div>
              <div class="text-gray-400">Intake Forms</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white">Team</div>
              <div class="text-gray-400">Management</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div class="py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Start Accepting Bookings Today
          </h2>
          <p class="text-xl text-gray-600 mb-8">
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
              class="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg font-semibold rounded-lg transition-colors"
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
              <a href="/privacy" class="text-gray-600 hover:text-gray-900">
                Privacy
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
