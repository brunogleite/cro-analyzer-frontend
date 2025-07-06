export interface Report {
  id: string
  url: string
  status: "generating" | "completed" | "failed"
  progress: number
  startTime: Date
  completedTime?: Date
  duration?: number
  error?: string
}

export type TabType = "one-time" | "reports" 