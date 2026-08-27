import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSessionContext, SESSION_COOKIE } from "@/lib/auth";
import { destroyCloudinaryImage } from "@/lib/cloudinary";
import { connectDb } from "@/lib/db";
import { accountDeletionSchema } from "@/lib/validation";
import { AuthSession } from "@/models/AuthSession";
import { Notification } from "@/models/Notification";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function DELETE(request: Request) {
  const context = await getSessionContext();
  if (!context) return NextResponse.json({ error: "Your session has ended." }, { status: 401 });
  const parsed = accountDeletionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Type DELETE exactly to confirm account deletion." }, { status: 400 });

  await connectDb();
  const user = await User.findById(context.userId).select("+passwordHash +profileImagePublicId");
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  if (user.passwordHash && (!parsed.data.password || !(await bcrypt.compare(parsed.data.password, user.passwordHash)))) {
    return NextResponse.json({ error: "Enter your current password to delete this account." }, { status: 400 });
  }

  await Promise.all([
    AuthSession.deleteMany({ userId: context.userId }),
    Notification.deleteMany({ userId: context.userId }),
    Order.deleteMany({ userId: context.userId }),
    User.deleteOne({ _id: context.userId }),
  ]);
  if (user.profileImagePublicId) {
    try { await destroyCloudinaryImage(user.profileImagePublicId); } catch { /* Account deletion must not be blocked by remote cleanup. */ }
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
