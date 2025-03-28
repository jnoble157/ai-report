import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HistoryPage() {
  // In a real app, we would fetch the user's report history from a database
  const reports = [
    {
      id: 1,
      title: "GPT Conversation Analysis",
      date: "2025-03-27",
      type: "Executive Summary",
    },
    {
      id: 2,
      title: "Product Development Discussion",
      date: "2025-03-26",
      type: "Detailed Breakdown",
    },
    {
      id: 3,
      title: "Marketing Strategy Planning",
      date: "2025-03-25",
      type: "Actionable Insights",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Report History</h1>
        <Button asChild>
          <Link href="/app">New Report</Link>
        </Button>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">You haven't generated any reports yet</p>
            <Button asChild>
              <Link href="/app">Generate Your First Report</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-2">
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {report.date} • {report.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/reports/${report.id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

