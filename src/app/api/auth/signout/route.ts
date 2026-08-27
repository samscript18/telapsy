import { NextResponse } from "next/server";
import { revokeCurrentSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST() { await revokeCurrentSession(); const response = NextResponse.json({ ok: true }); response.cookies.delete(SESSION_COOKIE); return response; }
