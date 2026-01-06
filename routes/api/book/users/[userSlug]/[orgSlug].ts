/**
 * GET /api/book/users/[userSlug]/[orgSlug]
 * Get a user at a specific organization
 * Used by book.snivel.app for /[user]/[org] booking page
 */

import { define } from "@/utils.ts";
import { getUserByGlobalSlug, isUserInOrg } from "@/lib/db/users.ts";
import { getOrganizationBySlug } from "@/lib/db/orgs.ts";
import { resolveEffectiveSettings } from "@/lib/settings/resolver.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const { userSlug, orgSlug } = ctx.params;

    if (!userSlug || !orgSlug) {
      return Response.json({ error: "User and org slugs are required" }, { status: 400 });
    }

    // Get user by their global slug
    const user = await getUserByGlobalSlug(userSlug);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get the org
    const org = await getOrganizationBySlug(orgSlug);

    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    // Verify user belongs to this org
    const userInOrg = await isUserInOrg(user.id, org.id);

    if (!userInOrg) {
      return Response.json({ error: "User is not a member of this organization" }, { status: 404 });
    }

    // Check if user is bookable
    if (!user.isActive || !user.calendarConnected) {
      return Response.json({ error: "User is not available for booking" }, { status: 404 });
    }

    // Resolve effective settings from org + user overrides
    const effectiveSettings = resolveEffectiveSettings(org.settings, user.settings);

    return Response.json({
      user: {
        id: user.id,
        slug: user.slug,
        name: user.name,
        settings: {
          timezone: effectiveSettings.timezone,
          availableDays: effectiveSettings.availableDays,
          availableHoursStart: effectiveSettings.availableHoursStart,
          availableHoursEnd: effectiveSettings.availableHoursEnd,
          meetingDurations: effectiveSettings.meetingDurations,
          bufferMinutes: effectiveSettings.bufferMinutes,
          bio: effectiveSettings.bio,
          avatarUrl: effectiveSettings.avatarUrl,
          // Booking limits
          minimumNoticeHours: effectiveSettings.minimumNoticeHours,
          maximumAdvanceDays: effectiveSettings.maximumAdvanceDays,
          dailyBookingLimit: effectiveSettings.dailyBookingLimit,
          weeklyBookingLimit: effectiveSettings.weeklyBookingLimit,
          calendarInviteMode: effectiveSettings.calendarInviteMode,
          // Intake fields and policies (org-only)
          intakeConfig: effectiveSettings.intakeConfig,
          policies: effectiveSettings.policies,
        },
      },
      org: {
        id: org.id,
        slug: org.slug,
        name: org.name,
        settings: {
          brandColor: org.settings?.brandColor,
          logoUrl: org.settings?.logoUrl,
          logoDisplayMode: org.settings?.logoDisplayMode,
        },
      },
    });
  },
});
