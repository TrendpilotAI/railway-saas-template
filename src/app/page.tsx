import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["100 API calls/month", "1 API key", "Community support", "Basic dashboard"],
    cta: "Get Started",
    href: "/api/auth/signin",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["10,000 API calls/month", "10 API keys", "Priority support", "Advanced analytics", "Webhooks"],
    cta: "Start Pro Trial",
    href: "/api/auth/signin",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: ["100,000 API calls/month", "Unlimited API keys", "Dedicated support", "Custom integrations", "SLA guarantee", "Admin panel"],
    cta: "Contact Sales",
    href: "/api/auth/signin",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-bold">🚀 SaaS Starter</div>
        <div className="flex gap-4 items-center">
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
          <Link href="/api/auth/signin" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Ship Your SaaS<br />
          <span className="text-indigo-400">In Days, Not Months</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Production-ready SaaS template with authentication, payments, API keys, 
          usage tracking, and more. Deploy to Railway in one click.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/api/auth/signin" className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-lg text-lg font-semibold transition">
            Get Started Free
          </Link>
          <a href="https://github.com/TrendpilotAI/railway-saas-template" className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-lg text-lg font-semibold transition">
            View Source
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "🔐", title: "Authentication", desc: "GitHub & Google OAuth with NextAuth.js. Session management built in." },
            { icon: "💳", title: "Stripe Billing", desc: "Subscriptions, checkout, customer portal. Three tiers ready to go." },
            { icon: "🔑", title: "API Keys", desc: "Generate, revoke, and track API key usage per user." },
            { icon: "📊", title: "Usage Tracking", desc: "Per-endpoint usage tracking with rate limiting via Redis." },
            { icon: "👑", title: "Admin Panel", desc: "Manage users, view metrics, and control your platform." },
            { icon: "📧", title: "Email Notifications", desc: "Transactional emails via Resend for signups, billing, and alerts." },
          ].map((f) => (
            <div key={f.title} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-8 ${
                tier.highlighted
                  ? "bg-indigo-600 border-2 border-indigo-400 scale-105"
                  : "bg-gray-800/50 border border-gray-700"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-gray-400">{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`block text-center py-3 rounded-lg font-semibold transition ${
                  tier.highlighted
                    ? "bg-white text-indigo-600 hover:bg-gray-100"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-500">
        <p>Built with ❤️ using Next.js, Prisma, Stripe & Railway</p>
        <p className="mt-2">
          <a href="https://railway.app?referralCode=trendpilot" className="text-indigo-400 hover:text-indigo-300">
            Deploy your own on Railway →
          </a>
        </p>
      </footer>
    </div>
  );
}
