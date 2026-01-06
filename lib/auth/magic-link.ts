/**
 * Magic Link Token Manager
 * Handles creation and verification of magic link tokens for passwordless auth
 */

import { getKv } from "@/lib/db/kv.ts";

// Token TTLs by type
// Signup: 60 minutes (corporate email quarantine can take 10-15+ mins)
// Regular sign-in: 20 minutes (domain should be whitelisted by then)
const SIGNUP_TTL_MS = 60 * 60 * 1000;      // 60 minutes
const SIGNIN_TTL_MS = 20 * 60 * 1000;      // 20 minutes

function getTtlForType(type: MagicLinkToken["type"]): number {
  return type === "signup" ? SIGNUP_TTL_MS : SIGNIN_TTL_MS;
}

export interface MagicLinkToken {
  id: string;
  email: string;
  orgId?: string;
  userId?: string;
  plan?: "solo" | "team"; // For signup tokens
  type: "org_admin" | "user" | "signup";
  createdAt: number;
  expiresAt: number;
}

/**
 * Create a new magic link token
 */
export async function createMagicLinkToken(
  email: string,
  type: MagicLinkToken["type"],
  options?: { orgId?: string; userId?: string; plan?: "solo" | "team" }
): Promise<string> {
  const kv = await getKv();
  const id = crypto.randomUUID();
  const now = Date.now();
  const ttl = getTtlForType(type);

  const token: MagicLinkToken = {
    id,
    email,
    orgId: options?.orgId,
    userId: options?.userId,
    plan: options?.plan,
    type,
    createdAt: now,
    expiresAt: now + ttl,
  };

  await kv.set(["auth", "magic_links", id], token, { expireIn: ttl });

  return id;
}

/**
 * Verify and consume a magic link token (single-use)
 * Returns the token data if valid, null if invalid/expired/already used
 */
export async function consumeMagicLinkToken(tokenId: string): Promise<MagicLinkToken | null> {
  const kv = await getKv();
  const entry = await kv.get<MagicLinkToken>(["auth", "magic_links", tokenId]);

  if (!entry.value) {
    return null;
  }

  // Check expiration (double-check in case KV TTL hasn't fired)
  if (entry.value.expiresAt < Date.now()) {
    await kv.delete(["auth", "magic_links", tokenId]);
    return null;
  }

  // Delete token (single-use)
  await kv.delete(["auth", "magic_links", tokenId]);

  return entry.value;
}

/**
 * Verify a magic link token without consuming it
 * Used for checking validity before showing a page
 */
export async function verifyMagicLinkToken(tokenId: string): Promise<MagicLinkToken | null> {
  const kv = await getKv();
  const entry = await kv.get<MagicLinkToken>(["auth", "magic_links", tokenId]);

  if (!entry.value) {
    return null;
  }

  // Check expiration
  if (entry.value.expiresAt < Date.now()) {
    await kv.delete(["auth", "magic_links", tokenId]);
    return null;
  }

  return entry.value;
}

/**
 * Revoke a magic link token
 */
export async function revokeMagicLinkToken(tokenId: string): Promise<void> {
  const kv = await getKv();
  await kv.delete(["auth", "magic_links", tokenId]);
}
