'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './FooterLegal.module.css'
import { FOOTER_LEGAL } from '../nav/footer.config'
import { trackEvent } from '@/lib/analytics'

export function FooterLegal() {
  const hasTracked = useRef(false)

  /* ======================================================
     Impression Tracking
  ====================================================== */
  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterLegal',
      itemCount: FOOTER_LEGAL.length,
    })

    hasTracked.current = true
  }, [])

  /* ======================================================
     Link Tracking
  ====================================================== */
  function trackLegalClick(label: string, href: string) {
    trackEvent('navigation_click', {
      placement: 'footer',
      component: 'FooterLegal',
      label,
      href,
      external: href.startsWith('http'),
    })
  }

  return (
    <div className={styles.legal}>
      <nav className={styles.nav} aria-label="Footer legal navigation">
        {FOOTER_LEGAL.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.link}
            onClick={() => trackLegalClick(item.label, item.href)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <p className={styles.copy}>
        © {new Date().getFullYear()} WaveNation Media. Powered by{' '}
        <a
          href="https://metrowavedigital.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackLegalClick(
              'MetroWave Digital',
              'https://metrowavedigital.com'
            )
          }
        >
          MetroWave Digital
        </a>
      </p>
    </div>
  )
}
