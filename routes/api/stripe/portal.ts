/**
 * POST /api/stripe/portal
 * Proxy to API for Stripe Customer Portal
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async POST(ctx) {
    const session = await getSessionFromRequest(ctx.req);
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const body = await ctx.req.json().catch(() => ({}));

      const res = await fetch(`${API_BASE}/stripe/portal`, {
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
      console.error("[Portal] Failed to create session:", error);
      return Response.json({ error: "Failed to create billing portal" }, { status: 500 });
    }
  },
});
