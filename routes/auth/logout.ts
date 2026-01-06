/**
 * GET/POST /auth/logout
 * Clear session and redirect to home
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest, deleteSession, clearSessionCookie } from "@/lib/auth/session.ts";

export const handler = define.handlers({
  async GET(ctx) {
    return handleLogout(ctx);
  },
  async POST(ctx) {
    return handleLogout(ctx);
  },
});

async function handleLogout(ctx: { req: Request; url: URL }) {
  const session = await getSessionFromRequest(ctx.req);

  if (session) {
    await deleteSession(session.id);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": clearSessionCookie(),
    },
  });
}
