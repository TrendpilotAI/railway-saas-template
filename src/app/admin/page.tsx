export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) redirect("/api/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const [userCount, proCount, enterpriseCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "PRO" } }),
    prisma.user.count({ where: { plan: "ENTERPRISE" } }),
    prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, plan: true, role: true, createdAt: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold">🚀 Admin Panel</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-gray-400 text-sm">Total Users</div>
            <div className="text-3xl font-bold">{userCount}</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-gray-400 text-sm">Pro Subscribers</div>
            <div className="text-3xl font-bold">{proCount}</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-gray-400 text-sm">Enterprise</div>
            <div className="text-3xl font-bold">{enterpriseCount}</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-700/50">
                  <td className="px-4 py-3 text-sm">{u.email}</td>
                  <td className="px-4 py-3 text-sm">{u.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${u.plan === "PRO" ? "bg-indigo-600/20 text-indigo-400" : u.plan === "ENTERPRISE" ? "bg-purple-600/20 text-purple-400" : "bg-gray-700 text-gray-400"}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{u.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
