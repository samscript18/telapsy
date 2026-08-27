import { describe, expect, it } from "vitest";
import { canUsePasswordAuthentication, isGoogleAccount } from "./auth-provider";

describe("authentication provider boundaries", () => {
  it("allows password authentication only for password-created accounts", () => {
    expect(canUsePasswordAuthentication({ authProvider: "password" })).toBe(true);
    expect(canUsePasswordAuthentication({ authProvider: "google", googleSub: "google-id" })).toBe(false);
  });

  it("keeps legacy mixed Google records Google-only", () => {
    const legacyGoogleAccount = { authProvider: "both" as const, googleSub: "google-id" };
    expect(isGoogleAccount(legacyGoogleAccount)).toBe(true);
    expect(canUsePasswordAuthentication(legacyGoogleAccount)).toBe(false);
  });

  it("treats any account carrying a Google subject as Google-authenticated", () => {
    expect(isGoogleAccount({ authProvider: "password", googleSub: "google-id" })).toBe(true);
    expect(canUsePasswordAuthentication({ authProvider: "password", googleSub: "google-id" })).toBe(false);
  });
});
