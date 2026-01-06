/**
 * GET /api/admin/users
 * List all users for admin dashboard
 */

import { define } from "@/utils.ts";
import { getKv } from "@/lib/db/kv.ts";
import type { User } from "@/lib/db/users.ts";

export const handler = define.handlers({
  async GET(_ctx) {
    try {
      const kv = await getKv();
      const users: User[] = [];

      for await (const entry of kv.list<User>({ prefix: ["users", "by_id"] })) {
        users.push(entry.value);
      }

      // Sort by createdAt descending
      users.sort((a, b) => b.createdAt - a.createdAt);

      // Calculate stats
      const stats = {
        total: users.length,
        active: users.filter((u) => u.isActive).length,
        withCalendar: users.filter((u) => u.calendarConnected).length,
        admins: users.filter((u) => u.role === "admin").length,
      };

      return new Response(JSON.stringify({ users, stats }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
