describe("Health endpoint", () => {
  it("should return status ok", async () => {
    // Import the handler
    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const data = await response.json();
    
    expect(data.status).toBe("ok");
    expect(data.timestamp).toBeDefined();
  });
});
