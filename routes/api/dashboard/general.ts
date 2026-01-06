/**
 * POST /api/dashboard/general
 * Update org name and slug
 */

import { define } from "@/utils.ts";
import { getOrganizationById, updateOrganization, isSlugAvailable } from "@/lib/db/orgs.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const session = ctx.state.session;
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, slug, logoUrl, logoDisplayMode } = body;

    if (!name?.trim() || !slug?.trim()) {
      return Response.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const org = await getOrganizationById(session.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    // Check slug availability if changed
    if (slug !== org.slug) {
      const available = await isSlugAvailable(slug);
      if (!available) {
        return Response.json({ error: "That URL is already taken" }, { status: 400 });
      }
    }

    // Validate logoDisplayMode if provided
    const validModes = ["logoOnly", "logoWithName", "nameOnly"];
    if (logoDisplayMode && !validModes.includes(logoDisplayMode)) {
      return Response.json({ error: "Invalid logo display mode" }, { status: 400 });
    }

    try {
      await updateOrganization(session.orgId, {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        settings: {
          ...org.settings,
          logoUrl: logoUrl?.trim() || undefined,
          logoDisplayMode: logoDisplayMode || "nameOnly",
        },
      });

      return Response.json({ success: true });
    } catch (error) {
      console.error("Failed to update org general:", error);
      return Response.json({ error: "Failed to save" }, { status: 500 });
    }
  },
});
