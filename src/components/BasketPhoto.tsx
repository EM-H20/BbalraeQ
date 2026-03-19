interface BasketPhotoProps {
  imageUrl: string
}

export function BasketPhoto({ imageUrl }: BasketPhotoProps) {
  return (
    <div className="space-y-2">
      <img
        src={imageUrl}
        alt="바구니 사진"
        className="aspect-square w-full rounded-lg object-cover"
      />
      <p className="text-center text-sm text-muted-foreground">
        이 바구니에 넣어주세요!
      </p>
    </div>
  )
}
