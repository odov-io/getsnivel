/**
 * GET /api/orgs/[slug]
 * Proxy to API for org info
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
      // Try book endpoint first (public org info for booking)
      const res = await fetch(`${API_BASE}/book/orgs/${slug}`);
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to fetch org:", error);
      return Response.json({ error: "Failed to fetch org" }, { status: 500 });
    }
  },
});
