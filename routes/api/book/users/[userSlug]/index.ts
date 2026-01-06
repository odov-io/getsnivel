/**
 * GET /api/book/users/[userSlug]
 * Get a user by slug with all their org memberships
 * Used by book.snivel.app for /[user] route
 */

import { define } from "@/utils.ts";
import { getUserByGlobalSlug, listUserOrgs } from "@/lib/db/users.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const userSlug = ctx.params.userSlug;

    if (!userSlug) {
      return Response.json({ error: "User slug is required" }, { status: 400 });
    }

    // Get user by their global slug (unique across all orgs)
    const user = await getUserByGlobalSlug(userSlug);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get all orgs the user belongs to
    const orgs = await listUserOrgs(user.id);

    // Return user info with bookable status
    // Even if not bookable, we return data so the booking page can show a helpful message
    return Response.json({
      user: {
        id: user.id,
        slug: user.slug,
        name: user.name,
        defaultOrgSlug: user.defaultOrgSlug,
        isBookable: user.isActive && user.calendarConnected,
        calendarConnected: user.calendarConnected,
        isActive: user.isActive,
        settings: {
          timezone: user.settings.timezone,
          availableDays: user.settings.availableDays,
          availableHoursStart: user.settings.availableHoursStart,
          availableHoursEnd: user.settings.availableHoursEnd,
          meetingDurations: user.settings.meetingDurations,
          bufferMinutes: user.settings.bufferMinutes,
          bio: user.settings.bio,
          avatarUrl: user.settings.avatarUrl,
        },
      },
      orgs: orgs.map((org) => ({
        id: org.id,
        slug: org.slug,
        name: org.name,
        settings: {
          brandColor: org.settings.brandColor,
          logoUrl: org.settings.logoUrl,
        },
      })),
    });
  },
});
