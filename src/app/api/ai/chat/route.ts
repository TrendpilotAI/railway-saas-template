import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 20 AI requests per minute per user
  const { allowed } = await rateLimit(`ai:${session.user.id}`, 20, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const apiKey = process.env.OPENCLAW_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenClaw not configured. Set OPENCLAW_API_KEY." },
      { status: 503 }
    );
  }

  try {
    const { messages } = await req.json();

    const response = await fetch(
      process.env.OPENCLAW_API_URL || "https://api.openclaw.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENCLAW_MODEL || "openclaw-default",
          messages,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: "AI service error", details: err },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to reach AI service", details: message },
      { status: 500 }
    );
  }
}
