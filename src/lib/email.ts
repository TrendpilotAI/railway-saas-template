import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return;
  }
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@example.com",
    to,
    subject,
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: "Welcome to SaaS Starter! 🚀",
    html: `<h1>Welcome, ${name}!</h1><p>Your account is ready. Head to your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">dashboard</a> to get started.</p>`,
  });
}

export async function sendSubscriptionEmail(
  email: string,
  plan: string,
  action: "upgraded" | "downgraded" | "cancelled"
) {
  await sendEmail({
    to: email,
    subject: `Subscription ${action}`,
    html: `<h1>Subscription ${action}</h1><p>Your plan has been ${action} to <strong>${plan}</strong>.</p>`,
  });
}
