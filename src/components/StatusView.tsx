import type { Registration } from "@/types"

interface StatusViewProps {
  registration: Registration | null
  onRegister: () => void
  onRetrieve: () => void
}

export function StatusView({ registration, onRegister, onRetrieve }: StatusViewProps) {
  if (registration) {
    return (
      <div>
        <p>현재 사용 중이에요</p>
        <p>"{registration.nickname}"님의 세탁물이에요</p>
        <button onClick={onRegister}>내 세탁물 등록하기</button>
        <button onClick={onRetrieve}>세탁물 회수 완료</button>
      </div>
    )
  }

  return (
    <div>
      <p>지금 사용할 수 있어요!</p>
      <button onClick={onRegister}>내 세탁물 등록하기</button>
    </div>
  )
}
