/**
 * GET /api/admin/export
 * Proxy to API for data export
 * Note: This may not have an equivalent endpoint in the API
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async GET(ctx) {
    const apiKey = ctx.state.adminApiKey;

    try {
      const res = await fetch(`${API_BASE}/admin/export`, {
        method: "GET",
        headers: {
          "x-admin-api-key": apiKey,
        },
      });

      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Export error:", error);
      return Response.json({ error: "Export failed" }, { status: 500 });
    }
  },
});
