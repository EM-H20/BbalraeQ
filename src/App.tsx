import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "@/pages/Home"
import { QrPage } from "@/pages/QrPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/q/:qrId" element={<QrPage />} />
      </Routes>
    </BrowserRouter>
  )
}
