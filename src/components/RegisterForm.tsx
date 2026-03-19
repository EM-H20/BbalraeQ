import { useState, useRef } from "react"
import { supabase } from "@/utils/supabase"
import { compressImage } from "@/lib/imageUtils"
import { deleteRegistration } from "@/lib/registration"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, ImageIcon, ArrowLeft, X } from "lucide-react"

interface RegisterFormProps {
  qrId: string
  onSuccess: () => void
  onCancel: () => void
}

interface PhotoState {
  file: File | null
  preview: string | null
}

const EMPTY_PHOTO: PhotoState = { file: null, preview: null }

export function RegisterForm({ qrId, onSuccess, onCancel }: RegisterFormProps) {
  const [nickname, setNickname] = useState("")
  const [washerPhoto, setWasherPhoto] = useState<PhotoState>(EMPTY_PHOTO)
  const [basketPhoto, setBasketPhoto] = useState<PhotoState>(EMPTY_PHOTO)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const washerCameraRef = useRef<HTMLInputElement>(null)
  const washerGalleryRef = useRef<HTMLInputElement>(null)
  const basketCameraRef = useRef<HTMLInputElement>(null)
  const basketGalleryRef = useRef<HTMLInputElement>(null)

  const nicknameValid = nickname.length >= 2 && nickname.length <= 10
  const canSubmit = nicknameValid && washerPhoto.file && basketPhoto.file && !submitting

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: typeof setWasherPhoto,
    current: PhotoState,
  ) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (current.preview) URL.revokeObjectURL(current.preview)
    setter({ file: selected, preview: URL.createObjectURL(selected) })
  }

  function handleFileRemove(
    setter: typeof setWasherPhoto,
    current: PhotoState,
    cameraRef: React.RefObject<HTMLInputElement | null>,
    galleryRef: React.RefObject<HTMLInputElement | null>,
  ) {
    if (current.preview) URL.revokeObjectURL(current.preview)
    setter(EMPTY_PHOTO)
    if (cameraRef.current) cameraRef.current.value = ""
    if (galleryRef.current) galleryRef.current.value = ""
  }

  async function uploadImage(file: File, prefix: string) {
    const compressed = await compressImage(file)
    const ext = compressed.name.split(".").pop() ?? "jpg"
    const filePath = `${qrId}/${prefix}_${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("baskets")
      .upload(filePath, compressed)

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from("baskets")
      .getPublicUrl(filePath)

    return urlData.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    setError(null)

    try {
      // 1. 기존 레코드 확인 및 삭제
      const { data: existing } = await supabase
        .from("registrations")
        .select("image_url, washer_image_url")
        .eq("qr_id", qrId)
        .maybeSingle()

      if (existing) {
        await deleteRegistration(qrId, existing.image_url, existing.washer_image_url)
      }

      // 2. 두 이미지 병렬 업로드
      const [basketUrl, washerUrl] = await Promise.all([
        uploadImage(basketPhoto.file!, "basket"),
        uploadImage(washerPhoto.file!, "washer"),
      ])

      // 3. 레코드 삽입
      const { error: insertError } = await supabase.from("registrations").insert({
        qr_id: qrId,
        nickname,
        image_url: basketUrl,
        washer_image_url: washerUrl,
      })

      if (insertError) throw insertError

      onSuccess()
    } catch (err) {
      console.error("등록 실패:", err)
      setError("등록에 실패했어요. 다시 시도해주세요.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-4 py-6">
      <header className="mb-6 flex w-full max-w-md items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-1.5 hover:bg-muted"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">내 세탁물 등록</h1>
      </header>

      <Card className="w-full max-w-md">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 닉네임 */}
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="2~10자 입력…"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
              />
              {nickname.length > 0 && !nicknameValid ? (
                <p className="text-xs text-destructive">2~10자로 입력해주세요</p>
              ) : null}
            </div>

            {/* 세탁기 사진 */}
            <PhotoUpload
              label="세탁기 사진"
              placeholder="사용 중인 세탁기 사진을 찍어주세요"
              photo={washerPhoto}
              onFileChange={(e) => handleFileChange(e, setWasherPhoto, washerPhoto)}
              onRemove={() =>
                handleFileRemove(setWasherPhoto, washerPhoto, washerCameraRef, washerGalleryRef)
              }
              cameraRef={washerCameraRef}
              galleryRef={washerGalleryRef}
            />

            {/* 바구니 사진 */}
            <PhotoUpload
              label="바구니 사진"
              placeholder="바구니 사진을 찍어주세요"
              photo={basketPhoto}
              onFileChange={(e) => handleFileChange(e, setBasketPhoto, basketPhoto)}
              onRemove={() =>
                handleFileRemove(setBasketPhoto, basketPhoto, basketCameraRef, basketGalleryRef)
              }
              cameraRef={basketCameraRef}
              galleryRef={basketGalleryRef}
            />

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
              {submitting ? "등록 중…" : "등록 완료!"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function PhotoUpload({
  label,
  placeholder,
  photo,
  onFileChange,
  onRemove,
  cameraRef,
  galleryRef,
}: {
  label: string
  placeholder: string
  photo: PhotoState
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  cameraRef: React.RefObject<HTMLInputElement | null>
  galleryRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {photo.preview ? (
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={photo.preview}
            alt={`${label} 미리보기`}
            className="aspect-square w-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            aria-label={`${label} 삭제`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        </div>
      )}
      <div className="flex gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => cameraRef.current?.click()}
        >
          <Camera className="mr-1.5 h-5 w-5" />
          찍기
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => galleryRef.current?.click()}
        >
          <ImageIcon className="mr-1.5 h-5 w-5" />
          선택
        </Button>
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="hidden"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  )
}
