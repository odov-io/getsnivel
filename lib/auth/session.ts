/**
 * Session Manager
 * Handles org admin session creation, verification, and cookie management
 */

import { getKv } from "@/lib/db/kv.ts";

// Session TTL: 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_COOKIE_NAME = "snivel_session";

export interface Session {
  id: string;
  email: string;
  orgId: string;
  userId: string;
  role: "admin" | "member";
  createdAt: number;
  expiresAt: number;
}

/**
 * Create a new session
 */
export async function createSession(data: {
  email: string;
  orgId: string;
  userId: string;
  role: "admin" | "member";
}): Promise<string> {
  const kv = await getKv();
  const id = crypto.randomUUID();
  const now = Date.now();

  const session: Session = {
    id,
    email: data.email,
    orgId: data.orgId,
    userId: data.userId,
    role: data.role,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  await kv.set(["auth", "sessions", id], session, { expireIn: SESSION_TTL_MS });

  return id;
}

/**
 * Verify a session by ID
 */
export async function verifySession(sessionId: string): Promise<Session | null> {
  const kv = await getKv();
  const entry = await kv.get<Session>(["auth", "sessions", sessionId]);

  if (!entry.value) {
    return null;
  }

  // Check expiration
  if (entry.value.expiresAt < Date.now()) {
    await kv.delete(["auth", "sessions", sessionId]);
    return null;
  }

  return entry.value;
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const kv = await getKv();
  await kv.delete(["auth", "sessions", sessionId]);
}

/**
 * Get session from request cookies
 */
export async function getSessionFromRequest(req: Request): Promise<Session | null> {
  const cookies = req.headers.get("cookie") || "";
  const sessionCookie = cookies
    .split(";")
    .find((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!sessionCookie) {
    return null;
  }

  const sessionId = sessionCookie.split("=")[1]?.trim();
  if (!sessionId) {
    return null;
  }

  return verifySession(sessionId);
}

/**
 * Create a session cookie string
 */
export function createSessionCookie(sessionId: string): string {
  const maxAge = SESSION_TTL_MS / 1000; // Convert to seconds
  return `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

/**
 * Create a cookie string that clears the session
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Check if a session has admin privileges
 */
export function isAdmin(session: Session | null): boolean {
  return session?.role === "admin";
}
