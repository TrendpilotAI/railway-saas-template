# 🚀 SaaS Starter Template

A production-ready SaaS starter template built with Next.js 14, TypeScript, Tailwind CSS, Postgres, and Redis. Deploy to Railway in one click.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?referralCode=trendpilot&repo=https://github.com/TrendpilotAI/railway-saas-template)

## Features

- **Authentication** — NextAuth.js with GitHub & Google OAuth
- **Payments** — Stripe subscriptions with 3 tiers (Free / Pro / Enterprise)
- **Database** — Prisma ORM with PostgreSQL
- **Caching** — Redis for rate limiting and session storage
- **API Keys** — Generate, revoke, and track usage per key
- **Usage Tracking** — Per-endpoint usage tracking with rate limiting
- **Admin Panel** — User management and metrics dashboard
- **Email** — Transactional emails via Resend
- **Landing Page** — Beautiful marketing page with pricing section
- **Dashboard** — User dashboard with billing, keys, and usage views
- **Railway Ready** — Dockerfile, health checks, and railway.json included

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma |
| Cache | Redis (ioredis) |
| Auth | NextAuth.js |
| Payments | Stripe |
| Email | Resend |
| Deployment | Railway / Docker |

## Quick Start

### 1. Deploy to Railway

Click the button above, or:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?referralCode=trendpilot&repo=https://github.com/TrendpilotAI/railway-saas-template)

Railway will automatically provision PostgreSQL and Redis for you.

### 2. Configure Environment Variables

Set these in your Railway project settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (auto-provided by Railway) |
| `REDIS_URL` | Redis connection string (auto-provided by Railway) |
| `NEXTAUTH_URL` | Your app URL (e.g., `https://your-app.up.railway.app`) |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `GITHUB_ID` | GitHub OAuth App client ID |
| `GITHUB_SECRET` | GitHub OAuth App client secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Pro plan |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe Price ID for Enterprise plan |
| `RESEND_API_KEY` | Resend API key for emails |
| `EMAIL_FROM` | Sender email address |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for client-side) |
| `OPENCLAW_API_KEY` | OpenClaw API key (optional, enables AI chat) |
| `OPENCLAW_API_URL` | OpenClaw API endpoint (optional, default: `https://api.openclaw.com/v1/chat/completions`) |
| `OPENCLAW_MODEL` | OpenClaw model name (optional) |

### 3. Set Up Stripe

1. Create products in [Stripe Dashboard](https://dashboard.stripe.com)
2. Create recurring prices for Pro ($29/mo) and Enterprise ($99/mo)
3. Copy the Price IDs to `STRIPE_PRO_PRICE_ID` and `STRIPE_ENTERPRISE_PRICE_ID`
4. Set up a webhook endpoint: `https://your-app.up.railway.app/api/stripe/webhook`
5. Listen for: `checkout.session.completed`, `customer.subscription.deleted`

### 4. Set Up OAuth

**GitHub:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL to `https://your-app.up.railway.app/api/auth/callback/github`

**Google (optional):**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Set redirect URI to `https://your-app.up.railway.app/api/auth/callback/google`

## Local Development

```bash
# Clone the repo
git clone https://github.com/TrendpilotAI/railway-saas-template.git
cd railway-saas-template

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── admin/                   # Admin panel
│   ├── dashboard/               # User dashboard
│   │   ├── billing/             # Subscription management
│   │   ├── keys/                # API key management
│   │   └── usage/               # Usage tracking
│   └── api/
│       ├── auth/[...nextauth]/  # Authentication
│       ├── health/              # Health check
│       ├── keys/                # API key CRUD
│       └── stripe/              # Stripe webhooks & checkout
├── components/                  # React components
├── lib/                         # Shared utilities
│   ├── auth.ts                  # NextAuth config
│   ├── prisma.ts                # Database client
│   ├── redis.ts                 # Redis client & rate limiting
│   ├── stripe.ts                # Stripe client & plans
│   └── email.ts                 # Email via Resend
├── middleware.ts                # Auth middleware
└── types/                       # TypeScript declarations
prisma/
└── schema.prisma                # Database schema
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/keys` | List API keys |
| POST | `/api/keys` | Create API key |
| DELETE | `/api/keys` | Revoke API key |
| POST | `/api/stripe/checkout` | Create checkout session |
| POST | `/api/stripe/portal` | Open billing portal |
| POST | `/api/stripe/webhook` | Stripe webhook handler |

## OpenClaw AI Assistant (Optional)

This template includes an optional AI chat assistant powered by [OpenClaw](https://openclaw.com).

**Setup:**
1. Get an API key from OpenClaw
2. Set `OPENCLAW_API_KEY` in your environment variables
3. The chat widget appears automatically in the bottom-right corner

**How it works:**
- `/api/ai/chat` — Proxies chat requests to OpenClaw's API (OpenAI-compatible)
- `ChatWidget` component — Floating chat bubble with conversation UI
- Rate limited to 20 requests/minute per user
- Only available to authenticated users

If `OPENCLAW_API_KEY` is not set, the widget will show a "not configured" message.

## Customization

This template is designed to be customized:

1. **Branding** — Update `src/app/page.tsx` and `src/app/layout.tsx`
2. **Pricing** — Modify `PLANS` in `src/lib/stripe.ts`
3. **Features** — Add your own API routes and pages
4. **Email Templates** — Customize in `src/lib/email.ts`
5. **Database** — Extend `prisma/schema.prisma` and run `npx prisma migrate dev`

## License

MIT — Use this template for any project, commercial or otherwise.

---

Built with ❤️ by [TrendpilotAI](https://github.com/TrendpilotAI)

[Deploy your own on Railway →](https://railway.app?referralCode=trendpilot)
