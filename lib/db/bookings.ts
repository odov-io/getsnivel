/**
 * Bookings Data Layer
 * CRUD operations for meeting bookings
 * Shared KV - same code works in both snivel-book and getsnivel
 */

import { getKv } from "./kv.ts";

export interface Booking {
  id: string;
  secretToken: string;              // For guest management links

  // Host
  hostUserId: string;
  hostUserSlug: string;
  orgId: string;
  orgSlug: string;

  // Booker
  bookerName: string;
  bookerEmail: string;
  bookerTimezone: string;
  bookerNotes?: string;
  additionalAttendees?: string[];
  customAnswers?: Record<string, string>;

  // Schedule
  startTime: number;                // Unix timestamp
  endTime: number;                  // Unix timestamp
  durationMinutes: number;

  // Calendar
  calendarProvider: "google" | "microsoft";
  calendarEventId?: string;
  meetingLink?: string;

  // Consent
  recordingConsent?: boolean;

  // Status
  status: "pending" | "confirmed" | "cancelled" | "rescheduled";
  cancelledAt?: number;
  cancelledBy?: "host" | "booker";
  rescheduledToId?: string;

  // Emails
  confirmationSentAt?: number;
  reminder24hSentAt?: number;
  reminder1hSentAt?: number;

  createdAt: number;
  updatedAt: number;
}

/**
 * Create a new booking
 */
export async function createBooking(data: {
  hostUserId: string;
  hostUserSlug: string;
  orgId: string;
  orgSlug: string;
  bookerName: string;
  bookerEmail: string;
  bookerTimezone: string;
  bookerNotes?: string;
  additionalAttendees?: string[];
  customAnswers?: Record<string, string>;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  calendarProvider: "google" | "microsoft";
  calendarEventId?: string;
  meetingLink?: string;
  recordingConsent?: boolean;
  status?: "pending" | "confirmed";
}): Promise<Booking> {
  const kv = await getKv();
  const id = crypto.randomUUID();
  const secretToken = generateSecretToken();
  const now = Date.now();

  const booking: Booking = {
    id,
    secretToken,
    hostUserId: data.hostUserId,
    hostUserSlug: data.hostUserSlug,
    orgId: data.orgId,
    orgSlug: data.orgSlug,
    bookerName: data.bookerName,
    bookerEmail: data.bookerEmail,
    bookerTimezone: data.bookerTimezone,
    bookerNotes: data.bookerNotes,
    additionalAttendees: data.additionalAttendees,
    customAnswers: data.customAnswers,
    startTime: data.startTime,
    endTime: data.endTime,
    durationMinutes: data.durationMinutes,
    calendarProvider: data.calendarProvider,
    calendarEventId: data.calendarEventId,
    meetingLink: data.meetingLink,
    recordingConsent: data.recordingConsent,
    status: data.status || "confirmed",
    createdAt: now,
    updatedAt: now,
  };

  // Store by ID (primary)
  await kv.set(["bookings", "by_id", id], booking);
  // Index by secret token (for guest management)
  await kv.set(["bookings", "by_token", secretToken], id);
  // Index by host user slug (for user's bookings)
  await kv.set(["bookings", "by_host", data.hostUserSlug, id], id);
  // Index by org (for admin dashboard)
  await kv.set(["bookings", "by_org", data.orgId, id], id);
  // Index by booker email (for booker's history)
  await kv.set(["bookings", "by_booker_email", data.bookerEmail.toLowerCase(), id], id);
  // Index by date (for availability checks) - key is YYYY-MM-DD
  const dateKey = new Date(data.startTime).toISOString().split("T")[0];
  await kv.set(["bookings", "by_host_date", data.hostUserSlug, dateKey, id], id);

  return booking;
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const kv = await getKv();
  const entry = await kv.get<Booking>(["bookings", "by_id", id]);
  return entry.value;
}

/**
 * Get booking by secret token (for guest management links)
 */
export async function getBookingByToken(token: string): Promise<Booking | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["bookings", "by_token", token]);
  if (!idEntry.value) return null;
  return getBookingById(idEntry.value);
}

/**
 * List bookings for a host user
 */
export async function listBookingsByHost(
  hostUserSlug: string,
  options?: { status?: Booking["status"]; upcoming?: boolean }
): Promise<Booking[]> {
  const kv = await getKv();
  const bookings: Booking[] = [];
  const now = Date.now();

  for await (const entry of kv.list<string>({ prefix: ["bookings", "by_host", hostUserSlug] })) {
    const booking = await getBookingById(entry.value);
    if (!booking) continue;

    // Filter by status if specified
    if (options?.status && booking.status !== options.status) continue;
    // Filter to upcoming only if specified
    if (options?.upcoming && booking.startTime < now) continue;

    bookings.push(booking);
  }

  // Sort by start time
  return bookings.sort((a, b) => a.startTime - b.startTime);
}

/**
 * List bookings for an organization (admin view)
 */
export async function listBookingsByOrg(
  orgId: string,
  options?: { status?: Booking["status"]; upcoming?: boolean; past?: boolean }
): Promise<Booking[]> {
  const kv = await getKv();
  const bookings: Booking[] = [];
  const now = Date.now();

  for await (const entry of kv.list<string>({ prefix: ["bookings", "by_org", orgId] })) {
    const booking = await getBookingById(entry.value);
    if (!booking) continue;

    // Filter by status if specified
    if (options?.status && booking.status !== options.status) continue;
    // Filter to upcoming only if specified
    if (options?.upcoming && booking.startTime < now) continue;
    // Filter to past only if specified
    if (options?.past && booking.startTime >= now) continue;

    bookings.push(booking);
  }

  // Sort by start time (newest first for past, soonest first for upcoming)
  if (options?.past) {
    return bookings.sort((a, b) => b.startTime - a.startTime);
  }
  return bookings.sort((a, b) => a.startTime - b.startTime);
}

