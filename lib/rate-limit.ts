type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function registerFailedAttempt(
  key: string,
  max = 5,
  windowMs = 15 * 60 * 1000,
): boolean {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  return current.count > max;
}
