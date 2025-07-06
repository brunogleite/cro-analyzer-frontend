import { Report } from "./types"
import { ReportsList } from "./ReportsList"
import { UrlInput } from "./UrlInput"

interface ReportsDashboardProps {
  reports: Report[]
  url: string
  error: string | null
  isSubmitting: boolean
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit: () => void
  onViewReport: (reportId: string) => void
  onDownloadPDF: (reportId: string) => void
}

export const ReportsDashboard = ({
  reports,
  url,
  error,
  isSubmitting,
  onUrlChange,
  onKeyPress,
  onSubmit,
  onViewReport,
  onDownloadPDF
}: ReportsDashboardProps) => {
  return (
    <>
      <div className="space-y-6">
        <ReportsList
          reports={reports}
          onViewReport={onViewReport}
          onDownloadPDF={onDownloadPDF}
        />
      </div>

      {/* Bottom URL Input */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl">
          <UrlInput
            url={url}
            error={error}
            isSubmitting={isSubmitting}
            onUrlChange={onUrlChange}
            onKeyPress={onKeyPress}
            onSubmit={onSubmit}
            placeholder="Enter website URL to analyze..."
          />
        </div>
      </div>
    </>
  )
} 