/**
 * POST /api/dashboard/policies
 * Update org policies
 */

import { define } from "@/utils.ts";
import { getOrganizationById, updateOrganization } from "@/lib/db/orgs.ts";

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

    const org = await getOrganizationById(session.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    const { policies } = body;

    try {
      await updateOrganization(session.orgId, {
        settings: {
          ...org.settings,
          policies,
        },
      });

      return Response.json({ success: true });
    } catch (error) {
      console.error("Failed to update policies:", error);
      return Response.json({ error: "Failed to save policies" }, { status: 500 });
    }
  },
});
