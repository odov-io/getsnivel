/**
 * GET /api/admin/orgs
 * List all organizations for admin dashboard
 */

import { define } from "@/utils.ts";
import { listOrganizations } from "@/lib/db/orgs.ts";
import type { Organization } from "@/lib/db/orgs.ts";

export const handler = define.handlers({
  async GET(_ctx) {
    try {
      const orgs = await listOrganizations();
      const now = Date.now();

      // Calculate stats
      const byStatus: Record<string, number> = {};
      const byPlan: Record<string, number> = {};

      // Categorize alerts
      const expiredTrials: Organization[] = [];
      const paymentFailures: Organization[] = [];
      const frozen: Organization[] = [];

      for (const org of orgs) {
        const status = org.subscriptionStatus || "none";
        byStatus[status] = (byStatus[status] || 0) + 1;

        const plan = org.plan.replace("-trial", "");
        byPlan[plan] = (byPlan[plan] || 0) + 1;

        // Expired trials
        if (org.subscriptionStatus === "trialing" && org.trialEndsAt && org.trialEndsAt < now) {
          expiredTrials.push(org);
        }

        // Payment failures
        if (org.subscriptionStatus === "past_due" || org.paymentFailedAt) {
          paymentFailures.push(org);
        }

        // Frozen accounts
        if (org.accountStatus === "frozen") {
          frozen.push(org);
        }
      }

      return new Response(JSON.stringify({
        orgs,
        stats: {
          total: orgs.length,
          byStatus,
          byPlan,
        },
        alerts: {
          expiredTrials,
          paymentFailures,
          frozen,
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
