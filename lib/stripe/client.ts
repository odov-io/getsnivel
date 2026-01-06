/**
 * Stripe Client
 * Initialize and manage Stripe SDK instance
 */

import Stripe from "stripe";

/**
 * Get environment variable
 */
function getEnv(key: string): string | undefined {
  if (typeof Deno !== "undefined") {
    return Deno.env.get(key);
  }
  return undefined;
}

let _stripe: Stripe | null = null;

/**
 * Get singleton Stripe instance
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = getEnv("STRIPE_SECRET_KEY");
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    _stripe = new Stripe(secretKey, {
      // Using clover API version - type assertion needed as SDK types lag behind
      apiVersion: "2025-12-15.clover" as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Get the publishable key for client-side use
 */
export function getPublishableKey(): string {
  const key = getEnv("STRIPE_PUBLISHABLE_KEY");
  if (!key) {
    console.warn("STRIPE_PUBLISHABLE_KEY not set");
    return "";
  }
  return key;
}

/**
 * Get the webhook secret for signature verification
 */
export function getWebhookSecret(): string {
  const secret = getEnv("STRIPE_WEBHOOK_SECRET");
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
  }
  return secret;
}
