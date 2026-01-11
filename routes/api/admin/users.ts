/**
 * GET /api/admin/users
 * Proxy to API for admin user list
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async GET(ctx) {
    const apiKey = ctx.state.adminApiKey;

    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: "GET",
        headers: {
          "x-admin-api-key": apiKey,
        },
      });

      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Error fetching users:", error);
      return Response.json({ error: "Failed to fetch users" }, { status: 500 });
    }
  },
});
