import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegistrationPhotos } from "@/components/RegistrationPhotos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import type { Registration } from "@/types";

interface StatusViewProps {
  qrId: string;
  registration: Registration | null;
  onRegister: () => void;
  onRetrieve: () => void;
  retrieving: boolean;
  error: string | null;
  onDismissError: () => void;
}

export function StatusView({
  qrId,
  registration,
  onRegister,
  onRetrieve,
  retrieving,
  error,
  onDismissError,
}: StatusViewProps) {
  const [confirmRetrieve, setConfirmRetrieve] = useState(false);
  const navigate = useNavigate();

  function handleRetrieveClick() {
    if (confirmRetrieve) {
      onRetrieve();
      setConfirmRetrieve(false);
    } else {
      setConfirmRetrieve(true);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-4 pt-10 pb-6">
      <header className="mb-6 flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label="홈으로"
          >
            <Home className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">빨래큐</h1>
        </div>
        <span className="rounded-md bg-muted px-2 py-1 text-sm font-medium text-muted-foreground">
          #{qrId}
        </span>
      </header>

      <Card className="w-full max-w-md">
        <CardContent className="space-y-5 p-5">
          {error ? (
            <div className="flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-base text-destructive">{error}</p>
              <button
                type="button"
                onClick={onDismissError}
                className="text-xs text-destructive underline"
              >
                닫기
              </button>
            </div>
          ) : null}

          {registration ? (
            <>
              <div className="space-y-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-base font-medium text-green-700">
                  <span
                    className="h-2 w-2 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  현재 사용 중이에요
                </span>
                <p className="text-xl font-semibold text-pretty">
                  &ldquo;{registration.nickname}&rdquo;님의 세탁물이에요
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(registration.created_at).toLocaleString("ko-KR", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" 등록"}
                </p>
              </div>

              <RegistrationPhotos
                basketImageUrl={registration.image_url}
                washerImageUrl={registration.washer_image_url}
              />

              <div className="space-y-2.5">
                <Button onClick={onRegister} className="w-full" size="lg">
                  내 세탁물 등록하기
                </Button>
                <Button
                  onClick={handleRetrieveClick}
                  variant={confirmRetrieve ? "destructive" : "secondary"}
                  className="w-full"
                  size="lg"
                  disabled={retrieving}
                >
                  {retrieving
                    ? "처리 중…"
                    : confirmRetrieve
                      ? "정말 회수 완료할까요?"
                      : "세탁물 회수 완료"}
                </Button>
                {confirmRetrieve && !retrieving ? (
                  <Button
                    onClick={() => setConfirmRetrieve(false)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    취소
                  </Button>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <div className="py-8 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-base font-medium text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full bg-gray-400"
                    aria-hidden="true"
                  />
                  지금 사용할 수 있어요!
                </span>
              </div>

              <Button onClick={onRegister} className="w-full" size="lg">
                내 세탁물 등록하기
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 w-full max-w-md text-center text-xs text-muted-foreground">
        서비스 이용 시{" "}
        <Link to="/policy?tab=terms" className="underline">
          이용약관
        </Link>{" "}
        및{" "}
        <Link to="/policy?tab=privacy" className="underline">
          개인정보처리방침
        </Link>
        에 동의한 것으로 간주합니다.
      </p>
    </div>
  );
}
