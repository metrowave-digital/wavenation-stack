'use client'

import { useEffect, useRef } from 'react'
import styles from './FooterBrand.module.css'
import { trackEvent } from '@/lib/analytics'

export function FooterBrand() {
  const hasTracked = useRef(false)

  /* ======================================================
     Impression Tracking
  ====================================================== */
  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterBrand',
    })

    hasTracked.current = true
  }, [])

  /* ======================================================
     Interaction Tracking
  ====================================================== */
  function handleInteraction(type: 'click' | 'focus') {
    trackEvent('content_click', {
      placement: 'footer',
      component: 'FooterBrand',
      interaction: type,
    })
  }

  return (
    <div
      className={styles.brand}
      tabIndex={0}
      role="contentinfo"
      aria-label="WaveNation Media brand statement"
      onClick={() => handleInteraction('click')}
      onFocus={() => handleInteraction('focus')}
    >
      <h3 className={styles.title}>WaveNation Media</h3>

      <p className={styles.tagline}>
        Culture-forward digital radio & media amplifying
        <span> music</span>, <span>community</span>, and{' '}
        <span>creators</span>.
      </p>

      <p className={styles.mission}>
        Built for the now. Rooted in the culture.
      </p>
    </div>
  )
}
