/**
 * User Data Layer
 * CRUD operations for users (scoped to organizations)
 */

import { getKv } from "./kv.ts";
import type { UserOverrides, EffectiveSettings, OrgBookingSettings } from "../settings/types.ts";
import { resolveEffectiveSettings, getOverridableFields } from "../settings/resolver.ts";

export interface User {
  id: string;
  orgId: string;           // Primary organization this user belongs to
  slug: string;            // URL slug (globally unique for booking URLs)
  email: string;
  name: string;
  role: "admin" | "member";
  isActive: boolean;

  // Multi-org support
  defaultOrgSlug?: string; // Default org for /[user] redirect (first org if not set)

  // Calendar integration
  providers: ("google" | "microsoft")[];
  calendarConnected: boolean;

  // User's setting overrides (only stores values where user has customized)
  // Use resolveEffectiveSettings() to get actual settings with org defaults
  settings: UserSettings;

  createdAt: number;
  updatedAt: number;
}

// Re-export for convenience
export type { UserOverrides, EffectiveSettings };

/**
 * UserSettings now stores OVERRIDES only
 * Full effective settings are resolved at runtime from org + user overrides
 */
export type UserSettings = UserOverrides;

/**
 * Legacy UserSettings format (for migration)
 */
interface LegacyUserSettings {
  timezone: string;
  availableDays: number[];
  availableHoursStart: string;
  availableHoursEnd: string;
  meetingDurations: number[];
  bufferMinutes: number;
  bio?: string;
  avatarUrl?: string;
  minimumNoticeHours?: number;
  maximumAdvanceDays?: number;
  dailyBookingLimit?: number;
  weeklyBookingLimit?: number;
  calendarInviteMode?: "all" | "none" | "externalOnly";
}

/**
 * Check if settings are in legacy format
 * Legacy format has meetingDurations as number[] like [30, 60, 90]
 * New format has meetingDurations as DurationOption[] like [{minutes: 30}, ...]
 *
 * This is the KEY difference - if meetingDurations contains objects with 'minutes', it's new format
 */
function isLegacyUserSettings(settings: unknown): settings is LegacyUserSettings {
  if (!settings || typeof settings !== "object") return false;
  const s = settings as Record<string, unknown>;

  // If no meetingDurations, not legacy (new overrides might not have it)
  if (!Array.isArray(s.meetingDurations) || s.meetingDurations.length === 0) {
    return false;
  }

  // Check the format of meetingDurations
  // Legacy: [30, 60, 90] - array of numbers
  // New: [{minutes: 30}, {minutes: 60}] - array of objects
  const firstDuration = s.meetingDurations[0];

  // If first element is a number, it's legacy format
  // If first element is an object with 'minutes', it's new format
  if (typeof firstDuration === "number") {
    // It's legacy number[] format - check if it has the other required fields too
    const hasLegacyTimezone = typeof s.timezone === "string" && s.timezone !== "";
    const hasLegacyDays = Array.isArray(s.availableDays) && s.availableDays.length > 0;
    return hasLegacyTimezone && hasLegacyDays;
  }

  // It's new DurationOption[] format, not legacy
  return false;
}

/**
 * Migrate legacy user settings to new overrides format
 * Clears all values - user starts fresh inheriting from org
 * Preserves bio and avatarUrl since those are always user-owned
 */
export function migrateUserSettings(settings: LegacyUserSettings | UserSettings): UserSettings {
  if (!isLegacyUserSettings(settings)) {
    return settings;
  }

  // Start fresh - only keep profile fields
  return {
    bio: settings.bio,
    avatarUrl: settings.avatarUrl,
  };
}

/**
 * Helper: Get effective settings for a user
 * Resolves org settings + user overrides into final values
 */
export async function getEffectiveUserSettings(
  user: User,
  orgSettings: OrgBookingSettings
): Promise<EffectiveSettings> {
  return resolveEffectiveSettings(orgSettings, user.settings);
}

/**
 * Helper: Get which settings this user CAN override
 */
