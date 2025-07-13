import { Clock, Loader2, Download, ExternalLink, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Report } from "./types"
import { getStatusColor, getStatusText } from "./utils"

interface ReportCardProps {
  report: Report
  onViewReport: (reportId: string) => void
}

export const ReportCard = ({ report, onViewReport }: ReportCardProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'completed':
        return <FileText className="h-4 w-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const isProcessing = report.status === 'pending' || report.status === 'processing'
  const isCompleted = report.status === 'completed'
  const isFailed = report.status === 'failed'

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
              <h3 className="font-medium text-gray-900">
                {report.pageTitle || report.url}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {getStatusText(report.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Created: {formatDate(report.createdAt)}
              </div>
              {report.metadata.wordCount > 0 && (
                <div>{report.metadata.wordCount} words</div>
              )}
              {report.metadata.pageSize > 0 && (
                <div>{Math.round(report.metadata.pageSize / 1024)}KB</div>
              )}
            </div>

            {report.errorMessage && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{report.errorMessage}</AlertDescription>
              </Alert>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getStatusIcon(report.status)}
                <span>
                  {report.status === 'pending' ? 'Queued for analysis...' : 'Analyzing website...'}
                </span>
              </div>
            )}

            {isCompleted && report.analysis && (
              <div className="text-sm text-gray-600 mb-3">
                <div className="font-medium mb-1">Analysis Summary:</div>
                <div className="line-clamp-3">
                  {report.analysis.substring(0, 200)}...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {isCompleted && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewReport(report.id)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </>
            )}
            {isFailed && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewReport(report.id)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 