import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { hashPasswordResetToken } from "@/lib/password-reset";
import { User } from "@/models/User";

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Use a password of at least 8 characters with a letter and number." },
      { status: 400 },
    );
  }

  await connectDb();
  const user = await User.findOne({
    passwordResetTokenHash: hashPasswordResetToken(parsed.data.token),
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpiresAt");

  if (!user) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  user.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  user.authProvider = user.googleSub ? "both" : "password";
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  return NextResponse.json({ message: "Password updated. You can now sign in." });
}
