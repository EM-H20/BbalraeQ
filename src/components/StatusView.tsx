import { BasketPhoto } from "@/components/BasketPhoto"
import type { Registration } from "@/types"

interface StatusViewProps {
  qrId: string
  registration: Registration | null
  onRegister: () => void
  onRetrieve: () => void
}

export function StatusView({ qrId, registration, onRegister, onRetrieve }: StatusViewProps) {
  if (registration) {
    return (
      <div className="flex min-h-svh flex-col items-center px-4 py-8">
        <header className="mb-6 flex w-full max-w-md items-center justify-between">
          <h1 className="text-xl font-bold">빨래큐</h1>
          <span className="text-sm text-muted-foreground">QR #{qrId}</span>
        </header>

        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1 text-center">
            <div className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
              현재 사용 중이에요
            </div>
            <p className="text-lg font-medium">"{registration.nickname}"님의 세탁물이에요</p>
          </div>

          <BasketPhoto imageUrl={registration.image_url} />

          <div className="space-y-3">
            <button
              onClick={onRegister}
              className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground"
            >
              내 세탁물 등록하기
            </button>
            <button
              onClick={onRetrieve}
              className="w-full rounded-lg border border-border px-4 py-3 font-medium"
            >
              세탁물 회수 완료
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center px-4 py-8">
      <header className="mb-6 flex w-full max-w-md items-center justify-between">
        <h1 className="text-xl font-bold">빨래큐</h1>
        <span className="text-sm text-muted-foreground">QR #{qrId}</span>
      </header>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            지금 사용할 수 있어요!
          </div>
        </div>

        <button
          onClick={onRegister}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground"
        >
          내 세탁물 등록하기
        </button>
      </div>
    </div>
  )
}
