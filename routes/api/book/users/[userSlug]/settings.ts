/**
 * GET/POST /api/book/users/[userSlug]/settings
 * Proxy to API for user settings
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
      const res = await fetch(`${API_BASE}/book/users/${userSlug}/settings`);
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
  },

  async POST(ctx) {
    const userSlug = ctx.params.userSlug;

    if (!userSlug) {
      return Response.json({ error: "User slug is required" }, { status: 400 });
    }

    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    try {
      const res = await fetch(`${API_BASE}/book/users/${userSlug}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (error) {
      console.error("Failed to update settings:", error);
      return Response.json({ error: "Failed to update settings" }, { status: 500 });
    }
  },
});
