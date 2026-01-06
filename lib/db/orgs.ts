/**
 * Organization Data Layer
 * CRUD operations for organizations (tenants)
 */

import { getKv } from "./kv.ts";
import type { OrgBookingSettings, SettingWithPermission } from "../settings/types.ts";
import { DEFAULT_ORG_BOOKING_SETTINGS } from "../settings/types.ts";

/**
 * Plan types for book.snivel
 * - solo-trial: 30-day trial of solo plan (1 user, minimal settings)
 * - solo: Paid solo plan ($6/mo or $5/mo annual, 1 user)
 * - team-trial: 30-day trial of team plan (up to 5 users, full features)
 * - team5/10/25/50/75/100/150: Paid team plans ($30-$450/mo)
 * - team150plus: Per-seat pricing for 150+ users ($3/user/mo)
 */
export type PlanType =
  | "solo-trial"
  | "solo"
  | "team-trial"
  | "team5"
  | "team10"
  | "team25"
  | "team50"
  | "team75"
  | "team100"
  | "team150"
  | "team150plus";

/**
 * Subscription status from Stripe
 */
export type SubscriptionStatus =
  | "trialing"      // In trial period (no payment yet)
  | "active"        // Paid and current
  | "past_due"      // Payment failed, in grace period
  | "canceled"      // User canceled
  | "unpaid";       // Payment failed, subscription paused

/**
 * Account status for lifecycle management
 */
export type AccountStatus =
  | "active"        // Full access
  | "frozen"        // Can log in, can't book, banner showing status
  | "soft_deleted"; // Org hidden, data preserved, recoverable

export interface Organization {
  id: string;
  slug: string;
  name: string;
  email: string;           // Primary contact/admin email
  domain?: string;         // Custom domain (future)
  plan: PlanType;
  maxSeats: number;        // Max users allowed (1 for solo, -1 for unlimited)
  currentSeats: number;    // Current active users in org
  settings: OrgSettings;
  createdAt: number;
  updatedAt: number;

  // Stripe billing fields
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPriceId?: string;
  billingInterval?: "month" | "year";
  currentPeriodEnd?: number;        // Unix timestamp (ms)
  cancelAtPeriodEnd?: boolean;      // True if scheduled to cancel

  // Account lifecycle fields
  accountStatus?: AccountStatus;    // Defaults to "active" if undefined
  trialEndsAt?: number;             // Unix timestamp (ms) - 30 days from creation
  frozenAt?: number;                // When account was frozen
  softDeletedAt?: number;           // When soft delete started
  paymentFailedAt?: number;         // When payment first failed
}

/**
 * Check if a plan is a solo plan (single user, simplified UX)
 */
export function isSoloPlan(plan: PlanType): boolean {
  return plan === "solo" || plan === "solo-trial";
}

/**
 * Check if a plan is a trial (not yet paying)
 */
export function isTrialPlan(plan: PlanType): boolean {
  return plan === "solo-trial" || plan === "team-trial";
}

/**
 * Get the max seats for a plan type
 */
export function getMaxSeatsForPlan(plan: PlanType): number {
  switch (plan) {
    case "solo-trial":
    case "solo":
      return 1;
    case "team-trial":
      return 5; // Team trial allows up to 5 users
    case "team5":
      return 5;
    case "team10":
      return 10;
    case "team25":
      return 25;
    case "team50":
      return 50;
    case "team75":
      return 75;
    case "team100":
      return 100;
    case "team150":
      return 150;
    case "team150plus":
      return -1; // Unlimited (per-seat pricing, 151 minimum)
    default:
      return 1;
  }
}

// Re-export for convenience
export type { OrgBookingSettings, SettingWithPermission };

/**
 * OrgSettings uses the new permission-controlled structure
 * Each booking setting has { value, userCanOverride }
 */
export type OrgSettings = OrgBookingSettings;

/**
 * Legacy OrgSettings format (for migration)
 */
interface LegacyOrgSettings {
  timezone: string;
  allowPublicBooking: boolean;
  brandColor?: string;
  logoUrl?: string;
  availableDays: number[];
  availableHoursStart: string;
  availableHoursEnd: string;
  meetingDurations: number[];
  bufferMinutes: number;
}

/**
 * Check if settings are in legacy format (flat values instead of SettingWithPermission)
 */
function isLegacySettings(settings: unknown): settings is LegacyOrgSettings {
  if (!settings || typeof settings !== "object") return false;
  const s = settings as Record<string, unknown>;
  // Legacy format has timezone as string, new format has timezone as object
  return typeof s.timezone === "string";
}

