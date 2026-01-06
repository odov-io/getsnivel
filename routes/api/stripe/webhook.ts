/**
 * POST /api/stripe/webhook
 * Handle incoming Stripe webhook events
 *
 * IMPORTANT: This route does NOT require authentication.
 * Security is provided by Stripe webhook signature verification.
 */

import { define } from "@/utils.ts";
import {
  verifyWebhookSignature,
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handlePaymentFailed,
  handleInvoicePaid,
} from "@/lib/stripe/webhooks.ts";

export const handler = define.handlers({
  async POST(ctx) {
    // Get the signature header
    const signature = ctx.req.headers.get("stripe-signature");
    if (!signature) {
      console.error("[Stripe Webhook] Missing stripe-signature header");
      return Response.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get raw body for signature verification
    const payload = await ctx.req.text();

    // Verify signature and construct event (async for Deno Deploy)
    let event;
    try {
      event = await verifyWebhookSignature(payload, signature);
    } catch (err) {
      console.error("[Stripe Webhook] Signature verification failed:", err);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Process the event
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(event.data.object);
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object);
          break;

        case "invoice.payment_failed":
          await handlePaymentFailed(event.data.object);
          break;

        case "invoice.paid":
          await handleInvoicePaid(event.data.object);
          break;

        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      // Log the error but return 200 to acknowledge receipt
      // Stripe will retry on 4xx/5xx responses
      console.error(`[Stripe Webhook] Error handling ${event.type}:`, error);
    }

    // Always return 200 to acknowledge receipt
    return Response.json({ received: true });
  },
});
