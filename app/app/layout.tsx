import type React from "react"
import { AppNavbar } from "@/components/app-navbar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  )
}

