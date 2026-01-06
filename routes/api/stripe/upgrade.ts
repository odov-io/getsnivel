/**
 * POST /api/stripe/upgrade
 * Change subscription plan (upgrade or downgrade)
 *
 * Upgrades: Charge prorated difference immediately
 * Downgrades: No credit, new price applies at next renewal
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";
import { getStripe } from "@/lib/stripe/client.ts";
import { getPriceId } from "@/lib/stripe/prices.ts";

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

    // Must have an active subscription
    if (!org.subscriptionId) {
      return Response.json(
        { error: "No active subscription. Please subscribe first." },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await ctx.req.json();
    const { plan, interval } = body;

    if (!plan || !interval) {
      return Response.json(
        { error: "Missing plan or interval" },
        { status: 400 }
      );
    }

    const newPriceId = getPriceId(plan, interval);
    if (!newPriceId) {
      return Response.json(
        { error: `Invalid plan: ${plan}` },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    try {
      // Get the current subscription with price details
      const subscription = await stripe.subscriptions.retrieve(org.subscriptionId, {
        expand: ["items.data.price"],
      });

      if (subscription.status !== "active") {
        return Response.json(
          { error: "Subscription is not active" },
          { status: 400 }
        );
      }

      // Get the current subscription item and price
      const currentItem = subscription.items.data[0];
      if (!currentItem) {
        return Response.json(
          { error: "No subscription item found" },
          { status: 400 }
        );
      }

      const currentPrice = currentItem.price;
      const currentAmount = currentPrice.unit_amount || 0;

      // Fetch the new price to compare
      const newPrice = await stripe.prices.retrieve(newPriceId);
      const newAmount = newPrice.unit_amount || 0;

      // Determine if this is an upgrade or downgrade
      const isUpgrade = newAmount > currentAmount;

      console.log(`[PlanChange] ${isUpgrade ? "Upgrade" : "Downgrade"}: ${currentAmount} -> ${newAmount}`);

      // Update the subscription
      // Upgrades: prorate and charge difference immediately
      // Downgrades: no proration, new price applies at next billing cycle
      const updatedSubscription = await stripe.subscriptions.update(
        org.subscriptionId,
        {
          items: [{
            id: currentItem.id,
            price: newPriceId,
          }],
          proration_behavior: isUpgrade ? "create_prorations" : "none",
          metadata: {
            orgId: org.id,
            plan: plan,
          },
        }
      );

      console.log("[PlanChange] Subscription updated:", updatedSubscription.id);

      return Response.json({
        success: true,
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
        isUpgrade,
      });
    } catch (error) {
      console.error("[PlanChange] Failed to update subscription:", error);
      return Response.json(
        { error: "Failed to change plan" },
        { status: 500 }
      );
    }
  },
});
