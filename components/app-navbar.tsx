"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">AI Report</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/app/history">History</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/app/settings">Settings</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

