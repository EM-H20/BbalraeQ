import imageCompression from "browser-image-compression"

const OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
} as const

export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, OPTIONS)
  } catch {
    return file
  }
}
