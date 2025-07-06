import { BarChart3, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UrlInputProps {
  url: string
  error: string | null
  isSubmitting: boolean
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit: () => void
  placeholder?: string
  label?: string
  fullWidth?: boolean
}

export const UrlInput = ({
  url,
  error,
  isSubmitting,
  onUrlChange,
  onKeyPress,
  onSubmit,
  placeholder = "Enter website URL to analyze...",
  label = "Website URL",
  fullWidth = false
}: UrlInputProps) => {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-4">
        <div className="flex-1">
          {label && <Label htmlFor="website-url">{label}</Label>}
          <Input
            id="website-url"
            type="url"
            placeholder={placeholder}
            value={url}
            onChange={onUrlChange}
            onKeyPress={onKeyPress}
            disabled={isSubmitting}
            className={label ? "mt-2" : ""}
          />
        </div>
        <Button 
          onClick={onSubmit} 
          disabled={!url.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 