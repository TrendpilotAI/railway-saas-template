export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { PLANS } from "@/lib/stripe";
import type { Plan } from "@prisma/client";

export default async function UsagePage() {
  const session = await getSession();
  if (!session?.user) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const usage = await prisma.usageRecord.groupBy({
    by: ["endpoint"],
    where: { userId: session.user.id, date: { gte: thirtyDaysAgo } },
    _sum: { count: true },
  });

  const totalCalls = usage.reduce((sum, u) => sum + (u._sum.count || 0), 0);
  const plan = (user?.plan || "FREE") as Plan;
  const limit = PLANS[plan].limits.apiCalls;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold">🚀 SaaS Starter</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back to Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Usage</h1>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-gray-400 text-sm">API Calls (30 days)</div>
              <div className="text-3xl font-bold">{totalCalls.toLocaleString()} <span className="text-lg text-gray-400">/ {limit.toLocaleString()}</span></div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Plan</div>
              <div className="text-lg font-semibold">{plan}</div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${totalCalls / limit > 0.9 ? "bg-red-500" : "bg-indigo-500"}`}
              style={{ width: `${Math.min(100, (totalCalls / limit) * 100)}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">By Endpoint</h2>
        <div className="space-y-3">
          {usage.map((u) => (
            <div key={u.endpoint} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex justify-between">
              <code className="text-gray-300">{u.endpoint}</code>
              <span className="font-semibold">{(u._sum.count || 0).toLocaleString()}</span>
            </div>
          ))}
          {usage.length === 0 && <p className="text-gray-500 text-center py-8">No usage data yet.</p>}
        </div>
      </div>
    </div>
  );
}
