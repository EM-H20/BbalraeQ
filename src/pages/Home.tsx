import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { QrCode, Camera, Package, Copy, Check, ExternalLink } from "lucide-react";
import washingMachine from "@/assets/washing_machine.png";

const QR_ID_PATTERN = /^[a-zA-Z0-9_-]*$/;
const BASE_URL = `${window.location.origin}/q/`;

const STEPS = [
  {
    icon: QrCode,
    title: "QR 스캔",
    description: "세탁기에 붙은 QR 코드를 스캔하세요",
  },
  {
    icon: Camera,
    title: "사진 등록",
    description: "닉네임과 세탁기/바구니 사진을 올려주세요",
  },
  {
    icon: Package,
    title: "세탁물 확인",
    description: "다른 분이 바구니에 넣어드려요",
  },
] as const;

function UrlGenerator() {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const fullUrl = `${BASE_URL}${name}`;
  const isValid = name.length > 0 && QR_ID_PATTERN.test(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (QR_ID_PATTERN.test(value)) {
      setName(value);
      setCopied(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="py-0">
      <CardContent className="space-y-3 p-5">
        <h2 className="text-base font-semibold text-muted-foreground">
          주소 만들기
        </h2>
        <p className="text-sm text-muted-foreground">
          세탁기 이름을 입력하면 주소가 만들어져요.
          <br />
          영문, 숫자, -, _ 만 사용할 수 있어요.
        </p>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="예: W1, room3, my-washer_01"
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        {isValid && (
          <>
            <div className="rounded-lg bg-muted/50 p-3 text-sm font-mono break-all">
              {fullUrl}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "복사됨" : "복사"}
              </button>
              <a
                href={fullUrl}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                바로가기
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-4 pt-12 pb-8">
      <div className="w-full max-w-md space-y-5">
        {/* 히어로 */}
        <div className="space-y-3 text-center">
          <img
            src={washingMachine}
            alt="세탁기"
            className="mx-auto h-24 w-24"
          />
          <h1 className="text-3xl font-bold tracking-tight">빨래큐</h1>
          <p className="text-lg text-muted-foreground">
            QR 스캔 한 번으로
            <br />
            세탁물 주인과 바구니를 확인하세요
          </p>
        </div>

        {/* 사용법 */}
        <Card className="py-0">
          <CardContent className="space-y-5 p-5">
            <h2 className="text-base font-semibold text-muted-foreground">
              사용 방법
            </h2>
            <ol className="space-y-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <step.icon className="h-4.5 w-4.5 text-foreground" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <p className="text-base font-semibold">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* URL 생성기 */}
        <UrlGenerator />

        {/* QR 코드 만들기 */}
        <Card className="py-0">
          <CardContent className="space-y-3 p-5">
            <h2 className="text-base font-semibold text-muted-foreground">
              QR 코드 만들기
            </h2>
            <p className="text-sm text-muted-foreground">
              위에서 생성한 주소로 QR 코드를 만들어 세탁기에 붙이세요.
            </p>
            <a
              href="https://qr.naver.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#03C75A] px-4 py-2.5 text-sm font-medium text-white"
            >
              네이버 QR 코드 만들기
            </a>
          </CardContent>
        </Card>

        <Footer />

        <p className="text-center text-xs text-muted-foreground/50">
          Designed by{" "}
          <a
            href="https://www.flaticon.com/kr/free-icon/washing-machine_5014793?term=%EC%84%B8%ED%83%81%EA%B8%B0&page=2&position=16&origin=search&related_id=5014793"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            smashingstocks
          </a>{" "}
          from Flaticon
          <br />
          Designed by{" "}
          <a
            href="https://www.flaticon.com/kr/free-icon/laundry-machine_3322056?term=%EC%84%B8%ED%83%81%EA%B8%B0&page=1&position=3&origin=search&related_id=3322056"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Eucalyp
          </a>{" "}
          from Flaticon
        </p>
      </div>
    </div>
  );
}
