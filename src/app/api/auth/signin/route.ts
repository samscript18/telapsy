import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { signinSchema } from "@/lib/validation";
import { User } from "@/models/User";

export async function POST(request: Request) {
	const parsed = signinSchema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
	await connectDb();
	const user = await User.findOne({ email: parsed.data.email });
	if (!user || !user.passwordHash || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
	const response = NextResponse.json({ user: { id: String(user._id), name: user.name, email: user.email, balanceCents: user.balanceCents } });
	response.cookies.set(SESSION_COOKIE, await createSessionToken(String(user._id)), sessionCookieOptions);
	return response;
}
