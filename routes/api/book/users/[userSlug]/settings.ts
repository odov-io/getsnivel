/**
 * GET/POST /api/book/users/[userSlug]/settings
 * Get or update user settings from snivel-book
 *
 * Returns effective settings resolved from org + user overrides
 * Also returns which fields user can override and current overrides
 */

import { define } from "@/utils.ts";
import { getUserByGlobalSlug, updateUser, listUserOrgs, type UserOverrides } from "@/lib/db/users.ts";
import { getOrganizationById, isSoloPlan } from "@/lib/db/orgs.ts";
import {
  resolveEffectiveSettings,
  getOverridableFields,
  getOrgDefaults,
  clearOverride,
  clearAllOverrides,
} from "@/lib/settings/resolver.ts";
import type { OverridableSettingKey } from "@/lib/settings/types.ts";

export const handler = define.handlers({
  // GET current settings with override info
  async GET(ctx) {
    const userSlug = ctx.params.userSlug;

    if (!userSlug) {
      return Response.json({ error: "User slug is required" }, { status: 400 });
    }

    const user = await getUserByGlobalSlug(userSlug);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get org settings for resolution
    const org = await getOrganizationById(user.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 500 });
    }

    // Resolve effective settings
    const effectiveSettings = resolveEffectiveSettings(org.settings, user.settings);

    // Get which fields user can override
    const overridableFields = getOverridableFields(org.settings);

    // Get org defaults for comparison
    const orgDefaults = getOrgDefaults(org.settings);

    // Get org settings last pushed timestamp (if available)
    // deno-lint-ignore no-explicit-any
    const orgSettingsLastPushedAt = (org.settings as any)?.settingsLastPushedAt as number | undefined;

    // Get user's orgs for sharing
    const userOrgs = await listUserOrgs(user.id);

    return Response.json({
      name: user.name,
      email: user.email,  // Needed for auth flow in snivel-book
      effectiveSettings,
      overridableFields,
      userOverrides: user.settings,
      orgDefaults,
      orgSettingsLastPushedAt,
      orgs: userOrgs.map(o => ({ slug: o.slug, name: o.name })),
      // Plan info for UI conditional rendering
      plan: org.plan,
      isSolo: isSoloPlan(org.plan),
      orgCreatedAt: org.createdAt,
    });
  },

  // POST to update settings (overrides only)
  async POST(ctx) {
    const userSlug = ctx.params.userSlug;

    if (!userSlug) {
      return Response.json({ error: "User slug is required" }, { status: 400 });
    }

    const user = await getUserByGlobalSlug(userSlug);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get org settings to check permissions
    const org = await getOrganizationById(user.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 500 });
    }

    const overridableFields = getOverridableFields(org.settings);

    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { action } = body;

    // Reset single setting to org default
    if (action === "reset") {
      const { field } = body as { field: OverridableSettingKey };

      if (!field) {
        return Response.json({ error: "Field is required for reset" }, { status: 400 });
      }

      const newOverrides = clearOverride(user.settings, field);
      await updateUser(user.id, { settings: newOverrides });

      return Response.json({ success: true, message: `${field} reset to org default` });
    }

    // Reset all settings to org defaults
    if (action === "resetAll") {
      const newOverrides = clearAllOverrides(user.settings);
      await updateUser(user.id, { settings: newOverrides });

      return Response.json({ success: true, message: "All settings reset to org defaults" });
    }

    // Update availability/rules (only if overridable)
    // "rules" is an alias for "availability" - both handle the same settings
    if (action === "availability" || action === "rules") {
      const newOverrides: UserOverrides = { ...(user.settings || {}) };

      // Only save fields that are overridable
      if (overridableFields.includes("timezone") && body.timezone !== undefined) {
        newOverrides.timezone = body.timezone;
      }
      if (overridableFields.includes("availableDays") && body.availableDays !== undefined) {
        newOverrides.availableDays = body.availableDays;
      }
      if (overridableFields.includes("availableHoursStart") && body.availableHoursStart !== undefined) {
        newOverrides.availableHoursStart = body.availableHoursStart;
      }
      if (overridableFields.includes("availableHoursEnd") && body.availableHoursEnd !== undefined) {
        newOverrides.availableHoursEnd = body.availableHoursEnd;
      }
      if (overridableFields.includes("meetingDurations") && body.meetingDurations !== undefined) {
        newOverrides.meetingDurations = body.meetingDurations;
      }
      if (overridableFields.includes("bufferMinutes") && body.bufferMinutes !== undefined) {
        newOverrides.bufferMinutes = body.bufferMinutes;
      }
      if (overridableFields.includes("minimumNoticeHours") && body.minimumNoticeHours !== undefined) {
        newOverrides.minimumNoticeHours = body.minimumNoticeHours;
      }
      if (overridableFields.includes("maximumAdvanceDays") && body.maximumAdvanceDays !== undefined) {
        newOverrides.maximumAdvanceDays = body.maximumAdvanceDays;
      }
      if (overridableFields.includes("dailyBookingLimit") && body.dailyBookingLimit !== undefined) {
        newOverrides.dailyBookingLimit = body.dailyBookingLimit;
      }
      if (overridableFields.includes("weeklyBookingLimit") && body.weeklyBookingLimit !== undefined) {
        newOverrides.weeklyBookingLimit = body.weeklyBookingLimit;
      }
      if (overridableFields.includes("calendarInviteMode") && body.calendarInviteMode !== undefined) {
        newOverrides.calendarInviteMode = body.calendarInviteMode;
      }

      await updateUser(user.id, { settings: newOverrides });

      return Response.json({ success: true, message: "Availability updated" });
    }

    // Update profile (bio/avatarUrl are always user-controlled)
    if (action === "profile") {
      const { name, bio, avatarUrl } = body;

      await updateUser(user.id, {
        name: name || user.name,
        settings: {
          ...user.settings,
          bio: bio ?? user.settings.bio,
          avatarUrl: avatarUrl ?? user.settings?.avatarUrl,
        },
      });

      return Response.json({ success: true, message: "Profile updated" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  },
});
