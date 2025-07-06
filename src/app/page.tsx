"use client"

import { useState, useCallback } from "react"
import {
  Sidebar,
  Header,
  OneTimeAnalysis,
  ReportsDashboard,
  useReports,
  isValidUrl,
  TabType
} from "@/components"

export default function CROAnalyzer() {
  const [activeTab, setActiveTab] = useState<TabType>("reports")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { reports, addReport, updateReport } = useReports()

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

    const newReport = {
      id: Date.now().toString(),
      url: trimmedUrl,
      status: "generating" as const,
      progress: 0,
      startTime: new Date(),
    }

    addReport(newReport)
    setUrl("")

    // Simulate report generation progress
    const interval = setInterval(() => {
      updateReport(newReport.id, (prev) => {
        if (prev.status !== "generating") {
          clearInterval(interval)
          return prev
        }

        const newProgress = Math.min(prev.progress + Math.random() * 15, 100)

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsSubmitting(false)
          return {
            ...prev,
            status: "completed",
            progress: 100,
            completedTime: new Date(),
            duration: Math.floor((Date.now() - prev.startTime.getTime()) / 1000),
          }
        }

        return { ...prev, progress: newProgress }
      })
    }, 800)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [url, addReport, updateReport])

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
    // TODO: Implement report viewing logic
    console.log("Viewing report:", reportId)
  }, [])

  const handleDownloadPDF = useCallback((reportId: string) => {
    // TODO: Implement PDF download logic
    console.log("Downloading PDF for report:", reportId)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} />

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "one-time" && (
            <OneTimeAnalysis
              url={url}
              error={error}
              isSubmitting={isSubmitting}
              onUrlChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              onSubmit={handleGenerateReport}
            />
          )}

          {activeTab === "reports" && (
            <ReportsDashboard
              reports={reports}
              url={url}
              error={error}
              isSubmitting={isSubmitting}
              onUrlChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              onSubmit={handleGenerateReport}
              onViewReport={handleViewReport}
              onDownloadPDF={handleDownloadPDF}
            />
          )}
        </div>
      </div>
    </div>
  )
}
