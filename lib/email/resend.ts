/**
 * Resend Email Client
 * Simple wrapper for sending transactional emails via Resend API
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ResendResponse {
  id: string;
}

/**
 * Get environment variable
 */
function getEnv(key: string): string | undefined {
  if (typeof Deno !== "undefined") {
    return Deno.env.get(key);
  }
  return undefined;
}

/**
 * Send an email via Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<ResendResponse> {
  const apiKey = getEnv("RESEND_API_KEY");
  // Use Resend's test sender in dev, or configure EMAIL_FROM for production
  const fromEmail = getEnv("EMAIL_FROM") || "SNIVEL <onboarding@resend.dev>";

  if (!apiKey) {
    // In development, log instead of throwing
    console.log("📧 [DEV] Would send email:", {
      to: options.to,
      subject: options.subject,
    });
    return { id: "dev-" + crypto.randomUUID() };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Send a magic link email for org admin login
 */
export async function sendOrgLoginLink(email: string, token: string, orgName: string): Promise<void> {
  const baseUrl = getEnv("BASE_URL") || "http://localhost:5173";
  const loginUrl = `${baseUrl}/auth/verify?token=${token}`;

  const { orgLoginEmail } = await import("./templates.ts");

  await sendEmail({
    to: email,
    subject: `Sign in to ${orgName} on SNIVEL`,
    html: orgLoginEmail({ loginUrl, orgName, expiresIn: "20 minutes" }),
    text: `Sign in to ${orgName}: ${loginUrl}\n\nThis link expires in 20 minutes.`,
  });
}

/**
 * Send a magic link for new org signup
 */
export async function sendSignupLink(email: string, token: string): Promise<void> {
  const baseUrl = getEnv("BASE_URL") || "http://localhost:5173";
  const signupUrl = `${baseUrl}/signup/complete?token=${token}`;

  const { signupEmail } = await import("./templates.ts");

  await sendEmail({
    to: email,
    subject: "Complete your SNIVEL signup",
    html: signupEmail({ signupUrl, expiresIn: "60 minutes" }),
    text: `Complete your SNIVEL signup: ${signupUrl}\n\nThis link expires in 60 minutes.`,
  });
}

/**
 * Send an invite email to a new user
 */
export async function sendUserInvite(
  email: string,
  token: string,
  userName: string,
  orgName: string
): Promise<void> {
  const baseUrl = getEnv("BASE_URL") || "http://localhost:5173";
  const inviteUrl = `${baseUrl}/auth/verify?token=${token}`;

  const { userInviteEmail } = await import("./templates.ts");

  await sendEmail({
    to: email,
    subject: `You've been invited to ${orgName} on SNIVEL`,
    html: userInviteEmail({ inviteUrl, userName, orgName, expiresIn: "24 hours" }),
    text: `Hi ${userName}, you've been invited to ${orgName}: ${inviteUrl}\n\nThis link expires in 24 hours.`,
  });
}
