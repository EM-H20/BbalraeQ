import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { QrCode, Camera, Package } from "lucide-react";
import washingMachine from "@/assets/washing_machine.png";

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
        <Card>
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

        {/* 안내 */}
        <Card>
          <CardContent className="space-y-3 p-5">
            <h2 className="text-base font-semibold text-muted-foreground">
              QR 코드 만들기
            </h2>
            <p className="text-sm text-muted-foreground">
              아래 형식으로 QR 코드를 생성해 세탁기에 붙이세요.
              <br />
              영문, 숫자, -, _ 조합으로 자유롭게 지정할 수 있어요.
            </p>
            <div className="rounded-lg bg-muted/50 p-3 text-sm font-mono space-y-1">
              <p>
                <span className="text-muted-foreground">세탁기 1호 →</span>{" "}
                웹주소/q/W1
              </p>
              <p>
                <span className="text-muted-foreground">세탁기 2호 →</span>{" "}
                웹주소/q/W2
              </p>
              <p>
                <span className="text-muted-foreground">건조기 1호 →</span>{" "}
                웹주소/q/D1
              </p>
              <p>
                <span className="text-muted-foreground">3층 세탁실 →</span>{" "}
                웹주소/q/room3
              </p>
              <p>
                <span className="text-muted-foreground">자유 형식 →</span>{" "}
                웹주소/q/my-washer_01
              </p>
            </div>
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
          <a
            href="https://www.flaticon.com/kr/free-icons/-"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            아이콘 제작자: smashingstocks - Flaticon
          </a>
        </p>
      </div>
    </div>
  );
}
