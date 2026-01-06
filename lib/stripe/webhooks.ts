/**
 * Stripe Webhook Handlers
 * Process incoming Stripe webhook events
 */

import type Stripe from "stripe";
import { getStripe, getWebhookSecret } from "./client.ts";
import { getPlanFromPriceId, getSeatsForPlan } from "./prices.ts";
import {
  getOrganizationByStripeCustomer,
  getOrganizationBySubscription,
  setStripeCustomer,
  setSubscription,
  reactivateOrganization,
  trackPaymentFailure,
  clearPaymentFailure,
  type SubscriptionStatus,
  type PlanType,
} from "../db/orgs.ts";

/**
 * Verify webhook signature and construct event
 * Throws if signature is invalid
 * Uses async version required for Deno Deploy
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<Stripe.Event> {
  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();

  return await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
}

/**
 * Handle checkout.session.completed event
 * Called when a customer completes payment
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log("[Stripe] Checkout completed:", session.id);

  const orgId = session.client_reference_id || session.metadata?.orgId;
  if (!orgId) {
    console.error("[Stripe] No orgId in checkout session:", session.id);
    return;
  }

  const stripe = getStripe();

  // Get the subscription details
  if (!session.subscription) {
    console.error("[Stripe] No subscription in checkout session:", session.id);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const priceId = subscription.items.data[0]?.price.id;
  const planInfo = priceId ? getPlanFromPriceId(priceId) : null;

  // Store Stripe customer ID
  if (session.customer) {
    await setStripeCustomer(orgId, session.customer as string);

    // Set the subscription's payment method as the customer's default
    const customerId = typeof session.customer === "string"
      ? session.customer
      : session.customer.id;
    const paymentMethodId = subscription.default_payment_method;

    if (paymentMethodId && typeof paymentMethodId === "string") {
      try {
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
        console.log("[Stripe] Set default payment method for customer:", customerId);
      } catch (err) {
        console.error("[Stripe] Failed to set default payment method:", err);
      }
    }
  }

  // Update subscription info
  await setSubscription(orgId, subscription.id, {
    subscriptionStatus: mapStripeStatus(subscription.status),
    subscriptionPriceId: priceId,
    billingInterval: planInfo?.interval,
    currentPeriodEnd: subscription.current_period_end * 1000,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    plan: planInfo?.plan as PlanType || "solo",
    maxSeats: planInfo?.plan ? getSeatsForPlan(planInfo.plan) : 1,
  });

  // Reactivate if was frozen/soft-deleted
  await reactivateOrganization(orgId);

  console.log("[Stripe] Subscription activated for org:", orgId);
}

/**
 * Handle customer.subscription.updated event
 * Called when subscription changes (plan change, renewal, etc.)
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log("[Stripe] Subscription updated:", subscription.id);

  const org = await getOrganizationBySubscription(subscription.id);
  if (!org) {
    // Try to find by customer ID
    const customerId = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
    const orgByCustomer = await getOrganizationByStripeCustomer(customerId);

    if (!orgByCustomer) {
      console.error("[Stripe] No org found for subscription:", subscription.id);
      return;
    }

    // Update the subscription ID index
    await setSubscription(orgByCustomer.id, subscription.id, {});
  }

  const orgId = org?.id || (await getOrganizationByStripeCustomer(
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id
  ))?.id;

  if (!orgId) {
    console.error("[Stripe] Could not find org for subscription update");
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const planInfo = priceId ? getPlanFromPriceId(priceId) : null;

  await setSubscription(orgId, subscription.id, {
    subscriptionStatus: mapStripeStatus(subscription.status),
    subscriptionPriceId: priceId,
    currentPeriodEnd: subscription.current_period_end * 1000,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    plan: planInfo?.plan as PlanType,
    maxSeats: planInfo?.plan ? getSeatsForPlan(planInfo.plan) : undefined,
  });

  // If subscription is now active, clear any payment failure flags
  if (subscription.status === "active") {
    await clearPaymentFailure(orgId);
    await reactivateOrganization(orgId);
  }

  console.log("[Stripe] Subscription updated for org:", orgId);
}

/**
 * Handle customer.subscription.deleted event
 * Called when subscription is canceled
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log("[Stripe] Subscription deleted:", subscription.id);

  const org = await getOrganizationBySubscription(subscription.id);
  if (!org) {
    console.error("[Stripe] No org found for deleted subscription:", subscription.id);
    return;
  }

  await setSubscription(org.id, subscription.id, {
    subscriptionStatus: "canceled",
    cancelAtPeriodEnd: false,
  });

  // Note: We don't immediately freeze - let them use until currentPeriodEnd
  // The cron job will freeze when the period actually ends

  console.log("[Stripe] Subscription canceled for org:", org.id);
}

/**
 * Handle invoice.payment_failed event
 * Called when a payment attempt fails
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log("[Stripe] Payment failed for invoice:", invoice.id);

  const customerId = typeof invoice.customer === "string"
    ? invoice.customer
    : invoice.customer?.id;

  if (!customerId) {
    console.error("[Stripe] No customer ID in failed invoice");
    return;
  }

  const org = await getOrganizationByStripeCustomer(customerId);
  if (!org) {
    console.error("[Stripe] No org found for customer:", customerId);
    return;
  }

  await trackPaymentFailure(org.id);

  // TODO: Send payment failed email notification

  console.log("[Stripe] Payment failure tracked for org:", org.id);
}

/**
 * Handle invoice.paid event
 * Called when payment succeeds
 */
export async function handleInvoicePaid(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log("[Stripe] Invoice paid:", invoice.id);

  const customerId = typeof invoice.customer === "string"
    ? invoice.customer
    : invoice.customer?.id;

  if (!customerId) return;

  const org = await getOrganizationByStripeCustomer(customerId);
  if (!org) return;

  // Clear payment failure if this was a retry
  await clearPaymentFailure(org.id);

  // Reactivate if was frozen due to payment failure
  if (org.accountStatus === "frozen" && org.paymentFailedAt) {
    await reactivateOrganization(org.id);
  }

  console.log("[Stripe] Payment success recorded for org:", org.id);
}

/**
 * Map Stripe subscription status to our status type
 */
function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "unpaid":
      return "unpaid";
    case "incomplete":
    case "incomplete_expired":
    case "paused":
    default:
      return "past_due";
  }
}
