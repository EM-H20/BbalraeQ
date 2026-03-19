interface BasketPhotoProps {
  imageUrl: string
}

export function BasketPhoto({ imageUrl }: BasketPhotoProps) {
  return (
    <div>
      <img src={imageUrl} alt="바구니 사진" className="w-full rounded-lg" />
      <p>이 바구니에 넣어주세요!</p>
    </div>
  )
}
