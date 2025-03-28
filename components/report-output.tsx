"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, FileText } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ReportOutputProps {
  report: string
  reportType: string
}

export function ReportOutput({ report, reportType }: ReportOutputProps) {
  const [activeTab, setActiveTab] = useState("preview")

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report)
    // In a real app, we would show a toast notification
    alert("Copied to clipboard!")
  }

  const downloadPDF = () => {
    // In a real app, we would generate a PDF and download it
    alert("PDF download functionality would be implemented here")
  }

  const downloadMarkdown = () => {
    const blob = new Blob([report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getReportTypeTitle = () => {
    switch (reportType) {
      case "executive":
        return "Executive Summary"
      case "detailed":
        return "Detailed Breakdown"
      case "actionable":
        return "Actionable Insights"
      default:
        return "Generated Report"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{getReportTypeTitle()}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadMarkdown}>
            <FileText className="h-4 w-4 mr-2" />
            Markdown
          </Button>
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </TabsContent>
          <TabsContent value="markdown" className="mt-4">
            <pre className="p-4 bg-muted rounded-md overflow-auto">
              <code>{report}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

