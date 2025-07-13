"use client"
import { useState, useCallback, useEffect } from "react"
import { Report, ApiResponse } from "../types"
import { useAuthContext } from "../contexts/AuthContext"

const API_BASE_URL = 'http://localhost:3000'

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getAuthHeaders, isAuthenticated } = useAuthContext()

  // Fetch reports from the backend
  const fetchReports = useCallback(async () => {
    if (!isAuthenticated) {
      setReports([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/cro/analyses`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.statusText}`)
      }

      const data: Report[] = await response.json()
      
      // Convert string dates to Date objects
      const reportsWithDates = data.map(report => ({
        ...report,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt),
      }))

      setReports(reportsWithDates)
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch reports')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, getAuthHeaders])

  // Fetch reports on mount and when authentication changes
  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  // Create a new analysis
  const createAnalysis = useCallback(async (url: string): Promise<Report | null> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to create analysis')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cro/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create analysis')
      }

      const data = await response.json()
      
      // Fetch updated reports after creating new analysis
      await fetchReports()
      
      return data
    } catch (err) {
      console.error('Error creating analysis:', err)
      throw err
    }
  }, [isAuthenticated, getAuthHeaders, fetchReports])

  // Get a single report by ID
  const getReportById = useCallback(async (id: string): Promise<Report | null> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to fetch report')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cro/analysis/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Failed to fetch report: ${response.statusText}`)
      }

      const report: Report = await response.json()
      
      return {
        ...report,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt),
      }
    } catch (err) {
      console.error('Error fetching report:', err)
      throw err
    }
  }, [isAuthenticated, getAuthHeaders])

  // Download PDF report
  const downloadPDF = useCallback(async (reportId: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to download report')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cro/analysis/${reportId}/pdf`, {
        headers: {
          ...getAuthHeaders(),
        } as Record<string, string>,
      })

      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CRO_Report_${reportId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading PDF:', err)
      throw err
    }
  }, [isAuthenticated, getAuthHeaders])

  return { 
    reports, 
    isLoading, 
    error, 
    fetchReports, 
    createAnalysis, 
    getReportById, 
    downloadPDF 
  }
} 