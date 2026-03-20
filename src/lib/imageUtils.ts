import imageCompression from "browser-image-compression"

const COMPRESS_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
} as const

const HEIC_TYPES = ["image/heic", "image/heif"]

function isHeic(file: File): boolean {
  if (HEIC_TYPES.includes(file.type)) return true
  return /\.hei[cf]$/i.test(file.name)
}

export async function compressImage(file: File): Promise<File> {
  if (isHeic(file)) {
    throw new Error("HEIC_NOT_SUPPORTED")
  }

  try {
    return await imageCompression(file, COMPRESS_OPTIONS)
  } catch {
    return file
  }
}
