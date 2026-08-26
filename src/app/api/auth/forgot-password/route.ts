import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";

const schema = z.object({ email: z.email().transform((value) => value.toLowerCase()) });
export async function POST(request: Request) {
	const parsed = schema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
	await connectDb();
	const user = await User.findOne({ email: parsed.data.email });
	let previewUrl: string | undefined;
	if (user) {
		const token = randomBytes(32).toString("base64url");
		user.passwordResetTokenHash = createHash("sha256").update(token).digest("hex");
		user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
		await user.save();
		const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${encodeURIComponent(token)}`;
		if (process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL) {
			try {
				const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
					method: "POST",
					headers: { accept: "application/json", "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json" },
					body: JSON.stringify({
						sender: { email: process.env.BREVO_SENDER_EMAIL, name: process.env.BREVO_SENDER_NAME ?? "Telapsy" },
						to: [{ email: user.email, name: user.name }],
						subject: "Reset your Telapsy password",
						htmlContent: `<html><body><p>Reset your Telapsy password using the secure link below. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this message.</p></body></html>`,
						tags: ["password-reset"],
					}),
				});
				if (!emailResponse.ok) console.error("Brevo password-reset delivery failed", emailResponse.status);
			} catch (error) {
				console.error("Brevo password-reset delivery failed", error);
			}
		} else if (process.env.NODE_ENV !== "production") previewUrl = resetUrl;
	}
	return NextResponse.json({ message: "If an account exists for that email, a reset link has been prepared.", previewUrl });
}
