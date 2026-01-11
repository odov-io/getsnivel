/**
 * GET /api/stripe/billing
 * Proxy to API for billing info
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async GET(ctx) {
    const session = await getSessionFromRequest(ctx.req);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const res = await fetch(`${API_BASE}/stripe/billing`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.token || ""}`,
        },
      });

      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("[Billing] Failed to fetch billing info:", error);
      return Response.json({ error: "Failed to fetch billing info" }, { status: 500 });
    }
  },
});
