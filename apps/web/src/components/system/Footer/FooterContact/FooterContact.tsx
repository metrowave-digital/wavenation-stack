'use client'

import { useEffect, useRef } from 'react'
import styles from './FooterContact.module.css'
import { trackEvent } from '@/lib/analytics'

export function FooterContact() {
  const hasTracked = useRef(false)

  /* ======================================================
     Impression Tracking
  ====================================================== */
  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterContact',
    })

    hasTracked.current = true
  }, [])

  /* ======================================================
     Interaction Tracking
  ====================================================== */
  function trackInteraction(type: 'email_click' | 'focus') {
    trackEvent('content_click', {
      placement: 'footer',
      component: 'FooterContact',
      interaction: type,
    })
  }

  return (
    <div
      className={styles.contact}
      role="contentinfo"
      aria-label="WaveNation Media contact information"
    >
      <h4 className={styles.heading}>Contact</h4>

      <p className={styles.line}>
        <a
          href="mailto:hello@wavenation.online"
          className={styles.email}
          onClick={() => trackInteraction('email_click')}
          onFocus={() => trackInteraction('focus')}
        >
          hello@wavenation.online
        </a>
      </p>

      <p className={styles.subtext}>
        Press, partnerships, and creator inquiries welcome.
      </p>
    </div>
  )
}
