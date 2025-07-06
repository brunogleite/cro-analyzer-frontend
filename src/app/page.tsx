"use client"

import { useState, useCallback, useEffect } from "react"
import { BarChart3, Clock, FileText, Globe, Loader2, Download, ExternalLink, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Report {
  id: string
  url: string
  status: "generating" | "completed" | "failed"
  progress: number
  startTime: Date
  completedTime?: Date
  duration?: number
  error?: string
}

type TabType = "one-time" | "reports"

// Utility functions
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

const getStatusColor = (status: Report["status"]): string => {
  switch (status) {
    case "generating":
      return "bg-blue-500"
    case "completed":
      return "bg-green-500"
    case "failed":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusText = (status: Report["status"]): string => {
  switch (status) {
    case "generating":
      return "Generating"
    case "completed":
      return "Completed"
    case "failed":
      return "Failed"
    default:
      return "Unknown"
  }
}

// Custom hook for reports management
const useReports = () => {
  const [reports, setReports] = useState<Report[]>(() => {
    // Load from localStorage on init
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cro-reports")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return parsed.map((report: any) => ({
            ...report,
            startTime: new Date(report.startTime),
            completedTime: report.completedTime ? new Date(report.completedTime) : undefined,
          }))
        } catch {
          return []
        }
      }
    }
    return []
  })

  // Save to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem("cro-reports", JSON.stringify(reports))
  }, [reports])

  const addReport = useCallback((report: Report) => {
    setReports(prev => [report, ...prev])
  }, [])

  const updateReport = useCallback((id: string, updates: Partial<Report> | ((prev: Report) => Partial<Report>)) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...(typeof updates === 'function' ? updates(report) : updates) } : report
    ))
  }, [])

  return { reports, addReport, updateReport }
}

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

    const newReport: Report = {
      id: Date.now().toString(),
      url: trimmedUrl,
      status: "generating",
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
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">CRO Analyzer</h1>
              <p className="text-sm text-gray-500">Website Optimization</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("one-time")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "one-time"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Globe className="h-4 w-4" />
              One Time
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "reports"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileText className="h-4 w-4" />
              Reports
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {activeTab === "one-time" ? "One Time Analysis" : "Reports Dashboard"}
          </h2>
          <p className="text-gray-600 mt-1">
            {activeTab === "one-time"
              ? "Analyze a website for conversion optimization opportunities"
              : "View and manage your CRO analysis reports"}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "reports" && (
            <div className="space-y-6">
              {/* Reports List */}
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="transition-all hover:shadow-md">
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
                              onClick={() => handleViewReport(report.id)}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadPDF(report.id)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {reports.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                      <p className="text-gray-500">Generate your first CRO analysis report below.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "one-time" && (
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Website Analysis</CardTitle>
                  <CardDescription>Enter a website URL to generate a comprehensive CRO analysis report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="website-url">Website URL</Label>
                    <Input
                      id="website-url"
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={handleUrlChange}
                      onKeyPress={handleKeyPress}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateReport} 
                    className="w-full" 
                    disabled={!url.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate CRO Report
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom URL Input (for Reports page) */}
        {activeTab === "reports" && (
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="max-w-4xl">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="Enter website URL to analyze..."
                    value={url}
                    onChange={handleUrlChange}
                    onKeyPress={handleKeyPress}
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={!url.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
