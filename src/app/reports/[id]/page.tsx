"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, Download, AlertCircle, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Report } from "@/components/types"
import { getStatusColor, getStatusText } from "@/components/utils"
import { useAuth } from "@/components/hooks/useAuth"

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getAuthHeaders } = useAuth()
  
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reportId = params.id as string

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return

      try {
        setIsLoading(true)
        setError(null)

        const headers = getAuthHeaders()
        const response = await fetch(`http://localhost:3000/api/cro/analysis/${reportId}`, {
          headers: headers as Record<string, string>
        })

        console.log('response', response);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Report not found')
          }
          if (response.status === 403) {
            throw new Error('Access denied')
          }
          throw new Error(`Failed to fetch report: ${response.statusText}`)
        }

        const data = await response.json()
        
        // Convert dates
        const reportWithDates = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        }

        setReport(reportWithDates)
      } catch (err) {
        console.error('Error fetching report:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch report')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [reportId, getAuthHeaders])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleBack = () => {
    router.push('/reports')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="h-4 w-full bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={handleBack} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={handleBack} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Report not found</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const isCompleted = report.status === 'completed'
  const isFailed = report.status === 'failed'
  const isProcessing = report.status === 'pending' || report.status === 'processing'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {report.pageTitle || report.url}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created: {formatDate(report.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
                  {getStatusText(report.status)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getStatusText(report.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {/* URL Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Website URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={report.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {report.url}
              </a>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {report.metadata.wordCount > 0 && (
                  <div>
                    <div className="text-sm text-gray-500">Word Count</div>
                    <div className="font-medium">{report.metadata.wordCount}</div>
                  </div>
                )}
                {report.metadata.pageSize > 0 && (
                  <div>
                    <div className="text-sm text-gray-500">Page Size</div>
                    <div className="font-medium">{Math.round(report.metadata.pageSize / 1024)}KB</div>
                  </div>
                )}
                {report.metadata.analysisTokens > 0 && (
                  <div>
                    <div className="text-sm text-gray-500">Analysis Tokens</div>
                    <div className="font-medium">{report.metadata.analysisTokens}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {isFailed && report.errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{report.errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <div className="font-medium">
                      {report.status === 'pending' ? 'Queued for analysis...' : 'Analyzing website...'}
                    </div>
                    <div className="text-sm text-gray-500">
                      This may take a few minutes. You can refresh the page to check the status.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {isCompleted && report.analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CRO Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div 
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: report.analysis }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 