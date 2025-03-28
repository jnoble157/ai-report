import { FileText, Download, Layers, Zap, Lock, RefreshCw } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              AI Report provides all the tools you need to transform your GPT conversations into professional reports.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <FileText className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Multiple Templates</h3>
            <p className="text-center text-muted-foreground">
              Choose from various report templates to match your specific needs.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Download className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Export Options</h3>
            <p className="text-center text-muted-foreground">
              Download as PDF, markdown, or copy as text for easy sharing.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Layers className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Structured Analysis</h3>
            <p className="text-center text-muted-foreground">
              Get section-by-section breakdowns and actionable insights.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Zap className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Fast Processing</h3>
            <p className="text-center text-muted-foreground">Generate comprehensive reports in seconds, not hours.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Lock className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-center text-muted-foreground">
              Your conversations and API keys are never stored on our servers.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <RefreshCw className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Customizable</h3>
            <p className="text-center text-muted-foreground">
              Tailor reports to your specific requirements with easy customization.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

