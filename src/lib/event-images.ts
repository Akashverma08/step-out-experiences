import { supabase } from "@/integrations/supabase/client";

export const EVENT_IMAGES_BUCKET = "event-images";
// 10 years — long-lived signed URL (bucket is private per workspace policy).
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365 * 10;

export type UploadResult = { path: string; url: string };

export function extractStoragePath(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  // Matches both /object/public/event-images/<path> and /object/sign/event-images/<path>?token=...
  const m = imageUrl.match(/\/event-images\/([^?]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function uploadEventImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image file");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be under 8 MB");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;

  onProgress?.(15);
  const { error: upErr } = await supabase.storage
    .from(EVENT_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (upErr) throw upErr;
  onProgress?.(75);

  const { data: signed, error: signErr } = await supabase.storage
    .from(EVENT_IMAGES_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (signErr || !signed) throw signErr ?? new Error("Failed to sign URL");
  onProgress?.(100);
  return { path, url: signed.signedUrl };
}

export async function deleteEventImage(imageUrl: string | null | undefined): Promise<void> {
  const path = extractStoragePath(imageUrl);
  if (!path) return;
  await supabase.storage.from(EVENT_IMAGES_BUCKET).remove([path]);
}
