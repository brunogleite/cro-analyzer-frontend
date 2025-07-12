"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  Header,
  OneTimeAnalysis,
  useReports,
  isValidUrl,
  TabType,
  AuthPage,
  useAuthContext
} from "@/components"

export default function OneTimePage() {
  const { isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("one-time")
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show authentication page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} />

        <div className="flex-1 p-6 overflow-auto">
          <OneTimeAnalysis
            url={url}
            error={error}
            isSubmitting={isSubmitting}
            onUrlChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            onSubmit={handleGenerateReport}
          />
        </div>
      </div>
    </div>
  )
} 