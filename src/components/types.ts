export interface Report {
  id: string
  userId: string
  url: string
  pageTitle?: string
  analysis: string
  pdfPath?: string
  metadata: {
    wordCount: number
    analysisTokens: number
    pageSize: number
    loadTime?: number
    screenshotPath?: string
  }
  status: "pending" | "processing" | "completed" | "failed"
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

export type TabType = "one-time" | "reports"

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
} 