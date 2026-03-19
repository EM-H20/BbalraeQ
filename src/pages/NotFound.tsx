import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <p className="text-5xl font-bold text-muted-foreground">404</p>
          <p className="text-lg font-semibold">페이지를 찾을 수 없어요</p>
          <p className="text-sm text-muted-foreground">
            주소가 잘못되었거나 삭제된 페이지예요
          </p>
          <Button onClick={() => navigate("/")} className="mt-2" size="lg">
            홈으로 돌아가기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
