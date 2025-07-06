import { TabType } from "./types"

interface HeaderProps {
  activeTab: TabType
}

export const Header = ({ activeTab }: HeaderProps) => {
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
      <h2 className="text-2xl font-semibold text-gray-900">{getTitle()}</h2>
      <p className="text-gray-600 mt-1">{getDescription()}</p>
    </div>
  )
} 