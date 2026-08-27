import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { accountUpdateSchema } from "@/lib/validation";

type AccountUser = { _id: unknown; name: string; email: string; balanceCents: number; authProvider?: "password" | "google" | "both"; profileImage?: string; createdAt?: Date; preferences?: { orderUpdates?: boolean; productNews?: boolean; compactDashboard?: boolean } };

const sessionUser = (user: AccountUser) => ({ id: String(user._id), name: user.name, email: user.email, balanceCents: user.balanceCents, authProvider: user.authProvider ?? "password", profileImage: user.profileImage, createdAt: user.createdAt?.toISOString(), preferences: { orderUpdates: user.preferences?.orderUpdates ?? true, productNews: user.preferences?.productNews ?? false, compactDashboard: user.preferences?.compactDashboard ?? false } });

export async function GET() {
  const id = await getSessionUserId(); if (!id) return NextResponse.json({ user: null }, { status: 401 });
  await connectDb(); const user = await User.findById(id).select("name email balanceCents authProvider profileImage createdAt preferences").lean() as unknown as AccountUser | null;
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: sessionUser(user) });
}

export async function PATCH(request: Request) {
  const id = await getSessionUserId(); if (!id) return NextResponse.json({ error: "Login to update your account." }, { status: 401 });
  const parsed = accountUpdateSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your account details." }, { status: 400 });
  await connectDb();
  const update: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.preferences !== undefined) update.preferences = parsed.data.preferences;
  const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).select("name email balanceCents authProvider profileImage createdAt preferences").lean() as unknown as AccountUser | null;
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  return NextResponse.json({ user: sessionUser(user) });
}
