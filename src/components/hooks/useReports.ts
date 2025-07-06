import { useState, useCallback, useEffect } from "react"
import { Report } from "../types"

// Type guard to validate report data from localStorage
const isValidReport = (data: unknown): data is Omit<Report, 'startTime' | 'completedTime'> & {
  startTime: string
  completedTime?: string
} => {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.progress === 'number' &&
    typeof obj.startTime === 'string'
  )
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>(() => {
    // Load from localStorage on init
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cro-reports")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            return parsed
              .filter(isValidReport)
              .map((report) => ({
                ...report,
                startTime: new Date(report.startTime),
                completedTime: report.completedTime ? new Date(report.completedTime) : undefined,
              }))
          }
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