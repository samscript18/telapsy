import { createHash, randomBytes } from "node:crypto";

const RESET_WINDOW_MS = 30 * 60 * 1000;
const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetToken(now = Date.now()) {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashPasswordResetToken(token),
    expiresAt: new Date(now + RESET_WINDOW_MS),
  };
}

type ResetRecipient = { email: string; name: string };

export async function sendPasswordResetEmail(
  recipient: ResetRecipient,
  resetUrl: string,
  fetcher: typeof fetch = fetch,
) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) return { status: "unconfigured" as const };

  const response = await fetcher(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: process.env.BREVO_SENDER_NAME ?? "Telapsy",
      },
      to: [recipient],
      subject: "Reset your Telapsy password",
      htmlContent: `<html><body><p>Reset your Telapsy password using the secure link below. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this message.</p></body></html>`,
      tags: ["password-reset"],
    }),
  });

  return { status: response.ok ? ("sent" as const) : ("failed" as const) };
}
