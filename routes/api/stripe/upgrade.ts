/**
 * POST /api/stripe/upgrade
 * Proxy to API for subscription upgrades/downgrades
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

    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/stripe/upgrade`, {
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
      console.error("[Upgrade] Failed to change plan:", error);
      return Response.json({ error: "Failed to change plan" }, { status: 500 });
    }
  },
});
