import { Report } from "./types"

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

export const getStatusColor = (status: Report["status"]): string => {
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

export const getStatusText = (status: Report["status"]): string => {
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