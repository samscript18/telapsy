import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/auth";
import { GOOGLE_NONCE_COOKIE, GOOGLE_RETURN_COOKIE, GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, googleAuthorizationUrl, googleConfigured, oauthRandom } from "@/lib/google-auth";

export async function GET(request: Request) {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
	if (!googleConfigured()) {
		return NextResponse.redirect(new URL("/signin?error=google_not_configured", appUrl));
	}

	const state = oauthRandom();
	const nonce = oauthRandom();
	const verifier = oauthRandom();
	const response = NextResponse.redirect(googleAuthorizationUrl(state, nonce, verifier));
	const options = { ...sessionCookieOptions, maxAge: 600 };
	response.cookies.set(GOOGLE_STATE_COOKIE, state, options);
	response.cookies.set(GOOGLE_NONCE_COOKIE, nonce, options);
	response.cookies.set(GOOGLE_VERIFIER_COOKIE, verifier, options);
	const requested = new URL(request.url).searchParams.get("next");
	const destination = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
	response.cookies.set(GOOGLE_RETURN_COOKIE, destination, options);
	return response;
}
