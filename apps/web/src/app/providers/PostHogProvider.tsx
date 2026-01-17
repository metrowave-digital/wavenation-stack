'use client'

import { useEffect } from 'react'

export function PostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

    import('posthog-js').then(posthog => {
      posthog.default.init(
        process.env.NEXT_PUBLIC_POSTHOG_KEY!,
        {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST ??
            'https://app.posthog.com',
          autocapture: false,
          capture_pageview: false,
        }
      )
    })
  }, [])

  return <>{children}</>
}
