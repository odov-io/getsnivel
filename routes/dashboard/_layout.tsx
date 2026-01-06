/**
 * Dashboard Layout
 * Simple top nav only - no sidebar
 */

import { define } from "@/utils.ts";
import type { Session } from "@/lib/auth/session.ts";
import Logo from "@/components/Logo.tsx";

declare module "@/utils.ts" {
  interface State {
    session?: Session;
    orgName?: string;
  }
}

export default define.page(function DashboardLayout({ Component, state }) {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-6">
              <a href="/dashboard">
                <Logo size="md" />
              </a>
              <span class="text-gray-300">|</span>
              <span class="text-gray-700 font-medium">{state.orgName}</span>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">{state.session?.email}</span>
              <a
                href="/auth/logout"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - full width, no sidebar */}
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Component />
      </main>
    </div>
  );
});
