import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UrlInput } from "./UrlInput"

interface OneTimeAnalysisProps {
  url: string
  error: string | null
  isSubmitting: boolean
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

export const OneTimeAnalysis = ({
  url,
  error,
  isSubmitting,
  onUrlChange,
  onKeyPress,
  onSubmit
}: OneTimeAnalysisProps) => {
  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Website Analysis</CardTitle>
          <CardDescription>
            Enter a website URL to generate a comprehensive CRO analysis report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UrlInput
            url={url}
            error={error}
            isSubmitting={isSubmitting}
            onUrlChange={onUrlChange}
            onKeyPress={onKeyPress}
            onSubmit={onSubmit}
            placeholder="https://example.com"
            label="Website URL"
            fullWidth
          />
        </CardContent>
      </Card>
    </div>
  )
} 