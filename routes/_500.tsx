/**
 * Custom 500 Error Page
 * Branded error page with option to report the issue
 */

import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Error500Page({ error }) {
  const errorMessage = error?.message || "An unexpected error occurred";
  const errorStack = error?.stack || "";
  const timestamp = new Date().toISOString();

  // Create mailto link with error details
  const subject = encodeURIComponent("Error Report - getsnivel.com");
  const body = encodeURIComponent(
    `Hi,\n\nI encountered an error on getsnivel.com:\n\n` +
    `Time: ${timestamp}\n` +
    `Error: ${errorMessage}\n\n` +
    `Additional details:\n${errorStack}\n\n` +
    `Page URL: (please add the URL you were on)\n\n` +
    `What I was trying to do:\n(please describe)\n`
  );
  const mailtoLink = `mailto:support@odov.io?subject=${subject}&body=${body}`;

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
          {/* Oops illustration */}
          <div class="mb-6">
            <div class="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg aria-hidden="true" class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>

          <p class="text-gray-600 mb-6">
            We encountered an unexpected error. Our team has been notified, but you can help us fix it faster by reporting this issue.
          </p>

          <div class="space-y-3">
            <a
              href={mailtoLink}
              class="block w-full py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
            >
              Report This Issue
            </a>

            <a
              href="/"
              class="block w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </a>
          </div>

          {/* Error details (collapsed) */}
          <details class="mt-6 text-left">
            <summary class="text-sm text-gray-600 cursor-pointer hover:text-gray-700">
              Technical details
            </summary>
            <div class="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 font-mono overflow-auto max-h-32">
              <p><strong>Time:</strong> {timestamp}</p>
              <p><strong>Error:</strong> {errorMessage}</p>
            </div>
          </details>
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
