import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { supabase } from "@/utils/supabase";
import { compressImage } from "@/lib/imageUtils";
import { deleteRegistration } from "@/lib/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Camera, ImageIcon, ArrowLeft, X } from "lucide-react";

interface RegisterFormProps {
  qrId: string;
  hasExisting: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PhotoState {
  file: File | null;
  preview: string | null;
}

const EMPTY_PHOTO: PhotoState = { file: null, preview: null };
const QR_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function RegisterForm({ qrId, hasExisting, onSuccess, onCancel }: RegisterFormProps) {
  const [nickname, setNickname] = useState("");
  const [washerPhoto, setWasherPhoto] = useState<PhotoState>(EMPTY_PHOTO);
  const [basketPhoto, setBasketPhoto] = useState<PhotoState>(EMPTY_PHOTO);
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState<"washer" | "basket" | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const washerCameraRef = useRef<HTMLInputElement>(null);
  const washerGalleryRef = useRef<HTMLInputElement>(null);
  const basketCameraRef = useRef<HTMLInputElement>(null);
  const basketGalleryRef = useRef<HTMLInputElement>(null);

  const trimmedNickname = nickname.trim();
  const nicknameValid = useMemo(
    () => trimmedNickname.length >= 2 && trimmedNickname.length <= 10,
    [trimmedNickname],
  );
  const canSubmit = useMemo(
    () =>
      nicknameValid &&
      !!washerPhoto.file &&
      !!basketPhoto.file &&
      !submitting &&
      !processing,
    [nicknameValid, washerPhoto.file, basketPhoto.file, submitting, processing],
  );

  // Object URL cleanup: preview 변경 시 이전 URL revoke
  const prevWasherPreview = useRef<string | null>(null);
  const prevBasketPreview = useRef<string | null>(null);

  useEffect(() => {
    if (
      prevWasherPreview.current &&
      prevWasherPreview.current !== washerPhoto.preview
    ) {
      URL.revokeObjectURL(prevWasherPreview.current);
    }
    prevWasherPreview.current = washerPhoto.preview;
  }, [washerPhoto.preview]);

  useEffect(() => {
    if (
      prevBasketPreview.current &&
      prevBasketPreview.current !== basketPhoto.preview
    ) {
      URL.revokeObjectURL(prevBasketPreview.current);
    }
    prevBasketPreview.current = basketPhoto.preview;
  }, [basketPhoto.preview]);

  // 언마운트 시 남은 URL 정리
  useEffect(() => {
    return () => {
      if (prevWasherPreview.current)
        URL.revokeObjectURL(prevWasherPreview.current);
      if (prevBasketPreview.current)
        URL.revokeObjectURL(prevBasketPreview.current);
    };
  }, []);

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: typeof setWasherPhoto,
      target: "washer" | "basket",
    ) => {
      const selected = e.target.files?.[0];
      if (!selected) return;

      setProcessing(target);
      try {
        const compressed = await compressImage(selected);
        setter({ file: compressed, preview: URL.createObjectURL(compressed) });
        setError(null);
        setConfirmReplace(false);
      } catch (err) {
        if (err instanceof Error && err.message === "HEIC_NOT_SUPPORTED") {
          setError(
            "HEIC 형식은 지원되지 않아요. 카메라로 직접 찍거나 JPG/PNG 사진을 선택해주세요.",
          );
          setter(EMPTY_PHOTO);
        } else {
          setter({ file: selected, preview: URL.createObjectURL(selected) });
        }
      } finally {
        setProcessing(null);
      }
    },
    [],
  );

  const handleWasherFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      handleFileChange(e, setWasherPhoto, "washer"),
    [handleFileChange],
  );

  const handleBasketFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      handleFileChange(e, setBasketPhoto, "basket"),
    [handleFileChange],
  );

  const handleWasherRemove = useCallback(() => {
    setWasherPhoto(EMPTY_PHOTO);
    if (washerCameraRef.current) washerCameraRef.current.value = "";
    if (washerGalleryRef.current) washerGalleryRef.current.value = "";
  }, []);

  const handleBasketRemove = useCallback(() => {
    setBasketPhoto(EMPTY_PHOTO);
    if (basketCameraRef.current) basketCameraRef.current.value = "";
    if (basketGalleryRef.current) basketGalleryRef.current.value = "";
  }, []);

  async function uploadImage(file: File, prefix: string) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const filePath = `${qrId}/${prefix}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("baskets")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("baskets")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    if (!QR_ID_PATTERN.test(qrId)) {
      setError("잘못된 QR 코드입니다.");
      return;
    }

    // 기존 등록이 있으면 확인 한 번 거치기
    if (hasExisting && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data: existing } = await supabase
        .from("registrations")
        .select("image_url, washer_image_url")
        .eq("qr_id", qrId)
        .maybeSingle();

      if (existing) {
        await deleteRegistration(
          qrId,
          existing.image_url,
          existing.washer_image_url,
        );
      }

      const [basketUrl, washerUrl] = await Promise.all([
        uploadImage(basketPhoto.file!, "basket"),
        uploadImage(washerPhoto.file!, "washer"),
      ]);

      const { error: insertError } = await supabase
        .from("registrations")
        .insert({
          qr_id: qrId,
          nickname: trimmedNickname,
          image_url: basketUrl,
          washer_image_url: washerUrl,
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      void err;
      setError("등록에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-4 pt-10 pb-6">
      <header className="mb-6 flex w-full max-w-md items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-1.5 hover:bg-muted"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">내 세탁물 등록</h1>
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
                onChange={(e) => {
                  setNickname(e.target.value);
                  setConfirmReplace(false);
                }}
                maxLength={10}
              />
              {nickname.length > 0 && !nicknameValid ? (
                <p className="text-sm text-destructive">
                  2~10자로 입력해주세요
                </p>
              ) : null}
            </div>

            {/* 세탁기 사진 */}
            <MemoizedPhotoUpload
              label="세탁기 사진"
              placeholder="사용 중인 세탁기 사진을 찍어주세요"
              photo={washerPhoto}
              processing={processing === "washer"}
              onFileChange={handleWasherFileChange}
              onRemove={handleWasherRemove}
              cameraRef={washerCameraRef}
              galleryRef={washerGalleryRef}
            />

            {/* 바구니 사진 */}
            <MemoizedPhotoUpload
              label="바구니 사진"
              placeholder="바구니 사진을 찍어주세요"
              photo={basketPhoto}
              processing={processing === "basket"}
              onFileChange={handleBasketFileChange}
              onRemove={handleBasketRemove}
              cameraRef={basketCameraRef}
              galleryRef={basketGalleryRef}
            />

            {error ? (
              <p className="text-base text-destructive">{error}</p>
            ) : null}

            {confirmReplace ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                기존 등록 정보가 교체됩니다
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={!canSubmit}
              variant={confirmReplace ? "destructive" : "default"}
              className="w-full"
              size="lg"
            >
              {submitting ? "등록 중…" : confirmReplace ? "교체하고 등록하기" : "등록 완료!"}
            </Button>

            {confirmReplace && !submitting ? (
              <Button
                type="button"
                onClick={() => setConfirmReplace(false)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                취소
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
}

const MemoizedPhotoUpload = memo(function PhotoUpload({
  label,
  placeholder,
  photo,
  processing,
  onFileChange,
  onRemove,
  cameraRef,
  galleryRef,
}: {
  label: string;
  placeholder: string;
  photo: PhotoState;
  processing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  cameraRef: React.RefObject<HTMLInputElement | null>;
  galleryRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {processing && !photo.preview ? (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">사진 처리 중…</p>
        </div>
      ) : photo.preview ? (
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
          <p className="text-base text-muted-foreground">{placeholder}</p>
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
  );
});
