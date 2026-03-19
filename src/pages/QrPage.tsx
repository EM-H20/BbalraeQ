import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/utils/supabase"
import { StatusView } from "@/components/StatusView"
import { RegisterForm } from "@/components/RegisterForm"
import { SuccessMessage } from "@/components/SuccessMessage"
import type { Registration } from "@/types"

type View = "status" | "register" | "success"

export function QrPage() {
  const { qrId } = useParams<{ qrId: string }>()
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>("status")

  const fetchRegistration = useCallback(async () => {
    if (!qrId) return
    setLoading(true)
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("qr_id", qrId)
      .maybeSingle()

    // 24시간 만료 체크: 조회 시점에 자동 삭제
    if (data) {
      const elapsed = Date.now() - new Date(data.created_at).getTime()
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

      if (elapsed > TWENTY_FOUR_HOURS) {
        const path = new URL(data.image_url).pathname.split("/baskets/")[1]
        await Promise.all([
          path
            ? supabase.storage.from("baskets").remove([decodeURIComponent(path)])
            : Promise.resolve(),
          supabase.from("registrations").delete().eq("qr_id", qrId),
        ])
        setRegistration(null)
        setLoading(false)
        return
      }
    }

    setRegistration(data)
    setLoading(false)
  }, [qrId])

  useEffect(() => {
    fetchRegistration()
  }, [fetchRegistration])

  async function handleRetrieve() {
    if (!qrId || !registration) return

    // async-parallel: Storage 삭제 + DB 삭제 병렬 실행
    const path = new URL(registration.image_url).pathname.split("/baskets/")[1]
    await Promise.all([
      path
        ? supabase.storage.from("baskets").remove([decodeURIComponent(path)])
        : Promise.resolve(),
      supabase.from("registrations").delete().eq("qr_id", qrId),
    ])
    setRegistration(null)
  }

  function handleRegisterSuccess() {
    setView("success")
    setTimeout(() => {
      setView("status")
      fetchRegistration()
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">불러오는 중…</p>
        </div>
      </div>
    )
  }

  if (!qrId) return null

  return (
    <>
      {view === "status" ? (
        <StatusView
          qrId={qrId}
          registration={registration}
          onRegister={() => setView("register")}
          onRetrieve={handleRetrieve}
        />
      ) : view === "register" ? (
        <RegisterForm
          qrId={qrId}
          onSuccess={handleRegisterSuccess}
          onCancel={() => setView("status")}
        />
      ) : (
        <SuccessMessage message="등록되었어요! 바구니를 세탁기 옆에 두세요" />
      )}
    </>
  )
}
