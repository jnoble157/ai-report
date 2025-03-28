import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AnimatedPreview } from "./animated-preview"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium mb-2">
                🚀 Supercharge Your Content
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Transform Any Content into Structured Reports
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From raw text to polished reports in seconds. Choose your template, generate report, and export anywhere.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200">
                <Link href="/app">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-muted transition-colors duration-200">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-muted pointer-events-none" />
            <AnimatedPreview />
          </div>
        </div>
      </div>
    </section>
  )
}

