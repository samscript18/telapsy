import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String },
  googleSub: { type: String, unique: true, sparse: true, index: true },
  authProvider: { type: String, enum: ["password", "google"], default: "password" },
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpiresAt: { type: Date, select: false },
  balanceCents: { type: Number, required: true, default: 100000, min: 0 },
}, { timestamps: true });

export const User = models.User ?? model("User", userSchema);
