/**
 * Settings Resolution Logic
 * Resolves effective settings from org settings + user overrides
 */

import type {
  OrgBookingSettings,
  UserOverrides,
  EffectiveSettings,
  SettingWithPermission,
  OverridableSettingKey,
  OVERRIDABLE_SETTING_KEYS,
  DurationOption,
  IntakeConfig,
  OrgPolicy,
  CustomIntakeQuestion,
} from "./types.ts";
import { normalizeDurations } from "./types.ts";

/**
 * Check if a setting is in the new SettingWithPermission format
 */
function isSettingWithPermission<T>(setting: unknown): setting is SettingWithPermission<T> {
  return (
    setting !== null &&
    typeof setting === "object" &&
    "value" in setting &&
    "userCanOverride" in setting
  );
}

/**
 * Resolve a single setting with permission check
 * Handles both old flat format and new { value, userCanOverride } format
 */
function resolveSetting<T>(
  orgSetting: SettingWithPermission<T> | T | undefined,
  userOverride: T | undefined,
  defaultValue: T
): T {
  // Handle missing org setting
  if (orgSetting === undefined) {
    return userOverride !== undefined ? userOverride : defaultValue;
  }

  // Handle new format: { value, userCanOverride }
  if (isSettingWithPermission<T>(orgSetting)) {
    // If org locked it OR user hasn't overridden, use org value
    if (!orgSetting.userCanOverride || userOverride === undefined) {
      return orgSetting.value;
    }
    return userOverride;
  }

  // Handle old flat format: just the value directly
  // In old format, users could always override (no permission concept existed)
  if (userOverride !== undefined) {
    return userOverride;
  }
  return orgSetting as T;
}

/**
 * Resolve all effective settings from org settings + user overrides
 * Handles both old flat format and new { value, userCanOverride } format
 */
export function resolveEffectiveSettings(
  orgSettings: OrgBookingSettings | Record<string, unknown> | undefined | null,
  userOverrides: UserOverrides | undefined | null
): EffectiveSettings {
  // Handle undefined/null inputs - use empty object and cast to any for flexible property access
  // deno-lint-ignore no-explicit-any
  const org = (orgSettings || {}) as any;
  const user = userOverrides || {};

  // Resolve durations and normalize to DurationOption[]
  const rawDurations = resolveSetting<DurationOption[] | number[]>(
    org.meetingDurations,
    user.meetingDurations,
    [{ minutes: 30 }]
  );

  return {
    // Resolve each setting with permission check and default fallbacks
    timezone: resolveSetting<string>(org.timezone, user.timezone, "America/New_York"),
    availableDays: resolveSetting<number[]>(org.availableDays, user.availableDays, [1, 2, 3, 4, 5]),
    availableHoursStart: resolveSetting<string>(org.availableHoursStart, user.availableHoursStart, "09:00"),
    availableHoursEnd: resolveSetting<string>(org.availableHoursEnd, user.availableHoursEnd, "17:00"),
    meetingDurations: normalizeDurations(rawDurations),
    bufferMinutes: resolveSetting<number>(org.bufferMinutes, user.bufferMinutes, 0),
    minimumNoticeHours: resolveSetting<number>(org.minimumNoticeHours, user.minimumNoticeHours, 0),
    maximumAdvanceDays: resolveSetting<number>(org.maximumAdvanceDays, user.maximumAdvanceDays, 60),
    dailyBookingLimit: resolveSetting<number>(org.dailyBookingLimit, user.dailyBookingLimit, 0),
    weeklyBookingLimit: resolveSetting<number>(org.weeklyBookingLimit, user.weeklyBookingLimit, 0),
    calendarInviteMode: resolveSetting<"all" | "none" | "externalOnly">(org.calendarInviteMode, user.calendarInviteMode, "all"),
    sendReminders: resolveSetting<boolean>(org.sendReminders, user.sendReminders, true),
    reminderTimes: resolveSetting<number[]>(org.reminderTimes, user.reminderTimes, [1440, 60]),

    // Profile fields (always from user)
    bio: user.bio,
    avatarUrl: user.avatarUrl,

    // Org-only fields (pass through directly from org, with safety)
    intakeConfig: org.intakeConfig as IntakeConfig | undefined,
    policies: org.policies as OrgPolicy[] | undefined,
    // Legacy fields
    intakeQuestions: org.intakeQuestions as CustomIntakeQuestion[] | undefined,
    consentText: org.consentText as string | undefined,
    requireRecordingConsent: org.requireRecordingConsent as boolean | undefined,
  };
}

/**
 * All overridable setting keys (used as default when no org settings)
 */
const ALL_OVERRIDABLE_KEYS: OverridableSettingKey[] = [
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
];

/**
 * Get list of setting keys that user CAN override (org allows it)
 * For old flat format, defaults to allowing all overrides (backward compat)
 */
