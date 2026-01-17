'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export function usePageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    trackPageView(pathname)
  }, [pathname])
}
