/**
 * GET /api/stripe/billing
 * Fetch billing details for display (invoices, upcoming, payment method)
 */

import { define } from "@/utils.ts";
import { getSessionFromRequest } from "@/lib/auth/session.ts";
import { getOrganizationById } from "@/lib/db/orgs.ts";
import { getStripe } from "@/lib/stripe/client.ts";

export interface BillingInfo {
  // Current subscription
  plan: string;
  status: string;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;

  // Payment method
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;

  // Upcoming invoice
  upcomingInvoice: {
    amountDue: number;
    dueDate: number | null;
  } | null;

  // Recent invoices
  invoices: {
    id: string;
    number: string | null;
    amountPaid: number;
    status: string;
    created: number;
    invoicePdf: string | null;
  }[];
}

export const handler = define.handlers({
  async GET(ctx) {
    const session = await getSessionFromRequest(ctx.req);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await getOrganizationById(session.orgId);
    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    if (!org.stripeCustomerId) {
      return Response.json({ error: "No billing account" }, { status: 400 });
    }

    const stripe = getStripe();

    try {
      // Fetch customer with default payment method
      const customer = await stripe.customers.retrieve(org.stripeCustomerId, {
        expand: ["default_source", "invoice_settings.default_payment_method"],
      });

      if (customer.deleted) {
        return Response.json({ error: "Customer deleted" }, { status: 400 });
      }

      // Get payment method
      let paymentMethod: BillingInfo["paymentMethod"] = null;
      const pm = customer.invoice_settings?.default_payment_method;
      if (pm && typeof pm !== "string" && pm.type === "card" && pm.card) {
        paymentMethod = {
          brand: pm.card.brand || "unknown",
          last4: pm.card.last4 || "****",
          expMonth: pm.card.exp_month || 0,
          expYear: pm.card.exp_year || 0,
        };
      }

      // Get upcoming invoice
      let upcomingInvoice: BillingInfo["upcomingInvoice"] = null;
      try {
        const upcoming = await stripe.invoices.retrieveUpcoming({
          customer: org.stripeCustomerId,
        });
        upcomingInvoice = {
          amountDue: upcoming.amount_due,
          dueDate: upcoming.due_date ? upcoming.due_date * 1000 : null,
        };
      } catch {
        // No upcoming invoice (canceled subscription, etc.)
      }

      // Get recent invoices
      const invoiceList = await stripe.invoices.list({
        customer: org.stripeCustomerId,
        limit: 10,
      });

      const invoices: BillingInfo["invoices"] = invoiceList.data.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amountPaid: inv.amount_paid,
        status: inv.status || "unknown",
        created: inv.created * 1000,
        invoicePdf: inv.invoice_pdf,
      }));

      const billingInfo: BillingInfo = {
        plan: org.plan,
        status: org.subscriptionStatus || "none",
        currentPeriodEnd: org.currentPeriodEnd || null,
        cancelAtPeriodEnd: org.cancelAtPeriodEnd || false,
        paymentMethod,
        upcomingInvoice,
        invoices,
      };

      return Response.json(billingInfo);
    } catch (error) {
      console.error("[Billing] Failed to fetch billing info:", error);
      return Response.json(
        { error: "Failed to fetch billing info" },
        { status: 500 }
      );
    }
  },
});
