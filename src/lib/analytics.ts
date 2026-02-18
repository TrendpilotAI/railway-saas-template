import prisma from "./prisma";

/**
 * Track API usage for a user on a specific endpoint.
 * Uses upsert to increment daily counters.
 */
export async function trackUsage(userId: string, endpoint: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.usageRecord.upsert({
    where: {
      userId_endpoint_date: { userId, endpoint, date: today },
    },
    update: { count: { increment: 1 } },
    create: { userId, endpoint, date: today, count: 1 },
  });
}

/**
 * Get usage summary for a user within a date range.
 */
export async function getUserUsage(
  userId: string,
  days: number = 30
): Promise<{ endpoint: string; total: number; daily: { date: string; count: number }[] }[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const records = await prisma.usageRecord.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "asc" },
  });

  const byEndpoint = new Map<string, { total: number; daily: { date: string; count: number }[] }>();

  for (const r of records) {
    const existing = byEndpoint.get(r.endpoint) || { total: 0, daily: [] };
    existing.total += r.count;
    existing.daily.push({ date: r.date.toISOString().split("T")[0], count: r.count });
    byEndpoint.set(r.endpoint, existing);
  }

  return Array.from(byEndpoint.entries()).map(([endpoint, data]) => ({
    endpoint,
    ...data,
  }));
}

/**
 * Get platform-wide analytics for admin dashboard.
 */
export async function getAdminAnalytics(days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalUsers, newUsers, totalCalls, dailyCalls] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.usageRecord.aggregate({
      where: { date: { gte: since } },
      _sum: { count: true },
    }),
    prisma.usageRecord.groupBy({
      by: ["date"],
      where: { date: { gte: since } },
      _sum: { count: true },
      orderBy: { date: "asc" },
    }),
  ]);

  return {
    totalUsers,
    newUsers,
    totalApiCalls: totalCalls._sum.count || 0,
    dailyApiCalls: dailyCalls.map((d) => ({
      date: d.date.toISOString().split("T")[0],
      count: d._sum.count || 0,
    })),
  };
}
