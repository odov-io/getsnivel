/**
 * GET/POST /dashboard/users/new
 * Add a new user to the organization
 */

import { define } from "@/utils.ts";
import { createUser, isSlugAvailable } from "@/lib/db/users.ts";
import { getOrganizationById, isSoloPlan } from "@/lib/db/orgs.ts";
import { createMagicLinkToken } from "@/lib/auth/magic-link.ts";
import { sendUserInvite } from "@/lib/email/resend.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const session = ctx.state.session;
    if (!session) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    // Solo plans cannot add users - redirect to pricing
    const org = await getOrganizationById(session.orgId);
    if (org && isSoloPlan(org.plan)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/pricing?upgrade=team&reason=add-users" },
      });
    }

    return { data: {} };
  },

  async POST(ctx) {
    const session = ctx.state.session;
    if (!session) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    // Only admins can add users
    if (session.role !== "admin") {
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard?error=Permission+denied" },
      });
    }

    // Solo plans cannot add users - redirect to pricing
    const org = await getOrganizationById(session.orgId);
    if (org && isSoloPlan(org.plan)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/pricing?upgrade=team&reason=add-users" },
      });
    }

    const form = await ctx.req.formData();
    const name = form.get("name")?.toString()?.trim();
    const email = form.get("email")?.toString()?.trim().toLowerCase();
    const slug = form.get("slug")?.toString()?.trim().toLowerCase();
    const role = form.get("role")?.toString() as "admin" | "member" || "member";
    const sendInvite = form.get("sendInvite") === "on";

    if (!name || !email || !slug) {
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", "All fields are required");
      return Response.redirect(url.href, 303);
    }

    // Check slug availability
    const slugAvailable = await isSlugAvailable(session.orgId, slug);
    if (!slugAvailable) {
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", "That URL slug is already taken");
      return Response.redirect(url.href, 303);
    }

    try {
      // Create user
      const user = await createUser({
        orgId: session.orgId,
        name,
        email,
        slug,
        role,
      });

      // Send invite email if requested
      if (sendInvite) {
        const org = await getOrganizationById(session.orgId);
        const token = await createMagicLinkToken(email, "user", {
          orgId: session.orgId,
          userId: user.id,
        });
        await sendUserInvite(email, token, name, org?.name || "Your Organization");
      }

      // Redirect to users list
      const successUrl = new URL("/dashboard/users", ctx.req.url);
      successUrl.searchParams.set("success", "User created");
      return Response.redirect(successUrl.href, 303);
    } catch (error) {
      console.error("Create user error:", error);
      const url = new URL(ctx.req.url);
      url.searchParams.set("error", error instanceof Error ? error.message : "Failed to create user");
      return Response.redirect(url.href, 303);
    }
  },
});

export default define.page(function NewUserPage({ url }) {
  const searchParams = new URL(url).searchParams;
  const error = searchParams.get("error");

  return (
    <div>
      <div class="mb-8">
        <a
          href="/dashboard/users"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to users
        </a>
        <h1 class="text-2xl font-bold text-gray-900 mt-2">Add User</h1>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 max-w-lg">
        {error && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form method="POST" class="space-y-4">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="John Smith"
            />
          </div>

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
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label
              for="slug"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              URL slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9-]+"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="john-smith"
            />
            <p class="text-xs text-gray-500 mt-1">
              Used in booking URLs. Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <div>
            <label
              for="role"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendInvite"
              name="sendInvite"
              class="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              checked
            />
            <label for="sendInvite" class="text-sm text-gray-700">
              Send invitation email
            </label>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
