/**
 * GET /api/admin/orgs
 * List all organizations for admin dashboard
 */

import { define } from "@/utils.ts";
import { listOrganizations, getOrgsNeedingLifecycleAction } from "@/lib/db/orgs.ts";

export const handler = define.handlers({
  async GET(_ctx) {
    try {
      const [orgs, lifecycle] = await Promise.all([
        listOrganizations(),
        getOrgsNeedingLifecycleAction(),
      ]);

      // Calculate stats
      const byStatus: Record<string, number> = {};
      const byPlan: Record<string, number> = {};

      for (const org of orgs) {
        const status = org.subscriptionStatus || "none";
        byStatus[status] = (byStatus[status] || 0) + 1;

        const plan = org.plan.replace("-trial", "");
        byPlan[plan] = (byPlan[plan] || 0) + 1;
      }

      return new Response(JSON.stringify({
        orgs,
        stats: {
          total: orgs.length,
          byStatus,
          byPlan,
        },
        alerts: {
          expiredTrials: lifecycle.expiredTrials,
          paymentFailures: lifecycle.paymentFailed,
          frozen: lifecycle.frozen,
        },
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching orgs:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch organizations" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
