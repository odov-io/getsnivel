/**
 * Unified Dashboard Island
 * Single page with tabs: Org Settings, Users, Booking Form, Policies
 * Each section saves independently with change detection
 */

import { useSignal, useComputed, useSignalEffect } from "@preact/signals";
import type { ComponentChildren } from "preact";
import SlidePanel from "./SlidePanel.tsx";
import BillingSection from "./BillingSection.tsx";

type TabId = "settings" | "users" | "fields" | "policies" | "billing";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  slug: string;
  role: string;
  isActive: boolean;
  calendarConnected: boolean;
  providers?: string[];
}

interface StandardFieldConfig {
  field: string;
  enabled: boolean;
  required: boolean;
}

interface CustomIntakeQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: string[];
}

interface IntakeConfig {
  standardFields: StandardFieldConfig[];
  customQuestions: CustomIntakeQuestion[];
}

interface OrgPolicy {
  id: string;
  title: string;
  content: string;
  requireAcknowledgment: boolean;
  enabled: boolean;
}

interface PendingBooking {
  id: string;
  secretToken: string;
  bookerName: string;
  bookerEmail: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  bookerNotes?: string;
  autoApproveDeadline?: number;
  createdAt: number;
}

interface SettingWithPermission<T> {
  value: T;
  userCanOverride: boolean;
}

interface DurationCustomField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: string[];
}

interface DurationOption {
  minutes: number;
  note?: string;
  requireApproval?: boolean;
  autoApproveAfterHours?: number;
  customFields?: DurationCustomField[];
  rate?: string;
}

// Duration presets available for selection
const DURATION_PRESETS = [15, 30, 45, 60, 90, 120, 240, 480] as const;

function formatDurationLabel(minutes: number): string {
  // 90 min and under: show minutes
  // Over 90 min: show hours
  if (minutes <= 90) return `${minutes} min`;
  const hours = minutes / 60;
  if (Number.isInteger(hours)) return `${hours}hrs`;
  return `${minutes} min`;
}

// Normalize to DurationOption[] from various formats
function normalizeDurations(durations: DurationOption[] | number[] | undefined): DurationOption[] {
  if (!durations || durations.length === 0) return [{ minutes: 30 }];
  if (typeof durations[0] === "object" && "minutes" in durations[0]) {
    return durations as DurationOption[];
  }
  return (durations as number[]).map(minutes => ({ minutes }));
}

interface OrgSettings {
  brandColor?: string;
  logoUrl?: string;
  logoDisplayMode?: "logoOnly" | "logoWithName" | "nameOnly";
  allowPublicBooking?: boolean;
  timezone: SettingWithPermission<string> | string;
  availableDays: SettingWithPermission<number[]> | number[];
  availableHoursStart: SettingWithPermission<string> | string;
  availableHoursEnd: SettingWithPermission<string> | string;
  meetingDurations: SettingWithPermission<DurationOption[] | number[]> | DurationOption[] | number[];
  bufferMinutes: SettingWithPermission<number> | number;
  minimumNoticeHours: SettingWithPermission<number> | number;
  maximumAdvanceDays: SettingWithPermission<number> | number;
  dailyBookingLimit: SettingWithPermission<number> | number;
  weeklyBookingLimit: SettingWithPermission<number> | number;
  calendarInviteMode: SettingWithPermission<string> | string;
  intakeConfig?: IntakeConfig;
  policies?: OrgPolicy[];
}

interface DashboardProps {
  orgId: string;
  orgName: string;
  orgSlug: string;
  orgPlan: string;
  orgCreatedAt: number;
  settings: OrgSettings;
  users: User[];
  error?: string;
  success?: string;
  // Billing fields
  subscriptionStatus?: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
}

// Trial is 30 days
const TRIAL_DAYS = 30;

function getTrialDaysRemaining(createdAt: number): number {
  const now = Date.now();
  const elapsed = now - createdAt;
  const elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - elapsedDays);
}

