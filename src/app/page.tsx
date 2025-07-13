"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthPage, useAuthContext } from "@/components"

export default function CROAnalyzer() {
  const { isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  // Redirect to one-time analysis page by default
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/one-time')
    }
  }, [isAuthenticated, router])

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

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}
