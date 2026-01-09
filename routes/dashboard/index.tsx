/**
 * GET /dashboard
 * Redirect to org.snivel.app
 */

import { define } from "@/utils.ts";

const ORG_URL = Deno.env.get("ORG_URL") || "https://org.snivel.app";

export const handler = define.handlers({
  GET(_ctx) {
    return new Response(null, {
      status: 302,
      headers: { Location: ORG_URL },
    });
  },
});

export default define.page(function DashboardRedirect() {
  return (
    <div class="min-h-screen flex items-center justify-center">
      <p>Redirecting to <a href={ORG_URL}>{ORG_URL}</a>...</p>
    </div>
  );
});
