import { PLANS } from "@/lib/stripe";

describe("PLANS configuration", () => {
  it("should have three tiers", () => {
    expect(Object.keys(PLANS)).toEqual(["FREE", "PRO", "ENTERPRISE"]);
  });

  it("should have correct pricing", () => {
    expect(PLANS.FREE.price).toBe(0);
    expect(PLANS.PRO.price).toBe(29);
    expect(PLANS.ENTERPRISE.price).toBe(99);
  });

  it("should have API call limits in ascending order", () => {
    expect(PLANS.FREE.limits.apiCalls).toBeLessThan(PLANS.PRO.limits.apiCalls);
    expect(PLANS.PRO.limits.apiCalls).toBeLessThan(PLANS.ENTERPRISE.limits.apiCalls);
  });

  it("FREE plan should not have a priceId", () => {
    expect((PLANS.FREE as any).priceId).toBeUndefined();
  });

  it("paid plans should have priceId fields", () => {
    expect(PLANS.PRO).toHaveProperty("priceId");
    expect(PLANS.ENTERPRISE).toHaveProperty("priceId");
  });
});
