"use client"

import { TabType } from "./types"
import { Button } from "./ui/button"
import { LogOut, User } from "lucide-react"
import { useAuthContext } from "./contexts/AuthContext"

interface HeaderProps {
  activeTab: TabType
}

export const Header = ({ activeTab }: HeaderProps) => {
  const { user, logout } = useAuthContext()

  const getTitle = () => {
    return activeTab === "one-time" ? "One Time Analysis" : "Reports Dashboard"
  }

  const getDescription = () => {
    return activeTab === "one-time"
      ? "Analyze a website for conversion optimization opportunities"
      : "View and manage your CRO analysis reports"
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{getTitle()}</h2>
          <p className="text-gray-600 mt-1">{getDescription()}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.firstName} {user?.lastName}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
} 