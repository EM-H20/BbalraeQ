import { supabase } from "@/utils/supabase"

export function extractStoragePath(imageUrl: string): string | null {
  try {
    return new URL(imageUrl).pathname.split("/baskets/")[1] ?? null
  } catch {
    return null
  }
}

export async function deleteRegistration(
  qrId: string,
  imageUrl: string,
  washerImageUrl?: string,
) {
  const { error } = await supabase.from("registrations").delete().eq("qr_id", qrId)
  if (error) throw error

  const paths = [imageUrl, washerImageUrl]
    .map((url) => (url ? extractStoragePath(url) : null))
    .filter((p): p is string => p !== null)
    .map((p) => decodeURIComponent(p))
  if (paths.length > 0) {
    await supabase.storage.from("baskets").remove(paths)
  }
}
