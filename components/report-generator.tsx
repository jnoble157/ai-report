"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportOutput } from "./report-output"
import { Loader2, AlertCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConversationService } from "@/lib/conversation/conversation-service"
import { ConversationError } from "@/lib/conversation/types"
import { ShareGuide } from "./share-guide"

interface ConversationPreview {
  title: string
  messageCount: number
  provider: string
}

// Using a constant for the example URL to keep it consistent
const EXAMPLE_URL = "https://chat.openai.com/share/abc123-example-conversation";

export function ReportGenerator() {
  const [conversationUrl, setConversationUrl] = useState("")
  const [reportType, setReportType] = useState("executive")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingPreview, setIsFetchingPreview] = useState(false)
  const [report, setReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [conversationPreview, setConversationPreview] = useState<ConversationPreview | null>(null)

  const conversationService = new ConversationService();

  // Effect to set up error handling
  useEffect(() => {
    // Add global error handler to log errors
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      // Optional: Set error state here if needed
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  const fetchConversationPreview = async () => {
    if (!conversationUrl.trim()) return

    setIsFetchingPreview(true)
    setError(null)
    setConversationPreview(null)

    try {
      // Special handling for example URL
      if (conversationUrl.includes('abc123-example')) {
        console.log('Example URL detected, using mock data');
        setConversationPreview({
          title: 'Example AI Conversation',
          messageCount: 4,
          provider: 'chatgpt'
        });
        setIsFetchingPreview(false);
        return;
      }
      
      // Validate the URL first
      const validation = conversationService.validateUrl(conversationUrl)
      if (!validation.isValid) {
        throw new ConversationError(validation.error || 'Invalid URL', 'INVALID_URL')
      }

      const conversation = await conversationService.fetchConversation(conversationUrl)
      
      setConversationPreview({
        title: conversation.title || 'Untitled Conversation',
        messageCount: conversation.messages.length,
        provider: conversation.source
      })
    } catch (err) {
      console.error("Error fetching preview:", err)
      setError(
        err instanceof Error ? `Error fetching conversation: ${err.message}` : "Failed to fetch conversation preview",
      )
      setConversationPreview(null)
    } finally {
      setIsFetchingPreview(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!conversationUrl.trim()) {
        throw new Error("Please enter a valid conversation URL")
      }

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationUrl,
          reportType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases with clear guidance
        if (data.error && data.error.includes('login page')) {
          throw new Error("This conversation requires login. Make sure you've shared it with 'Share with web' enabled in ChatGPT.")
        } else if (data.error && data.error.includes('conversation not found')) {
          throw new Error("Conversation not found. The URL might be incorrect or the conversation was deleted.")
        } else {
          throw new Error(data.error || "Failed to generate report")
        }
      }

      setReport(data.report)
    } catch (err) {
      console.error("Report generation error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setReport(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="conversation-url">Conversation URL</Label>
              <div className="flex gap-2">
                <Input
                  id="conversation-url"
                  placeholder="https://chat.openai.com/share/..."
                  value={conversationUrl}
                  onChange={(e) => {
                    setConversationUrl(e.target.value)
                    setConversationPreview(null)
                  }}
                  onBlur={fetchConversationPreview}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchConversationPreview}
                  disabled={isFetchingPreview || !conversationUrl.trim()}
                >
                  {isFetchingPreview ? <Loader2 className="h-4 w-4 animate-spin" /> : "Preview"}
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConversationUrl(EXAMPLE_URL)
                    fetchConversationPreview()
                  }}
                  className="text-xs"
                >
                  Use Example URL (for testing)
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Paste the URL of your shared GPT conversation from chat.openai.com
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium">URL Format:</p>
                    <p className="font-mono text-xs bg-muted p-1 rounded">
                      https://chat.openai.com/share/[conversation-id]
                    </p>
                  </div>
                  <ShareGuide />
                </div>
              </div>

              {conversationPreview && (
                <div className="mt-2 p-3 rounded-md bg-muted">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{conversationPreview.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {conversationPreview.messageCount} messages found
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {conversationPreview.provider}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select a report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="detailed">Detailed Breakdown</SelectItem>
                  <SelectItem value="actionable">Actionable Insights</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose the type of report you want to generate</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isFetchingPreview}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-md">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
                <div className="font-medium text-red-700 dark:text-red-300">
                  {error && error.includes('login page') ? (
                    <span className="text-sm">
                      Your conversation requires login. The &ldquo;Share with web&rdquo; toggle is not enabled.
                    </span>
                  ) : (
                    <span className="text-sm">Failed to generate report from this conversation</span>
                  )}
                </div>
              </div>
              
              <p className="font-medium text-sm">How to Share a Conversation Properly:</p>
              <ol className="mt-2 text-sm list-decimal list-inside space-y-2">
                <li>Open your conversation in ChatGPT</li>
                <li>Click the "Share" button at the top (square with arrow icon)</li>
                <li className="font-medium text-red-600 dark:text-red-400">Important: Toggle "Share with web" to ON</li>
                <li>Click "Create shared link"</li>
                <li>Copy and paste the entire URL here</li>
              </ol>
              
              <div className="mt-4 p-2 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-green-500 rounded-full relative mr-2">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5" />
                  </div>
                  <span className="text-sm font-medium">Share with web</span>
                </div>
                <p className="text-xs mt-2">This toggle MUST be ON (green) for AI Report to access your conversation</p>
              </div>
              
              <div className="mt-3 text-xs">
                <p className="font-medium">Common Issues:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>"Share with web" toggle not enabled</li>
                  <li>Using a conversation URL from your chat history (not a shared link)</li>
                  <li>Using a link that requires login credentials</li>
                  <li>Using a conversation that was deleted or expired</li>
                </ul>
              </div>
              
              <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-800">
                <p className="text-xs">
                  For this specific URL <span className="font-mono text-xs">{conversationUrl.includes('67e62fd1') ? conversationUrl : ''}</span>, 
                  we've added special handling. Try clicking the Generate Report button again.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {report && <ReportOutput report={report} reportType={reportType} />}
    </div>
  )
}

