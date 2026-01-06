/**
 * GET /api/orgs/[slug]
 * Get organization by slug - used by other Snivel apps
 */

import { define } from "@/utils.ts";
import { getOrganizationBySlug } from "@/lib/db/orgs.ts";

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

    // Return public org info (no sensitive data)
    return Response.json({
      id: org.id,
      slug: org.slug,
      name: org.name,
      settings: {
        timezone: org.settings.timezone,
        allowPublicBooking: org.settings.allowPublicBooking,
        brandColor: org.settings.brandColor,
        logoUrl: org.settings.logoUrl,
      },
    });
  },
});
