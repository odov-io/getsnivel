/**
 * POST /api/book/users/[userSlug]/calendar-connected
 * Called by snivel-book after successful OAuth to mark user as calendar-connected
 */

import { define } from "@/utils.ts";
import { getUserByGlobalSlug, updateUser } from "@/lib/db/users.ts";

interface CalendarConnectedBody {
  provider: "google" | "microsoft";
}

export const handler = define.handlers({
  async POST(ctx) {
    const userSlug = ctx.params.userSlug;

    if (!userSlug) {
      return Response.json({ error: "User slug is required" }, { status: 400 });
    }

    // Parse request body
    let body: CalendarConnectedBody;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body.provider || !["google", "microsoft"].includes(body.provider)) {
      return Response.json({ error: "Valid provider (google or microsoft) is required" }, { status: 400 });
    }

    // Find user by global slug
    const user = await getUserByGlobalSlug(userSlug);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's calendar connection status
    try {
      // Add provider to array if not already present
      const currentProviders = user.providers || [];
      const newProviders = currentProviders.includes(body.provider)
        ? currentProviders
        : [...currentProviders, body.provider];

      await updateUser(user.id, {
        calendarConnected: true,
        providers: newProviders,
      });

      console.log(`Calendar connected for user ${userSlug} via ${body.provider} (providers: ${newProviders.join(", ")})`);

      return Response.json({
        success: true,
        message: `Calendar connected via ${body.provider}`,
      });
    } catch (error) {
      console.error("Failed to update calendar status:", error);
      return Response.json({ error: "Failed to update calendar status" }, { status: 500 });
    }
  },
});
