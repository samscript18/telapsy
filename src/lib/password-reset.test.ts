import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createPasswordResetToken,
  hashPasswordResetToken,
  sendPasswordResetEmail,
} from "./password-reset";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("password reset", () => {
  it("stores only a one-way token hash and expires it after 30 minutes", () => {
    const now = Date.UTC(2026, 7, 26, 12);
    const result = createPasswordResetToken(now);

    expect(result.token).not.toBe(result.tokenHash);
    expect(result.tokenHash).toBe(hashPasswordResetToken(result.token));
    expect(result.expiresAt.getTime()).toBe(now + 30 * 60 * 1000);
  });

  it("sends reset mail through the Brevo transactional email API", async () => {
    process.env.BREVO_API_KEY = "test-api-key";
    process.env.BREVO_SENDER_EMAIL = "noreply@example.com";
    process.env.BREVO_SENDER_NAME = "Telapsy";
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 201 }));

    const result = await sendPasswordResetEmail(
      { email: "shopper@example.com", name: "Shopper" },
      "https://telapsy.example/reset-password?token=example",
      fetcher,
    );

    expect(result.status).toBe("sent");
    expect(fetcher).toHaveBeenCalledOnce();
    const [url, request] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(request?.headers).toMatchObject({ "api-key": "test-api-key" });
    expect(JSON.parse(String(request?.body))).toMatchObject({
      sender: { email: "noreply@example.com", name: "Telapsy" },
      to: [{ email: "shopper@example.com", name: "Shopper" }],
      subject: "Reset your Telapsy password",
    });
  });

  it("reports an unconfigured provider without making a request", async () => {
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_SENDER_EMAIL;
    const fetcher = vi.fn<typeof fetch>();

    await expect(
      sendPasswordResetEmail(
        { email: "shopper@example.com", name: "Shopper" },
        "https://telapsy.example/reset-password?token=example",
        fetcher,
      ),
    ).resolves.toEqual({ status: "unconfigured" });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
