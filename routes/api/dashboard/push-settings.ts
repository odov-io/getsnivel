/**
 * POST /api/dashboard/push-settings
 * Push org settings to all users
 *
 * Modes:
 * - respectOverrides: Only update users who haven't customized the field
 * - forceAll: Clear user overrides and apply org default
 */

import { define } from "@/utils.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";
import { getUserById, updateUser, listUsersByOrg } from "@/lib/db/users.ts";
import { getOrgDefaults, getOverridableFields } from "@/lib/settings/resolver.ts";
import type { Session } from "@/lib/auth/session.ts";
import type { OverridableSettingKey, UserOverrides } from "@/lib/settings/types.ts";

interface PushRequest {
  fields: OverridableSettingKey[];
  mode: "respectOverrides" | "forceAll";
}

export const handler = define.handlers({
  async POST(ctx) {
    const session = ctx.state.session as Session;
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the admin user
    const adminUser = await getUserById(session.userId);
    if (!adminUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if admin
    if (adminUser.role !== "admin" && adminUser.role !== "owner") {
      return Response.json({ error: "Only admins can push settings" }, { status: 403 });
    }

    // Get org
    const org = await getOrganizationById(adminUser.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    // Parse request body
    let body: PushRequest;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { fields, mode } = body;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return Response.json({ error: "Fields array is required" }, { status: 400 });
    }

    if (mode !== "respectOverrides" && mode !== "forceAll") {
      return Response.json({ error: "Mode must be 'respectOverrides' or 'forceAll'" }, { status: 400 });
    }

    // Get org defaults
    const orgDefaults = getOrgDefaults(org.settings);

    // Get all users in org
    const users = await listUsersByOrg(adminUser.orgId);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const userOverrides = user.settings || {};
      const newOverrides: UserOverrides = { ...userOverrides };
      let needsUpdate = false;

      for (const field of fields) {
        const hasOverride = userOverrides[field] !== undefined;

        if (mode === "forceAll") {
          // Clear user override to force org default
          if (hasOverride) {
            delete newOverrides[field];
            needsUpdate = true;
          }
        } else if (mode === "respectOverrides") {
          // Only affect users who haven't customized this field
          // Nothing to do - they already get org default via resolution
          // But we could store a "pushed" marker if needed for notifications
        }
      }

      if (needsUpdate) {
        await updateUser(user.id, { settings: newOverrides });
        updatedCount++;
      } else {
        skippedCount++;
      }
    }

    // Update org's settingsLastPushedAt timestamp
    const now = Date.now();
    await import("@/lib/db/orgs.ts").then(({ updateOrganization }) =>
      updateOrganization(org.id, {
        settings: {
          ...org.settings,
          settingsLastPushedAt: now,
        } as typeof org.settings,
      })
    );

    return Response.json({
      success: true,
      message: `Settings pushed to ${updatedCount} users (${skippedCount} skipped)`,
      updatedCount,
      skippedCount,
    });
  },
});
