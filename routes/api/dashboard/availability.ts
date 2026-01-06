/**
 * POST /api/dashboard/availability
 * Update availability settings (timezone, days, hours, durations, buffer)
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

    const {
      timezone,
      availableDays,
      availableHoursStart,
      availableHoursEnd,
      meetingDurations,
      bufferMinutes,
    } = body;

    try {
      await updateOrganization(session.orgId, {
        settings: {
          ...org.settings,
          timezone,
          availableDays,
          availableHoursStart,
          availableHoursEnd,
          meetingDurations,
          bufferMinutes,
        },
      });

      return Response.json({ success: true });
    } catch (error) {
      console.error("Failed to update availability:", error);
      return Response.json({ error: "Failed to save availability settings" }, { status: 500 });
    }
  },
});
