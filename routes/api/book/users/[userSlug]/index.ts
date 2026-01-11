/**
 * GET /api/book/users/[userSlug]
 * Proxy to API for user booking data
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async GET(ctx) {
    const userSlug = ctx.params.userSlug;

    if (!userSlug) {
      return Response.json({ error: "User slug is required" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/book/users/${userSlug}`);
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return Response.json({ error: "Failed to fetch user" }, { status: 500 });
    }
  },
});
