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
    setRegistration(data)
    setLoading(false)
  }, [qrId])

  useEffect(() => {
    fetchRegistration()
  }, [fetchRegistration])

  async function handleRetrieve() {
    if (!qrId || !registration) return

    // Storage 사진 삭제
    const path = new URL(registration.image_url).pathname.split("/baskets/")[1]
    if (path) {
      await supabase.storage.from("baskets").remove([decodeURIComponent(path)])
    }

    // 레코드 삭제
    await supabase.from("registrations").delete().eq("qr_id", qrId)
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
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    )
  }

  if (!qrId) return null

  if (view === "register") {
    return (
      <RegisterForm
        qrId={qrId}
        onSuccess={handleRegisterSuccess}
        onCancel={() => setView("status")}
      />
    )
  }

  if (view === "success") {
    return <SuccessMessage message="등록되었어요! 바구니를 세탁기 옆에 두세요" />
  }

  return (
    <StatusView
      qrId={qrId}
      registration={registration}
      onRegister={() => setView("register")}
      onRetrieve={handleRetrieve}
    />
  )
}
