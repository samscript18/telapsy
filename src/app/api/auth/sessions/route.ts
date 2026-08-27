import { NextResponse } from "next/server";
import { describeUserAgent, getSessionContext, SESSION_COOKIE } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { AuthSession } from "@/models/AuthSession";
import { User } from "@/models/User";

interface StoredSession {
  sessionId: string;
  device: string;
  browser: string;
  operatingSystem: string;
  createdAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
}

export async function GET(request: Request) {
  const context = await getSessionContext();
  if (!context) return NextResponse.json({ error: "Your session has ended." }, { status: 401 });
  await connectDb();

  if (context.sessionId) {
    await AuthSession.updateOne({ sessionId: context.sessionId, userId: context.userId }, { $set: { lastActiveAt: new Date() } });
  }
  const stored = await AuthSession.find({ userId: context.userId, revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
    .sort({ lastActiveAt: -1 })
    .lean() as unknown as StoredSession[];
  const sessions = stored.map((session) => ({
    id: session.sessionId,
    device: session.device,
    browser: session.browser,
    operatingSystem: session.operatingSystem,
    createdAt: session.createdAt.toISOString(),
    lastActiveAt: session.lastActiveAt.toISOString(),
    expiresAt: session.expiresAt.toISOString(),
    current: session.sessionId === context.sessionId,
  }));

  if (!context.sessionId) {
    const now = new Date();
    const openedAt = new Date((context.issuedAt ?? Math.floor(now.getTime() / 1000)) * 1000);
    sessions.unshift({
      id: "current",
      ...describeUserAgent(request.headers.get("user-agent") ?? "Unknown browser"),
      createdAt: openedAt.toISOString(),
      lastActiveAt: now.toISOString(),
      expiresAt: new Date(openedAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      current: true,
    });
  }

  return NextResponse.json({ sessions });
}

export async function DELETE() {
  const context = await getSessionContext();
  if (!context) return NextResponse.json({ error: "Your session has ended." }, { status: 401 });
  await connectDb();
  const now = new Date();
  await Promise.all([
    User.updateOne({ _id: context.userId }, { $inc: { sessionVersion: 1 } }),
    AuthSession.updateMany({ userId: context.userId, revokedAt: { $exists: false } }, { $set: { revokedAt: now } }),
  ]);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
