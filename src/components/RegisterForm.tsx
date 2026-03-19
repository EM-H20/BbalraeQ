interface RegisterFormProps {
  qrId: string
  onSuccess: () => void
  onCancel: () => void
}

export function RegisterForm({ qrId: _qrId, onSuccess: _onSuccess, onCancel: _onCancel }: RegisterFormProps) {
  return (
    <div>
      <h2>내 세탁물 등록</h2>
    </div>
  )
}
