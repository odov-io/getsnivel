/**
 * POST /api/stripe/checkout
 * GET /api/stripe/checkout?session_id=xxx
 * Proxy to API for Stripe checkout operations
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  /**
   * POST - Create new checkout session
   */
  async POST(ctx) {
    const session = await getSessionFromRequest(ctx.req);
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/stripe/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token || ""}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Checkout error:", error);
      return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
  },

  /**
   * GET - Check status of a checkout session
   */
  async GET(ctx) {
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
      const res = await fetch(`${API_BASE}/stripe/checkout/${sessionId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.token || ""}`,
        },
      });

      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to get checkout session:", error);
      return Response.json({ error: "Failed to get session" }, { status: 500 });
    }
  },
});
