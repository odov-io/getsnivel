/**
 * GET/POST /auth/verify
 * Verify magic link token and create session
 *
 * GET: Show confirmation page (verifies but doesn't consume - prevents Safe Links issues)
 * POST: Actually consume token and create session
 */

import { define } from "@/utils.ts";
import { consumeMagicLinkToken, verifyMagicLinkToken, createMagicLinkToken } from "@/lib/auth/magic-link.ts";
import { createSession, createSessionCookie } from "@/lib/auth/session.ts";
import { getUserById } from "@/lib/db/users.ts";
import Logo from "@/components/Logo.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login?error=Missing+token" },
      });
    }

    // Just verify the token exists and is valid (don't consume yet)
    const tokenData = await verifyMagicLinkToken(token);

    if (!tokenData) {
      return {
        data: { error: "This link has expired or already been used.", token: null },
      };
    }

    // Show confirmation page
    return {
      data: { error: null, token, type: tokenData.type },
    };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const token = form.get("token")?.toString();

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login?error=Missing+token" },
      });
    }

    // NOW consume the magic link token (single use)
    const tokenData = await consumeMagicLinkToken(token);

    if (!tokenData) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login?error=Invalid+or+expired+link" },
      });
    }

    // Handle different token types
    switch (tokenData.type) {
      case "signup":
        // Redirect to complete signup - preserve plan info
        const signupUrl = new URL("/signup/complete", ctx.req.url);
        const newToken = await createMagicLinkToken(tokenData.email, "signup", {
          plan: tokenData.plan,
        });
        signupUrl.searchParams.set("token", newToken);
        return new Response(null, {
          status: 302,
          headers: { Location: signupUrl.href },
        });

      case "org_admin":
      case "user":
        if (!tokenData.userId || !tokenData.orgId) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=Invalid+token+data" },
          });
        }

        const user = await getUserById(tokenData.userId);
        if (!user) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=User+not+found" },
          });
        }

        const sessionId = await createSession({
          email: tokenData.email,
          orgId: tokenData.orgId,
          userId: tokenData.userId,
          role: user.role,
        });

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/dashboard",
            "Set-Cookie": createSessionCookie(sessionId),
          },
        });

      default:
        return new Response(null, {
          status: 302,
          headers: { Location: "/login?error=Unknown+token+type" },
        });
    }
  },
});

interface PageData {
  error: string | null;
  token: string | null;
  type?: string;
}

export default define.page<PageData>(function VerifyPage({ data }) {
  const { error, token, type } = data;

  if (error || !token) {
    return (
      <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div class="w-full max-w-md text-center">
          <div class="text-center mb-8">
            <a href="/"><Logo size="sm" /></a>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg aria-hidden="true" class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 class="text-xl font-semibold text-gray-900 mb-2">Link Expired</h1>
            <p class="text-gray-600 mb-6">{error}</p>
            <a href="/login" class="inline-block px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg">
              Request New Link
            </a>
          </div>
        </div>
      </div>
    );
  }

  const actionText = type === "signup" ? "Complete Signup" : "Sign In";

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md text-center">
        <div class="text-center mb-8">
          <a href="/"><Logo size="sm" /></a>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg aria-hidden="true" class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-xl font-semibold text-gray-900 mb-2">Email Verified</h1>
          <p class="text-gray-600 mb-6">Click below to continue</p>
          <form method="POST">
            <input type="hidden" name="token" value={token} />
            <button type="submit" class="w-full px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg">
              {actionText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});
