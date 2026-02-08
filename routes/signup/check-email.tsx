/**
 * GET /signup/check-email
 * Shown after user submits signup form
 */

import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function CheckEmailPage(props) {
  const url = new URL(props.url);
  const email = url.searchParams.get("email") || "your email";

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md text-center">
        {/* Logo */}
        <div class="mb-8">
          <a href="/">
            <Logo size="sm" class="mx-auto" />
          </a>
        </div>

        {/* Check email card */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            Check your email
          </h1>

          <p class="text-gray-600 mb-6">
            We've sent a magic link to <strong class="text-gray-900">{email}</strong>.
            Click the link to complete your signup.
          </p>

          <p class="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or{" "}
            <a href="/signup" class="text-gray-900 font-medium hover:underline">
              try again
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
});