/**
 * Migrate legacy settings to new format
 * Converts flat values to SettingWithPermission with userCanOverride defaults
 */
export function migrateOrgSettings(settings: LegacyOrgSettings | OrgSettings): OrgSettings {
  if (!isLegacySettings(settings)) {
    // Already in new format
    return settings;
  }

  // Preserve fields that exist but aren't part of the legacy type
  const anySettings = settings as unknown as Record<string, unknown>;

  // Convert legacy flat settings to new permission-controlled format
  return {
    brandColor: settings.brandColor,
    logoUrl: settings.logoUrl,
    logoDisplayMode: anySettings.logoDisplayMode as "logoOnly" | "logoWithName" | "nameOnly" | undefined,
    allowPublicBooking: settings.allowPublicBooking,

    // Availability - default to user can override
    timezone: { value: settings.timezone, userCanOverride: true },
    availableDays: { value: settings.availableDays, userCanOverride: true },
    availableHoursStart: { value: settings.availableHoursStart, userCanOverride: true },
    availableHoursEnd: { value: settings.availableHoursEnd, userCanOverride: true },
    meetingDurations: { value: settings.meetingDurations, userCanOverride: false },
    bufferMinutes: { value: settings.bufferMinutes, userCanOverride: false },

    // Booking policies - default to locked (org-controlled)
    minimumNoticeHours: { value: 0, userCanOverride: false },
    maximumAdvanceDays: { value: 60, userCanOverride: false },
    dailyBookingLimit: { value: 0, userCanOverride: false },
    weeklyBookingLimit: { value: 0, userCanOverride: false },
    calendarInviteMode: { value: "all", userCanOverride: false },
    sendReminders: { value: true, userCanOverride: false },
    reminderTimes: { value: [1440, 60], userCanOverride: false },

    // Preserve intake config and policies (org-only fields)
    intakeConfig: anySettings.intakeConfig as OrgBookingSettings["intakeConfig"],
    policies: anySettings.policies as OrgBookingSettings["policies"],
  };
}

const DEFAULT_SETTINGS: OrgSettings = DEFAULT_ORG_BOOKING_SETTINGS;

/**
 * Create a new organization
 */
export async function createOrganization(data: {
  name: string;
  email: string;
  slug?: string;
  plan?: "solo-trial" | "team-trial";
}): Promise<Organization> {
  const kv = await getKv();
  const id = crypto.randomUUID();
  const slug = data.slug || generateSlug(data.name);
  const now = Date.now();
  const plan = data.plan || "solo-trial";

  // Check if slug already exists
  const existingBySlug = await getOrganizationBySlug(slug);
  if (existingBySlug) {
    throw new Error(`Organization with slug "${slug}" already exists`);
  }

  // Create settings - for solo plans, all settings are user-customizable
  let settings: OrgSettings = { ...DEFAULT_SETTINGS };
  if (isSoloPlan(plan)) {
    // Solo plans: force all userCanOverride to true (managed at user level)
    settings = {
      ...settings,
      timezone: { ...settings.timezone, userCanOverride: true },
      availableDays: { ...settings.availableDays, userCanOverride: true },
      availableHoursStart: { ...settings.availableHoursStart, userCanOverride: true },
      availableHoursEnd: { ...settings.availableHoursEnd, userCanOverride: true },
      meetingDurations: { ...settings.meetingDurations, userCanOverride: true },
      bufferMinutes: { ...settings.bufferMinutes, userCanOverride: true },
      minimumNoticeHours: { ...settings.minimumNoticeHours, userCanOverride: true },
      maximumAdvanceDays: { ...settings.maximumAdvanceDays, userCanOverride: true },
      dailyBookingLimit: { ...settings.dailyBookingLimit, userCanOverride: true },
      weeklyBookingLimit: { ...settings.weeklyBookingLimit, userCanOverride: true },
      calendarInviteMode: { ...settings.calendarInviteMode, userCanOverride: true },
      sendReminders: { ...settings.sendReminders, userCanOverride: true },
      reminderTimes: { ...settings.reminderTimes, userCanOverride: true },
    };
  }

  // Calculate trial end date (30 days from now) for trial plans
  const trialEndsAt = isTrialPlan(plan) ? now + (30 * 24 * 60 * 60 * 1000) : undefined;

  const org: Organization = {
    id,
    slug,
    name: data.name,
    email: data.email,
    plan,
    maxSeats: getMaxSeatsForPlan(plan),
    currentSeats: 1,        // Creator is the first seat
    settings,
    createdAt: now,
    updatedAt: now,
    // Subscription fields (will be populated when they subscribe)
    subscriptionStatus: isTrialPlan(plan) ? "trialing" : undefined,
    // Lifecycle fields
    accountStatus: "active",
    trialEndsAt,
  };

  // Store by ID (primary)
  await kv.set(["orgs", "by_id", id], org);
  // Store slug -> ID index
  await kv.set(["orgs", "by_slug", slug], id);
  // Store email -> ID index
  await kv.set(["orgs", "by_email", data.email.toLowerCase()], id);

  return org;
}