export function getUserOverridableFields(orgSettings: OrgBookingSettings): string[] {
  return getOverridableFields(orgSettings);
}

/**
 * Create a new user in an organization
 * Settings are resolved dynamically from org - no copying
 */
export async function createUser(data: {
  orgId: string;
  email: string;
  name: string;
  slug?: string;
  role?: "admin" | "member";
}): Promise<User> {
  const kv = await getKv();
  const id = crypto.randomUUID();
  const slug = data.slug || generateSlug(data.name);
  const now = Date.now();

  // Check if slug already exists globally (slugs must be unique for booking URLs)
  const existingByGlobalSlug = await getUserByGlobalSlug(slug);
  if (existingByGlobalSlug) {
    throw new Error(`User with slug "${slug}" already exists`);
  }

  // Check if slug already exists in this org
  const existingBySlug = await getUserBySlug(data.orgId, slug);
  if (existingBySlug) {
    throw new Error(`User with slug "${slug}" already exists in this organization`);
  }

  // Check if email already exists in this org
  const existingByEmail = await getUserByEmail(data.orgId, data.email);
  if (existingByEmail) {
    throw new Error(`User with email "${data.email}" already exists in this organization`);
  }

  // New users start with empty overrides - they inherit everything from org
  const userSettings: UserSettings = {};

  const user: User = {
    id,
    orgId: data.orgId,
    slug,
    email: data.email,
    name: data.name,
    role: data.role || "member",
    isActive: true,
    providers: [],
    calendarConnected: false,
    settings: userSettings,
    createdAt: now,
    updatedAt: now,
  };

  // Store by ID (primary)
  await kv.set(["users", "by_id", id], user);
  // Store org+slug -> ID index
  await kv.set(["users", "by_org_slug", data.orgId, slug], id);
  // Store org+email -> ID index
  await kv.set(["users", "by_org_email", data.orgId, data.email.toLowerCase()], id);
  // Store global email -> ID index (for login lookup)
  await kv.set(["users", "by_email", data.email.toLowerCase()], id);
  // Store global slug -> ID index (for book.snivel.app URLs)
  await kv.set(["users", "by_global_slug", slug.toLowerCase()], id);

  return user;
}

/**
 * Get user by ID
 * Auto-migrates legacy settings format if needed
 */
export async function getUserById(id: string): Promise<User | null> {
  const kv = await getKv();
  const entry = await kv.get<User>(["users", "by_id", id]);
  if (!entry.value) return null;

  const user = entry.value;

  // Auto-migrate legacy settings if needed
  if (isLegacyUserSettings(user.settings)) {
    user.settings = migrateUserSettings(user.settings);
    // Save migrated settings back to DB
    await kv.set(["users", "by_id", id], user);
  }

  return user;
}

/**
 * Get user by slug within an organization
 */
export async function getUserBySlug(orgId: string, slug: string): Promise<User | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["users", "by_org_slug", orgId, slug.toLowerCase()]);
  if (!idEntry.value) return null;
  return getUserById(idEntry.value);
}

/**
 * Get user by email within an organization
 */
export async function getUserByEmail(orgId: string, email: string): Promise<User | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["users", "by_org_email", orgId, email.toLowerCase()]);
  if (!idEntry.value) return null;
  return getUserById(idEntry.value);
}

/**
 * Get user by email globally (for login)
 */
export async function getUserByEmailGlobal(email: string): Promise<User | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["users", "by_email", email.toLowerCase()]);
  if (!idEntry.value) return null;
  return getUserById(idEntry.value);
}

