/**
 * GET /api/book/users/[userSlug]/[orgSlug]
 * Proxy to API for user at specific org
 */

import { define } from "@/utils.ts";

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

export const handler = define.handlers({
  async GET(ctx) {
    const { userSlug, orgSlug } = ctx.params;

    if (!userSlug || !orgSlug) {
      return Response.json({ error: "User and org slugs are required" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/book/users/${userSlug}/${orgSlug}`);
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to fetch user at org:", error);
      return Response.json({ error: "Failed to fetch user" }, { status: 500 });
    }
  },
});
