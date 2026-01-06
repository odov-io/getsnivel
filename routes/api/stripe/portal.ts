/**
 * POST /api/stripe/portal
 * Create a Stripe Customer Portal session
 *
 * Allows customers to:
 * - Update payment method
 * - View invoice history
 * - Cancel subscription
 * - Update billing info
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";
import { createPortalSession } from "@/lib/stripe/checkout.ts";

export const handler = define.handlers({
  async POST(ctx) {
    // Check auth - must be admin
    const session = await getSessionFromRequest(ctx.req);
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get org
    const org = await getOrganizationById(session.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    // Check if org has a Stripe customer
    if (!org.stripeCustomerId) {
      return Response.json(
        { error: "No billing account. Subscribe first." },
        { status: 400 }
      );
    }

    try {
      console.log("[Portal] Creating session for customer:", org.stripeCustomerId);
      const portalUrl = await createPortalSession(org.stripeCustomerId);
      console.log("[Portal] Session created, redirecting to:", portalUrl);
      return Response.json({ url: portalUrl });
    } catch (error) {
      console.error("[Portal] Failed to create session:", error);
      return Response.json(
        { error: "Failed to create billing portal" },
        { status: 500 }
      );
    }
  },
});
