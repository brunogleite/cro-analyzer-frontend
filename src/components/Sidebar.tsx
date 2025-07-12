"use client"

import { BarChart3, FileText, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { TabType } from "./types"

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const router = useRouter()

  const handleReportsClick = () => {
    // Navigate to the protected reports page
    router.push('/reports')
  }

  const handleOneTimeClick = () => {
    // Navigate to the main page (one-time analysis)
    router.push('/')
  }

  return (
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
            onClick={handleOneTimeClick}
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
            onClick={handleReportsClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            Reports
          </button>
        </div>
      </nav>
    </div>
  )
} 