/**
 * List bookings for a host on a specific date (for availability checking)
 */
export async function listBookingsByHostDate(
  hostUserSlug: string,
  date: string // YYYY-MM-DD
): Promise<Booking[]> {
  const kv = await getKv();
  const bookings: Booking[] = [];

  for await (const entry of kv.list<string>({ prefix: ["bookings", "by_host_date", hostUserSlug, date] })) {
    const booking = await getBookingById(entry.value);
    if (booking && booking.status !== "cancelled") {
      bookings.push(booking);
    }
  }

  return bookings.sort((a, b) => a.startTime - b.startTime);
}

/**
 * Update a booking
 */
export async function updateBooking(
  id: string,
  updates: Partial<Omit<Booking, "id" | "secretToken" | "createdAt">>
): Promise<Booking | null> {
  const kv = await getKv();
  const existing = await getBookingById(id);
  if (!existing) return null;

  const updated: Booking = {
    ...existing,
    ...updates,
    id: existing.id,
    secretToken: existing.secretToken,
    createdAt: existing.createdAt,
    updatedAt: Date.now(),
  };

  await kv.set(["bookings", "by_id", id], updated);

  // Update date index if time changed
  if (updates.startTime && updates.startTime !== existing.startTime) {
    const oldDateKey = new Date(existing.startTime).toISOString().split("T")[0];
    const newDateKey = new Date(updates.startTime).toISOString().split("T")[0];
    if (oldDateKey !== newDateKey) {
      await kv.delete(["bookings", "by_host_date", existing.hostUserSlug, oldDateKey, id]);
      await kv.set(["bookings", "by_host_date", existing.hostUserSlug, newDateKey, id], id);
    }
  }

  return updated;
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  id: string,
  cancelledBy: "host" | "booker"
): Promise<Booking | null> {
  return updateBooking(id, {
    status: "cancelled",
    cancelledAt: Date.now(),
    cancelledBy,
  });
}

/**
 * Mark booking as rescheduled (pointing to new booking)
 */
export async function markBookingRescheduled(
  id: string,
  newBookingId: string
): Promise<Booking | null> {
  return updateBooking(id, {
    status: "rescheduled",
    rescheduledToId: newBookingId,
  });
}

/**
 * Update email tracking fields
 */
export async function updateBookingEmailStatus(
  id: string,
  field: "confirmationSentAt" | "reminder24hSentAt" | "reminder1hSentAt"
): Promise<Booking | null> {
  return updateBooking(id, {
    [field]: Date.now(),
  });
}

/**
 * Check if a time slot conflicts with existing bookings
 * Returns true if there IS a conflict
 */
export async function hasBookingConflict(
  hostUserSlug: string,
  startTime: number,
  endTime: number,
  excludeBookingId?: string
): Promise<boolean> {
  const date = new Date(startTime).toISOString().split("T")[0];
  const bookings = await listBookingsByHostDate(hostUserSlug, date);

  for (const booking of bookings) {
    // Skip the booking we're checking against (for reschedule)
    if (excludeBookingId && booking.id === excludeBookingId) continue;
    // Skip cancelled bookings
    if (booking.status === "cancelled") continue;

    // Check for overlap
    if (startTime < booking.endTime && endTime > booking.startTime) {
      return true;
    }
  }

  return false;
}

/**
 * Delete a booking (for cleanup/testing only)
 */
export async function deleteBooking(id: string): Promise<boolean> {
  const kv = await getKv();
  const existing = await getBookingById(id);
  if (!existing) return false;

  const dateKey = new Date(existing.startTime).toISOString().split("T")[0];

  await kv.delete(["bookings", "by_id", id]);
  await kv.delete(["bookings", "by_token", existing.secretToken]);
  await kv.delete(["bookings", "by_host", existing.hostUserSlug, id]);
  await kv.delete(["bookings", "by_org", existing.orgId, id]);
  await kv.delete(["bookings", "by_booker_email", existing.bookerEmail.toLowerCase(), id]);
  await kv.delete(["bookings", "by_host_date", existing.hostUserSlug, dateKey, id]);

  return true;
}

/**
 * Get confirmed bookings for a user within a time range
 * Used for checking daily/weekly booking limits
 */
export async function getBookingsByUserInRange(
  hostUserSlug: string,
  rangeStart: number,
  rangeEnd: number
): Promise<Booking[]> {
  const bookings = await listBookingsByHost(hostUserSlug, { status: "confirmed" });
  return bookings.filter(b => b.startTime >= rangeStart && b.startTime < rangeEnd);
}

/**
 * Count confirmed bookings for a user on a specific day
 */
export async function countBookingsForDay(
  hostUserSlug: string,
  date: Date
): Promise<number> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const bookings = await getBookingsByUserInRange(
    hostUserSlug,
    dayStart.getTime(),
    dayEnd.getTime()
  );
  return bookings.length;
}

/**
 * Count confirmed bookings for a user in the current week (Sunday to Saturday)
 */
export async function countBookingsForWeek(
  hostUserSlug: string,
  referenceDate: Date
): Promise<number> {
  const weekStart = new Date(referenceDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Go to Sunday
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const bookings = await getBookingsByUserInRange(
    hostUserSlug,
    weekStart.getTime(),
    weekEnd.getTime()
  );
  return bookings.length;
}

/**
 * Generate a secure token for guest management links
 */
function generateSecretToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
