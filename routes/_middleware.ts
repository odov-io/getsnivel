/**
 * Global Middleware
 * Resolves API URL per-request for timeline support
 */

import { define } from "@/utils.ts";
import { getApiUrlForRequest } from "@/lib/env.ts";

export const handler = define.middleware(async (ctx) => {
  const url = new URL(ctx.req.url);

  // Resolve API URL based on request hostname (for timeline support)
  ctx.state.apiUrl = getApiUrlForRequest(url.hostname);

  return ctx.next();
});
