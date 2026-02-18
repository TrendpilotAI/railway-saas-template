import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./redis";

export interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
  keyPrefix?: string;
}

const defaultConfig: RateLimitConfig = {
  limit: 60,
  windowSeconds: 60,
  keyPrefix: "rl",
};

/**
 * Rate limiting helper for API routes.
 * Returns null if allowed, or a NextResponse with 429 if rate limited.
 */
export async function checkRateLimit(
  req: NextRequest,
  config: Partial<RateLimitConfig> = {}
): Promise<NextResponse | null> {
  const { limit, windowSeconds, keyPrefix } = { ...defaultConfig, ...config };

  // Use IP or forwarded-for as key
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${keyPrefix}:${ip}`;

  const { allowed } = await rateLimit(key, limit, windowSeconds);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "Retry-After": String(windowSeconds),
        },
      }
    );
  }

  return null;
}
