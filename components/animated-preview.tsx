"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Paste URL",
    content: "Share your GPT conversation or upload any text content",
    icon: "🔗"
  },
  {
    title: "Select Template",
    content: "Choose from our professional report templates",
    icon: "📄"
  },
  {
    title: "Generate Report",
    content: "Watch AI transform your content into a structured report",
    icon: "⚡"
  },
  {
    title: "Download",
    content: "Export your polished report in your preferred format",
    icon: "📥"
  }
]

export function AnimatedPreview() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border bg-gradient-to-br from-muted/50 to-muted shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className={cn(
                  "p-4 transition-all duration-700 ease-in-out transform hover:shadow-md",
                  currentStep === index
                    ? "bg-primary text-primary-foreground scale-105 shadow-lg"
                    : "bg-background/80 backdrop-blur-sm opacity-40 scale-95"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl transform transition-all duration-500 hover:scale-110">
                    {step.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{step.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{step.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 