/**
 * Get organization by ID
 * Auto-migrates legacy settings format and plan fields if needed
 */
export async function getOrganizationById(id: string): Promise<Organization | null> {
  const kv = await getKv();
  const entry = await kv.get<Organization>(["orgs", "by_id", id]);
  if (!entry.value) return null;

  const org = entry.value;
  let needsSave = false;

  // Auto-migrate legacy settings if needed
  if (isLegacySettings(org.settings)) {
    org.settings = migrateOrgSettings(org.settings);
    needsSave = true;
  }

  // Auto-migrate legacy plan types (free/pro/enterprise → solo)
  // Existing users become "solo" (active), NOT "trial"
  // Migrate legacy plan types
  // deno-lint-ignore no-explicit-any
  const legacyPlan = org.plan as any;
  if (legacyPlan === "free" || legacyPlan === "pro" || legacyPlan === "enterprise") {
    // Map legacy plans to solo - these are existing users, not trials
    org.plan = "solo";
    needsSave = true;
  } else if (legacyPlan === "trial") {
    // Old "trial" becomes "solo-trial" (default for backwards compat)
    org.plan = "solo-trial";
    needsSave = true;
  }

  // Add maxSeats/currentSeats if missing
  if (org.maxSeats === undefined) {
    org.maxSeats = getMaxSeatsForPlan(org.plan);
    needsSave = true;
  }
  if (org.currentSeats === undefined) {
    org.currentSeats = 1; // Default to 1 (at least the creator)
    needsSave = true;
  }

  // Save migrated org back to DB
  if (needsSave) {
    await kv.set(["orgs", "by_id", id], org);
  }

  return org;
}

/**
 * Get organization by slug
 */
export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["orgs", "by_slug", slug.toLowerCase()]);
  if (!idEntry.value) return null;
  return getOrganizationById(idEntry.value);
}

/**
 * Get organization by admin email
 */
export async function getOrganizationByEmail(email: string): Promise<Organization | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["orgs", "by_email", email.toLowerCase()]);
  if (!idEntry.value) return null;
  return getOrganizationById(idEntry.value);
}

/**
 * Update an organization
 */
export async function updateOrganization(
  id: string,
  updates: Partial<Omit<Organization, "id" | "createdAt">>
): Promise<Organization | null> {
  const kv = await getKv();
  const existing = await getOrganizationById(id);
  if (!existing) return null;

  const updated: Organization = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: Date.now(),
  };

  // Handle slug change
  if (updates.slug && updates.slug !== existing.slug) {
    const slugExists = await getOrganizationBySlug(updates.slug);
    if (slugExists) {
      throw new Error(`Organization with slug "${updates.slug}" already exists`);
    }
    await kv.delete(["orgs", "by_slug", existing.slug]);
    await kv.set(["orgs", "by_slug", updates.slug.toLowerCase()], id);
  }

  // Handle email change
  if (updates.email && updates.email !== existing.email) {
    await kv.delete(["orgs", "by_email", existing.email.toLowerCase()]);
    await kv.set(["orgs", "by_email", updates.email.toLowerCase()], id);
  }

  await kv.set(["orgs", "by_id", id], updated);
  return updated;
}

/**
 * Delete an organization
 */
export async function deleteOrganization(id: string): Promise<boolean> {
  const kv = await getKv();
  const existing = await getOrganizationById(id);
  if (!existing) return false;

  // Delete all indexes
  await kv.delete(["orgs", "by_id", id]);
  await kv.delete(["orgs", "by_slug", existing.slug]);
  await kv.delete(["orgs", "by_email", existing.email.toLowerCase()]);

  // TODO: Also delete all users in the org

  return true;
}

/**
 * List all organizations
 */
export async function listOrganizations(): Promise<Organization[]> {
  const kv = await getKv();
  const orgs: Organization[] = [];

  for await (const entry of kv.list<Organization>({ prefix: ["orgs", "by_id"] })) {
    orgs.push(entry.value);
  }

  return orgs.sort((a, b) => b.createdAt - a.createdAt);
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
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await getOrganizationBySlug(slug);
  return existing === null;
}

// =============================================================================
// Stripe Integration Functions
// =============================================================================

