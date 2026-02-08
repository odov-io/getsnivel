/**
 * Custom 404 Error Page
 * Branded page for not found errors
 */

import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Error404Page() {
  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md text-center">
        {/* Logo */}
        <div class="mb-8">
          <a href="/">
            <Logo size="sm" />
          </a>
        </div>

        {/* Error Card */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* 404 illustration */}
          <div class="mb-6">
            <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <span class="text-3xl font-bold text-gray-500">404</span>
            </div>
          </div>

          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            Page not found
          </h1>

          <p class="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div class="space-y-3">
            <a
              href="/dashboard"
              class="block w-full py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>

            <a
              href="/"
              class="block w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </a>
          </div>
        </div>

        {/* Footer */}
        <p class="mt-6 text-sm text-gray-600">
          Need help? Contact us at{" "}
          <a href="mailto:support@odov.io" class="text-gray-700 hover:underline">
            support@odov.io
          </a>
        </p>
      </div>
    </div>
  );
});
