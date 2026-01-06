/**
 * GET /api/orgs/[slug]/users/[userSlug]
 * Get a specific user by slug - used by book.snivel.app
 */

import { define } from "@/utils.ts";
import { getOrganizationBySlug } from "@/lib/db/orgs.ts";
import { getUserBySlug } from "@/lib/db/users.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const { slug, userSlug } = ctx.params;

    if (!slug || !userSlug) {
      return Response.json({ error: "Slug and userSlug are required" }, { status: 400 });
    }

    const org = await getOrganizationBySlug(slug);

    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    const user = await getUserBySlug(org.id, userSlug);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is bookable
    if (!user.isActive || !user.calendarConnected) {
      return Response.json({ error: "User is not available for booking" }, { status: 404 });
    }

    // Return public user info (no sensitive data)
    return Response.json({
      id: user.id,
      orgId: org.id,
      orgName: org.name,
      slug: user.slug,
      name: user.name,
      provider: user.provider,
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
    });
  },
});
