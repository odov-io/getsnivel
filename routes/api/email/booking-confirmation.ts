/**
 * POST /api/email/booking-confirmation
 * Sends confirmation emails to both the booker and the host
 */

import { define } from "@/utils.ts";
import { sendEmail } from "@/lib/email/resend.ts";
import { bookingConfirmationEmail, newBookingNotificationEmail } from "@/lib/email/templates.ts";

interface BookingConfirmationRequest {
  bookingId: string;
  hostName: string;
  hostEmail: string;
  bookerName: string;
  bookerEmail: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  meetingLink?: string;
  manageUrl: string;
  orgName: string;
  notes?: string;
}

export const handler = define.handlers({
  async POST(ctx) {
    let body: BookingConfirmationRequest;
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      bookingId,
      hostName,
      hostEmail,
      bookerName,
      bookerEmail,
      startTime,
      endTime,
      durationMinutes,
      meetingLink,
      manageUrl,
      orgName,
      notes,
    } = body;

    // Format date and time for emails
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const dateStr = startDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const timeStr = `${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

    const durationStr = `${durationMinutes} min`;

    // Detect timezone from the system (or use a default)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      // Send confirmation to booker
      await sendEmail({
        to: bookerEmail,
        subject: `Booking Confirmed: Meeting with ${hostName}`,
        html: bookingConfirmationEmail({
          bookerName,
          hostName,
          orgName,
          date: dateStr,
          time: timeStr,
          duration: durationStr,
          timezone,
          meetingLink,
          manageUrl,
          notes,
        }),
        text: `Your meeting with ${hostName} at ${orgName} is confirmed.\n\n${dateStr}\n${timeStr} (${durationStr})\n\n${meetingLink ? `Join: ${meetingLink}\n\n` : ""}Manage booking: ${manageUrl}`,
      });

      // Send notification to host
      await sendEmail({
        to: hostEmail,
        subject: `New Booking: ${bookerName}`,
        html: newBookingNotificationEmail({
          hostName,
          bookerName,
          bookerEmail,
          orgName,
          date: dateStr,
          time: timeStr,
          duration: durationStr,
          timezone,
          meetingLink,
          notes,
        }),
        text: `You have a new booking from ${bookerName} (${bookerEmail}).\n\n${dateStr}\n${timeStr} (${durationStr})\n\n${meetingLink ? `Meeting link: ${meetingLink}\n\n` : ""}${notes ? `Notes: ${notes}` : ""}`,
      });

      console.log(`Sent booking confirmation emails for booking ${bookingId}`);

      return Response.json({ success: true });
    } catch (error) {
      console.error("Failed to send booking confirmation emails:", error);
      return Response.json(
        { error: "Failed to send confirmation emails" },
        { status: 500 }
      );
    }
  },
});
