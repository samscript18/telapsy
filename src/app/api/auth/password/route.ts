import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSessionContext, SESSION_COOKIE } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { passwordChangeSchema } from "@/lib/validation";
import { AuthSession } from "@/models/AuthSession";
import { User } from "@/models/User";

export async function PATCH(request: Request) {
  const context = await getSessionContext();
  if (!context) return NextResponse.json({ error: "Your session has ended." }, { status: 401 });
  const parsed = passwordChangeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your password details." }, { status: 400 });

  await connectDb();
  const user = await User.findById(context.userId).select("+passwordHash +sessionVersion");
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  if (!user.passwordHash) return NextResponse.json({ error: "This account uses Google authentication. Manage its password through Google." }, { status: 400 });
  if (!(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

  user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  user.sessionVersion = (user.sessionVersion ?? 0) + 1;
  await user.save();
  await AuthSession.updateMany({ userId: context.userId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });

  const response = NextResponse.json({ ok: true, message: "Password changed. Sign in again with your new password." });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
