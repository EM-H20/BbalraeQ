interface SuccessMessageProps {
  message: string
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div>
      <p>{message}</p>
    </div>
  )
}
