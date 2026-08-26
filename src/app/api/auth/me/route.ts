import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const id = await getSessionUserId(); if (!id) return NextResponse.json({ user: null }, { status: 401 });
  await connectDb(); const user = await User.findById(id).select("name email balanceCents").lean() as unknown as { _id: unknown; name: string; email: string; balanceCents: number } | null;
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: { id: String(user._id), name: user.name, email: user.email, balanceCents: user.balanceCents } });
}
