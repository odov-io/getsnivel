/**
 * Stripe Checkout Session Creation
 * Creates embedded checkout sessions for subscription purchases
 */

import type Stripe from "stripe";
import { getStripe } from "./client.ts";
import { getPriceId } from "./prices.ts";
import type { Organization } from "../db/orgs.ts";

/**
 * Get environment variable
 */
function getEnv(key: string): string | undefined {
  if (typeof Deno !== "undefined") {
    return Deno.env.get(key);
  }
  return undefined;
}

export interface CreateCheckoutOptions {
  org: Organization;
  plan: string;
  interval: "month" | "year";
  quantity?: number;      // For 100+ plans (number of seats)
}

/**
 * Create an embedded checkout session for subscription
 * Returns the client secret for rendering embedded checkout
 */
export async function createCheckoutSession(options: CreateCheckoutOptions): Promise<string> {
  const stripe = getStripe();
  const priceId = getPriceId(options.plan, options.interval);
  const baseUrl = getEnv("BASE_URL") || "http://localhost:5173";

  if (!priceId) {
    throw new Error(`Invalid plan: ${options.plan}`);
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    ui_mode: "embedded",
    return_url: `${baseUrl}/dashboard?tab=billing&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    client_reference_id: options.org.id,

    // Enable Stripe Tax for automatic tax calculation
    automatic_tax: { enabled: true },

    // Allow business customers to enter tax ID
    tax_id_collection: { enabled: true },

    line_items: [{
      price: priceId,
      quantity: options.quantity || 1,
    }],

    // Allow promotion codes/coupons
    allow_promotion_codes: true,

    // Save payment method as customer default
    payment_method_collection: "always",

    // Metadata for webhook processing
    metadata: {
      orgId: options.org.id,
      plan: options.plan,
      interval: options.interval,
    },

    subscription_data: {
      metadata: {
        orgId: options.org.id,
        plan: options.plan,
      },
    },
  };

  // If org already has a Stripe customer, use it
  if (options.org.stripeCustomerId) {
    sessionParams.customer = options.org.stripeCustomerId;
    // Update customer's default payment method on checkout
    sessionParams.customer_update = {
      name: "auto",
      address: "auto",
    };
  } else {
    // Pre-fill email for new customers
    sessionParams.customer_email = options.org.email;
    // For new customers, create with default payment method
    sessionParams.customer_creation = "always";
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.client_secret) {
    throw new Error("Failed to create checkout session");
  }

  return session.client_secret;
}

/**
 * Retrieve a checkout session by ID
 * Used to check session status after redirect
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "customer"],
  });
}

/**
 * Create a customer portal session
 * Allows customers to manage their subscription, update payment, view invoices
 */
export async function createPortalSession(stripeCustomerId: string): Promise<string> {
  const stripe = getStripe();
  const baseUrl = getEnv("BASE_URL") || "http://localhost:5173";

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${baseUrl}/dashboard?tab=billing`,
  });

  return session.url;
}