/**
 * Update a user
 */
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "orgId" | "createdAt">>
): Promise<User | null> {
  const kv = await getKv();
  const existing = await getUserById(id);
  if (!existing) return null;

  const updated: User = {
    ...existing,
    ...updates,
    id: existing.id,
    orgId: existing.orgId,
    createdAt: existing.createdAt,
    updatedAt: Date.now(),
  };

  // Handle slug change
  if (updates.slug && updates.slug !== existing.slug) {
    const slugExists = await getUserBySlug(existing.orgId, updates.slug);
    if (slugExists) {
      throw new Error(`User with slug "${updates.slug}" already exists in this organization`);
    }
    await kv.delete(["users", "by_org_slug", existing.orgId, existing.slug]);
    await kv.set(["users", "by_org_slug", existing.orgId, updates.slug.toLowerCase()], id);
  }

  // Handle email change
  if (updates.email && updates.email !== existing.email) {
    const emailExists = await getUserByEmail(existing.orgId, updates.email);
    if (emailExists) {
      throw new Error(`User with email "${updates.email}" already exists in this organization`);
    }
    await kv.delete(["users", "by_org_email", existing.orgId, existing.email.toLowerCase()]);
    await kv.delete(["users", "by_email", existing.email.toLowerCase()]);
    await kv.set(["users", "by_org_email", existing.orgId, updates.email.toLowerCase()], id);
    await kv.set(["users", "by_email", updates.email.toLowerCase()], id);
  }

  await kv.set(["users", "by_id", id], updated);
  return updated;
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  const kv = await getKv();
  const existing = await getUserById(id);
  if (!existing) return false;

  // Delete all indexes
  await kv.delete(["users", "by_id", id]);
  await kv.delete(["users", "by_org_slug", existing.orgId, existing.slug]);
  await kv.delete(["users", "by_org_email", existing.orgId, existing.email.toLowerCase()]);
  await kv.delete(["users", "by_email", existing.email.toLowerCase()]);
  await kv.delete(["users", "by_global_slug", existing.slug.toLowerCase()]);

  return true;
}

/**
 * List all users in an organization
 */
export async function listUsersByOrg(orgId: string): Promise<User[]> {
  const kv = await getKv();
  const users: User[] = [];

  // Get all user IDs for this org via the slug index
  for await (const entry of kv.list<string>({ prefix: ["users", "by_org_slug", orgId] })) {
    const user = await getUserById(entry.value);
    if (user) users.push(user);
  }

  return users.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * List active, bookable users in an organization
 */
export async function listBookableUsers(orgId: string): Promise<User[]> {
  const users = await listUsersByOrg(orgId);
  return users.filter(u => u.isActive && u.calendarConnected);
}

/**
 * Generate a URL-safe slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);
}

/**
 * Check if a slug is available in an org
 */
export async function isSlugAvailable(orgId: string, slug: string): Promise<boolean> {
  const existing = await getUserBySlug(orgId, slug);
  return existing === null;
}

// ============================================================
// Functions for book.snivel.app (user-first booking URLs)
// ============================================================

/**
 * Get user by their global slug (for book.snivel.app/[user])
 */
export async function getUserByGlobalSlug(slug: string): Promise<User | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["users", "by_global_slug", slug.toLowerCase()]);
  if (!idEntry.value) return null;
  return getUserById(idEntry.value);
}

/**
 * List all organizations a user belongs to
 * For now, returns just their primary org (multi-org support later)
 */
export async function listUserOrgs(userId: string): Promise<Array<{
  id: string;
  slug: string;
  name: string;
  settings: { brandColor?: string; logoUrl?: string };
}>> {
  const user = await getUserById(userId);
  if (!user) return [];

  // Import dynamically to avoid circular dependency
  const { getOrganizationById } = await import("./orgs.ts");
  const org = await getOrganizationById(user.orgId);

  if (!org) return [];

  return [{
    id: org.id,
    slug: org.slug,
    name: org.name,
    settings: {
      brandColor: org.settings.brandColor,
      logoUrl: org.settings.logoUrl,
    },
  }];
}

/**
 * Check if a user is a member of a specific org
 */
export async function isUserInOrg(userId: string, orgId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;

  // For now, just check their primary org
  // Multi-org support will add a separate org_memberships table
  return user.orgId === orgId;
}

/**
 * Check if a global slug is available
 */
export async function isGlobalSlugAvailable(slug: string): Promise<boolean> {
  const existing = await getUserByGlobalSlug(slug);
  return existing === null;
}
