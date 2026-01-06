/**
 * POST /api/stripe/checkout
 * Create a Stripe embedded checkout session
 *
 * Requires admin session - called from billing tab in dashboard
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";
import { createCheckoutSession, getCheckoutSession } from "@/lib/stripe/checkout.ts";
import { getPublishableKey } from "@/lib/stripe/client.ts";

export const handler = define.handlers({
  /**
   * POST - Create new checkout session
   * Body: { plan: string, interval: "month" | "year", quantity?: number }
   * Returns: { clientSecret: string, publishableKey: string }
   */
  async POST(ctx) {
    // Check auth
    const session = await getSessionFromRequest(ctx.req);
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body
    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { plan, interval, quantity } = body;

    // Validate inputs
    if (!plan || typeof plan !== "string") {
      return Response.json({ error: "Plan is required" }, { status: 400 });
    }

    if (interval !== "month" && interval !== "year") {
      return Response.json({ error: "Interval must be 'month' or 'year'" }, { status: 400 });
    }

    // Get org
    const org = await getOrganizationById(session.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    try {
      const clientSecret = await createCheckoutSession({
        org,
        plan,
        interval,
        quantity: quantity ? Number(quantity) : undefined,
      });

      return Response.json({
        clientSecret,
        publishableKey: getPublishableKey(),
      });
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      return Response.json(
        { error: error instanceof Error ? error.message : "Failed to create checkout" },
        { status: 500 }
      );
    }
  },

  /**
   * GET - Check status of a checkout session
   * Query: ?session_id=cs_xxx
   * Returns: { status: string, customerId?: string }
   */
  async GET(ctx) {
    // Check auth
    const session = await getSessionFromRequest(ctx.req);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(ctx.req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    try {
      const checkoutSession = await getCheckoutSession(sessionId);

      return Response.json({
        status: checkoutSession.status,
        paymentStatus: checkoutSession.payment_status,
        customerId: typeof checkoutSession.customer === "string"
          ? checkoutSession.customer
          : checkoutSession.customer?.id,
      });
    } catch (error) {
      console.error("Failed to get checkout session:", error);
      return Response.json({ error: "Failed to get session" }, { status: 500 });
    }
  },
});
