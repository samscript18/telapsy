import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { canUsePasswordAuthentication } from "@/lib/auth-provider";
import { createPasswordResetToken, sendPasswordResetEmail } from "@/lib/password-reset";
import { User } from "@/models/User";

const schema = z.object({ email: z.email().transform((value) => value.toLowerCase()) });
export async function POST(request: Request) {
	const parsed = schema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
	await connectDb();
	const user = await User.findOne({ email: parsed.data.email });
	let previewUrl: string | undefined;
	if (canUsePasswordAuthentication(user)) {
		const { token, tokenHash, expiresAt } = createPasswordResetToken();
		user.passwordResetTokenHash = tokenHash;
		user.passwordResetExpiresAt = expiresAt;
		await user.save();
		const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${encodeURIComponent(token)}`;
		try {
			const delivery = await sendPasswordResetEmail({ email: user.email, name: user.name }, resetUrl);
			if (delivery.status === "failed") console.error("Brevo password-reset delivery failed");
			if (delivery.status === "unconfigured" && process.env.NODE_ENV !== "production") previewUrl = resetUrl;
		} catch {
			console.error("Brevo password-reset delivery failed");
		}
	}
	return NextResponse.json({ message: "If an account exists for that email, a reset link has been prepared.", previewUrl });
}
