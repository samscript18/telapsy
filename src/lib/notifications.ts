import { Notification } from "@/models/Notification";

interface NotificationInput {
  userId: string;
  type: "account" | "order" | "collection" | "security";
  title: string;
  message: string;
  actionUrl?: string;
  dedupeKey: string;
}

export async function notifyUser(input: NotificationInput) {
  try {
    await Notification.updateOne(
      { userId: input.userId, dedupeKey: input.dedupeKey },
      { $setOnInsert: input },
      { upsert: true },
    );
  } catch (error) {
    console.error("Unable to create account notification", error);
  }
}

export function welcomeNotification(userId: string) {
  return notifyUser({
    userId,
    type: "account",
    title: "Welcome to Telapsy",
    message: "Your account is ready, and your $1,000.00 Telapsy Balance is available for your first order.",
    actionUrl: "/dashboard/products",
    dedupeKey: "account:welcome",
  });
}
