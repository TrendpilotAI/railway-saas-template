"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BillingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  const plan = session.user?.plan || "FREE";

  const handleUpgrade = async (targetPlan: string) => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: targetPlan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  const handleManage = async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold">🚀 SaaS Starter</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back to Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Current Plan: {plan}</h2>
          {plan !== "FREE" && (
            <button onClick={handleManage} className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
              Manage Subscription
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plan === "FREE" && (
            <>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold">Pro — $29/mo</h3>
                <p className="text-gray-400 mt-2 mb-4">10,000 API calls, 10 keys, priority support</p>
                <button onClick={() => handleUpgrade("PRO")} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-medium transition">
                  Upgrade to Pro
                </button>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold">Enterprise — $99/mo</h3>
                <p className="text-gray-400 mt-2 mb-4">100,000 API calls, unlimited keys, SLA</p>
                <button onClick={() => handleUpgrade("ENTERPRISE")} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-medium transition">
                  Upgrade to Enterprise
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
