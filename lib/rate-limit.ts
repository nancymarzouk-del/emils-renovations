// Lightweight in-memory rate limiter (no external dependency).
// NOTE: per-server-instance and resets on restart — intended as basic abuse
// protection, not a distributed guarantee. For multi-instance production,
// swap the store for a shared one (e.g. Upstash/Redis).

type Entry = { count: number; reset: number }

const store = new Map<string, Entry>()

export type RateLimitOptions = { max: number; windowMs: number }

export function rateLimit(
  key: string,
  { max, windowMs }: RateLimitOptions
): { ok: boolean; remaining: number } {
  const now = Date.now()

  // Opportunistic cleanup so the map can't grow unbounded.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (now > v.reset) store.delete(k)
    }
  }

  const entry = store.get(key)
  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: max - 1 }
  }

  if (entry.count >= max) return { ok: false, remaining: 0 }

  entry.count += 1
  return { ok: true, remaining: max - entry.count }
}
