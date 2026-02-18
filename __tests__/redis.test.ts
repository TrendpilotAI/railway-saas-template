// Test rate limiting logic without actual Redis connection
describe("Rate limiting", () => {
  it("should allow requests when Redis is not configured", async () => {
    // Clear any existing REDIS_URL
    const original = process.env.REDIS_URL;
    delete process.env.REDIS_URL;
    
    // Re-import to get null redis
    jest.resetModules();
    const { rateLimit } = await import("@/lib/redis");
    
    const result = await rateLimit("test-key", 10, 60);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(10);
    
    // Restore
    if (original) process.env.REDIS_URL = original;
  });
});
