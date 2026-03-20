import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessMessageProps {
  message: string
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <p className="text-center text-xl font-semibold">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
