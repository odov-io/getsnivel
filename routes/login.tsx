/**
 * GET/POST /login
 * Org admin login - enter email and receive magic link
 */

import { define } from "@/utils.ts";
import { createMagicLinkToken } from "@/lib/auth/magic-link.ts";
import { sendOrgLoginLink } from "@/lib/email/resend.ts";
import { getUserByEmailGlobal } from "@/lib/db/users.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";
import Logo from "@/components/Logo.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    // If already logged in, redirect to dashboard
    const session = await getSessionFromRequest(ctx.req);
    if (session) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard" },
      });
    }
    return { data: {} };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = form.get("email")?.toString()?.trim().toLowerCase();

    if (!email) {
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", "Email is required");
      return Response.redirect(url.href, 303);
    }

    // Find user by email
    const user = await getUserByEmailGlobal(email);
    if (!user) {
      // Don't reveal whether user exists
      const successUrl = new URL("/login/check-email", ctx.req.url);
      successUrl.searchParams.set("email", email);
      return Response.redirect(successUrl.href, 303);
    }

    // Get org name for email
    const org = await getOrganizationById(user.orgId);
    const orgName = org?.name || "your organization";

    // Create magic link token
    const token = await createMagicLinkToken(email, "org_admin", {
      orgId: user.orgId,
      userId: user.id,
    });

    // Send email
    await sendOrgLoginLink(email, token, orgName);

    // Redirect to check email page
    const successUrl = new URL("/login/check-email", ctx.req.url);
    successUrl.searchParams.set("email", email);
    return Response.redirect(successUrl.href, 303);
  },
});

export default define.page(function LoginPage(props) {
  const url = new URL(props.url);
  const error = url.searchParams.get("error");
  const message = url.searchParams.get("message");
  const defaultEmail = url.searchParams.get("email") || "";

  return (
    <div id="main-content" class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        {/* Logo */}
        <div class="text-center mb-8">
          <a href="/">
            <Logo size="sm" />
          </a>
          <p class="text-gray-600 mt-2">Sign in to your organization</p>
        </div>

        {/* Login Card */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-6">
            Sign In
          </h1>

          {error && (
            <div role="alert" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              {message}
            </div>
          )}

          <form method="POST" class="space-y-4">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={defaultEmail}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="you@company.com"
              />
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </form>

          <p class="text-sm text-gray-600 mt-4 text-center">
            We'll send you a magic link to sign in.
          </p>
        </div>

        {/* Signup link */}
        <p class="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" class="text-gray-900 font-medium hover:underline">
            Get started
          </a>
        </p>
      </div>
    </div>
  );
});
