/**
 * Admin API Middleware
 * Protects admin endpoints with API key authentication
 */

import { define } from "@/utils.ts";

const ADMIN_API_KEY = Deno.env.get("ADMIN_API_KEY");

export const handler = define.middleware((ctx) => {
  // Check for API key in Authorization header
  const authHeader = ctx.req.headers.get("Authorization");
  const apiKey = authHeader?.replace("Bearer ", "");

  if (!ADMIN_API_KEY) {
    console.error("ADMIN_API_KEY not configured");
    return new Response(JSON.stringify({ error: "Admin API not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return ctx.next();
});
