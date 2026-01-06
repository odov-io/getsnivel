/**
 * GET /dashboard
 * Unified dashboard - single page with tabs
 */

import { define } from "@/utils.ts";
import { listUsersByOrg, type User } from "@/lib/db/users.ts";
import { getOrganizationById, type Organization } from "@/lib/db/orgs.ts";
import Dashboard from "@/islands/Dashboard.tsx";
import IdleTimeout from "@/islands/IdleTimeout.tsx";

interface PageData {
  org: Organization;
  users: User[];
  error?: string;
  success?: string;
}

export const handler = define.handlers({
  async GET(ctx) {
    const session = ctx.state.session;
    if (!session) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    const [org, users] = await Promise.all([
      getOrganizationById(session.orgId),
      listUsersByOrg(session.orgId),
    ]);

    if (!org) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    const searchParams = new URL(ctx.req.url).searchParams;

    // Check for checkout success
    const checkoutStatus = searchParams.get("checkout");
    let success = searchParams.get("success") || undefined;

    if (checkoutStatus === "success") {
      success = "Payment successful! Your subscription is now active.";
    }

    return {
      data: {
        org,
        users,
        error: searchParams.get("error") || undefined,
        success,
      }
    };
  },
});

export default define.page<PageData>(function DashboardPage({ data }) {
  const { org, users, error, success } = data;

  return (
    <>
      <Dashboard
        orgId={org.id}
        orgName={org.name}
        orgSlug={org.slug}
        orgPlan={org.plan}
        orgCreatedAt={org.createdAt}
        settings={org.settings}
        users={users}
        error={error}
        success={success}
        subscriptionStatus={org.subscriptionStatus}
        currentPeriodEnd={org.currentPeriodEnd}
        cancelAtPeriodEnd={org.cancelAtPeriodEnd}
      />

      {/* Idle timeout warning */}
      <IdleTimeout
        warningAfterMinutes={15}
        countdownMinutes={5}
        logoutUrl="/logout"
      />
    </>
  );
});
