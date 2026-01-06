/**
 * Deno KV Database Connection
 * Provides a singleton KV instance with in-memory fallback for development
 */

export interface KvLike {
  get<T>(key: Deno.KvKey): Promise<{ value: T | null; versionstamp: string | null }>;
  set(key: Deno.KvKey, value: unknown, options?: { expireIn?: number }): Promise<{ ok: boolean }>;
  delete(key: Deno.KvKey): Promise<void>;
  list<T>(options: { prefix: Deno.KvKey }): AsyncIterable<{ key: Deno.KvKey; value: T }>;
}

// In-memory store for development
const memoryStore = new Map<string, { value: unknown; expiresAt?: number }>();

function keyToString(key: Deno.KvKey): string {
  return JSON.stringify(key);
}

function createMemoryKv(): KvLike {
  return {
    async get<T>(key: Deno.KvKey) {
      const k = keyToString(key);
      const entry = memoryStore.get(k);
      if (!entry) return { value: null, versionstamp: null };
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        memoryStore.delete(k);
        return { value: null, versionstamp: null };
      }
      return { value: entry.value as T, versionstamp: "memory" };
    },
    async set(key: Deno.KvKey, value: unknown, options?: { expireIn?: number }) {
      const k = keyToString(key);
      memoryStore.set(k, {
        value,
        expiresAt: options?.expireIn ? Date.now() + options.expireIn : undefined,
      });
      return { ok: true };
    },
    async delete(key: Deno.KvKey) {
      memoryStore.delete(keyToString(key));
    },
    async *list<T>(options: { prefix: Deno.KvKey }) {
      const prefixStr = JSON.stringify(options.prefix).slice(0, -1); // Remove trailing ]
      for (const [k, entry] of memoryStore.entries()) {
        if (k.startsWith(prefixStr)) {
          if (entry.expiresAt && entry.expiresAt < Date.now()) {
            memoryStore.delete(k);
            continue;
          }
          yield { key: JSON.parse(k) as Deno.KvKey, value: entry.value as T };
        }
      }
    },
  };
}

let _kv: KvLike | null = null;

export async function getKv(): Promise<KvLike> {
  if (!_kv) {
    if (typeof Deno !== "undefined" && typeof Deno.openKv === "function") {
      try {
        // On Deno Deploy, call without args to use provisioned KV
        // Locally, this uses the default local KV store
        _kv = await Deno.openKv() as unknown as KvLike;
        console.log("Using Deno KV");
      } catch (e) {
        console.log("Deno KV not available, using in-memory store:", e);
        _kv = createMemoryKv();
      }
    } else {
      console.log("Using in-memory store for development");
      _kv = createMemoryKv();
    }
  }
  return _kv;
}
