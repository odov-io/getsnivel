/**
 * API client for signup operations
 * Calls api.snivel.app for org/user creation
 */

const API_BASE = Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";

interface CheckEmailResponse {
  exists: boolean;
  orgId?: string;
  orgSlug?: string;
}

interface CheckSlugResponse {
  available: boolean;
}

interface CreateOrgResponse {
  success: boolean;
  org: {
    id: string;
    slug: string;
    name: string;
    email: string;
    plan: string;
  };
  user: {
    id: string;
    slug: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
}

interface CleanupOrphanResponse {
  cleaned: boolean;
  orgId?: string;
  reason?: string;
}

export async function checkEmailExists(email: string): Promise<CheckEmailResponse> {
  try {
    const res = await fetch(`${API_BASE}/signup/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      console.error("Check email API error:", res.status);
      return { exists: false };
    }

    return res.json();
  } catch (error) {
    console.error("Check email error:", error);
    return { exists: false };
  }
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/signup/check-slug`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    if (!res.ok) {
      console.error("Check slug API error:", res.status);
      return false;
    }

    const data: CheckSlugResponse = await res.json();
    return data.available;
  } catch (error) {
    console.error("Check slug error:", error);
    return false;
  }
}

export async function createOrgAndUser(params: {
  orgName: string;
  orgSlug: string;
  email: string;
  userName: string;
  plan?: string;
}): Promise<CreateOrgResponse> {
  try {
    const res = await fetch(`${API_BASE}/signup/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        org: { id: "", slug: "", name: "", email: "", plan: "" },
        user: { id: "", slug: "", email: "", name: "", role: "" },
        error: data.error || "Failed to create organization",
      };
    }

    return data;
  } catch (error) {
    console.error("Create org error:", error);
    return {
      success: false,
      org: { id: "", slug: "", name: "", email: "", plan: "" },
      user: { id: "", slug: "", email: "", name: "", role: "" },
      error: error instanceof Error ? error.message : "Failed to create organization",
    };
  }
}

export async function cleanupOrphanedOrg(email: string): Promise<CleanupOrphanResponse> {
  try {
    const res = await fetch(`${API_BASE}/signup/cleanup-orphan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      console.error("Cleanup orphan API error:", res.status);
      return { cleaned: false };
    }

    return res.json();
  } catch (error) {
    console.error("Cleanup orphan error:", error);
    return { cleaned: false };
  }
}
