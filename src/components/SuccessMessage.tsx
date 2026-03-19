import { CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  message: string
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  )
}
