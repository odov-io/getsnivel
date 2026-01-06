/**
 * POST /api/dashboard/limits
 * Update booking limits settings
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
      minimumNoticeHours,
      maximumAdvanceDays,
      dailyBookingLimit,
      weeklyBookingLimit,
      calendarInviteMode,
    } = body;

    try {
      await updateOrganization(session.orgId, {
        settings: {
          ...org.settings,
          minimumNoticeHours,
          maximumAdvanceDays,
          dailyBookingLimit,
          weeklyBookingLimit,
          calendarInviteMode,
        },
      });

      return Response.json({ success: true });
    } catch (error) {
      console.error("Failed to update booking limits:", error);
      return Response.json({ error: "Failed to save booking limits" }, { status: 500 });
    }
  },
});
