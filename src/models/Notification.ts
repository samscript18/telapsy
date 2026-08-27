import { model, models, Schema } from "mongoose";

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["account", "order", "collection", "security"], required: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  actionUrl: { type: String, trim: true },
  readAt: Date,
  dedupeKey: { type: String, sparse: true },
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, dedupeKey: 1 }, { unique: true, sparse: true });

export const Notification = models.Notification ?? model("Notification", notificationSchema);
