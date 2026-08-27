interface CloudinaryUploadResult {
  secure_url?: string;
  public_id?: string;
  error?: { message?: string };
}

function credentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary image uploads are not configured.");
  return { cloudName, apiKey, apiSecret };
}

function authorization(apiKey: string, apiSecret: string) {
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
}

export async function uploadProfileImage(file: File, userId: string) {
  const { cloudName, apiKey, apiSecret } = credentials();
  const publicId = `telapsy/profiles/${userId}`;
  const body = new FormData();
  body.set("file", file);
  body.set("public_id", publicId);
  body.set("overwrite", "true");
  body.set("invalidate", "true");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: "POST",
    headers: { Authorization: authorization(apiKey, apiSecret) },
    body,
  });
  const result = await response.json() as CloudinaryUploadResult;
  if (!response.ok || !result.secure_url || !result.public_id) throw new Error(result.error?.message ?? "Cloudinary could not upload this image.");
  return { secureUrl: result.secure_url, publicId: result.public_id };
}

export async function destroyCloudinaryImage(publicId: string) {
  const { cloudName, apiKey, apiSecret } = credentials();
  const body = new FormData();
  body.set("public_id", publicId);
  body.set("invalidate", "true");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`, {
    method: "POST",
    headers: { Authorization: authorization(apiKey, apiSecret) },
    body,
  });
  if (!response.ok) throw new Error("Cloudinary could not remove the profile image.");
}
