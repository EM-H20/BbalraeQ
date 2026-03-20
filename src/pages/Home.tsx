import { Card, CardContent } from "@/components/ui/card"
import { WashingMachine, QrCode, Camera, Package } from "lucide-react"

const STEPS = [
  {
    icon: QrCode,
    title: "QR 스캔",
    description: "세탁기에 붙은 QR 코드를 스캔하세요",
  },
  {
    icon: Camera,
    title: "사진 등록",
    description: "닉네임과 세탁기/바구니 사진을 올려주세요",
  },
  {
    icon: Package,
    title: "세탁물 확인",
    description: "다른 분이 바구니에 넣어드려요",
  },
] as const

export function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* 히어로 */}
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <WashingMachine className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">빨래큐</h1>
          <p className="text-lg text-muted-foreground">
            QR 스캔 한 번으로<br />
            세탁물 주인과 바구니를 확인하세요
          </p>
        </div>

        {/* 사용법 */}
        <Card>
          <CardContent className="space-y-5 p-5">
            <h2 className="text-base font-semibold text-muted-foreground">사용 방법</h2>
            <ol className="space-y-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <step.icon className="h-4.5 w-4.5 text-foreground" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <p className="text-base font-semibold">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-base text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* 안내 */}
        <div className="space-y-1 text-center text-sm text-muted-foreground">
          <p>세탁기의 QR 코드를 스캔하면 자동으로 이동합니다</p>
          <p>QR ID는 영문, 숫자, -, _ 조합으로 자유롭게 지정할 수 있어요</p>
          <p className="font-medium">예: /q/W1 · /q/dryer-01 · /q/Room_3</p>
        </div>
      </div>
    </div>
  )
}
