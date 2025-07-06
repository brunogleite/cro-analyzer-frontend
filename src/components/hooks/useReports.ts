import { useState, useCallback, useEffect } from "react"
import { Report } from "../types"

export const useReports = () => {
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