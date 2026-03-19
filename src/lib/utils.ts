import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/utils/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractStoragePath(imageUrl: string): string | null {
  try {
    return new URL(imageUrl).pathname.split("/baskets/")[1] ?? null
  } catch {
    return null
  }
}

export async function deleteRegistration(qrId: string, imageUrl: string) {
  await supabase.from("registrations").delete().eq("qr_id", qrId)
  const path = extractStoragePath(imageUrl)
  if (path) {
    await supabase.storage.from("baskets").remove([decodeURIComponent(path)])
  }
}
