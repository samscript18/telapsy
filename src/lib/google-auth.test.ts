import { afterEach, describe, expect, it } from "vitest";
import {
  googleAuthorizationUrl,
  googleConfigured,
  oauthRandom,
  parseGoogleIntent,
  pkceChallenge,
} from "./google-auth";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("Google OAuth helpers", () => {
  it("keeps signup and login intents separate", () => {
    expect(parseGoogleIntent("signup")).toBe("signup");
    expect(parseGoogleIntent("signin")).toBe("signin");
    expect(parseGoogleIntent("unexpected")).toBe("signin");
  });
  it("creates high-entropy URL-safe values", () => {
    const first = oauthRandom();
    const second = oauthRandom();
    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(second).not.toBe(first);
  });

  it("creates the RFC 7636 S256 PKCE challenge", () => {
    expect(pkceChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")).toBe(
      "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    );
  });

  it("requires both Google client settings", () => {
    process.env.GOOGLE_CLIENT_ID = "client";
    delete process.env.GOOGLE_CLIENT_SECRET;
    expect(googleConfigured()).toBe(false);
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    expect(googleConfigured()).toBe(true);
  });

  it("builds the official Google authorization-code URL with CSRF and PKCE values", () => {
    process.env.GOOGLE_CLIENT_ID = "example-client";
    process.env.GOOGLE_CLIENT_SECRET = "example-secret";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    const url = googleAuthorizationUrl("state-value", "nonce-value", "verifier-value");

    expect(url.origin).toBe("https://accounts.google.com");
    expect(url.pathname).toBe("/o/oauth2/v2/auth");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("state")).toBe("state-value");
    expect(url.searchParams.get("nonce")).toBe("nonce-value");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://localhost:3000/api/auth/google/callback",
    );
  });
});
