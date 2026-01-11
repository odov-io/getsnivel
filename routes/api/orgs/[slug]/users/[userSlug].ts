/**
 * GET /api/orgs/[slug]/users/[userSlug]
 * Proxy to API for specific user in org
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async GET(ctx) {
    const { slug, userSlug } = ctx.params;

    if (!slug || !userSlug) {
      return Response.json({ error: "Slug and userSlug are required" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/book/orgs/${slug}/users/${userSlug}`);
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return Response.json({ error: "Failed to fetch user" }, { status: 500 });
    }
  },
});
