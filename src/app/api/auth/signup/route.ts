import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { createAuthenticatedSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { User } from "@/models/User";
import { welcomeNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your details." }, { status: 400 });
    await connectDb();
    if (await User.exists({ email: parsed.data.email })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const user = await User.create({ name: parsed.data.name, email: parsed.data.email, passwordHash: await bcrypt.hash(parsed.data.password, 12), balanceCents: 100000 });
    await welcomeNotification(String(user._id));
    const response = NextResponse.json({ user: { id: String(user._id), name: user.name, email: user.email, balanceCents: user.balanceCents } }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, await createAuthenticatedSession(String(user._id), request), sessionCookieOptions);
    return response;
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === 11000) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    return NextResponse.json({ error: "We couldn’t create your account. Please try again." }, { status: 500 });
  }
}
