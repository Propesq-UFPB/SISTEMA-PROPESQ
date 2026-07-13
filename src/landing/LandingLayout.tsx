// src/landing/LandingLayout.tsx
import { Outlet } from "react-router-dom"
import HeaderLanding from "./HeaderLanding"

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-ufpb-light text-ufpb-dark">
      <HeaderLanding />

      <main>
        <Outlet />
      </main>
    </div>
  )
}
