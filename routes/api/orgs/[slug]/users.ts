/**
 * GET /api/orgs/[slug]/users
 * Proxy to API for bookable users in org
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async GET(ctx) {
    const slug = ctx.params.slug;

    if (!slug) {
      return Response.json({ error: "Slug is required" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/book/orgs/${slug}/users`);
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return Response.json({ error: "Failed to fetch users" }, { status: 500 });
    }
  },
});
