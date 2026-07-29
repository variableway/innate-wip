"use client"

import { useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"

interface PluginIframeViewProps {
  title: string
  src: string
  description?: string
}

export function PluginIframeView({ title, src, description }: PluginIframeViewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </a>
      </div>

      <div className="relative flex-1 bg-background">
        {isLoading && !isError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <p>Failed to load plugin content.</p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              Open in new tab
            </a>
          </div>
        ) : (
          <iframe
            src={src}
            title={title}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setIsError(true)
            }}
          />
        )}
      </div>
    </div>
  )
}
