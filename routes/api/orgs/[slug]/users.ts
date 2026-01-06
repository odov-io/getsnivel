/**
 * GET /api/orgs/[slug]/users
 * List bookable users for an organization - used by book.snivel.app
 */

import { define } from "@/utils.ts";
import { getOrganizationBySlug } from "@/lib/db/orgs.ts";
import { listBookableUsers } from "@/lib/db/users.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const slug = ctx.params.slug;

    if (!slug) {
      return Response.json({ error: "Slug is required" }, { status: 400 });
    }

    const org = await getOrganizationBySlug(slug);

    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    // Get bookable users (active + calendar connected)
    const users = await listBookableUsers(org.id);

    // Return public user info (no sensitive data)
    return Response.json({
      orgId: org.id,
      orgName: org.name,
      users: users.map((u) => ({
        id: u.id,
        slug: u.slug,
        name: u.name,
        settings: {
          timezone: u.settings.timezone,
          availableDays: u.settings.availableDays,
          availableHoursStart: u.settings.availableHoursStart,
          availableHoursEnd: u.settings.availableHoursEnd,
          meetingDurations: u.settings.meetingDurations,
          bio: u.settings.bio,
          avatarUrl: u.settings.avatarUrl,
        },
      })),
    });
  },
});
