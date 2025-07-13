"use client"

import { useState, useCallback } from "react"
import {
  Sidebar,
  Header,
  ReportsDashboard,
  useReports,
  isValidUrl,
  TabType,
  ProtectedRoute
} from "@/components"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("reports")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { reports, isLoading, error: reportsError, createAnalysis, downloadPDF } = useReports()

  const handleGenerateReport = useCallback(async () => {
    const trimmedUrl = url.trim()
    
    if (!trimmedUrl) {
      setError("Please enter a website URL")
      return
    }

    if (!isValidUrl(trimmedUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await createAnalysis(trimmedUrl)
      setUrl("")
      setError(null)
    } catch (err) {
      console.error('Failed to create analysis:', err)
      setError(err instanceof Error ? err.message : 'Failed to create analysis')
    } finally {
      setIsSubmitting(false)
    }
  }, [url, createAnalysis])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (error) setError(null)
  }, [error])

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleGenerateReport()
    }
  }, [handleGenerateReport, isSubmitting])

  const handleViewReport = useCallback((reportId: string) => {
    // TODO: Implement report viewing logic - could open in a modal or new page
    console.log("Viewing report:", reportId)
  }, [])

  // Combine local error with reports error
  const displayError = error || reportsError

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 flex flex-col">
          <Header activeTab={activeTab} />

          <div className="flex-1 p-6 overflow-auto">
            <ReportsDashboard
              reports={reports}
              url={url}
              error={displayError}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              onUrlChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              onSubmit={handleGenerateReport}
              onViewReport={handleViewReport}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 