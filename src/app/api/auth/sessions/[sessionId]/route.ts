import { NextResponse } from "next/server";
import { getSessionContext, SESSION_COOKIE } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { AuthSession } from "@/models/AuthSession";

export async function DELETE(_: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const context = await getSessionContext();
  if (!context) return NextResponse.json({ error: "Your session has ended." }, { status: 401 });
  const { sessionId } = await params;
  await connectDb();

  const revokingCurrent = sessionId === "current" || sessionId === context.sessionId;
  if (sessionId !== "current") {
    const result = await AuthSession.updateOne(
      { sessionId, userId: context.userId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } },
    );
    if (!result.matchedCount) return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true, signedOut: revokingCurrent });
  if (revokingCurrent) response.cookies.delete(SESSION_COOKIE);
  return response;
}
