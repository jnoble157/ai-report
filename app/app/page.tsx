"use client"

import { ReportGenerator } from "@/components/report-generator"
import { ErrorBoundary } from "@/components/error-boundary"

export default function AppPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">GPT Report Generator</h1>
      <ErrorBoundary>
        <ReportGenerator />
      </ErrorBoundary>
    </div>
  )
}

