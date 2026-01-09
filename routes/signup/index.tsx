/**
 * GET/POST /signup
 * Start org signup - collect email and send magic link
 */

import { define } from "@/utils.ts";
import { createMagicLinkToken } from "@/lib/auth/magic-link.ts";
import { sendSignupLink } from "@/lib/email/resend.ts";
import { checkEmailExists, cleanupOrphanedOrg } from "@/lib/signup-api.ts";
import Logo from "@/components/Logo.tsx";

export const handler = define.handlers({
  async POST(ctx) {
    const reqUrl = new URL(ctx.req.url);
    const plan = reqUrl.searchParams.get("plan") || "solo"; // Default to solo

    const form = await ctx.req.formData();
    const email = form.get("email")?.toString()?.trim().toLowerCase();

    if (!email) {
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", "Email is required");
      return Response.redirect(url.href, 303);
    }

    // Clean up any orphaned org from previous incomplete signup
    await cleanupOrphanedOrg(email);

    // Check if org already exists with this email
    const emailCheck = await checkEmailExists(email);
    if (emailCheck.exists) {
      const url = new URL("/login", ctx.req.url);
      url.searchParams.set("email", email);
      url.searchParams.set("message", "An organization with this email already exists. Please log in.");
      return Response.redirect(url.href, 303);
    }

    // Create magic link token (store plan type in token for complete page)
    const token = await createMagicLinkToken(email, "signup", { plan });

    // Send email
    await sendSignupLink(email, token);

    // Redirect to check email page
    const successUrl = new URL("/signup/check-email", ctx.req.url);
    successUrl.searchParams.set("email", email);
    successUrl.searchParams.set("plan", plan);
    return Response.redirect(successUrl.href, 303);
  },
});

export default define.page(function SignupPage(props) {
  const url = new URL(props.url);
  const error = url.searchParams.get("error");
  const plan = url.searchParams.get("plan") || "solo";
  const isTeam = plan === "team";

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        {/* Logo */}
        <div class="text-center mb-8">
          <a href="/">
            <Logo size="sm" />
          </a>
          <p class="text-gray-600 mt-2">
            {isTeam ? "Start your team trial" : "Start your free trial"}
          </p>
        </div>

        {/* Signup Card */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            {isTeam ? "Team Plan" : "Solo Plan"}
          </h1>
          <p class="text-gray-500 text-sm mb-6">
            {isTeam ? "30 days free, up to 5 users" : "30 days free, just you"}
          </p>

          {error && (
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form method="POST" action={`/signup?plan=${plan}`} class="space-y-4">
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

          <p class="text-sm text-gray-500 mt-4 text-center">
            We'll send you a magic link to verify your email.
          </p>

          {/* Switch plan link */}
          <p class="text-sm text-gray-500 mt-4 text-center">
            {isTeam ? (
              <>Just you? <a href="/signup?plan=solo" class="text-gray-900 font-medium hover:underline">Try Solo instead</a></>
            ) : (
              <>Have a team? <a href="/signup?plan=team" class="text-gray-900 font-medium hover:underline">Try Team instead</a></>
            )}
          </p>
        </div>

        {/* Login link */}
        <p class="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/login" class="text-gray-900 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
});
