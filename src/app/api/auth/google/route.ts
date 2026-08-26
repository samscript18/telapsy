import { NextResponse } from "next/server";
import { GOOGLE_NONCE_COOKIE, GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, googleConfigured, googleRedirectUri, oauthRandom, pkceChallenge } from "@/lib/google-auth";
import { sessionCookieOptions } from "@/lib/auth";

export async function GET() {
  const appUrl=process.env.NEXT_PUBLIC_APP_URL??"http://localhost:3000";
  if(!googleConfigured()) return NextResponse.redirect(new URL("/signin?error=google_not_configured",appUrl));
  const state=oauthRandom();const nonce=oauthRandom();const verifier=oauthRandom();
  const params=new URLSearchParams({client_id:process.env.GOOGLE_CLIENT_ID!,redirect_uri:googleRedirectUri(),response_type:"code",scope:"openid email profile",state,nonce,code_challenge:pkceChallenge(verifier),code_challenge_method:"S256",prompt:"select_account"});
  const response=NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  const options={...sessionCookieOptions,maxAge:600};response.cookies.set(GOOGLE_STATE_COOKIE,state,options);response.cookies.set(GOOGLE_NONCE_COOKIE,nonce,options);response.cookies.set(GOOGLE_VERIFIER_COOKIE,verifier,options);return response;
}
