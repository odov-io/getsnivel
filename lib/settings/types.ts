/**
 * Shared Settings Types
 * Used by both getsnivel (admin) and snivel-book (booking)
 */

// Re-export plan types from orgs module for convenience
export type { PlanType } from "../db/orgs.ts";
export { isSoloPlan, isTrialPlan, getMaxSeatsForPlan } from "../db/orgs.ts";

/**
 * A setting with permission control
 * Org admin sets the value and whether users can override it
 */
export interface SettingWithPermission<T> {
  value: T;
  userCanOverride: boolean;
}

/**
 * Custom field for a specific duration
 * e.g., additional questions only asked for 90-minute consultations
 */
export interface DurationCustomField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: string[]; // For select type
}

/**
 * Duration option with optional settings
 * Each duration can have its own memo, approval requirements, and custom fields
 */
export interface DurationOption {
  minutes: number;
  note?: string;                          // Display text on booking page
  requireApproval?: boolean;              // Host must approve before confirmed
  autoApproveAfterHours?: number;         // Auto-approve if no response (0 = never auto-approve)
  customFields?: DurationCustomField[];   // Additional fields for this duration only
  rate?: string;                          // Future: display rate/price info
}

/**
 * Available duration presets (in minutes)
 */
export const DURATION_PRESETS = [15, 30, 45, 60, 90, 120, 240, 480] as const;

/**
 * Human-readable duration labels
 * 90 min and under: show minutes (15 min, 30 min, 45 min, 60 min, 90 min)
 * Over 90 min: show hours (2hrs, 4hrs, 8hrs)
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 90) return `${minutes} min`;
  const hours = minutes / 60;
  if (Number.isInteger(hours)) return `${hours}hrs`;
  return `${minutes} min`;
}

/**
 * Standard intake field types (built-in fields)
 */
export type StandardIntakeField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "company"
  | "address"
  | "city"
  | "state"
  | "zip"
  | "country";

/**
 * Standard intake field configuration
 */
export interface StandardFieldConfig {
  field: StandardIntakeField;
  enabled: boolean;
  required: boolean;
}

/**
 * Custom intake question for booking form
 */
export interface CustomIntakeQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: string[]; // For select type
}

/**
 * Complete intake configuration
 */
export interface IntakeConfig {
  standardFields: StandardFieldConfig[];
  customQuestions: CustomIntakeQuestion[];
}

/**
 * Organization policy/disclosure
 */
export interface OrgPolicy {
  id: string;
  title: string;
  content: string;
  requireAcknowledgment: boolean;
  enabled: boolean;
}

/**
 * Org Settings with permission controls
 * Each booking-related setting can be locked or customizable by users
 */
export interface OrgBookingSettings {
  // Branding (org-only, never user-overridable)
  brandColor?: string;
  logoUrl?: string;
  logoDisplayMode?: "logoOnly" | "logoWithName" | "nameOnly";

  // Availability settings (with permission control)
  timezone: SettingWithPermission<string>;
  availableDays: SettingWithPermission<number[]>;
  availableHoursStart: SettingWithPermission<string>;
  availableHoursEnd: SettingWithPermission<string>;
  // meetingDurations can be number[] (legacy) or DurationOption[] (new)
  meetingDurations: SettingWithPermission<DurationOption[] | number[]>;
  bufferMinutes: SettingWithPermission<number>;

  // Booking policies (with permission control)
  minimumNoticeHours: SettingWithPermission<number>;
  maximumAdvanceDays: SettingWithPermission<number>;
  dailyBookingLimit: SettingWithPermission<number>;
  weeklyBookingLimit: SettingWithPermission<number>;
  calendarInviteMode: SettingWithPermission<"all" | "none" | "externalOnly">;

  // Reminder settings (with permission control)
  sendReminders: SettingWithPermission<boolean>;
  reminderTimes: SettingWithPermission<number[]>; // Minutes before meeting, e.g., [1440, 60] = 24h and 1h

  // Intake fields (org-only - never user-overridable)
  intakeConfig?: IntakeConfig;

  // Policies & Disclosures (org-only)
  policies?: OrgPolicy[];

  // Legacy fields - kept for backward compat
  intakeQuestions?: CustomIntakeQuestion[];
  consentText?: string;
  requireRecordingConsent?: boolean;

  // Legacy field - kept for backward compat during migration
  allowPublicBooking?: boolean;
}

/**
 * User Settings - simplified to only store OVERRIDES
 * Only fields where org allows override AND user has customized
 */
export interface UserOverrides {
  // Profile (always user-editable)
  bio?: string;
  avatarUrl?: string;

  // Overrides (only stored if user has customized AND org allows)
  timezone?: string;
  availableDays?: number[];
  availableHoursStart?: string;
  availableHoursEnd?: string;
  // meetingDurations can be number[] (legacy) or DurationOption[] (new)
  meetingDurations?: DurationOption[] | number[];
  bufferMinutes?: number;
  minimumNoticeHours?: number;
  maximumAdvanceDays?: number;
  dailyBookingLimit?: number;
  weeklyBookingLimit?: number;
  calendarInviteMode?: "all" | "none" | "externalOnly";
  sendReminders?: boolean;
  reminderTimes?: number[];
}

/**
 * Effective Settings - resolved at runtime
 * What the booking system actually uses
 * meetingDurations is always normalized to DurationOption[]
 */