/**
 * Get organization by Stripe customer ID
 * Used for webhook processing
 */
export async function getOrganizationByStripeCustomer(customerId: string): Promise<Organization | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["orgs", "by_stripe_customer", customerId]);
  if (!idEntry.value) return null;
  return getOrganizationById(idEntry.value);
}

/**
 * Get organization by Stripe subscription ID
 * Used for webhook processing
 */
export async function getOrganizationBySubscription(subscriptionId: string): Promise<Organization | null> {
  const kv = await getKv();
  const idEntry = await kv.get<string>(["orgs", "by_subscription", subscriptionId]);
  if (!idEntry.value) return null;
  return getOrganizationById(idEntry.value);
}

/**
 * Update organization with Stripe customer info
 * Creates indexes for fast webhook lookups
 */
export async function setStripeCustomer(
  orgId: string,
  stripeCustomerId: string
): Promise<void> {
  const kv = await getKv();
  const org = await getOrganizationById(orgId);
  if (!org) throw new Error("Organization not found");

  // Update org with customer ID
  await updateOrganization(orgId, { stripeCustomerId });

  // Create index for webhook lookups
  await kv.set(["orgs", "by_stripe_customer", stripeCustomerId], orgId);
}

/**
 * Update organization with subscription info
 * Creates indexes for fast webhook lookups
 */
export async function setSubscription(
  orgId: string,
  subscriptionId: string,
  updates: Partial<Pick<Organization,
    | "subscriptionStatus"
    | "subscriptionPriceId"
    | "billingInterval"
    | "currentPeriodEnd"
    | "cancelAtPeriodEnd"
    | "plan"
    | "maxSeats"
  >>
): Promise<void> {
  const kv = await getKv();
  const org = await getOrganizationById(orgId);
  if (!org) throw new Error("Organization not found");

  // Update org with subscription info
  await updateOrganization(orgId, {
    subscriptionId,
    ...updates,
  });

  // Create index for webhook lookups
  await kv.set(["orgs", "by_subscription", subscriptionId], orgId);
}

// =============================================================================
// Account Lifecycle Functions
// =============================================================================

/**
 * Freeze an organization (trial expired or payment failed)
 * Users can log in but can't book meetings
 */
export async function freezeOrganization(orgId: string): Promise<void> {
  await updateOrganization(orgId, {
    accountStatus: "frozen",
    frozenAt: Date.now(),
  });
}

/**
 * Soft delete an organization
 * Data preserved but org hidden, recoverable with CC
 */
export async function softDeleteOrganization(orgId: string): Promise<void> {
  await updateOrganization(orgId, {
    accountStatus: "soft_deleted",
    softDeletedAt: Date.now(),
  });
}

/**
 * Reactivate a frozen or soft-deleted organization
 * Called when payment is successful or user resubscribes
 */
export async function reactivateOrganization(orgId: string): Promise<void> {
  await updateOrganization(orgId, {
    accountStatus: "active",
    frozenAt: undefined,
    softDeletedAt: undefined,
    paymentFailedAt: undefined,
  });
}

/**
 * Track payment failure for lifecycle management
 */
export async function trackPaymentFailure(orgId: string): Promise<void> {
  const org = await getOrganizationById(orgId);
  if (!org) return;

  // Only set paymentFailedAt if not already set (track first failure)
  if (!org.paymentFailedAt) {
    await updateOrganization(orgId, {
      subscriptionStatus: "past_due",
      paymentFailedAt: Date.now(),
    });
  }
}

/**
 * Clear payment failure when payment succeeds
 */
export async function clearPaymentFailure(orgId: string): Promise<void> {
  await updateOrganization(orgId, {
    paymentFailedAt: undefined,
  });
}

/**
 * Get organizations that need lifecycle actions (for cron job)
 * Returns orgs with expired trials or payment failures
 */
export async function getOrgsNeedingLifecycleAction(): Promise<Organization[]> {
  const orgs = await listOrganizations();
  const now = Date.now();

  return orgs.filter(org => {
    // Skip already hard-deleted (shouldn't exist but safety check)
    if (!org.id) return false;

    // Trial expired but not yet frozen
    if (org.subscriptionStatus === "trialing" && org.trialEndsAt && org.trialEndsAt < now) {
      return true;
    }

    // Payment failed
    if (org.subscriptionStatus === "past_due" || org.paymentFailedAt) {
      return true;
    }

    // Frozen or soft-deleted (for escalation checks)
    if (org.accountStatus === "frozen" || org.accountStatus === "soft_deleted") {
      return true;
    }

    return false;
  });
}
