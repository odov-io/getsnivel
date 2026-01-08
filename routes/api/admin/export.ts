/**
 * GET /api/admin/export
 * Export all orgs and users for migration to api.snivel.app
 */

import { define } from "@/utils.ts";
import { listOrganizations } from "@/lib/db/orgs.ts";
import { getKv } from "@/lib/db/kv.ts";
import type { User } from "@/lib/db/users.ts";

export const handler = define.handlers({
  async GET(_ctx) {
    try {
      // Get all orgs
      const orgs = await listOrganizations();

      // Get all users
      const kv = await getKv();
      const users: User[] = [];
      for await (const entry of kv.list<User>({ prefix: ["users", "by_id"] })) {
        users.push(entry.value);
      }

      return new Response(JSON.stringify({
        exportedAt: new Date().toISOString(),
        source: "getsnivel",
        data: {
          orgs,
          users,
        },
        counts: {
          orgs: orgs.length,
          users: users.length,
        },
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Export error:", error);
      return new Response(JSON.stringify({ error: "Export failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
