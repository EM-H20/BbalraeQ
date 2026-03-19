import { useState, useRef } from "react"
import { supabase } from "@/utils/supabase"
import { compressImage } from "@/lib/imageUtils"
import { Camera, ImageIcon, ArrowLeft } from "lucide-react"

interface RegisterFormProps {
  qrId: string
  onSuccess: () => void
  onCancel: () => void
}

export function RegisterForm({ qrId, onSuccess, onCancel }: RegisterFormProps) {
  const [nickname, setNickname] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const nicknameValid = nickname.length >= 2 && nickname.length <= 10
  const canSubmit = nicknameValid && file && !submitting

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
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
        .select("image_url")
        .eq("qr_id", qrId)
        .maybeSingle()

      if (existing) {
        const path = new URL(existing.image_url).pathname.split("/baskets/")[1]
        if (path) {
          await supabase.storage.from("baskets").remove([decodeURIComponent(path)])
        }
        await supabase.from("registrations").delete().eq("qr_id", qrId)
      }

      // 2. 이미지 압축 + 업로드
      const compressed = await compressImage(file)
      const ext = compressed.name.split(".").pop() ?? "jpg"
      const filePath = `${qrId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("baskets")
        .upload(filePath, compressed)

      if (uploadError) throw uploadError

      // 3. 공개 URL 취득
      const { data: urlData } = supabase.storage
        .from("baskets")
        .getPublicUrl(filePath)

      // 4. 레코드 삽입
      const { error: insertError } = await supabase.from("registrations").insert({
        qr_id: qrId,
        nickname,
        image_url: urlData.publicUrl,
      })

      if (insertError) throw insertError

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록에 실패했어요")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center px-4 py-8">
      <header className="mb-6 flex w-full max-w-md items-center gap-3">
        <button onClick={onCancel} className="p-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">내 세탁물 등록</h1>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {/* 닉네임 */}
        <div className="space-y-2">
          <label htmlFor="nickname" className="text-sm font-medium">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="2~10자 입력"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={10}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          {nickname.length > 0 && !nicknameValid && (
            <p className="text-xs text-destructive">2~10자로 입력해주세요</p>
          )}
        </div>

        {/* 바구니 사진 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">바구니 사진</label>
          {preview ? (
            <img
              src={preview}
              alt="바구니 미리보기"
              className="aspect-square w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-border">
              <p className="text-sm text-muted-foreground">바구니 사진을 찍어주세요</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"
            >
              <Camera className="h-4 w-4" />
              찍기
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"
            >
              <ImageIcon className="h-4 w-4" />
              선택
            </button>
          </div>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {submitting ? "등록 중..." : "등록 완료!"}
        </button>
      </form>
    </div>
  )
}
