import { Clock, Loader2, Download, ExternalLink, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Report } from "./types"
import { formatDuration, getStatusColor, getStatusText } from "./utils"

interface ReportCardProps {
  report: Report
  onViewReport: (reportId: string) => void
  onDownloadPDF: (reportId: string) => void
}

export const ReportCard = ({ report, onViewReport, onDownloadPDF }: ReportCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
              <h3 className="font-medium text-gray-900">{report.url}</h3>
              <Badge variant="secondary" className="text-xs">
                {getStatusText(report.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Started: {report.startTime.toLocaleTimeString()}
              </div>
              {report.duration && <div>Duration: {formatDuration(report.duration)}</div>}
            </div>

            {report.error && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{report.error}</AlertDescription>
              </Alert>
            )}

            {report.status === "generating" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Analyzing website... {Math.round(report.progress)}%
                  </span>
                </div>
                <Progress value={report.progress} className="h-2" />
              </div>
            )}
          </div>

          {report.status === "completed" && (
            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewReport(report.id)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDownloadPDF(report.id)}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 