// Constants
const FIELD_LABELS: Record<string, string> = {
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

const DEFAULT_INTAKE: IntakeConfig = {
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

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helpers
function getValue<T>(setting: T | { value: T; userCanOverride: boolean }): T {
  if (setting && typeof setting === "object" && "value" in setting) {
    return (setting as { value: T }).value;
  }
  return setting as T;
}

function getCanOverride(setting: unknown): boolean {
  if (setting && typeof setting === "object" && "userCanOverride" in setting) {
    return (setting as { userCanOverride: boolean }).userCanOverride;
  }
  return true;
}

function TabIcon({ name }: { name: string }) {
  const cls = "w-5 h-5";
  switch (name) {
    case "settings":
      return (
        <svg class={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "users":
      return (
        <svg class={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "form":
      return (
        <svg class={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "document":
      return (
        <svg class={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "billing":
      return (
        <svg class={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Dashboard({
  orgId,
  orgName,
  orgSlug,
  orgPlan,
  orgCreatedAt,
  settings,
  users,
  error,
  success,
  subscriptionStatus,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: DashboardProps) {
  // Read initial tab from URL query param
  const getInitialTab = (): TabId => {
    if (typeof window === "undefined") return "settings";
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "settings" || tab === "users" || tab === "fields" || tab === "policies" || tab === "billing") {
      return tab;
    }
    return "settings";
  };

  const activeTab = useSignal<TabId>(getInitialTab());

  // Plan checks
  const isSolo = orgPlan === "solo" || orgPlan === "solo-trial";
  const isTrial = orgPlan === "solo-trial" || orgPlan === "team-trial";
  const trialDaysRemaining = isTrial ? getTrialDaysRemaining(orgCreatedAt) : 0;

  // Messages
  const globalError = useSignal(error || "");
  const globalSuccess = useSignal(success || "");

  // Users list (mutable for local updates)
  const usersList = useSignal<User[]>(users);

  const s = settings;
  const activeUsers = useComputed(() => usersList.value.filter((u) => u.isActive));
  const connectedUsers = useComputed(() => usersList.value.filter((u) => u.calendarConnected));

  // ============ GENERAL STATE ============
  const name = useSignal(orgName);
  const slug = useSignal(orgSlug);
  const logoUrl = useSignal(s.logoUrl || "");
  const logoDisplayMode = useSignal<"logoOnly" | "logoWithName" | "nameOnly">(s.logoDisplayMode || "nameOnly");
  const originalName = useSignal(orgName);
  const originalSlug = useSignal(orgSlug);
  const originalLogoUrl = useSignal(s.logoUrl || "");
  const originalLogoDisplayMode = useSignal<"logoOnly" | "logoWithName" | "nameOnly">(s.logoDisplayMode || "nameOnly");
  const savingGeneral = useSignal(false);

  const generalChanged = useComputed(() =>
    name.value !== originalName.value ||
    slug.value !== originalSlug.value ||
    logoUrl.value !== originalLogoUrl.value ||
    logoDisplayMode.value !== originalLogoDisplayMode.value
  );

  // ============ AVAILABILITY STATE ============
  // Solo plans: always true for userCanOverride (managed at user level)
  const soloOverride = (val: boolean) => isSolo ? true : val;

  const timezone = useSignal(getValue(s.timezone) || "America/New_York");
  const timezoneOverride = useSignal(soloOverride(getCanOverride(s.timezone)));
  const availableDays = useSignal<number[]>(getValue(s.availableDays) || [1, 2, 3, 4, 5]);
  const availableDaysOverride = useSignal(soloOverride(getCanOverride(s.availableDays)));
  const availableHoursStart = useSignal(getValue(s.availableHoursStart) || "09:00");
  const availableHoursEnd = useSignal(getValue(s.availableHoursEnd) || "17:00");
  const availableHoursOverride = useSignal(soloOverride(getCanOverride(s.availableHoursStart)));
  const meetingDurations = useSignal<DurationOption[]>(normalizeDurations(getValue(s.meetingDurations)));
  const meetingDurationsOverride = useSignal(soloOverride(getCanOverride(s.meetingDurations)));
  const bufferMinutes = useSignal(getValue(s.bufferMinutes) || 0);
  const bufferMinutesOverride = useSignal(soloOverride(getCanOverride(s.bufferMinutes)));

  // Original values for change detection
  const origTimezone = useSignal(getValue(s.timezone) || "America/New_York");
  const origTimezoneOverride = useSignal(getCanOverride(s.timezone));
  const origAvailableDays = useSignal(JSON.stringify((getValue(s.availableDays) || [1,2,3,4,5]).sort()));
  const origAvailableDaysOverride = useSignal(getCanOverride(s.availableDays));
  const origAvailableHoursStart = useSignal(getValue(s.availableHoursStart) || "09:00");
  const origAvailableHoursEnd = useSignal(getValue(s.availableHoursEnd) || "17:00");
  const origAvailableHoursOverride = useSignal(getCanOverride(s.availableHoursStart));
  const origMeetingDurations = useSignal(JSON.stringify(normalizeDurations(getValue(s.meetingDurations))));
  const origMeetingDurationsOverride = useSignal(getCanOverride(s.meetingDurations));
  const origBufferMinutes = useSignal(getValue(s.bufferMinutes) || 0);
  const origBufferMinutesOverride = useSignal(getCanOverride(s.bufferMinutes));

  const savingAvailability = useSignal(false);

  const availabilityChanged = useComputed(() =>
    timezone.value !== origTimezone.value ||
    timezoneOverride.value !== origTimezoneOverride.value ||
    JSON.stringify([...availableDays.value].sort()) !== origAvailableDays.value ||
    availableDaysOverride.value !== origAvailableDaysOverride.value ||
    availableHoursStart.value !== origAvailableHoursStart.value ||
    availableHoursEnd.value !== origAvailableHoursEnd.value ||
    availableHoursOverride.value !== origAvailableHoursOverride.value ||
    JSON.stringify(meetingDurations.value) !== origMeetingDurations.value ||
    meetingDurationsOverride.value !== origMeetingDurationsOverride.value ||
    bufferMinutes.value !== origBufferMinutes.value ||
    bufferMinutesOverride.value !== origBufferMinutesOverride.value
  );

  // ============ BOOKING LIMITS STATE ============
  const minimumNoticeHours = useSignal(getValue(s.minimumNoticeHours) || 0);
  const minimumNoticeHoursOverride = useSignal(soloOverride(getCanOverride(s.minimumNoticeHours)));
  const maximumAdvanceDays = useSignal(getValue(s.maximumAdvanceDays) || 60);
  const maximumAdvanceDaysOverride = useSignal(soloOverride(getCanOverride(s.maximumAdvanceDays)));
  const dailyBookingLimit = useSignal(getValue(s.dailyBookingLimit) || 0);
  const dailyBookingLimitOverride = useSignal(soloOverride(getCanOverride(s.dailyBookingLimit)));
  const weeklyBookingLimit = useSignal(getValue(s.weeklyBookingLimit) || 0);
  const weeklyBookingLimitOverride = useSignal(soloOverride(getCanOverride(s.weeklyBookingLimit)));
  const calendarInviteMode = useSignal(getValue(s.calendarInviteMode) || "all");
  const calendarInviteModeOverride = useSignal(soloOverride(getCanOverride(s.calendarInviteMode)));

  const origMinimumNoticeHours = useSignal(getValue(s.minimumNoticeHours) || 0);
  const origMinimumNoticeHoursOverride = useSignal(getCanOverride(s.minimumNoticeHours));
  const origMaximumAdvanceDays = useSignal(getValue(s.maximumAdvanceDays) || 60);
  const origMaximumAdvanceDaysOverride = useSignal(getCanOverride(s.maximumAdvanceDays));
  const origDailyBookingLimit = useSignal(getValue(s.dailyBookingLimit) || 0);
  const origDailyBookingLimitOverride = useSignal(getCanOverride(s.dailyBookingLimit));
  const origWeeklyBookingLimit = useSignal(getValue(s.weeklyBookingLimit) || 0);
  const origWeeklyBookingLimitOverride = useSignal(getCanOverride(s.weeklyBookingLimit));
  const origCalendarInviteMode = useSignal(getValue(s.calendarInviteMode) || "all");
  const origCalendarInviteModeOverride = useSignal(getCanOverride(s.calendarInviteMode));

  const savingLimits = useSignal(false);

  const limitsChanged = useComputed(() =>
    minimumNoticeHours.value !== origMinimumNoticeHours.value ||
    minimumNoticeHoursOverride.value !== origMinimumNoticeHoursOverride.value ||
    maximumAdvanceDays.value !== origMaximumAdvanceDays.value ||
    maximumAdvanceDaysOverride.value !== origMaximumAdvanceDaysOverride.value ||
    dailyBookingLimit.value !== origDailyBookingLimit.value ||
    dailyBookingLimitOverride.value !== origDailyBookingLimitOverride.value ||
    weeklyBookingLimit.value !== origWeeklyBookingLimit.value ||
    weeklyBookingLimitOverride.value !== origWeeklyBookingLimitOverride.value ||
    calendarInviteMode.value !== origCalendarInviteMode.value ||
    calendarInviteModeOverride.value !== origCalendarInviteModeOverride.value
  );

  // ============ INTAKE FIELDS STATE ============
  const intakeConfig = useSignal<IntakeConfig>(s.intakeConfig || DEFAULT_INTAKE);
  const origIntakeConfig = useSignal(JSON.stringify(s.intakeConfig || DEFAULT_INTAKE));
  const savingIntake = useSignal(false);

  const intakeChanged = useComputed(() =>
    JSON.stringify(intakeConfig.value) !== origIntakeConfig.value
  );

  // ============ POLICIES STATE ============
  const policies = useSignal<OrgPolicy[]>(settings.policies || []);
  const origPolicies = useSignal(JSON.stringify(settings.policies || []));
  const editingPolicy = useSignal<OrgPolicy | null>(null);
  const isNewPolicy = useSignal(false);
  const savingPolicies = useSignal(false);

  const policiesChanged = useComputed(() =>
    JSON.stringify(policies.value) !== origPolicies.value
  );

  // ============ USER EDIT STATE ============
  const editingUser = useSignal<User | null>(null);
  const editUserRole = useSignal<string>("member");
  const editUserActive = useSignal(true);
  const savingUser = useSignal(false);
  const deletingUser = useSignal(false);
  const userError = useSignal("");

  const openUserEdit = (user: User) => {
    editingUser.value = user;
    editUserRole.value = user.role;
    editUserActive.value = user.isActive;
    userError.value = "";
  };

  const closeUserEdit = () => {
    editingUser.value = null;
    userError.value = "";
  };

  const saveUser = async () => {
    if (!editingUser.value) return;
    savingUser.value = true;
    userError.value = "";

    try {
      const res = await fetch(`/api/dashboard/users/${editingUser.value.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editUserRole.value,
          isActive: editUserActive.value,
        }),
      });

      if (res.ok) {
        // Update local state
        usersList.value = usersList.value.map((u) =>
          u.id === editingUser.value!.id
            ? { ...u, role: editUserRole.value, isActive: editUserActive.value }
            : u
        );
        globalSuccess.value = "User updated!";
        closeUserEdit();
      } else {
        const data = await res.json();
        userError.value = data.error || "Failed to update user";
      }
    } catch {
      userError.value = "Failed to update user";
    }

    savingUser.value = false;
  };

  const deleteUserAction = async () => {
    if (!editingUser.value) return;
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    deletingUser.value = true;
    userError.value = "";

    try {
      const res = await fetch(`/api/dashboard/users/${editingUser.value.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        usersList.value = usersList.value.filter((u) => u.id !== editingUser.value!.id);
        globalSuccess.value = "User deleted!";
        closeUserEdit();
      } else {
        const data = await res.json();
        userError.value = data.error || "Failed to delete user";
      }
    } catch {
      userError.value = "Failed to delete user";
    }

    deletingUser.value = false;
  };

  // ============ TABS CONFIG ============
  const tabs = [
    { id: "settings", label: "Org Settings", icon: "settings" },
    { id: "users", label: "Users", icon: "users" },
    { id: "fields", label: "Booking Form", icon: "form" },
    { id: "policies", label: "Policies", icon: "document" },
    { id: "billing", label: "Billing", icon: "billing" },
  ] as const;

  // ============ SAVE FUNCTIONS ============
  const saveGeneral = async () => {
    savingGeneral.value = true;
    globalError.value = "";
    globalSuccess.value = "";

    try {
      const res = await fetch("/api/dashboard/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value,
          slug: slug.value,
          logoUrl: logoUrl.value.trim() || undefined,
          logoDisplayMode: logoDisplayMode.value,
        }),
      });

      if (res.ok) {
        globalSuccess.value = "Organization details saved!";
        originalName.value = name.value;
        originalSlug.value = slug.value;
        originalLogoUrl.value = logoUrl.value;
        originalLogoDisplayMode.value = logoDisplayMode.value;
      } else {
        const data = await res.json();
        globalError.value = data.error || "Failed to save";
      }
    } catch {
      globalError.value = "Failed to save organization details";
    }

    savingGeneral.value = false;
  };

  const saveAvailability = async () => {
    savingAvailability.value = true;
    globalError.value = "";
    globalSuccess.value = "";

    // Solo plans: always allow user override (settings managed at user level)
    const override = (val: boolean) => isSolo ? true : val;

    try {
      const res = await fetch("/api/dashboard/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timezone: { value: timezone.value, userCanOverride: override(timezoneOverride.value) },
          availableDays: { value: availableDays.value, userCanOverride: override(availableDaysOverride.value) },
          availableHoursStart: { value: availableHoursStart.value, userCanOverride: override(availableHoursOverride.value) },
          availableHoursEnd: { value: availableHoursEnd.value, userCanOverride: override(availableHoursOverride.value) },
          meetingDurations: { value: meetingDurations.value, userCanOverride: override(meetingDurationsOverride.value) },
          bufferMinutes: { value: bufferMinutes.value, userCanOverride: override(bufferMinutesOverride.value) },
        }),
      });

      if (res.ok) {
        globalSuccess.value = "Availability settings saved!";
        // Update originals
        origTimezone.value = timezone.value;
        origTimezoneOverride.value = timezoneOverride.value;
        origAvailableDays.value = JSON.stringify([...availableDays.value].sort());
        origAvailableDaysOverride.value = availableDaysOverride.value;
        origAvailableHoursStart.value = availableHoursStart.value;
        origAvailableHoursEnd.value = availableHoursEnd.value;
        origAvailableHoursOverride.value = availableHoursOverride.value;
        origMeetingDurations.value = JSON.stringify(meetingDurations.value);
        origMeetingDurationsOverride.value = meetingDurationsOverride.value;
        origBufferMinutes.value = bufferMinutes.value;
        origBufferMinutesOverride.value = bufferMinutesOverride.value;
      } else {
        globalError.value = "Failed to save availability settings";
      }
    } catch {
      globalError.value = "Failed to save availability settings";
    }

    savingAvailability.value = false;
  };

  const saveLimits = async () => {
    savingLimits.value = true;
    globalError.value = "";
    globalSuccess.value = "";

    // Solo plans: always allow user override (settings managed at user level)
    const override = (val: boolean) => isSolo ? true : val;

    try {
      const res = await fetch("/api/dashboard/limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minimumNoticeHours: { value: minimumNoticeHours.value, userCanOverride: override(minimumNoticeHoursOverride.value) },
          maximumAdvanceDays: { value: maximumAdvanceDays.value, userCanOverride: override(maximumAdvanceDaysOverride.value) },
          dailyBookingLimit: { value: dailyBookingLimit.value, userCanOverride: override(dailyBookingLimitOverride.value) },
          weeklyBookingLimit: { value: weeklyBookingLimit.value, userCanOverride: override(weeklyBookingLimitOverride.value) },
          calendarInviteMode: { value: calendarInviteMode.value, userCanOverride: override(calendarInviteModeOverride.value) },
        }),
      });

      if (res.ok) {
        globalSuccess.value = "Booking limits saved!";
        origMinimumNoticeHours.value = minimumNoticeHours.value;
        origMinimumNoticeHoursOverride.value = minimumNoticeHoursOverride.value;
        origMaximumAdvanceDays.value = maximumAdvanceDays.value;
        origMaximumAdvanceDaysOverride.value = maximumAdvanceDaysOverride.value;
        origDailyBookingLimit.value = dailyBookingLimit.value;
        origDailyBookingLimitOverride.value = dailyBookingLimitOverride.value;
        origWeeklyBookingLimit.value = weeklyBookingLimit.value;
        origWeeklyBookingLimitOverride.value = weeklyBookingLimitOverride.value;
        origCalendarInviteMode.value = calendarInviteMode.value;
        origCalendarInviteModeOverride.value = calendarInviteModeOverride.value;
      } else {
        globalError.value = "Failed to save booking limits";
      }
    } catch {
      globalError.value = "Failed to save booking limits";
    }

    savingLimits.value = false;
  };

  const saveIntake = async () => {
    savingIntake.value = true;
    globalError.value = "";
    globalSuccess.value = "";

    try {
      const res = await fetch("/api/dashboard/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeConfig: intakeConfig.value }),
      });

      if (res.ok) {
        globalSuccess.value = "Booking form fields saved!";
        origIntakeConfig.value = JSON.stringify(intakeConfig.value);
      } else {
        globalError.value = "Failed to save booking form fields";
      }
    } catch {
      globalError.value = "Failed to save booking form fields";
    }

    savingIntake.value = false;
  };

  const savePolicies = async () => {
    savingPolicies.value = true;
    globalError.value = "";
    globalSuccess.value = "";

    try {
      const res = await fetch("/api/dashboard/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policies: policies.value }),
      });

      if (res.ok) {
        globalSuccess.value = "Policies saved!";
        origPolicies.value = JSON.stringify(policies.value);
      } else {
        globalError.value = "Failed to save policies";
      }
    } catch {
      globalError.value = "Failed to save policies";
    }

    savingPolicies.value = false;
  };

  // ============ PUSH SETTINGS TO USERS ============
  const showPushDialog = useSignal(false);
  const pushingSettings = useSignal(false);
  const pushResult = useSignal<{ updatedCount: number; skippedCount: number } | null>(null);

  const pushSettingsToUsers = async (mode: "respectOverrides" | "forceAll") => {
    pushingSettings.value = true;
    globalError.value = "";

    // Get all overridable fields that users might want updated
    const fields = [
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
    ];

    try {
      const res = await fetch("/api/dashboard/push-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, mode }),
      });

      if (res.ok) {
        const data = await res.json();
        pushResult.value = { updatedCount: data.updatedCount, skippedCount: data.skippedCount };
        globalSuccess.value = `Settings pushed to ${data.updatedCount} users!`;
        showPushDialog.value = false;
      } else {
        globalError.value = "Failed to push settings";
      }
    } catch {
      globalError.value = "Failed to push settings";
    }

    pushingSettings.value = false;
  };

  // ============ POLICY CRUD ============
  const addPolicy = () => {
    editingPolicy.value = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      requireAcknowledgment: false,
      enabled: true,
    };
    isNewPolicy.value = true;
  };

  const editPolicy = (policy: OrgPolicy) => {
    editingPolicy.value = { ...policy };
    isNewPolicy.value = false;
  };

  const savePolicy = () => {
    if (!editingPolicy.value) return;
    const updated = [...policies.value];
    const idx = updated.findIndex((p) => p.id === editingPolicy.value!.id);
    if (idx >= 0) {
      updated[idx] = editingPolicy.value;
    } else {
      updated.push(editingPolicy.value);
    }
    policies.value = updated;
    editingPolicy.value = null;
  };

  const deletePolicy = (id: string) => {
    if (confirm("Delete this policy?")) {
      policies.value = policies.value.filter((p) => p.id !== id);
    }
  };

  const togglePolicyEnabled = (id: string) => {
    policies.value = policies.value.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
  };

  // ============ INTAKE FIELD HELPERS ============
  const updateIntakeField = (field: string, key: "enabled" | "required", value: boolean) => {
    const updated = { ...intakeConfig.value };
    updated.standardFields = updated.standardFields.map((f) =>
      f.field === field ? { ...f, [key]: value } : f
    );
    intakeConfig.value = updated;
  };

  // ============ CUSTOM QUESTION HELPERS ============
  const addCustomQuestion = () => {
    const updated = { ...intakeConfig.value };
    const newQuestion: CustomIntakeQuestion = {
      id: crypto.randomUUID(),
      label: "",
      type: "text",
      required: false,
    };
    updated.customQuestions = [...updated.customQuestions, newQuestion];
    intakeConfig.value = updated;
  };

  const updateCustomQuestion = (id: string, updates: Partial<CustomIntakeQuestion>) => {
    const updated = { ...intakeConfig.value };
    updated.customQuestions = updated.customQuestions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    intakeConfig.value = updated;
  };

  const removeCustomQuestion = (id: string) => {
    const updated = { ...intakeConfig.value };
    updated.customQuestions = updated.customQuestions.filter((q) => q.id !== id);
    intakeConfig.value = updated;
  };

  // ============ DAY/DURATION TOGGLES ============
  const toggleDay = (day: number) => {
    if (availableDays.value.includes(day)) {
      availableDays.value = availableDays.value.filter((d) => d !== day);
    } else {
      availableDays.value = [...availableDays.value, day];
    }
  };

  const toggleDuration = (minutes: number) => {
    const existing = meetingDurations.value.find(d => d.minutes === minutes);
    if (existing) {
      meetingDurations.value = meetingDurations.value.filter(d => d.minutes !== minutes);
    } else {
      meetingDurations.value = [...meetingDurations.value, { minutes }];
    }
  };

  const updateDuration = (minutes: number, updates: Partial<DurationOption>) => {
    meetingDurations.value = meetingDurations.value.map(d =>
      d.minutes === minutes ? { ...d, ...updates } : d
    );
  };

  const updateDurationNote = (minutes: number, note: string) => {
    updateDuration(minutes, { note: note || undefined });
  };

  const toggleDurationApproval = (minutes: number) => {
    const duration = meetingDurations.value.find(d => d.minutes === minutes);
    if (duration) {
      updateDuration(minutes, {
        requireApproval: !duration.requireApproval,
        autoApproveAfterHours: !duration.requireApproval ? 24 : undefined
      });
    }
  };

  const updateAutoApproveHours = (minutes: number, hours: number) => {
    updateDuration(minutes, { autoApproveAfterHours: hours });
  };

  const addDurationCustomField = (minutes: number) => {
    const duration = meetingDurations.value.find(d => d.minutes === minutes);
    const newField: DurationCustomField = {
      id: crypto.randomUUID(),
      label: "",
      type: "text",
      required: false,
    };
    updateDuration(minutes, {
      customFields: [...(duration?.customFields || []), newField]
    });
  };

  const updateDurationCustomField = (minutes: number, fieldId: string, updates: Partial<DurationCustomField>) => {
    const duration = meetingDurations.value.find(d => d.minutes === minutes);
    if (duration?.customFields) {
      updateDuration(minutes, {
        customFields: duration.customFields.map(f =>
          f.id === fieldId ? { ...f, ...updates } : f
        )
      });
    }
  };

  const removeDurationCustomField = (minutes: number, fieldId: string) => {
    const duration = meetingDurations.value.find(d => d.minutes === minutes);
    if (duration?.customFields) {
      updateDuration(minutes, {
        customFields: duration.customFields.filter(f => f.id !== fieldId)
      });
    }
  };

  const isDurationSelected = (minutes: number) =>
    meetingDurations.value.some(d => d.minutes === minutes);

  const getDuration = (minutes: number) =>
    meetingDurations.value.find(d => d.minutes === minutes);

  return (
    <div>
      {/* Trial Banner */}
      {isTrial && (
        <div class="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-amber-800 font-medium">
              {isSolo ? "Solo" : "Team"} Trial: <strong>{trialDaysRemaining} days</strong> remaining
            </span>
          </div>
          <a href="/pricing" class="text-amber-700 font-medium hover:text-amber-900 text-sm">
            View plans &rarr;
          </a>
        </div>
      )}

      {/* Stats - only show for team plans */}
      {!isSolo && (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Users" value={usersList.value.length.toString()} sublabel="team members" />
          <StatCard label="Active Users" value={activeUsers.value.length.toString()} sublabel="can receive bookings" />
          <StatCard label="Calendars Connected" value={connectedUsers.value.length.toString()} sublabel="synced with calendar" />
        </div>
      )}

      {/* Messages */}
      {globalError.value && (
        <div class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {globalError.value}
        </div>
      )}
      {globalSuccess.value && (
        <div class="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center justify-between gap-4">
          <span>{globalSuccess.value}</span>
          {!showPushDialog.value && (
            <button
              type="button"
              onClick={() => showPushDialog.value = true}
              class="text-sm text-green-700 hover:text-green-800 underline whitespace-nowrap"
            >
              Push to users
            </button>
          )}
        </div>
      )}

      {/* Push Settings Dialog */}
      {showPushDialog.value && (
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-medium text-blue-900 mb-2">Push Settings to Team</h3>
          <p class="text-sm text-blue-700 mb-4">
            Apply your organization's settings to team members.
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => pushSettingsToUsers("respectOverrides")}
              disabled={pushingSettings.value}
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {pushingSettings.value ? "Pushing..." : "Push (respect customizations)"}
            </button>
            <button
              type="button"
              onClick={() => pushSettingsToUsers("forceAll")}
              disabled={pushingSettings.value}
              class="px-4 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
            >
              {pushingSettings.value ? "Pushing..." : "Force push to all"}
            </button>
            <button
              type="button"
              onClick={() => showPushDialog.value = false}
              class="px-4 py-2 text-sm text-blue-700 hover:text-blue-800"
            >
              Cancel
            </button>
          </div>
          <p class="text-xs text-blue-600 mt-3">
            "Respect customizations" only updates users who haven't made their own changes.
            "Force push" clears all user customizations and applies org defaults.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="border-b border-gray-200 px-4 sm:px-6">
          <nav class="flex gap-1 sm:gap-4 -mb-px" aria-label="Dashboard tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => (activeTab.value = tab.id)}
                class={`flex items-center gap-2 py-3 sm:py-4 px-3 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab.value === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <TabIcon name={tab.icon} />
                <span class="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div class="p-6">
          {/* General section - always visible at top */}
          <div class="pb-6 mb-6 border-b border-gray-200 space-y-6">
            {/* For Solo: just show org name */}
            {isSolo ? (
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Organization name</label>
                <input
                  type="text"
                  value={name.value}
                  onInput={(e) => name.value = (e.target as HTMLInputElement).value}
                  class="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Organization name</label>
                    <input
                      type="text"
                      value={name.value}
                      onInput={(e) => name.value = (e.target as HTMLInputElement).value}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                    <input
                      type="text"
                      value={slug.value}
                      onInput={(e) => slug.value = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9-]/g, "")}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <p class="mt-1 text-xs text-gray-500">book.snivel.app/[user]/{slug.value}</p>
                  </div>
                </div>

                {/* Logo Settings - Team only */}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                    <input
                      type="url"
                      value={logoUrl.value}
                      onInput={(e) => logoUrl.value = (e.target as HTMLInputElement).value}
                      placeholder="https://example.com/logo.png"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <p class="mt-1 text-xs text-gray-500">Enter URL to your organization's logo image</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Booking Page Header</label>
                    <select
                      value={logoDisplayMode.value}
                      onChange={(e) => logoDisplayMode.value = (e.target as HTMLSelectElement).value as "logoOnly" | "logoWithName" | "nameOnly"}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="nameOnly">Organization Name Only</option>
                      <option value="logoOnly">Logo Only</option>
                      <option value="logoWithName">Logo + Organization Name</option>
                    </select>
                    <p class="mt-1 text-xs text-gray-500">
                      {!logoUrl.value.trim() && logoDisplayMode.value !== "nameOnly"
                        ? "Will show org name (no logo URL provided)"
                        : "How your org appears on booking pages"}
                    </p>
                  </div>
                </div>

                {/* Logo Preview */}
                {logoUrl.value.trim() && (
                  <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <span class="text-sm text-gray-500">Preview:</span>
                    <div class="flex items-center gap-3">
                      {(logoDisplayMode.value === "logoOnly" || logoDisplayMode.value === "logoWithName") && (
                        <img
                          src={logoUrl.value}
                          alt="Logo preview"
                          class="h-8 w-auto object-contain"
                          onError={(e) => (e.target as HTMLImageElement).style.display = "none"}
                        />
                      )}
                      {(logoDisplayMode.value === "nameOnly" || logoDisplayMode.value === "logoWithName") && (
                        <span class="font-semibold text-gray-900">{name.value}</span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {generalChanged.value && (
              <SaveButton saving={savingGeneral.value} onClick={saveGeneral} label="Save Organization Details" />
            )}
          </div>

          {/* Org Settings Tab */}
          {activeTab.value === "settings" && (
            <div class="space-y-8">
              {/* Availability */}
              <Section title="Default Availability">
                {isSolo && (
                  <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                    Solo plan settings are managed on your personal booking page. <a href={`https://book.snivel.app/${usersList.value[0]?.slug || ""}/settings`} class="text-gray-900 font-medium hover:underline">Go to settings &rarr;</a>
                  </div>
                )}
                <div class="space-y-6">
                  <SettingRow label="Timezone" override={timezoneOverride} isSolo={isSolo}>
                    <select
                      value={timezone.value}
                      onChange={(e) => timezone.value = (e.target as HTMLSelectElement).value}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="America/Phoenix">Arizona</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </SettingRow>

                  <SettingRow label="Available Days" override={availableDaysOverride} isSolo={isSolo}>
                    <div class="flex flex-wrap gap-2">
                      {DAY_NAMES.map((day, i) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(i)}
                          class={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                            availableDays.value.includes(i)
                              ? "bg-gray-900 text-white border-gray-900"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </SettingRow>

                  <SettingRow label="Available Hours" override={availableHoursOverride} isSolo={isSolo}>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">Start</label>
                        <input
                          type="time"
                          value={availableHoursStart.value}
                          onChange={(e) => availableHoursStart.value = (e.target as HTMLInputElement).value}
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">End</label>
                        <input
                          type="time"
                          value={availableHoursEnd.value}
                          onChange={(e) => availableHoursEnd.value = (e.target as HTMLInputElement).value}
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </SettingRow>

                  <SettingRow label="Meeting Durations" override={meetingDurationsOverride} isSolo={isSolo}>
                    <div class="space-y-3">
                      <div class="w-full flex gap-1">
                        {DURATION_PRESETS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleDuration(d)}
                            class={`flex-1 min-w-0 py-2 border rounded-lg text-xs transition-colors ${
                              isDurationSelected(d)
                                ? "bg-gray-900 text-white border-gray-900"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {formatDurationLabel(d)}
                          </button>
                        ))}
                      </div>
                      {/* Collapsible settings for selected durations */}
                      {meetingDurations.value.length > 0 && (
                        <div class="space-y-2 pt-2 border-t border-gray-100">
                          <p class="text-xs text-gray-500">Click a duration to configure its settings:</p>
                          {meetingDurations.value
                            .sort((a, b) => a.minutes - b.minutes)
                            .map((d) => (
                              <details key={d.minutes} class="border border-gray-200 rounded-lg overflow-hidden group">
                                <summary class="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                                  <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-medium text-gray-900 text-sm">{formatDurationLabel(d.minutes)}</span>
                                    {d.note && <span class="text-xs text-gray-500 truncate max-w-[120px]">{d.note}</span>}
                                    {d.requireApproval && (
                                      <span class="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">Approval</span>
                                    )}
                                    {(d.customFields?.length || 0) > 0 && (
                                      <span class="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                        {d.customFields?.length} field{d.customFields?.length !== 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                  <svg class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </summary>
                                <div class="p-3 space-y-3 bg-white text-sm">
                                  {/* Note/Memo */}
                                  <div>
                                    <label class="block text-xs font-medium text-gray-700 mb-1">Display Note</label>
                                    <input
                                      type="text"
                                      value={d.note || ""}
                                      onInput={(e) => updateDurationNote(d.minutes, (e.target as HTMLInputElement).value)}
                                      placeholder="e.g., May incur additional charge"
                                      class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900"
                                    />
                                  </div>

                                  {/* Require Approval */}
                                  <div class="flex items-start gap-2">
                                    <input
                                      type="checkbox"
                                      id={`org-approval-${d.minutes}`}
                                      checked={d.requireApproval || false}
                                      onChange={() => toggleDurationApproval(d.minutes)}
                                      class="mt-0.5 w-4 h-4 text-gray-900 border-gray-300 rounded"
                                    />
                                    <div>
                                      <label for={`org-approval-${d.minutes}`} class="text-xs font-medium text-gray-700 cursor-pointer">
                                        Require approval
                                      </label>
                                      <p class="text-xs text-gray-500">Host must approve each booking request</p>
                                    </div>
                                  </div>

                                  {/* Auto-approve hours */}
                                  {d.requireApproval && (
                                    <div class="ml-6 p-2 bg-gray-50 rounded">
                                      <label class="block text-xs font-medium text-gray-700 mb-1">Auto-approve after</label>
                                      <select
                                        value={d.autoApproveAfterHours || 0}
                                        onChange={(e) => updateAutoApproveHours(d.minutes, parseInt((e.target as HTMLSelectElement).value))}
                                        class="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      >
                                        <option value="0">Never (manual only)</option>
                                        <option value="1">1 hour</option>
                                        <option value="2">2 hours</option>
                                        <option value="4">4 hours</option>
                                        <option value="12">12 hours</option>
                                        <option value="24">24 hours</option>
                                        <option value="48">48 hours</option>
                                      </select>
                                    </div>
                                  )}

                                  {/* Custom Fields */}
                                  <div class="border-t border-gray-100 pt-3">
                                    <div class="flex items-center justify-between mb-2">
                                      <label class="text-xs font-medium text-gray-700">Additional Questions</label>
                                      <button
                                        type="button"
                                        onClick={() => addDurationCustomField(d.minutes)}
                                        class="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                      >
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add
                                      </button>
                                    </div>

                                    {(!d.customFields || d.customFields.length === 0) ? (
                                      <p class="text-xs text-gray-400 italic">No additional fields</p>
                                    ) : (
                                      <div class="space-y-2">
                                        {d.customFields.map((field) => (
                                          <div key={field.id} class="p-2 bg-gray-50 rounded space-y-1">
                                            <div class="flex items-center gap-1">
                                              <input
                                                type="text"
                                                value={field.label}
                                                onInput={(e) => updateDurationCustomField(d.minutes, field.id, { label: (e.target as HTMLInputElement).value })}
                                                placeholder="Question"
                                                class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                              />
                                              <select
                                                value={field.type}
                                                onChange={(e) => updateDurationCustomField(d.minutes, field.id, { type: (e.target as HTMLSelectElement).value as DurationCustomField["type"] })}
                                                class="px-1 py-1 text-xs border border-gray-300 rounded"
                                              >
                                                <option value="text">Text</option>
                                                <option value="textarea">Long</option>
                                                <option value="select">Select</option>
                                                <option value="checkbox">Check</option>
                                              </select>
                                              <button
                                                type="button"
                                                onClick={() => removeDurationCustomField(d.minutes, field.id)}
                                                class="p-1 text-red-500 hover:text-red-700"
                                              >
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                              </button>
                                            </div>
                                            <div class="flex items-center gap-2">
                                              <label class="flex items-center gap-1 text-xs text-gray-600">
                                                <input
                                                  type="checkbox"
                                                  checked={field.required}
                                                  onChange={(e) => updateDurationCustomField(d.minutes, field.id, { required: (e.target as HTMLInputElement).checked })}
                                                  class="w-3 h-3"
                                                />
                                                Required
                                              </label>
                                              {field.type === "select" && (
                                                <input
                                                  type="text"
                                                  value={field.options?.join(", ") || ""}
                                                  onInput={(e) => updateDurationCustomField(d.minutes, field.id, {
                                                    options: (e.target as HTMLInputElement).value.split(",").map(s => s.trim()).filter(Boolean)
                                                  })}
                                                  placeholder="Options (comma-sep)"
                                                  class="flex-1 px-1 py-0.5 text-xs border border-gray-300 rounded"
                                                />
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </details>
                            ))}
                        </div>
                      )}
                    </div>
                  </SettingRow>

                  <SettingRow label="Buffer Between Meetings" override={bufferMinutesOverride} isSolo={isSolo}>
                    <select
                      value={bufferMinutes.value}
                      onChange={(e) => bufferMinutes.value = parseInt((e.target as HTMLSelectElement).value)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="0">No buffer</option>
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </SettingRow>
                </div>

                {availabilityChanged.value && (
                  <div class="mt-6">
                    <SaveButton saving={savingAvailability.value} onClick={saveAvailability} label="Save Availability" />
                  </div>
                )}
              </Section>

              {/* Booking Limits */}
              <Section title="Booking Limits">
                {isSolo && (
                  <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                    Solo plan settings are managed on your personal booking page.
                  </div>
                )}
                <div class="space-y-6">
                  <SettingRow label="Minimum Notice" override={minimumNoticeHoursOverride} isSolo={isSolo}>
                    <select
                      value={minimumNoticeHours.value}
                      onChange={(e) => minimumNoticeHours.value = parseInt((e.target as HTMLSelectElement).value)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="0">No minimum</option>
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="4">4 hours</option>
                      <option value="24">24 hours</option>
                      <option value="48">48 hours</option>
                    </select>
                  </SettingRow>

                  <SettingRow label="Maximum Advance" override={maximumAdvanceDaysOverride} isSolo={isSolo}>
                    <select
                      value={maximumAdvanceDays.value}
                      onChange={(e) => maximumAdvanceDays.value = parseInt((e.target as HTMLSelectElement).value)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="7">1 week</option>
                      <option value="14">2 weeks</option>
                      <option value="30">1 month</option>
                      <option value="60">2 months</option>
                      <option value="90">3 months</option>
                    </select>
                  </SettingRow>

                  <SettingRow label="Daily Limit" override={dailyBookingLimitOverride} isSolo={isSolo}>
                    <select
                      value={dailyBookingLimit.value}
                      onChange={(e) => dailyBookingLimit.value = parseInt((e.target as HTMLSelectElement).value)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="0">Unlimited</option>
                      <option value="1">1 per day</option>
                      <option value="2">2 per day</option>
                      <option value="5">5 per day</option>
                      <option value="10">10 per day</option>
                    </select>
                  </SettingRow>

                  <SettingRow label="Weekly Limit" override={weeklyBookingLimitOverride} isSolo={isSolo}>
                    <select
                      value={weeklyBookingLimit.value}
                      onChange={(e) => weeklyBookingLimit.value = parseInt((e.target as HTMLSelectElement).value)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="0">Unlimited</option>
                      <option value="5">5 per week</option>
                      <option value="10">10 per week</option>
                      <option value="20">20 per week</option>
                    </select>
                  </SettingRow>

                  <SettingRow label="Calendar Invites" override={calendarInviteModeOverride} isSolo={isSolo}>
                    <select
                      value={calendarInviteMode.value}
                      onChange={(e) => calendarInviteMode.value = (e.target as HTMLSelectElement).value}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="all">Send to all</option>
                      <option value="externalOnly">External only</option>
                      <option value="none">Don't send</option>
                    </select>
                  </SettingRow>
                </div>

                {limitsChanged.value && (
                  <div class="mt-6">
                    <SaveButton saving={savingLimits.value} onClick={saveLimits} label="Save Booking Limits" />
                  </div>
                )}
              </Section>

              <div class="pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">Plan: <span class="font-medium capitalize">{orgPlan}</span></p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab.value === "users" && (
            <div>
              <div class="flex justify-between items-center mb-6">
                <p class="text-sm text-gray-500">{usersList.value.length} {usersList.value.length === 1 ? "user" : "users"}</p>
                {!isSolo && (
                  <a href="/dashboard/users/new" class="px-4 py-2 bg-gray-900 hover:bg-black text-white font-medium rounded-lg text-sm">
                    Add User
                  </a>
                )}
              </div>

              {usersList.value.length === 0 ? (
                <div class="text-center py-12 text-gray-500">
                  <p class="mb-4">No users yet</p>
                  <a href="/dashboard/users/new" class="text-gray-900 font-medium hover:underline">Add your first user</a>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <table class="w-full hidden sm:table">
                    <thead class="bg-gray-50 border-y border-gray-200">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calendar</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      {usersList.value.map((user) => (
                        <tr key={user.id} class="hover:bg-gray-50">
                          <td class="px-4 py-3">
                            <p class="text-sm font-medium text-gray-900">{user.name}</p>
                            <p class="text-sm text-gray-500">{user.email}</p>
                          </td>
                          <td class="px-4 py-3">
                            <span class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                              {user.role}
                            </span>
                          </td>
                          <td class="px-4 py-3">
                            {user.calendarConnected ? (
                              <span class="text-green-600 text-sm capitalize">{user.providers?.[0] || "Connected"}</span>
                            ) : (
                              <span class="text-gray-400 text-sm">None</span>
                            )}
                          </td>
                          <td class="px-4 py-3">
                            <span class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td class="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => openUserEdit(user)}
                              class="text-gray-600 hover:text-gray-900 text-sm font-medium"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile cards */}
                  <div class="sm:hidden space-y-3">
                    {usersList.value.map((user) => (
                      <div key={user.id} class="bg-gray-50 rounded-lg p-4">
                        <div class="flex items-start justify-between mb-2">
                          <div>
                            <p class="font-medium text-gray-900">{user.name}</p>
                            <p class="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openUserEdit(user)}
                            class="text-gray-600 hover:text-gray-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 mt-3">
                          <span class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                            {user.role}
                          </span>
                          <span class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                          {user.calendarConnected ? (
                            <span class="text-xs text-green-600 capitalize">{user.providers?.[0] || "Calendar"}</span>
                          ) : (
                            <span class="text-xs text-gray-400">No calendar</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Solo upgrade prompt */}
              {isSolo && (
                <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-blue-900">Need more users?</h4>
                      <p class="text-sm text-blue-700 mt-1">
                        {isTrial
                          ? "Upgrade to a Team plan to add more users. Team plans start at $30/mo for up to 5 users ($25/mo billed annually)."
                          : "Upgrade to a Team plan to add more users. Team plans start at $30/mo for up to 5 users ($25/mo billed annually)."}
                      </p>
                      <button
                        type="button"
                        onClick={() => activeTab.value = "billing"}
                        class="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-700 hover:text-blue-900"
                      >
                        {isTrial ? "View plans" : "Upgrade plan"}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Booking Form Tab */}
          {activeTab.value === "fields" && (
            <div>
              <p class="text-sm text-gray-500 mb-6">Choose which information to collect from people booking meetings.</p>
              <div class="space-y-3">
                {(Object.entries(FIELD_LABELS) as [string, string][]).map(([field, label]) => {
                  const config = intakeConfig.value.standardFields.find((f) => f.field === field);
                  const isEmail = field === "email";
                  return (
                    <div key={field} class="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
                      <span class="text-sm text-gray-700 font-medium">{label}</span>
                      <div class="flex items-center gap-4 sm:gap-6">
                        <label class={`flex items-center gap-2 text-sm ${isEmail ? "text-gray-400" : "text-gray-600 cursor-pointer"}`}>
                          <input
                            type="checkbox"
                            checked={isEmail || config?.enabled}
                            disabled={isEmail}
                            onChange={(e) => updateIntakeField(field, "enabled", (e.target as HTMLInputElement).checked)}
                            class="rounded border-gray-300 text-gray-900 disabled:opacity-50"
                          />
                          <span>Collect</span>
                        </label>
                        <label class={`flex items-center gap-2 text-sm ${isEmail ? "text-gray-400" : "text-gray-600 cursor-pointer"}`}>
                          <input
                            type="checkbox"
                            checked={isEmail || config?.required}
                            disabled={isEmail}
                            onChange={(e) => updateIntakeField(field, "required", (e.target as HTMLInputElement).checked)}
                            class="rounded border-gray-300 text-gray-900 disabled:opacity-50"
                          />
                          <span>Required</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p class="mt-4 text-xs text-gray-400">Email is always required for booking confirmations.</p>

              {/* Custom Questions Section */}
              <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900">Custom Questions</h4>
                    <p class="text-xs text-gray-500 mt-1">Add your own questions. Use [Category]Label for grouping.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCustomQuestion}
                    class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Question
                  </button>
                </div>

                {intakeConfig.value.customQuestions.length === 0 ? (
                  <p class="text-sm text-gray-400 italic">No custom questions yet.</p>
                ) : (
                  <div class="space-y-3">
                    {intakeConfig.value.customQuestions.map((q) => (
                      <div key={q.id} class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="flex items-start gap-3">
                          {/* Label input */}
                          <div class="flex-1">
                            <input
                              type="text"
                              value={q.label}
                              onInput={(e) => updateCustomQuestion(q.id, { label: (e.target as HTMLInputElement).value })}
                              placeholder="e.g., [Services]Fractional CTO or just Question text"
                              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                          </div>

                          {/* Type dropdown */}
                          <select
                            value={q.type}
                            onChange={(e) => updateCustomQuestion(q.id, { type: (e.target as HTMLSelectElement).value as CustomIntakeQuestion["type"] })}
                            class="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="select">Dropdown</option>
                            <option value="checkbox">Checkbox</option>
                          </select>

                          {/* Required toggle */}
                          <label class="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={q.required}
                              onChange={(e) => updateCustomQuestion(q.id, { required: (e.target as HTMLInputElement).checked })}
                              class="rounded border-gray-300 text-gray-900"
                            />
                            Required
                          </label>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => removeCustomQuestion(q.id)}
                            class="p-1 text-gray-400 hover:text-red-500"
                            title="Remove question"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Options for select type */}
                        {q.type === "select" && (
                          <div class="mt-3 pl-0">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Options (one per line)</label>
                            <textarea
                              rows={3}
                              value={(q.options || []).join("\n")}
                              onInput={(e) => {
                                const lines = (e.target as HTMLTextAreaElement).value.split("\n").filter(l => l.trim());
                                updateCustomQuestion(q.id, { options: lines });
                              }}
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {intakeChanged.value && (
                <div class="mt-6">
                  <SaveButton saving={savingIntake.value} onClick={saveIntake} label="Save Booking Form Fields" />
                </div>
              )}
            </div>
          )}

          {/* Policies Tab */}
          {activeTab.value === "policies" && (
            <div>
              <p class="text-sm text-gray-500 mb-6">Add legal disclaimers, AI policies, or other disclosures shown before booking.</p>

              {/* Policy Editor Modal */}
              {editingPolicy.value && (
                <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div class="bg-white rounded-xl max-w-lg w-full">
                    <div class="p-6">
                      <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        {isNewPolicy.value ? "Add Policy" : "Edit Policy"}
                      </h3>
                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={editingPolicy.value.title}
                            onInput={(e) => editingPolicy.value = { ...editingPolicy.value!, title: (e.target as HTMLInputElement).value }}
                            placeholder="e.g., AI Disclosure Policy"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                          <textarea
                            rows={6}
                            value={editingPolicy.value.content}
                            onInput={(e) => editingPolicy.value = { ...editingPolicy.value!, content: (e.target as HTMLTextAreaElement).value }}
                            placeholder="Enter the policy text..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingPolicy.value.requireAcknowledgment}
                            onChange={(e) => editingPolicy.value = { ...editingPolicy.value!, requireAcknowledgment: (e.target as HTMLInputElement).checked }}
                            class="rounded border-gray-300 text-gray-900"
                          />
                          <span class="text-sm text-gray-700">Require acknowledgment before booking</span>
                        </label>
                      </div>
                      <div class="flex gap-3 mt-6">
                        <button type="button" onClick={() => editingPolicy.value = null} class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={savePolicy}
                          disabled={!editingPolicy.value.title.trim() || !editingPolicy.value.content.trim()}
                          class="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50"
                        >
                          {isNewPolicy.value ? "Add Policy" : "Update Policy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {policies.value.length === 0 ? (
                <div class="text-center py-12">
                  <p class="text-gray-500 mb-4">No policies configured yet.</p>
                  <button type="button" onClick={addPolicy} class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black">
                    Add Your First Policy
                  </button>
                </div>
              ) : (
                <div class="space-y-3">
                  {policies.value.map((policy) => (
                    <div key={policy.id} class="p-4 bg-gray-50 rounded-lg">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium text-gray-900">{policy.title}</span>
                            <span class={`text-xs px-2 py-0.5 rounded-full ${policy.enabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                              {policy.enabled ? "Active" : "Disabled"}
                            </span>
                            {policy.requireAcknowledgment && (
                              <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Requires Ack</span>
                            )}
                          </div>
                          <p class="text-sm text-gray-600 line-clamp-2">{policy.content}</p>
                        </div>
                        <div class="flex items-center gap-1">
                          <button type="button" onClick={() => togglePolicyEnabled(policy.id)} class="p-2 text-gray-500 hover:text-gray-700" title={policy.enabled ? "Disable" : "Enable"}>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {policy.enabled ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              )}
                            </svg>
                          </button>
                          <button type="button" onClick={() => editPolicy(policy)} class="p-2 text-gray-500 hover:text-gray-700" title="Edit">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button type="button" onClick={() => deletePolicy(policy.id)} class="p-2 text-red-500 hover:text-red-700" title="Delete">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addPolicy} class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600">
                    + Add Another Policy
                  </button>
                </div>
              )}

              {policiesChanged.value && (
                <div class="mt-6">
                  <SaveButton saving={savingPolicies.value} onClick={savePolicies} label="Save Policies" />
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab.value === "billing" && (
            <div>
              <BillingSection
                orgPlan={orgPlan}
                isTrial={isTrial}
                trialDaysRemaining={trialDaysRemaining}
                subscriptionStatus={subscriptionStatus}
                currentPeriodEnd={currentPeriodEnd}
                cancelAtPeriodEnd={cancelAtPeriodEnd}
              />
            </div>
          )}
        </div>
      </div>

      {/* User Edit Slideout */}
      <SlidePanel
        isOpen={editingUser.value !== null}
        onClose={closeUserEdit}
        title="Manage User"
      >
        {editingUser.value && (
          <div class="space-y-6">
            {userError.value && (
              <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {userError.value}
              </div>
            )}

            {/* User Info (read-only) */}
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">User Info</h3>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-500">Name</dt>
                  <dd class="text-gray-900">{editingUser.value.name}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Email</dt>
                  <dd class="text-gray-900">{editingUser.value.email}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Booking URL</dt>
                  <dd>
                    <a
                      href={`https://book.snivel.app/${editingUser.value.slug}/${slug.value}`}
                      target="_blank"
                      class="text-blue-600 hover:underline"
                    >
                      book.snivel.app/{editingUser.value.slug}/{slug.value}
                    </a>
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Settings</dt>
                  <dd>
                    <a
                      href={`https://book.snivel.app/${editingUser.value.slug}/settings`}
                      target="_blank"
                      class="text-blue-600 hover:underline"
                    >
                      User settings page
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Role & Status */}
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editUserRole.value}
                  onChange={(e) => editUserRole.value = (e.target as HTMLSelectElement).value}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <p class="mt-1 text-xs text-gray-500">Admins can manage organization settings and users</p>
              </div>

              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editUserActive"
                  checked={editUserActive.value}
                  onChange={(e) => editUserActive.value = (e.target as HTMLInputElement).checked}
                  class="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <label for="editUserActive" class="text-sm font-medium text-gray-700">
                  Active (can receive bookings)
                </label>
              </div>
            </div>

            {/* Calendar Status */}
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Calendar</h3>
              {editingUser.value.calendarConnected && editingUser.value.providers?.length ? (
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span class="text-green-600 font-medium text-sm">Connected</span>
                  <span class="text-gray-500 text-sm capitalize">({editingUser.value.providers[0]})</span>
                </div>
              ) : (
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span class="text-gray-500 text-sm">Not connected</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div class="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={saveUser}
                disabled={savingUser.value}
                class="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingUser.value && (
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {savingUser.value ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={deleteUserAction}
                disabled={deletingUser.value}
                class="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {deletingUser.value ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <p class="text-sm text-gray-500 mb-1">{label}</p>
      <p class="text-3xl font-bold text-gray-900">{value}</p>
      <p class="text-sm text-gray-500">{sublabel}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <div>
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

interface SettingRowProps {
  label: string;
  override: { value: boolean };
  children: ComponentChildren;
  isSolo?: boolean;
}

function SettingRow({ label, override, children, isSolo }: SettingRowProps) {
  return (
    <div class={`grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start ${isSolo ? "opacity-50" : ""}`}>
      <div class="flex sm:block items-center justify-between">
        <label class="block text-sm font-medium text-gray-700">{label}</label>
        <label class={`flex items-center gap-2 mt-0 sm:mt-1 text-xs text-gray-500 ${isSolo ? "cursor-not-allowed" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            checked={isSolo ? true : override.value}
            onChange={(e) => !isSolo && (override.value = (e.target as HTMLInputElement).checked)}
            disabled={isSolo}
            class="rounded border-gray-300 text-gray-900 h-3 w-3 disabled:opacity-50"
          />
          <span>Users can customize</span>
        </label>
      </div>
      <div class={`sm:col-span-2 ${isSolo ? "pointer-events-none" : ""}`}>{children}</div>
    </div>
  );
}

interface SaveButtonProps {
  saving: boolean;
  onClick: () => void;
  label: string;
}

function SaveButton({ saving, onClick, label }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      class={`px-6 py-2 font-medium rounded-lg transition-all flex items-center gap-2 ${
        saving
          ? "bg-gray-600 text-white cursor-wait"
          : "bg-gray-900 hover:bg-black text-white"
      }`}
    >
      {saving && (
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {saving ? "Saving..." : label}
    </button>
  );
}
