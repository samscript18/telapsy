import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "telapsy_session";
export const RECENT_ORDER_COOKIE = "telapsy_recent_order";
const secret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  return new TextEncoder().encode(value);
};

export async function createSessionToken(userId: string) {
  return new SignJWT({ userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
}

export async function createOrderAccessToken(orderNumber: string) {
  return new SignJWT({ orderNumber, kind: "order-access" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1d").sign(secret());
}

export async function canAccessRecentOrder(orderNumber: string) {
  const token = (await cookies()).get(RECENT_ORDER_COOKIE)?.value; if (!token) return false;
  try { const { payload } = await jwtVerify(token, secret()); return payload.kind === "order-access" && payload.orderNumber === orderNumber; } catch { return false; }
}

export async function getSessionUserId() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret()); return typeof payload.userId === "string" ? payload.userId : null; }
  catch { return null; }
}

export const sessionCookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 };
