/**
 * Billing Section Island
 * Shows subscription status and allows plan management
 */

import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

// Stripe types
declare global {
  interface Window {
    Stripe?: (key: string) => StripeInstance;
  }
}

interface StripeInstance {
  initEmbeddedCheckout: (options: { clientSecret: string }) => Promise<EmbeddedCheckout>;
}

interface EmbeddedCheckout {
  mount: (element: HTMLElement | string) => void;
  unmount: () => void;
  destroy: () => void;
}

interface BillingSectionProps {
  orgPlan: string;
  isTrial: boolean;
  trialDaysRemaining: number;
  subscriptionStatus?: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
}

// Plan display names
const PLAN_NAMES: Record<string, string> = {
  "solo-trial": "Solo (Trial)",
  "solo": "Solo",
  "team-trial": "Team (Trial)",
  "team5": "Team",
  "team10": "Team",
  "team25": "Team",
  "team50": "Team",
  "team75": "Team",
  "team100": "Team",
  "team150": "Team",
  "team150plus": "Team",
};

const PLAN_SEATS: Record<string, string> = {
  "solo": "1 user",
  "solo-trial": "1 user",
  "team5": "Up to 5 users",
  "team10": "Up to 10 users",
  "team25": "Up to 25 users",
  "team50": "Up to 50 users",
  "team75": "Up to 75 users",
  "team100": "Up to 100 users",
  "team150": "Up to 150 users",
  "team150plus": "151+ users",
};

// Pricing for display (flat-rate tiers)
const PRICING: Record<string, { monthly: number; annual: number }> = {
  solo: { monthly: 6, annual: 60 },
  team5: { monthly: 30, annual: 300 },
  team10: { monthly: 54, annual: 540 },
  team25: { monthly: 120, annual: 1200 },
  team50: { monthly: 210, annual: 2100 },
  team75: { monthly: 300, annual: 3000 },
  team100: { monthly: 420, annual: 4200 },
  team150: { monthly: 450, annual: 4500 },
};

// Billing info from Stripe
interface BillingInfo {
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  upcomingInvoice: {
    amountDue: number;
    dueDate: number | null;
  } | null;
  invoices: {
    id: string;
    number: string | null;
    amountPaid: number;
    status: string;
    created: number;
    invoicePdf: string | null;
  }[];
}

