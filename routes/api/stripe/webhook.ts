/**
 * POST /api/stripe/webhook
 * Proxy to API for Stripe webhook handling
 *
 * IMPORTANT: This forwards the raw body and signature to the API.
 * The API handles verification and processing.
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async POST(ctx) {
    // Get the signature header
    const signature = ctx.req.headers.get("stripe-signature");
    if (!signature) {
      console.error("[Stripe Webhook Proxy] Missing stripe-signature header");
      return Response.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get raw body to forward
    const payload = await ctx.req.text();

    try {
      // Forward to API with same signature
      const res = await fetch(`${API_BASE}/stripe/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "stripe-signature": signature,
        },
        body: payload,
      });

      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("[Stripe Webhook Proxy] Failed to forward:", error);
      // Return 200 to acknowledge receipt (Stripe retries on errors)
      return Response.json({ received: true, proxied: false });
    }
  },
});
