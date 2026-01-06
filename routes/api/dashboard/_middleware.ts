/**
 * API Dashboard Middleware
 * Checks auth for all /api/dashboard/* routes
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";

export const handler = define.middleware(async (ctx) => {
  const session = await getSessionFromRequest(ctx.req);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Add to state for API handlers
  ctx.state.session = session;

  return ctx.next();
});
