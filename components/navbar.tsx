"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { SignInModal } from "./sign-in-modal"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">AI Report</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm">
              <Link href="/app">Try Now</Link>
            </Button>
            <Button size="sm" onClick={() => setIsSignInOpen(true)}>
              Sign In
            </Button>
          </div>

          <button className="flex md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="container md:hidden py-4 flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex items-center gap-4 pt-2">
              <ThemeToggle />
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/app">Try Now</Link>
              </Button>
              <Button size="sm" className="w-full" onClick={() => setIsSignInOpen(true)}>
                Sign In
              </Button>
            </div>
          </div>
        )}
      </header>
      <SignInModal open={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </>
  )
}

