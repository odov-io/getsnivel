/**
 * Dashboard Middleware
 * Checks auth for all dashboard routes
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";

export const handler = define.middleware(async (ctx) => {
  const session = await getSessionFromRequest(ctx.req);

  if (!session) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  // Get org info
  const org = await getOrganizationById(session.orgId);

  // Add to state for layout and pages
  ctx.state.session = session;
  ctx.state.orgName = org?.name || "Organization";

  return ctx.next();
});
