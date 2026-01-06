// App configuration

function getEnv(key: string): string | undefined {
  if (typeof Deno !== "undefined") {
    return Deno.env.get(key);
  }
  return undefined;
}

// URLs for Snivel apps
export const SNIVEL_APP_URL = getEnv("SNIVEL_APP_URL") || "http://localhost:3001";
export const SNIVEL_BOOK_URL = getEnv("SNIVEL_BOOK_URL") || "http://localhost:3002";
export const BASE_URL = getEnv("BASE_URL") || "http://localhost:5173";
