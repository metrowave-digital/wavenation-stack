'use client'

import { useEffect, useRef } from 'react'
import styles from './MobileFooter.module.css'
import { trackEvent } from '@/lib/analytics'

export function MobileFooter() {
  const hasTracked = useRef(false)

  /* ======================================================
     Impression Tracking (mobile only)
  ====================================================== */
  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'mobile_footer',
      component: 'MobileFooter',
    })

    hasTracked.current = true
  }, [])

  return (
    <div
      className={styles.mobile}
      role="contentinfo"
      aria-label="WaveNation Media mobile footer"
    >
      <span className={styles.copy}>
        © {new Date().getFullYear()} WaveNation Media
      </span>
    </div>
  )
}
