/**
 * GET/POST /signup/complete
 * Complete org signup after magic link verification
 */

import { define } from "@/utils.ts";
import { consumeMagicLinkToken } from "@/lib/auth/magic-link.ts";
import { createOrganization, isSlugAvailable, getOrganizationByEmail, deleteOrganization } from "@/lib/db/orgs.ts";
import { createUser, listUsersByOrg } from "@/lib/db/users.ts";
import { createSession, createSessionCookie } from "@/lib/auth/session.ts";
import Logo from "@/components/Logo.tsx";

/**
 * Clean up orphaned org (created but signup never completed)
 * An org is orphaned if it exists but has no users
 */
async function cleanupOrphanedOrg(email: string): Promise<void> {
  const existingOrg = await getOrganizationByEmail(email);
  if (!existingOrg) return;

  const users = await listUsersByOrg(existingOrg.id);
  if (users.length === 0) {
    console.log(`Cleaning up orphaned org ${existingOrg.id} (${existingOrg.slug}) for ${email}`);
    await deleteOrganization(existingOrg.id);
  }
}

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const token = url.searchParams.get("token");

    console.log(`[signup/complete GET] token=${token ? token.substring(0, 8) + "..." : "MISSING"}`);

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/signup?error=Missing+token" },
      });
    }

    // Verify token (don't consume yet - we'll do that on POST)
    const { verifyMagicLinkToken } = await import("@/lib/auth/magic-link.ts");
    const tokenData = await verifyMagicLinkToken(token);

    console.log(`[signup/complete GET] Verified: ${tokenData ? `type=${tokenData.type}, email=${tokenData.email}` : "NULL"}`);

    if (!tokenData || tokenData.type !== "signup") {
      return new Response(null, {
        status: 302,
        headers: { Location: "/signup?error=Invalid+or+expired+link" },
      });
    }

    // Page reads token from URL params
    return { data: {} };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const token = form.get("token")?.toString();
    const orgName = form.get("orgName")?.toString()?.trim();
    const orgSlug = form.get("orgSlug")?.toString()?.trim().toLowerCase();
    const userName = form.get("userName")?.toString()?.trim();

    console.log(`[signup/complete POST] token=${token ? token.substring(0, 8) + "..." : "MISSING"}, orgName=${orgName}, orgSlug=${orgSlug}, userName=${userName}`);

    if (!token || !orgName || !orgSlug || !userName) {
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", "All fields are required");
      url.searchParams.set("token", token || "");
      return Response.redirect(url.href, 303);
    }

    // Consume the magic link token
    console.log(`[signup/complete POST] Attempting to consume token ${token.substring(0, 8)}...`);
    const tokenData = await consumeMagicLinkToken(token);
    console.log(`[signup/complete POST] Token data: ${tokenData ? `type=${tokenData.type}, email=${tokenData.email}` : "NULL"}`);
    if (!tokenData || tokenData.type !== "signup") {
      console.log(`[signup/complete POST] Token rejected: tokenData=${!!tokenData}, type=${tokenData?.type}`);
      return new Response(null, {
        status: 302,
        headers: { Location: "/signup?error=Invalid+or+expired+link" },
      });
    }

    // Clean up any orphaned org from previous incomplete signup attempts
    await cleanupOrphanedOrg(tokenData.email);

    // Check slug availability
    const slugAvailable = await isSlugAvailable(orgSlug);
    if (!slugAvailable) {
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", "That URL is already taken");
      url.searchParams.set("token", token);
      return Response.redirect(url.href, 303);
    }

    try {
      // Determine plan type from token (solo-trial or team-trial)
      const planType = tokenData.plan === "team" ? "team-trial" : "solo-trial";
      console.log(`[signup/complete POST] Creating org with plan: ${planType}`);

      // Create organization
      const org = await createOrganization({
        name: orgName,
        email: tokenData.email,
        slug: orgSlug,
        plan: planType,
      });

      // Create admin user
      const user = await createUser({
        orgId: org.id,
        email: tokenData.email,
        name: userName,
        role: "admin",
      });

      // Create session
      const sessionId = await createSession({
        email: tokenData.email,
        orgId: org.id,
        userId: user.id,
        role: "admin",
      });

      // Redirect to dashboard with session cookie
      const dashboardUrl = new URL("/dashboard", ctx.req.url);
      return new Response(null, {
        status: 302,
        headers: {
          Location: dashboardUrl.href,
          "Set-Cookie": createSessionCookie(sessionId),
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", "Failed to create organization");
      url.searchParams.set("token", token);
      return Response.redirect(url.href, 303);
    }
  },
});

export default define.page(function CompleteSignupPage(props) {
  const url = new URL(props.url);
  const token = url.searchParams.get("token") || "";
  const error = url.searchParams.get("error");

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        {/* Logo */}
        <div class="text-center mb-8">
          <a href="/">
            <Logo size="sm" />
          </a>
          <p class="text-gray-600 mt-2">Set up your organization</p>
        </div>

        {/* Setup Card */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-6">
            Complete Setup
          </h1>

          {error && (
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form method="POST" class="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div>
              <label
                for="userName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Your name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label
                for="orgName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Organization name
              </label>
              <input
                type="text"
                id="orgName"
                name="orgName"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label
                for="orgSlug"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Organization URL
              </label>
              <div class="flex">
                <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  snivel.app/
                </span>
                <input
                  type="text"
                  id="orgSlug"
                  name="orgSlug"
                  required
                  pattern="[a-z0-9-]+"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="acme"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Lowercase letters, numbers, and hyphens only
              </p>
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
            >
              Create Organization
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});
