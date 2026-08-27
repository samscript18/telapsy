import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { welcomeNotification } from "@/lib/notifications";
import { Notification } from "@/models/Notification";

type NotificationDocument = {
  _id: unknown;
  type: "account" | "order" | "collection" | "security";
  title: string;
  message: string;
  actionUrl?: string;
  readAt?: Date;
  createdAt: Date;
};

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Login to view notifications." }, { status: 401 });
  await connectDb();
  await welcomeNotification(userId);
  const records = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(60).lean() as unknown as NotificationDocument[];
  const notifications = records.map((record) => ({
    id: String(record._id),
    type: record.type,
    title: record.title,
    message: record.message,
    actionUrl: record.actionUrl,
    read: Boolean(record.readAt),
    createdAt: record.createdAt.toISOString(),
  }));
  return NextResponse.json({ notifications, unreadCount: notifications.filter((item) => !item.read).length });
}

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Login to update notifications." }, { status: 401 });
  const body = await request.json() as { id?: string; all?: boolean };
  await connectDb();
  if (body.all) {
    await Notification.updateMany({ userId, readAt: { $exists: false } }, { $set: { readAt: new Date() } });
  } else if (body.id && isValidObjectId(body.id)) {
    await Notification.updateOne({ _id: body.id, userId }, { $set: { readAt: new Date() } });
  } else {
    return NextResponse.json({ error: "Choose a notification to update." }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
