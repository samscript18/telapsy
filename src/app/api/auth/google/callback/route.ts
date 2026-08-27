import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { GOOGLE_INTENT_COOKIE, GOOGLE_NONCE_COOKIE, GOOGLE_RETURN_COOKIE, GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, googleConfigured, googleRedirectUri, parseGoogleIntent, verifyGoogleIdToken, type GoogleAuthIntent } from "@/lib/google-auth";
import { welcomeNotification } from "@/lib/notifications";
import { User } from "@/models/User";

const oauthCookies = [GOOGLE_STATE_COOKIE, GOOGLE_NONCE_COOKIE, GOOGLE_VERIFIER_COOKIE, GOOGLE_RETURN_COOKIE, GOOGLE_INTENT_COOKIE];

function googleError(code: string, intent: GoogleAuthIntent) {
  const response = NextResponse.redirect(new URL(`/${intent}?error=${code}`, process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  oauthCookies.forEach((cookie) => response.cookies.delete(cookie));
  return response;
}

export async function GET(request: NextRequest) {
  const intent = parseGoogleIntent(request.cookies.get(GOOGLE_INTENT_COOKIE)?.value);
  if (!googleConfigured()) return googleError("google_not_configured", intent);
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(GOOGLE_STATE_COOKIE)?.value;
  const nonce = request.cookies.get(GOOGLE_NONCE_COOKIE)?.value;
  const verifier = request.cookies.get(GOOGLE_VERIFIER_COOKIE)?.value;
  if (!code || !state || !expectedState || state !== expectedState || !nonce || !verifier) return googleError("google_state", intent);

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: googleRedirectUri(), grant_type: "authorization_code", code_verifier: verifier }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed.");
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) throw new Error("Google ID token missing.");
    const profile = await verifyGoogleIdToken(tokens.id_token, nonce);
    await connectDb();

    let user;
    if (intent === "signin") {
      user = await User.findOne({ googleSub: profile.sub, authProvider: { $in: ["google", "both"] } });
      if (!user) return googleError("google_signup_required", intent);
    } else {
      if (await User.exists({ googleSub: profile.sub })) return googleError("google_account_exists", intent);
      if (await User.exists({ email: profile.email })) return googleError("google_email_exists", intent);
      user = await User.create({ name: profile.name, email: profile.email, googleSub: profile.sub, authProvider: "google", balanceCents: 100000 });
      await welcomeNotification(String(user._id));
    }

    const requested = request.cookies.get(GOOGLE_RETURN_COOKIE)?.value;
    const destination = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
    const response = NextResponse.redirect(new URL(destination, process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
    response.cookies.set(SESSION_COOKIE, await createSessionToken(String(user._id)), sessionCookieOptions);
    oauthCookies.forEach((cookie) => response.cookies.delete(cookie));
    return response;
  } catch {
    return googleError("google_failed", intent);
  }
}
