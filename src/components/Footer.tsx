import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="mt-6 w-full max-w-md space-y-1 text-center">
      <p className="text-xs text-muted-foreground">
        서비스 이용 시{" "}
        <Link to="/policy?tab=terms" className="underline">
          이용약관
        </Link>
        {" "}및{" "}
        <Link to="/policy?tab=privacy" className="underline">
          개인정보처리방침
        </Link>
        에 동의한 것으로 간주합니다.
      </p>
      <p className="text-sm text-muted-foreground/50">
        &copy; 2026. Elipair All rights reserved.
      </p>
    </footer>
  )
}
