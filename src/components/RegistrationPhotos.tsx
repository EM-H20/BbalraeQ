interface RegistrationPhotosProps {
  basketImageUrl: string;
  washerImageUrl?: string;
}

export function RegistrationPhotos({
  basketImageUrl,
  washerImageUrl,
}: RegistrationPhotosProps) {
  return (
    <div className="space-y-5">
      {washerImageUrl ? (
        <div className="space-y-1.5">
          <p className="text-base font-semibold text-muted-foreground">
            세탁기
          </p>
          <div className="overflow-hidden rounded-lg">
            <img
              src={washerImageUrl}
              alt="세탁기 사진"
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
      <div className="space-y-1.5">
        <p className="text-base font-semibold text-muted-foreground">바구니</p>
        <div className="overflow-hidden rounded-lg">
          <img
            src={basketImageUrl}
            alt="바구니 사진"
            className="aspect-square w-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-center text-base font-medium text-muted-foreground">
          이 바구니에 넣어주세요!
        </p>
      </div>
    </div>
  );
}
