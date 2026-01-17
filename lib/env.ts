/**
 * Environment-aware configuration utilities for getsnivel
 *
 * Enables timeline deployments to automatically route to the correct API.
 * See snivel-admin/lib/env.ts for detailed documentation.
 */

export type DeploymentEnv = "production" | "timeline" | "local";

const PRODUCTION_HOSTNAMES = new Set([
  "getsnivel.com",
  "www.getsnivel.com",
  "getsnivel.odov.deno.net",
]);

// Pattern: getsnivel--{branch}.odov.deno.net
const TIMELINE_PATTERN = /^getsnivel--([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\.odov\.deno\.net$/;

function extractBranchFromHostname(hostname: string): string | null {
  const normalized = hostname.toLowerCase();
  const match = normalized.match(TIMELINE_PATTERN);
  if (!match) return null;
  const branch = match[1];
  if (branch.length > 50) return null;
  return branch;
}

export function getDeploymentEnvFromHostname(hostname: string): DeploymentEnv {
  const normalized = hostname.toLowerCase();
  if (PRODUCTION_HOSTNAMES.has(normalized)) return "production";
  if (extractBranchFromHostname(normalized)) return "timeline";
  if (normalized.includes("localhost") || normalized.startsWith("127.")) return "local";
  return "production";
}

export function getApiUrlForRequest(requestHostname: string): string {
  const explicitUrl = Deno.env.get("SNIVEL_API_URL");
  const branch = extractBranchFromHostname(requestHostname);

  if (branch) {
    return `https://snivel-api--${branch}.odov.deno.net/api/v1`;
  }

  return explicitUrl || "https://api.snivel.app/api/v1";
}

export function getStaticApiUrl(): string {
  return Deno.env.get("SNIVEL_API_URL") || "https://api.snivel.app/api/v1";
}
