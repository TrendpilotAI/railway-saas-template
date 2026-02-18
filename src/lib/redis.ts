import Redis from "ioredis";

const getRedisClient = () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn("REDIS_URL not set, rate limiting disabled");
    return null;
  }
  return new Redis(url, { maxRetriesPerRequest: 3 });
};

export const redis = getRedisClient();

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  if (!redis) return { allowed: true, remaining: limit };

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}
