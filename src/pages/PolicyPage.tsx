import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronDown } from "lucide-react"
import termsData from "@/data/terms.json"
import privacyData from "@/data/privacy.json"

type Tab = "terms" | "privacy"

export function PolicyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get("tab") === "privacy" ? "privacy" : "terms"
  const [tab, setTab] = useState<Tab>(initialTab)
  const [openSections, setOpenSections] = useState<Set<number>>(new Set())

  const data = tab === "terms" ? termsData : privacyData

  function toggleSection(index: number) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function handleTabChange(newTab: Tab) {
    setTab(newTab)
    setOpenSections(new Set())
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-4 pt-10 pb-8">
      <div className="w-full max-w-md space-y-5">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">{data.title}</h1>
        </header>

        {/* 탭 */}
        <div className="flex rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => handleTabChange("terms")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === "terms"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            이용약관
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("privacy")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === "privacy"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            개인정보처리방침
          </button>
        </div>

        {/* 아코디언 */}
        <Card>
          <CardContent className="divide-y p-0">
            {data.sections.map((section, i) => (
              <div key={section.title}>
                <button
                  type="button"
                  onClick={() => toggleSection(i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold">{section.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      openSections.has(i) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.has(i) ? (
                  <div className="px-5 pb-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {section.content}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 시행일 */}
        <p className="text-center text-xs text-muted-foreground">
          시행일: {data.effectiveDate}
        </p>
      </div>
    </div>
  )
}
