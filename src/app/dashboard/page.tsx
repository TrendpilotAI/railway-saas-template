export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { apiKeys: true, _count: { select: { usageRecords: true } } },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🚀 SaaS Starter</Link>
          <div className="flex gap-4 items-center">
            <span className="text-gray-400">{session.user.email}</span>
            <span className="bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded text-sm font-medium">
              {user?.plan || "FREE"}
            </span>
            <Link href="/api/auth/signout" className="text-gray-400 hover:text-white">Sign Out</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">Current Plan</div>
            <div className="text-2xl font-bold">{user?.plan || "Free"}</div>
            <Link href="/dashboard/billing" className="text-indigo-400 text-sm hover:text-indigo-300 mt-2 inline-block">
              Manage billing →
            </Link>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">API Keys</div>
            <div className="text-2xl font-bold">{user?.apiKeys.length || 0}</div>
            <Link href="/dashboard/keys" className="text-indigo-400 text-sm hover:text-indigo-300 mt-2 inline-block">
              Manage keys →
            </Link>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">API Calls (this period)</div>
            <div className="text-2xl font-bold">{user?._count.usageRecords || 0}</div>
            <Link href="/dashboard/usage" className="text-indigo-400 text-sm hover:text-indigo-300 mt-2 inline-block">
              View usage →
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
              <p className="text-gray-500"># Install the SDK</p>
              <p>npm install your-saas-sdk</p>
              <p className="text-gray-500 mt-3"># Use your API key</p>
              <p>curl -H &quot;Authorization: Bearer sk_...&quot; \</p>
              <p className="pl-4">{process.env.NEXT_PUBLIC_APP_URL || "https://your-app.up.railway.app"}/api/v1/data</p>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Resources</h2>
            <ul className="space-y-3">
              <li><a href="#" className="text-indigo-400 hover:text-indigo-300">📖 API Documentation</a></li>
              <li><a href="#" className="text-indigo-400 hover:text-indigo-300">💬 Discord Community</a></li>
              <li><a href="#" className="text-indigo-400 hover:text-indigo-300">🐛 Report an Issue</a></li>
              <li><a href="#" className="text-indigo-400 hover:text-indigo-300">📧 Contact Support</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
