import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Report } from "./types"
import { ReportCard } from "./ReportCard"

interface ReportsListProps {
  reports: Report[]
  onViewReport: (reportId: string) => void
}

export const ReportsList = ({ reports, onViewReport }: ReportsListProps) => {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-500">Generate your first CRO analysis report below.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onViewReport={onViewReport}
        />
      ))}
    </div>
  )
} 