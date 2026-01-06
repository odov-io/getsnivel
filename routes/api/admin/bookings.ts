/**
 * GET /api/admin/bookings
 * List all bookings for admin dashboard
 */

import { define } from "@/utils.ts";
import { getKv } from "@/lib/db/kv.ts";
import type { Booking } from "@/lib/db/bookings.ts";

export const handler = define.handlers({
  async GET(ctx) {
    try {
      const url = new URL(ctx.req.url);
      const filter = url.searchParams.get("filter") || "upcoming";
      const limit = parseInt(url.searchParams.get("limit") || "100");

      const kv = await getKv();
      const bookings: Booking[] = [];
      const now = Date.now();

      for await (const entry of kv.list<Booking>({ prefix: ["bookings", "by_id"] })) {
        const booking = entry.value;

        // Filter by upcoming/past
        if (filter === "upcoming" && booking.startTime < now) continue;
        if (filter === "past" && booking.startTime >= now) continue;

        bookings.push(booking);
      }

      // Sort
      if (filter === "upcoming") {
        bookings.sort((a, b) => a.startTime - b.startTime);
      } else {
        bookings.sort((a, b) => b.startTime - a.startTime);
      }

      // Apply limit
      const limited = bookings.slice(0, limit);

      // Calculate stats
      const allBookings: Booking[] = [];
      for await (const entry of kv.list<Booking>({ prefix: ["bookings", "by_id"] })) {
        allBookings.push(entry.value);
      }

      const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
      const byStatus: Record<string, number> = {};
      let upcoming = 0;
      let thisWeek = 0;

      for (const booking of allBookings) {
        byStatus[booking.status] = (byStatus[booking.status] || 0) + 1;
        if (booking.startTime >= now) {
          upcoming++;
          if (booking.startTime <= weekFromNow) thisWeek++;
        }
      }

      return new Response(JSON.stringify({
        bookings: limited,
        stats: {
          total: allBookings.length,
          upcoming,
          thisWeek,
          byStatus,
        },
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch bookings" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
