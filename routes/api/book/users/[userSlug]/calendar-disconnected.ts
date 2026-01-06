/**
 * POST /api/book/users/[userSlug]/calendar-disconnected
 * Called by snivel-book when user disconnects a calendar
 * If no calendars remain, marks user as not bookable
 */

import { define } from "@/utils.ts";
import { getUserByGlobalSlug, updateUser } from "@/lib/db/users.ts";

interface CalendarDisconnectedBody {
  provider: "google" | "microsoft";
}

export const handler = define.handlers({
  async POST(ctx) {
    const userSlug = ctx.params.userSlug;

    if (!userSlug) {
      return Response.json({ error: "User slug is required" }, { status: 400 });
    }

    // Parse request body
    let body: CalendarDisconnectedBody;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Find user by global slug
    const user = await getUserByGlobalSlug(userSlug);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's calendar connection status
    try {
      // Remove provider from array
      const currentProviders = user.providers || [];
      const newProviders = currentProviders.filter(p => p !== body.provider);
      const stillConnected = newProviders.length > 0;

      await updateUser(user.id, {
        calendarConnected: stillConnected,
        providers: newProviders,
      });

      console.log(`Calendar disconnected for user ${userSlug} (${body.provider}). Remaining: ${newProviders.join(", ") || "none"}`);

      return Response.json({
        success: true,
        message: "Calendar disconnected",
        stillConnected,
      });
    } catch (error) {
      console.error("Failed to update calendar status:", error);
      return Response.json({ error: "Failed to update calendar status" }, { status: 500 });
    }
  },
});
