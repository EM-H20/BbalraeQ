import { useParams } from "react-router-dom"

export function QrPage() {
  const { qrId } = useParams<{ qrId: string }>()

  return (
    <div>
      <h1>QR: {qrId}</h1>
    </div>
  )
}
