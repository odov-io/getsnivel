/**
 * POST /api/email/booking-confirmation
 * Proxy to API for sending booking confirmation emails
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async POST(ctx) {
    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/email/booking-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to send booking confirmation emails:", error);
      return Response.json({ error: "Failed to send confirmation emails" }, { status: 500 });
    }
  },
});
