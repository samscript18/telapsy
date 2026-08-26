import { createHash, randomBytes } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const GOOGLE_STATE_COOKIE = "telapsy_google_state";
export const GOOGLE_NONCE_COOKIE = "telapsy_google_nonce";
export const GOOGLE_VERIFIER_COOKIE = "telapsy_google_verifier";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function oauthRandom() {
  return randomBytes(32).toString("base64url");
}

export function pkceChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function googleRedirectUri() {
  return `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/auth/google/callback`;
}

export function googleAuthorizationUrl(state: string, nonce: string, verifier: string) {
  if (!googleConfigured()) throw new Error("Google OAuth is not configured.");
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: pkceChallenge(verifier),
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return new URL(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

export async function verifyGoogleIdToken(idToken: string, nonce: string) {
  const { payload } = await jwtVerify(idToken, jwks, {
    audience: process.env.GOOGLE_CLIENT_ID,
    issuer: GOOGLE_ISSUERS,
  });
  if (payload.nonce !== nonce) throw new Error("Google nonce validation failed.");
  if (!payload.sub || typeof payload.email !== "string" || payload.email_verified !== true) {
    throw new Error("Google did not return a verified email address.");
  }
  return {
    sub: payload.sub,
    email: payload.email.toLowerCase(),
    name: typeof payload.name === "string" ? payload.name : payload.email.split("@")[0],
  };
}