export function getOverridableFields(orgSettings: OrgBookingSettings | Record<string, unknown> | undefined | null): OverridableSettingKey[] {
  if (!orgSettings) {
    // If no org settings, allow all overrides by default
    return [...ALL_OVERRIDABLE_KEYS];
  }

  // deno-lint-ignore no-explicit-any
  const org = orgSettings as any;
  const overridable: OverridableSettingKey[] = [];

  for (const key of ALL_OVERRIDABLE_KEYS) {
    const setting = org[key];

    // New format: check userCanOverride flag
    if (isSettingWithPermission(setting)) {
      if (setting.userCanOverride) {
        overridable.push(key);
      }
    } else if (setting !== undefined) {
      // Old flat format: all fields are overridable by default
      overridable.push(key);
    } else {
      // Setting not defined in org - allow override by default
      overridable.push(key);
    }
  }

  return overridable;
}

/**
 * Get list of setting keys that are LOCKED (org doesn't allow override)
 * For old flat format, nothing is locked (backward compat)
 */
export function getLockedFields(orgSettings: OrgBookingSettings | Record<string, unknown> | undefined | null): OverridableSettingKey[] {
  if (!orgSettings) {
    // If no org settings, nothing is locked
    return [];
  }

  // deno-lint-ignore no-explicit-any
  const org = orgSettings as any;
  const locked: OverridableSettingKey[] = [];

  for (const key of ALL_OVERRIDABLE_KEYS) {
    const setting = org[key];

    // Only new format can have locked fields
    if (isSettingWithPermission(setting)) {
      if (!setting.userCanOverride) {
        locked.push(key);
      }
    }
    // Old flat format: nothing is locked
  }

  return locked;
}

/**
 * Check if user has any overrides set
 */
export function hasUserOverrides(userOverrides: UserOverrides | undefined | null): boolean {
  if (!userOverrides) return false;

  for (const key of ALL_OVERRIDABLE_KEYS) {
    if (userOverrides[key] !== undefined) {
      return true;
    }
  }

  return false;
}

/**
 * Clear a single override (reset to org default)
 */
export function clearOverride(
  userOverrides: UserOverrides,
  key: OverridableSettingKey
): UserOverrides {
  const updated = { ...userOverrides };
  delete updated[key];
  return updated;
}

/**
 * Clear all overrides (reset all to org defaults)
 * Preserves bio and avatarUrl since those are always user-controlled
 */
export function clearAllOverrides(userOverrides: UserOverrides): UserOverrides {
  return {
    bio: userOverrides.bio,
    avatarUrl: userOverrides.avatarUrl,
  };
}

/**
 * Validate that user override is only set for allowed fields
 * Returns any invalid overrides that should be removed
 */
export function validateUserOverrides(
  orgSettings: OrgBookingSettings | Record<string, unknown> | undefined | null,
  userOverrides: UserOverrides | undefined | null
): OverridableSettingKey[] {
  if (!userOverrides) return [];
  const invalid: OverridableSettingKey[] = [];
  const overridableFields = getOverridableFields(orgSettings);

  for (const key of ALL_OVERRIDABLE_KEYS) {
    if (userOverrides[key] !== undefined && !overridableFields.includes(key)) {
      invalid.push(key);
    }
  }

  return invalid;
}

/**
 * Strip invalid overrides based on org permissions
 * Used when org changes permissions to clean up stale user data
 */
export function stripInvalidOverrides(
  orgSettings: OrgBookingSettings | Record<string, unknown>,
  userOverrides: UserOverrides
): UserOverrides {
  const invalidFields = validateUserOverrides(orgSettings, userOverrides);

  if (invalidFields.length === 0) {
    return userOverrides;
  }

  const cleaned = { ...userOverrides };
  for (const key of invalidFields) {
    delete cleaned[key];
  }

  return cleaned;
}

/**
 * Extract org default values from org settings
 * Used to show users what the org-set values are for comparison
 */
export function getOrgDefaults(
  orgSettings: OrgBookingSettings | Record<string, unknown> | undefined | null
): Record<string, unknown> {
  if (!orgSettings) {
    return {
      timezone: "America/New_York",
      availableDays: [1, 2, 3, 4, 5],
      availableHoursStart: "09:00",
      availableHoursEnd: "17:00",
      meetingDurations: [{ minutes: 30 }],
      bufferMinutes: 0,
      minimumNoticeHours: 0,
      maximumAdvanceDays: 60,
      dailyBookingLimit: 0,
      weeklyBookingLimit: 0,
      calendarInviteMode: "all",
      sendReminders: true,
      reminderTimes: [1440, 60],
    };
  }

  // deno-lint-ignore no-explicit-any
  const org = orgSettings as any;
  const defaults: Record<string, unknown> = {};

  for (const key of ALL_OVERRIDABLE_KEYS) {
    const setting = org[key];

    if (isSettingWithPermission(setting)) {
      // New format: extract value from { value, userCanOverride }
      defaults[key] = key === "meetingDurations"
        ? normalizeDurations(setting.value)
        : setting.value;
    } else if (setting !== undefined) {
      // Old flat format: value is directly stored
      defaults[key] = key === "meetingDurations"
        ? normalizeDurations(setting)
        : setting;
    }
  }

  return defaults;
}
