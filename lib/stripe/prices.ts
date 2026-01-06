/**
 * Stripe Price Mappings
 * Maps plan types to Stripe price IDs
 *
 * NOTE: These price IDs must match the ones created in the Stripe Dashboard.
 * Use environment variables for flexibility between test/live modes.
 */

import type { PlanType } from "../db/orgs.ts";

export interface PriceConfig {
  monthly: string;
  annual: string;
  seats: number;          // Max seats for this tier (-1 for unlimited/per-seat)
  monthlyAmount: number;  // Price in cents for display
  annualAmount: number;   // Price in cents for display
}

/**
 * Price configurations for each plan tier
 * Price IDs will be populated from environment or use defaults
 */
function getEnv(key: string): string | undefined {
  if (typeof Deno !== "undefined") {
    return Deno.env.get(key);
  }
  return undefined;
}

// Minimum users for team150plus (metered billing)
export const TEAM150PLUS_MINIMUM_USERS = 151;

export const PRICE_MAP: Record<string, PriceConfig> = {
  solo: {
    monthly: getEnv("STRIPE_BOOK_PRICE_SOLO_MONTHLY") || "price_solo_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_SOLO_ANNUAL") || "price_solo_annual",
    seats: 1,
    monthlyAmount: 600,     // $6.00
    annualAmount: 6000,     // $60.00 (17% off)
  },
  team5: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM5_MONTHLY") || "price_team5_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM5_ANNUAL") || "price_team5_annual",
    seats: 5,
    monthlyAmount: 3000,    // $30.00
    annualAmount: 30000,    // $300.00 (17% off)
  },
  team10: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM10_MONTHLY") || "price_team10_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM10_ANNUAL") || "price_team10_annual",
    seats: 10,
    monthlyAmount: 5400,    // $54.00
    annualAmount: 54000,    // $540.00 (17% off)
  },
  team25: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM25_MONTHLY") || "price_team25_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM25_ANNUAL") || "price_team25_annual",
    seats: 25,
    monthlyAmount: 12000,   // $120.00
    annualAmount: 120000,   // $1,200.00 (17% off)
  },
  team50: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM50_MONTHLY") || "price_team50_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM50_ANNUAL") || "price_team50_annual",
    seats: 50,
    monthlyAmount: 21000,   // $210.00
    annualAmount: 210000,   // $2,100.00 (17% off)
  },
  team75: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM75_MONTHLY") || "price_team75_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM75_ANNUAL") || "price_team75_annual",
    seats: 75,
    monthlyAmount: 30000,   // $300.00
    annualAmount: 300000,   // $3,000.00 (17% off)
  },
  team100: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM100_MONTHLY") || "price_team100_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM100_ANNUAL") || "price_team100_annual",
    seats: 100,
    monthlyAmount: 42000,   // $420.00
    annualAmount: 420000,   // $4,200.00 (17% off)
  },
  team150: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM150_MONTHLY") || "price_team150_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM150_ANNUAL") || "price_team150_annual",
    seats: 150,
    monthlyAmount: 45000,   // $450.00
    annualAmount: 450000,   // $4,500.00 (17% off)
  },
  team150plus: {
    monthly: getEnv("STRIPE_BOOK_PRICE_TEAM150PLUS_MONTHLY") || "price_team150plus_monthly",
    annual: getEnv("STRIPE_BOOK_PRICE_TEAM150PLUS_ANNUAL") || "price_team150plus_annual",
    seats: -1,              // Unlimited (per-seat pricing, 151 minimum)
    monthlyAmount: 300,     // $3.00 per user (metered, 151 min = $453/mo)
    annualAmount: 3600,     // $36.00 per user (licensed, no discount - $3/mo floor)
  },
};

/**
 * Get the Stripe price ID for a plan and billing interval
 * Returns null if plan not found or interval not available (e.g., annual for team150plus)
 */
export function getPriceId(plan: string, interval: "month" | "year"): string | null {
  // Strip "-trial" suffix if present
  const basePlan = plan.replace("-trial", "");
  const config = PRICE_MAP[basePlan];
  if (!config) return null;
  const priceId = interval === "month" ? config.monthly : config.annual;
  // Return null if price ID is empty (e.g., no annual for team150plus)
  return priceId || null;
}

/**
 * Get the plan type and interval from a Stripe price ID
 */
export function getPlanFromPriceId(priceId: string): { plan: PlanType; interval: "month" | "year" } | null {
  for (const [plan, config] of Object.entries(PRICE_MAP)) {
    if (config.monthly === priceId) {
      return { plan: plan as PlanType, interval: "month" };
    }
    if (config.annual === priceId) {
      return { plan: plan as PlanType, interval: "year" };
    }
  }
  return null;
}

/**
 * Get price config for a plan
 */
export function getPriceConfig(plan: string): PriceConfig | null {
  const basePlan = plan.replace("-trial", "");
  return PRICE_MAP[basePlan] || null;
}

/**
 * Get max seats for a paid plan
 */
export function getSeatsForPlan(plan: string): number {
  const config = getPriceConfig(plan);
  return config?.seats ?? 1;
}

/**
 * Check if a plan supports annual billing
 * All plans support annual billing
 */
export function supportsAnnualBilling(plan: string): boolean {
  const basePlan = plan.replace("-trial", "");
  const config = PRICE_MAP[basePlan];
  return !!config?.annual;
}

/**
 * Check if annual billing for this plan uses licensed (quantity-based) pricing
 * vs metered (usage-reported) pricing
 * - team150plus annual = licensed (set quantity, prorate changes)
 * - team150plus monthly = metered (report usage)
 */
export function isLicensedAnnual(plan: string): boolean {
  const basePlan = plan.replace("-trial", "");
  return basePlan === "team150plus";
}

/**
 * Check if a plan uses per-seat (metered) billing
 */
export function isPerSeatPlan(plan: string): boolean {
  const basePlan = plan.replace("-trial", "");
  return basePlan === "team150plus";
}

/**
 * Determine which team plan tier a seat count falls into
 */
export function getPlanForSeats(seats: number): PlanType {
  if (seats <= 1) return "solo";
  if (seats <= 5) return "team5";
  if (seats <= 10) return "team10";
  if (seats <= 25) return "team25";
  if (seats <= 50) return "team50";
  if (seats <= 75) return "team75";
  if (seats <= 100) return "team100";
  if (seats <= 150) return "team150";
  return "team150plus";
}