function formatDate(timestamp: number | string | undefined | null): string {
  if (!timestamp) return "";
  const ts = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
  if (!ts || isNaN(ts)) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function BillingSection({
  orgPlan,
  isTrial,
  trialDaysRemaining,
  subscriptionStatus,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: BillingSectionProps) {
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const selectedPlan = useSignal(orgPlan.replace("-trial", ""));
  const selectedInterval = useSignal<"month" | "year">("year");
  const checkoutLoading = useSignal(false);
  const billingInfo = useSignal<BillingInfo | null>(null);
  const billingLoading = useSignal(false);

  // Embedded checkout
  const showCheckout = useSignal(false);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const checkoutInstance = useRef<EmbeddedCheckout | null>(null);

  // Plan change state (for all subscribers)
  const showPlanChange = useSignal(false);
  const planChangeLoading = useSignal(false);
  const newPlan = useSignal("team5");
  const newInterval = useSignal<"month" | "year">("year");

  const basePlan = orgPlan.replace("-trial", "");
  const isActive = subscriptionStatus === "active";
  const isPastDue = subscriptionStatus === "past_due";
  const hasSubscription = isActive || isPastDue;
  const canChangePlan = hasSubscription && !isTrial;

  // Fetch billing info on mount for active subscriptions
  useEffect(() => {
    if (hasSubscription) {
      billingLoading.value = true;
      fetch("/api/stripe/billing")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            billingInfo.value = data;
          }
        })
        .catch(() => {})
        .finally(() => {
          billingLoading.value = false;
        });
    }
  }, []);

  // Cleanup checkout on unmount
  useEffect(() => {
    return () => {
      if (checkoutInstance.current) {
        checkoutInstance.current.destroy();
      }
    };
  }, []);

  // Load Stripe.js script
  const loadStripeJs = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Stripe) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Stripe.js"));
      document.head.appendChild(script);
    });
  };

  // Open Stripe Customer Portal
  const openBillingPortal = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to open billing portal");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to open billing portal";
      loading.value = false;
    }
  };

  // Start checkout for a plan
  const startCheckout = async () => {
    checkoutLoading.value = true;
    error.value = null;

    try {
      await loadStripeJs();

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan.value,
          interval: selectedInterval.value,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start checkout");
      }

      const { clientSecret, publishableKey } = await res.json();
      const stripe = window.Stripe!(publishableKey);
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });

      checkoutInstance.current = checkout;
      showCheckout.value = true;
      checkoutLoading.value = false;

      setTimeout(() => {
        if (checkoutRef.current) {
          checkout.mount(checkoutRef.current);
        }
      }, 0);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to start checkout";
      checkoutLoading.value = false;
    }
  };

  const cancelCheckout = () => {
    if (checkoutInstance.current) {
      checkoutInstance.current.destroy();
      checkoutInstance.current = null;
    }
    showCheckout.value = false;
  };

  // Change subscription plan (upgrade or downgrade)
  const changePlan = async () => {
    planChangeLoading.value = true;
    error.value = null;
    success.value = null;

    try {
      const res = await fetch("/api/stripe/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: newPlan.value,
          interval: newInterval.value,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change plan");
      }

      success.value = "Plan changed successfully! Changes will be reflected shortly.";
      showPlanChange.value = false;

      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to change plan";
    } finally {
      planChangeLoading.value = false;
    }
  };

  return (
    <div class="space-y-6">
      {/* Error display */}
      {error.value && (
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error.value}
        </div>
      )}

      {/* Success display */}
      {success.value && (
        <div class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success.value}
        </div>
      )}

      {/* Current Plan Card */}
      <div class="p-6 bg-gray-50 rounded-lg">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h3 class="text-xl font-semibold text-gray-900">
                {PLAN_NAMES[orgPlan] || orgPlan}
              </h3>
              {isTrial && (
                <span class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                  Trial
                </span>
              )}
              {isActive && !isTrial && (
                <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Active
                </span>
              )}
              {isPastDue && (
                <span class="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                  Past Due
                </span>
              )}
            </div>
            <p class="text-sm text-gray-500">
              {PLAN_SEATS[orgPlan] || ""}
            </p>
          </div>
          <div class="text-right">
            {isTrial ? (
              <p class="text-sm text-amber-600 font-medium">
                {trialDaysRemaining} days left in trial
              </p>
            ) : hasSubscription && currentPeriodEnd ? (
              <p class="text-sm text-gray-500">
                {cancelAtPeriodEnd ? "Ends" : "Renews"} {formatDate(currentPeriodEnd)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Plan Change Form (for all subscribers) */}
      {canChangePlan && showPlanChange.value && (
        <div class="p-6 bg-white border border-gray-200 rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Change Plan</h3>
            <button
              type="button"
              onClick={() => showPlanChange.value = false}
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          <p class="text-sm text-gray-600 mb-4">
            Current plan: <span class="font-medium">{PLAN_NAMES[orgPlan] || orgPlan}</span> ({PLAN_SEATS[orgPlan] || ""})
          </p>

          {/* Billing Toggle */}
          <div class="flex justify-center mb-6">
            <div class="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => newInterval.value = "month"}
                class={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  newInterval.value === "month"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => newInterval.value = "year"}
                class={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  newInterval.value === "year"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Annual <span class="text-green-600 text-xs ml-1">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Plan Selector */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select new plan</label>
            <select
              value={newPlan.value}
              onChange={(e) => newPlan.value = (e.target as HTMLSelectElement).value}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="solo">Solo (1 user) – ${newInterval.value === "year" ? "60/yr" : "6/mo"}</option>
              <option value="team5">Team 5 users – ${newInterval.value === "year" ? "300/yr" : "30/mo"}</option>
              <option value="team10">Team 10 users – ${newInterval.value === "year" ? "540/yr" : "54/mo"}</option>
              <option value="team25">Team 25 users – ${newInterval.value === "year" ? "1,200/yr" : "120/mo"}</option>
              <option value="team50">Team 50 users – ${newInterval.value === "year" ? "2,100/yr" : "210/mo"}</option>
              <option value="team75">Team 75 users – ${newInterval.value === "year" ? "3,000/yr" : "300/mo"}</option>
              <option value="team100">Team 100 users – ${newInterval.value === "year" ? "4,200/yr" : "420/mo"}</option>
              <option value="team150">Team 150 users – ${newInterval.value === "year" ? "4,500/yr" : "450/mo"}</option>
            </select>
          </div>

          <p class="text-xs text-gray-500 mb-4">
            {newPlan.value === basePlan
              ? "Select a different plan to make changes."
              : PRICING[newPlan.value]?.monthly > (PRICING[basePlan]?.monthly || 0)
                ? "You'll be charged the prorated difference immediately and your new plan will be active right away."
                : `You'll keep access to your current plan until ${currentPeriodEnd ? formatDate(currentPeriodEnd) : "the end of your billing period"}, then be charged at the new rate.`}
          </p>

          <button
            type="button"
            onClick={changePlan}
            disabled={planChangeLoading.value || newPlan.value === basePlan}
            class="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black disabled:opacity-50 transition-colors"
          >
            {planChangeLoading.value ? "Processing..." : "Confirm Change"}
          </button>
        </div>
      )}

      {/* Trial: Upgrade Section */}
      {isTrial && !showCheckout.value && (
        <div class="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>

          {/* Billing Toggle */}
          <div class="flex justify-center mb-6">
            <div class="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => selectedInterval.value = "month"}
                class={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedInterval.value === "month"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => selectedInterval.value = "year"}
                class={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedInterval.value === "year"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Annual <span class="text-green-600 text-xs ml-1">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Plan Selection */}
          <div class="grid sm:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => selectedPlan.value = "solo"}
              class={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedPlan.value === "solo"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div class="font-semibold text-gray-900 mb-1">Solo</div>
              <div class="text-sm text-gray-500 mb-2">For individuals</div>
              <div class="text-2xl font-bold text-gray-900">
                ${selectedInterval.value === "year" ? "5" : "6"}
                <span class="text-sm font-normal text-gray-500">/mo</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectedPlan.value = "team5"}
              class={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedPlan.value.startsWith("team")
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div class="font-semibold text-gray-900 mb-1">Team</div>
              <div class="text-sm text-gray-500 mb-2">For teams of any size</div>
              <div class="text-2xl font-bold text-gray-900">
                From ${selectedInterval.value === "year" ? "25" : "30"}
                <span class="text-sm font-normal text-gray-500">/mo</span>
              </div>
            </button>
          </div>

          {/* Team Size Selector */}
          {selectedPlan.value.startsWith("team") && (
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Team size</label>
              <select
                value={selectedPlan.value}
                onChange={(e) => selectedPlan.value = (e.target as HTMLSelectElement).value}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="team5">Up to 5 users – ${selectedInterval.value === "year" ? "300/yr" : "30/mo"}</option>
                <option value="team10">Up to 10 users – ${selectedInterval.value === "year" ? "540/yr" : "54/mo"}</option>
                <option value="team25">Up to 25 users – ${selectedInterval.value === "year" ? "1,200/yr" : "120/mo"}</option>
                <option value="team50">Up to 50 users – ${selectedInterval.value === "year" ? "2,100/yr" : "210/mo"}</option>
                <option value="team75">Up to 75 users – ${selectedInterval.value === "year" ? "3,000/yr" : "300/mo"}</option>
                <option value="team100">Up to 100 users – ${selectedInterval.value === "year" ? "4,200/yr" : "420/mo"}</option>
                <option value="team150">Up to 150 users – ${selectedInterval.value === "year" ? "4,500/yr" : "450/mo"}</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={startCheckout}
            disabled={checkoutLoading.value}
            class="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black disabled:opacity-50 transition-colors"
          >
            {checkoutLoading.value ? "Loading..." : "Subscribe Now"}
          </button>
          <p class="text-xs text-gray-500 text-center mt-3">
            Secure checkout powered by Stripe
          </p>
        </div>
      )}

      {/* Embedded Checkout */}
      {isTrial && showCheckout.value && (
        <div class="p-6 bg-white border border-gray-200 rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Complete Payment</h3>
            <button
              type="button"
              onClick={cancelCheckout}
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
          </div>
          <div ref={checkoutRef} class="min-h-[400px]" />
        </div>
      )}

      {/* Active Subscription: Billing Details */}
      {hasSubscription && (
        <>
          {/* Payment Method */}
          <div class="p-6 bg-white border border-gray-200 rounded-lg">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900">Payment Method</h3>
              <button
                type="button"
                onClick={openBillingPortal}
                disabled={loading.value}
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                {loading.value ? "Opening..." : "Update"}
              </button>
            </div>
            <div class="mt-3">
              {billingLoading.value ? (
                <div class="text-sm text-gray-400">Loading...</div>
              ) : billingInfo.value?.paymentMethod ? (
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-gray-700 uppercase">
                    {billingInfo.value.paymentMethod.brand}
                  </span>
                  <span class="text-sm text-gray-600">
                    •••• {billingInfo.value.paymentMethod.last4}
                  </span>
                  <span class="text-sm text-gray-400">
                    {billingInfo.value.paymentMethod.expMonth}/{billingInfo.value.paymentMethod.expYear}
                  </span>
                </div>
              ) : (
                <div class="text-sm text-gray-500">No payment method on file</div>
              )}
            </div>
          </div>

          {/* Next Payment */}
          {billingInfo.value?.upcomingInvoice && (
            <div class="p-6 bg-white border border-gray-200 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-3">Next Payment</h3>
              <div class="flex items-baseline justify-between">
                <span class="text-2xl font-bold text-gray-900">
                  {formatCurrency(billingInfo.value.upcomingInvoice.amountDue)}
                </span>
                <span class="text-sm text-gray-500">
                  {currentPeriodEnd ? formatDate(currentPeriodEnd) : ""}
                </span>
              </div>
              {cancelAtPeriodEnd && (
                <p class="mt-2 text-sm text-amber-600">
                  Your subscription will end after this payment period
                </p>
              )}
            </div>
          )}

          {/* Payment History */}
          <div class="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-4">Payment History</h3>
            {billingLoading.value ? (
              <div class="text-sm text-gray-400">Loading...</div>
            ) : billingInfo.value?.invoices && billingInfo.value.invoices.length > 0 ? (
              <div class="divide-y divide-gray-100">
                {billingInfo.value.invoices.map((invoice) => (
                  <div key={invoice.id} class="py-3 flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amountPaid)}
                      </div>
                      <div class="text-xs text-gray-500">{formatDate(invoice.created)}</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class={`text-xs px-2 py-0.5 rounded ${
                        invoice.status === "paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {invoice.status}
                      </span>
                      {invoice.invoicePdf && (
                        <a
                          href={invoice.invoicePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="text-sm text-gray-500">No payments yet</div>
            )}
          </div>

          {/* Manage Subscription */}
          <div class="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Manage Subscription</h3>
            <p class="text-sm text-gray-500 mb-4">
              Change your plan or manage billing details
            </p>
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  showPlanChange.value = true;
                  // Scroll to top to show the form
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
              >
                Change Plan
              </button>
              <button
                type="button"
                onClick={openBillingPortal}
                disabled={loading.value}
                class="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {loading.value ? "Opening..." : "Billing Portal"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Past Due Warning */}
      {isPastDue && (
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800">Payment failed</p>
              <p class="text-sm text-red-700 mt-1">
                Please update your payment method to avoid service interruption.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Warning */}
      {cancelAtPeriodEnd && currentPeriodEnd && !isPastDue && (
        <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-amber-800">Subscription ending</p>
              <p class="text-sm text-amber-700 mt-1">
                Your access will end on {formatDate(currentPeriodEnd)}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
