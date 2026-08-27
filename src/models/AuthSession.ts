import { model, models, Schema } from "mongoose";

const authSessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  device: { type: String, required: true },
  browser: { type: String, required: true },
  operatingSystem: { type: String, required: true },
  userAgent: { type: String, required: true },
  lastActiveAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  revokedAt: { type: Date },
}, { timestamps: true });

authSessionSchema.index({ userId: 1, revokedAt: 1, expiresAt: -1 });

export const AuthSession = models.AuthSession ?? model("AuthSession", authSessionSchema);