export interface EffectiveSettings {
  timezone: string;
  availableDays: number[];
  availableHoursStart: string;
  availableHoursEnd: string;
  meetingDurations: DurationOption[];
  bufferMinutes: number;
  minimumNoticeHours: number;
  maximumAdvanceDays: number;
  dailyBookingLimit: number;
  weeklyBookingLimit: number;
  calendarInviteMode: "all" | "none" | "externalOnly";
  sendReminders: boolean;
  reminderTimes: number[];
  bio?: string;
  avatarUrl?: string;
  // Org-only fields included directly
  intakeConfig?: IntakeConfig;
  policies?: OrgPolicy[];
  // Legacy fields
  intakeQuestions?: CustomIntakeQuestion[];
  consentText?: string;
  requireRecordingConsent?: boolean;
}

/**
 * Settings that can potentially be overridden by users
 * (subject to org's userCanOverride flag)
 */
export const OVERRIDABLE_SETTING_KEYS = [
  "timezone",
  "availableDays",
  "availableHoursStart",
  "availableHoursEnd",
  "meetingDurations",
  "bufferMinutes",
  "minimumNoticeHours",
  "maximumAdvanceDays",
  "dailyBookingLimit",
  "weeklyBookingLimit",
  "calendarInviteMode",
  "sendReminders",
  "reminderTimes",
] as const;

export type OverridableSettingKey = typeof OVERRIDABLE_SETTING_KEYS[number];

/**
 * Default values for org settings
 */
export const DEFAULT_ORG_BOOKING_SETTINGS: OrgBookingSettings = {
  timezone: { value: "America/New_York", userCanOverride: true },
  availableDays: { value: [1, 2, 3, 4, 5], userCanOverride: true },
  availableHoursStart: { value: "09:00", userCanOverride: true },
  availableHoursEnd: { value: "17:00", userCanOverride: true },
  meetingDurations: { value: [{ minutes: 30 }], userCanOverride: false },
  bufferMinutes: { value: 0, userCanOverride: false },
  minimumNoticeHours: { value: 0, userCanOverride: false },
  maximumAdvanceDays: { value: 60, userCanOverride: false },
  dailyBookingLimit: { value: 0, userCanOverride: false },
  weeklyBookingLimit: { value: 0, userCanOverride: false },
  calendarInviteMode: { value: "all", userCanOverride: false },
  sendReminders: { value: true, userCanOverride: false },
  reminderTimes: { value: [1440, 60], userCanOverride: false }, // 24h and 1h before
};

/**
 * Normalize durations to DurationOption[] format
 * Handles legacy number[] and new DurationOption[] formats
 */
export function normalizeDurations(durations: DurationOption[] | number[] | undefined): DurationOption[] {
  if (!durations || durations.length === 0) {
    return [{ minutes: 30 }];
  }

  // Check if already in new format
  if (typeof durations[0] === "object" && "minutes" in durations[0]) {
    return durations as DurationOption[];
  }

  // Convert legacy number[] to DurationOption[]
  return (durations as number[]).map(minutes => ({ minutes }));
}

/**
 * Standard field labels and defaults
 */
export const STANDARD_FIELD_LABELS: Record<StandardIntakeField, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone Number",
  company: "Company",
  address: "Street Address",
  city: "City",
  state: "State/Province",
  zip: "ZIP/Postal Code",
  country: "Country",
};

/**
 * Default intake configuration
 * Email always enabled & required (needed for booking)
 */
export const DEFAULT_INTAKE_CONFIG: IntakeConfig = {
  standardFields: [
    { field: "firstName", enabled: true, required: true },
    { field: "lastName", enabled: true, required: true },
    { field: "email", enabled: true, required: true },
    { field: "phone", enabled: false, required: false },
    { field: "company", enabled: false, required: false },
    { field: "address", enabled: false, required: false },
    { field: "city", enabled: false, required: false },
    { field: "state", enabled: false, required: false },
    { field: "zip", enabled: false, required: false },
    { field: "country", enabled: false, required: false },
  ],
  customQuestions: [],
};

/**
 * Parsed label with optional group
 */
export interface ParsedLabel {
  group: string | null;
  label: string;
}

/**
 * Parse a label that may contain grouping syntax
 * Supports two formats:
 * - [Category]Label  -> group: "Category", label: "Label"
 * - Category||Label  -> group: "Category", label: "Label"
 * - Just a label     -> group: null, label: "Just a label"
 */
export function parseGroupedLabel(rawLabel: string): ParsedLabel {
  // Check [bracket] syntax: [Group]Label
  const bracketMatch = rawLabel.match(/^\[([^\]]+)\](.+)$/);
  if (bracketMatch) {
    return { group: bracketMatch[1].trim(), label: bracketMatch[2].trim() };
  }

  // Check || syntax: Group||Label
  const pipeMatch = rawLabel.match(/^(.+)\|\|(.+)$/);
  if (pipeMatch) {
    return { group: pipeMatch[1].trim(), label: pipeMatch[2].trim() };
  }

  // No grouping
  return { group: null, label: rawLabel };
}

/**
 * Group fields by their parsed group name
 * Returns a Map with group names as keys (null for ungrouped)
 * Preserves insertion order within groups
 */
export function groupFieldsByLabel<T extends { label: string }>(
  fields: T[]
): Map<string | null, T[]> {
  const groups = new Map<string | null, T[]>();

  for (const field of fields) {
    const { group } = parseGroupedLabel(field.label);
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(field);
  }

  return groups;
}
