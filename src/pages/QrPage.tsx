import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/utils/supabase";
import { deleteRegistration } from "@/lib/registration";
import { StatusView } from "@/components/StatusView";
import { RegisterForm } from "@/components/RegisterForm";
import { SuccessMessage } from "@/components/SuccessMessage";
import type { Registration } from "@/types";

type View = "status" | "register" | "success";

const QR_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const SUCCESS_REDIRECT_MS = 2000;

export function QrPage() {
  const { qrId } = useParams<{ qrId: string }>();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("status");
  const [retrieving, setRetrieving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const fetchRegistration = useCallback(async () => {
    if (!qrId) return;
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("registrations")
      .select("id, qr_id, nickname, image_url, washer_image_url, created_at")
      .eq("qr_id", qrId)
      .maybeSingle();

    if (fetchError) {
      void fetchError;
      setError("데이터를 불러오지 못했어요. 다시 시도해주세요!");
      setLoading(false);
      return;
    }

    if (data) {
      const elapsed = Date.now() - new Date(data.created_at).getTime();
      if (elapsed > TWENTY_FOUR_HOURS) {
        await deleteRegistration(qrId, data.image_url, data.washer_image_url);
        setRegistration(null);
        setLoading(false);
        return;
      }
    }

    setRegistration(data);
    setLoading(false);
  }, [qrId]);

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]);

  const handleRetrieve = useCallback(async () => {
    if (!qrId || !registration) return;

    setRetrieving(true);
    try {
      await deleteRegistration(
        qrId,
        registration.image_url,
        registration.washer_image_url,
      );
      setRegistration(null);
    } catch (err) {
      void err;
      setError("회수에 실패했어요. 다시 시도해주세요!");
    } finally {
      setRetrieving(false);
    }
  }, [qrId, registration]);

  const handleRegisterSuccess = useCallback(() => {
    setView("success");
    successTimerRef.current = setTimeout(() => {
      setView("status");
      fetchRegistration();
    }, SUCCESS_REDIRECT_MS);
  }, [fetchRegistration]);

  const handleRegister = useCallback(() => setView("register"), []);
  const handleCancel = useCallback(() => setView("status"), []);
  const handleDismissError = useCallback(() => setError(null), []);

  const validQrId = useMemo(
    () => (qrId && QR_ID_PATTERN.test(qrId) ? qrId : null),
    [qrId],
  );

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">불러오는 중…</p>
        </div>
      </div>
    );
  }

  if (!validQrId) return <Navigate to="/" replace />;

  return (
    <>
      {view === "status" ? (
        <StatusView
          qrId={validQrId}
          registration={registration}
          onRegister={handleRegister}
          onRetrieve={handleRetrieve}
          retrieving={retrieving}
          error={error}
          onDismissError={handleDismissError}
        />
      ) : view === "register" ? (
        <RegisterForm
          qrId={validQrId}
          hasExisting={!!registration}
          onSuccess={handleRegisterSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <SuccessMessage message="등록되었어요! 바구니를 세탁기 옆에 두세요" />
      )}
    </>
  );
}
