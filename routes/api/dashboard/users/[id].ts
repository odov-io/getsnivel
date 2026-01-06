/**
 * GET/POST/DELETE /api/dashboard/users/[id]
 * User management API
 */

import { define } from "@/utils.ts";
import { getUserById, updateUser, deleteUser } from "@/lib/db/users.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";
import { resolveEffectiveSettings } from "@/lib/settings/resolver.ts";

export const handler = define.handlers({
  // Get user details
  async GET(ctx) {
    const session = ctx.state.session;
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = ctx.params.id;
    const user = await getUserById(userId);

    if (!user || user.orgId !== session.orgId) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const org = await getOrganizationById(session.orgId);
    const effectiveSettings = org
      ? resolveEffectiveSettings(org.settings, user.settings)
      : null;

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        slug: user.slug,
        role: user.role,
        isActive: user.isActive,
        calendarConnected: user.calendarConnected,
        providers: user.providers,
      },
      orgSlug: org?.slug || "",
      effectiveSettings,
    });
  },

  // Update user
  async POST(ctx) {
    const session = ctx.state.session;
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = ctx.params.id;
    const user = await getUserById(userId);

    if (!user || user.orgId !== session.orgId) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { role, isActive } = body;

    try {
      await updateUser(userId, { role, isActive });
      return Response.json({ success: true });
    } catch (error) {
      console.error("User update error:", error);
      return Response.json({ error: "Failed to update user" }, { status: 500 });
    }
  },

  // Delete user
  async DELETE(ctx) {
    const session = ctx.state.session;
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = ctx.params.id;

    // Don't allow deleting yourself
    if (userId === session.userId) {
      return Response.json({ error: "You cannot delete yourself" }, { status: 400 });
    }

    const user = await getUserById(userId);

    if (!user || user.orgId !== session.orgId) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    try {
      await deleteUser(userId);
      return Response.json({ success: true });
    } catch (error) {
      console.error("User delete error:", error);
      return Response.json({ error: "Failed to delete user" }, { status: 500 });
    }
  },
});
