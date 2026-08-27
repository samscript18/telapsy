import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { uploadProfileImage } from "@/lib/cloudinary";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";

const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maximumBytes = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Login to update your profile image." }, { status: 401 });
  const body = await request.formData();
  const file = body.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!supportedTypes.has(file.type)) return NextResponse.json({ error: "Choose a JPEG, PNG, or WebP image." }, { status: 400 });
  if (file.size > maximumBytes) return NextResponse.json({ error: "Choose an image smaller than 2 MB." }, { status: 400 });

  try {
    const uploaded = await uploadProfileImage(file, userId);
    await connectDb();
    const user = await User.findByIdAndUpdate(userId, {
      $set: { profileImage: uploaded.secureUrl, profileImagePublicId: uploaded.publicId },
    }, { new: true }).select("profileImage").lean() as unknown as { profileImage?: string } | null;
    if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
    return NextResponse.json({ profileImage: user.profileImage });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not upload this image." }, { status: 502 });
  }
}
