import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "@/pages/Home"
import { QrPage } from "@/pages/QrPage"
import { NotFound } from "@/pages/NotFound"
import { PolicyPage } from "@/pages/PolicyPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/q/:qrId" element={<QrPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
