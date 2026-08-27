import { randomUUID } from "crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { connectDb } from "@/lib/db";
import { AuthSession } from "@/models/AuthSession";
import { User } from "@/models/User";

export const SESSION_COOKIE = "telapsy_session";
export const RECENT_ORDER_COOKIE = "telapsy_recent_order";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

const secret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  return new TextEncoder().encode(value);
};

interface SessionPayload extends JWTPayload {
  userId: string;
  sessionId?: string;
  sessionVersion?: number;
}

export interface SessionContext {
  userId: string;
  sessionId: string | null;
  issuedAt: number | null;
}

export function describeUserAgent(userAgent: string) {
  const browser = /Edg\//.test(userAgent)
    ? "Microsoft Edge"
    : /Chrome\//.test(userAgent)
      ? "Chrome"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : "Web browser";
  const operatingSystem = /iPhone|iPad/.test(userAgent)
    ? "iOS"
    : /Android/.test(userAgent)
      ? "Android"
      : /Mac OS X/.test(userAgent)
        ? "macOS"
        : /Windows/.test(userAgent)
          ? "Windows"
          : /Linux/.test(userAgent)
            ? "Linux"
            : "Unknown system";
  const device = /iPhone/.test(userAgent)
    ? "iPhone"
    : /iPad/.test(userAgent)
      ? "iPad"
      : /Android/.test(userAgent)
        ? "Android device"
        : /Mac OS X/.test(userAgent)
          ? "Mac"
          : /Windows/.test(userAgent)
            ? "Windows device"
            : "Browser session";
  return { device, browser, operatingSystem };
}

async function createSessionToken(userId: string, sessionId: string, sessionVersion: number) {
  return new SignJWT({ userId, sessionId, sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function createAuthenticatedSession(userId: string, request: Request) {
  await connectDb();
  const user = await User.findById(userId).select("+sessionVersion").lean() as unknown as { sessionVersion?: number } | null;
  if (!user) throw new Error("Account not found.");

  const sessionId = randomUUID();
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) || "Unknown browser";
  const device = describeUserAgent(userAgent);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_SECONDS * 1000);
  await AuthSession.create({ sessionId, userId, ...device, userAgent, lastActiveAt: now, expiresAt });

  return createSessionToken(userId, sessionId, user.sessionVersion ?? 0);
}

export async function createOrderAccessToken(orderNumber: string) {
  return new SignJWT({ orderNumber, kind: "order-access" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1d").sign(secret());
}

export async function canAccessRecentOrder(orderNumber: string) {
  const token = (await cookies()).get(RECENT_ORDER_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.kind === "order-access" && payload.orderNumber === orderNumber;
  } catch {
    return false;
  }
}

export async function getSessionContext(): Promise<SessionContext | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const claims = payload as SessionPayload;
    if (typeof claims.userId !== "string") return null;

    await connectDb();
    const user = await User.findById(claims.userId).select("+sessionVersion").lean() as unknown as { sessionVersion?: number } | null;
    if (!user || (claims.sessionVersion ?? 0) !== (user.sessionVersion ?? 0)) return null;

    if (claims.sessionId) {
      const active = await AuthSession.exists({ sessionId: claims.sessionId, userId: claims.userId, revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } });
      if (!active) return null;
    }

    return { userId: claims.userId, sessionId: claims.sessionId ?? null, issuedAt: typeof claims.iat === "number" ? claims.iat : null };
  } catch {
    return null;
  }
}

export async function getSessionUserId() {
  return (await getSessionContext())?.userId ?? null;
}

export async function revokeCurrentSession() {
  const context = await getSessionContext();
  if (context?.sessionId) await AuthSession.updateOne({ sessionId: context.sessionId, userId: context.userId }, { $set: { revokedAt: new Date() } });
}

export const sessionCookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_SECONDS };
