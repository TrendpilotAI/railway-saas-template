const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px; margin: 0 auto; padding: 40px 20px;
  background: #0f172a; color: #e2e8f0;
`;

const buttonStyle = `
  display: inline-block; background: #6366f1; color: #ffffff;
  padding: 12px 24px; border-radius: 8px; text-decoration: none;
  font-weight: 600; font-size: 14px;
`;

const footerStyle = `
  margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155;
  color: #64748b; font-size: 12px; text-align: center;
`;

const appName = process.env.NEXT_PUBLIC_APP_NAME || "SaaS Starter";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.up.railway.app";

export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: `Welcome to ${appName}! 🚀`,
    html: `<div style="${baseStyle}">
      <h1 style="color: #f8fafc; font-size: 28px;">Welcome, ${name}!</h1>
      <p>We're excited to have you on board. Your account is ready to go.</p>
      <p>Here's what you can do next:</p>
      <ul style="color: #cbd5e1; line-height: 1.8;">
        <li>Generate your first API key</li>
        <li>Explore the dashboard</li>
        <li>Check out the API documentation</li>
        <li>Upgrade to Pro for more features</li>
      </ul>
      <p style="margin-top: 24px;">
        <a href="${appUrl}/dashboard" style="${buttonStyle}">Go to Dashboard</a>
      </p>
      <div style="${footerStyle}">
        <p>${appName} — Ship your SaaS in days, not months.</p>
      </div>
    </div>`,
  };
}

export function invoiceEmail(name: string, plan: string, amount: string, invoiceUrl?: string): { subject: string; html: string } {
  return {
    subject: `Payment receipt — ${appName}`,
    html: `<div style="${baseStyle}">
      <h1 style="color: #f8fafc; font-size: 24px;">Payment Received</h1>
      <p>Hi ${name},</p>
      <p>We've received your payment. Here are the details:</p>
      <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Plan:</strong> ${plan}</p>
        <p style="margin: 8px 0 0;"><strong>Amount:</strong> ${amount}</p>
        <p style="margin: 8px 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      ${invoiceUrl ? `<p><a href="${invoiceUrl}" style="${buttonStyle}">View Invoice</a></p>` : ""}
      <div style="${footerStyle}">
        <p>Manage your subscription in <a href="${appUrl}/dashboard/billing" style="color: #818cf8;">billing settings</a>.</p>
      </div>
    </div>`,
  };
}

export function passwordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: `Reset your password — ${appName}`,
    html: `<div style="${baseStyle}">
      <h1 style="color: #f8fafc; font-size: 24px;">Password Reset</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new one.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="${buttonStyle}">Reset Password</a>
      </p>
      <p style="color: #94a3b8; font-size: 13px;">
        This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
      </p>
      <div style="${footerStyle}">
        <p>${appName}</p>
      </div>
    </div>`,
  };
}

export function usageLimitEmail(name: string, usage: number, limit: number, plan: string): { subject: string; html: string } {
  const pct = Math.round((usage / limit) * 100);
  return {
    subject: `⚠️ You've used ${pct}% of your API quota`,
    html: `<div style="${baseStyle}">
      <h1 style="color: #f8fafc; font-size: 24px;">Usage Alert</h1>
      <p>Hi ${name},</p>
      <p>You've used <strong>${usage.toLocaleString()}</strong> of your <strong>${limit.toLocaleString()}</strong> API calls on the ${plan} plan (${pct}%).</p>
      <p>Consider upgrading to avoid interruptions.</p>
      <p style="margin-top: 24px;">
        <a href="${appUrl}/dashboard/billing" style="${buttonStyle}">Upgrade Plan</a>
      </p>
      <div style="${footerStyle}">
        <p>${appName}</p>
      </div>
    </div>`,
  };
}
