"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { ConversationService } from "@/lib/conversation/conversation-service"
import { ConversationError } from "@/lib/conversation/types"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { templateManager } from "@/lib/templates"
import ReactMarkdown from 'react-markdown'

// Add custom event type definition
declare global {
  interface WindowEventMap {
    resetGeneratorState: CustomEvent;
  }
}

interface ConversationPreview {
  title: string
  messageCount: number
  provider: string
}

type InputType = "llm" | "scratch" | "file"

export function ReportGenerator() {
  const [inputType, setInputType] = useState<InputType>("llm")
  const [conversationUrl, setConversationUrl] = useState("")
  const [scratchNotes, setScratchNotes] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState("")
  const [reportType, setReportType] = useState("executive")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [errors, setErrors] = useState<Record<InputType, string | null>>({
    llm: null,
    scratch: null,
    file: null
  })
  const [conversationPreview, setConversationPreview] = useState<ConversationPreview | null>(null)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const conversationService = new ConversationService();

  const ALLOWED_FILE_TYPES = {
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.json': 'application/json',
  };

  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  const validateFile = (file: File) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size must be less than 1MB");
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !Object.keys(ALLOWED_FILE_TYPES).includes(fileExtension)) {
      throw new Error("Only .md, .txt, and .json files are supported");
    }

    return true;
  };

  const handleFileUpload = async (file: File) => {
    try {
      validateFile(file);
      
      // First clear any old file state and errors
      setFileContent("");
      setUploadedFile(null);
      setErrors(prev => ({ ...prev, file: null }));
      
      // Get the file content safely
      try {
        const text = await file.text();
        if (!text || !text.trim()) {
          throw new Error("File appears to be empty");
        }
        
        // Log file details for debugging
        console.log(`Uploaded file: ${file.name}, size: ${file.size}B, type: ${file.type}`);
        console.log(`Content length: ${text.length} characters`);
        
        // Set the new file state
        setFileContent(text);
        setUploadedFile(file);
      } catch (readError) {
        console.error("Error reading file:", readError);
        throw new Error("Failed to read file content");
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, file: err instanceof Error ? err.message : "Failed to read file" }));
      setUploadedFile(null);
      setFileContent("");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Effect to set up error handling and state reset listener
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };
    
    // Add listener for state reset event from report page
    const resetStateHandler = () => {
      console.log('Resetting generator state');
      
      // First set loading to true during reset to prevent any interactions
      setIsLoading(true);
      
      // Force a small delay to ensure clean state transitions
      setTimeout(() => {
        // Reset all form state
        setConversationUrl('');
        setScratchNotes('');
        setUploadedFile(null);
        setFileContent('');
        setReportType('executive');
        setConversationPreview(null);
        setErrors({ llm: null, scratch: null, file: null });
        setIsValidating(false);
        
        // Reset file input if it exists
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Finally allow interaction again
        setIsLoading(false);
        
        // Set input type to llm as default after reset
        setInputType('llm');
        
        console.log('Generator state reset complete');
      }, 100);
    };
    
    window.addEventListener('error', errorHandler);
    window.addEventListener('resetGeneratorState', resetStateHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('resetGeneratorState', resetStateHandler);
    };
  }, []);

  const validateConversationUrl = async () => {
    if (!conversationUrl.trim()) return

    setIsValidating(true)
    setErrors(prev => ({ ...prev, llm: null }))
    setConversationPreview(null)

    try {
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
      console.error("Error validating URL:", err)
      setErrors(prev => ({ ...prev, llm: err instanceof Error ? err.message : "Invalid URL" }))
      setConversationPreview(null)
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({ llm: null, scratch: null, file: null })

    try {
      let content = ""
      
      switch (inputType) {
        case "llm":
          if (!conversationUrl.trim()) {
            throw new Error("Please enter a conversation URL")
          }
          content = conversationUrl
          break
        case "scratch":
          if (!scratchNotes.trim()) {
            setErrors(prev => ({ ...prev, scratch: "Please enter some notes" }))
            throw new Error("Please enter some notes")
          }
          content = scratchNotes
          break
        case "file":
          if (!fileContent) {
            setErrors(prev => ({ ...prev, file: "Please upload a file" }))
            throw new Error("Please upload a file")
          }
          
          // Ensure file content is properly handled as a string
          if (typeof fileContent !== 'string') {
            console.error("File content is not a string:", typeof fileContent)
            throw new Error("Invalid file content")
          }
          
          // Clean up any potential issues with the file content
          content = fileContent.toString().trim()
          
          if (content.length === 0) {
            setErrors(prev => ({ ...prev, file: "File content is empty" }))
            throw new Error("File content is empty")
          }
          
          console.log(`File content length: ${content.length} chars`)
          break
      }

      console.log(`Submitting report generation request with ${inputType} input`)
      
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          reportType,
          inputType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("API response error:", data)
        if (data.error && data.error.includes('login page')) {
          throw new Error("Login required")
        } else if (data.error && data.error.includes('conversation not found')) {
          throw new Error("Not found")
        } else {
          throw new Error(data.error || "Generation failed")
        }
      }

      router.push(`/report?report=${encodeURIComponent(data.report)}&type=${reportType}`)
    } catch (err) {
      console.error("Report generation error:", err)
      setErrors(prev => ({
        ...prev,
        [inputType]: err instanceof Error ? err.message : "Unknown error"
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Input Selection and Content */}
              <div className="space-y-8">
                <Tabs value={inputType} onValueChange={(value) => setInputType(value as InputType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="llm">LLM Conversation</TabsTrigger>
                    <TabsTrigger value="scratch">Scratch Notes</TabsTrigger>
                    <TabsTrigger value="file">Upload File</TabsTrigger>
                  </TabsList>

                  <TabsContent value="llm" className="mt-0">
                    <div className="space-y-4">
                      <Label htmlFor="conversation-url">Conversation URL</Label>
                      <Input
                        id="conversation-url"
                        placeholder="https://chat.openai.com/share/..."
                        value={conversationUrl}
                        onChange={(e) => {
                          setConversationUrl(e.target.value)
                          setConversationPreview(null)
                        }}
                        onBlur={validateConversationUrl}
                        required
                        className="h-12"
                      />
                      <div className="flex items-center gap-2 text-sm">
                        {isValidating && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Validating...</span>
                          </div>
                        )}
                        {conversationPreview && (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Valid conversation URL</span>
                          </div>
                        )}
                        {errors.llm && (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.llm}</span>
                          </div>
                        )}
                      </div>
                      {conversationPreview && (
                        <p className="text-sm text-muted-foreground">
                          {conversationPreview.title} • {conversationPreview.messageCount} messages • {conversationPreview.provider}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="scratch" className="mt-0">
                    <div className="space-y-4">
                      <Label htmlFor="scratch-notes">Your Notes</Label>
                      <Textarea
                        id="scratch-notes"
                        placeholder="Paste or type your notes here..."
                        value={scratchNotes}
                        onChange={(e) => setScratchNotes(e.target.value)}
                        className="min-h-[300px] resize-none"
                        required
                      />
                      {errors.scratch && (
                        <p className="text-sm text-destructive mt-2">
                          {errors.scratch}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="file" className="mt-0">
                    <div className="space-y-4">
                      <Label>Upload File</Label>
                      <div 
                        className={cn(
                          "border-2 border-dashed rounded-lg p-8 text-center min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors",
                          errors.file && "border-destructive border-2",
                          uploadedFile && "border-green-500/50"
                        )}
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file) handleFileUpload(file);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {uploadedFile ? (
                          <>
                            <p className="font-medium">{uploadedFile.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {(uploadedFile.size / 1024).toFixed(1)}KB • Click to upload a different file
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Supports: .md, .txt, .json files (max 1MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".txt,.md,.json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                      {errors.file && (
                        <p className="text-sm text-destructive mt-2">
                          {errors.file}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Template Selection and Preview */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="report-type">Report Template</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type" className="h-12">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      <SelectItem value="meeting">Meeting Notes</SelectItem>
                      <SelectItem value="project">Project Documentation</SelectItem>
                      <SelectItem value="research">Research Summary</SelectItem>
                      <SelectItem value="product">Product Specification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Template Preview</Label>
                  <Card className="max-h-[400px] overflow-hidden">
                    <CardContent className="pt-6 overflow-y-auto max-h-[400px] custom-scrollbar">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {templateManager.getTemplate(reportType)?.metadata?.previewContent ? (
                          <ReactMarkdown>
                            {templateManager.getTemplate(reportType)?.metadata?.previewContent || ''}
                          </ReactMarkdown>
                        ) : (
                          <>
                            <h2>Sample Report</h2>
                            <p>Template preview not available.</p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Generate Report Button - Full Width at Bottom */}
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

