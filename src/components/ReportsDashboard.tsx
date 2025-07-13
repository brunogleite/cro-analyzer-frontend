import { Report } from "./types"
import { ReportsList } from "./ReportsList"
import { UrlInput } from "./UrlInput"

interface ReportsDashboardProps {
  reports: Report[]
  url: string
  error: string | null
  isLoading: boolean
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
  isLoading,
  isSubmitting,
  onUrlChange,
  onKeyPress,
  onSubmit,
  onViewReport,
}: ReportsDashboardProps) => {
  return (
    <>
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading reports...</div>
          </div>
        ) : (
          <ReportsList
            reports={reports}
            onViewReport={onViewReport}
          />
        )}
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