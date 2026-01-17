'use client'

import { useEffect, useRef } from 'react'
import styles from './FooterSocial.module.css'
import { Facebook, Instagram, X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type SocialPlatform = 'facebook' | 'instagram' | 'x'

export function FooterSocial() {
  const hasTracked = useRef(false)

  /* ======================================================
     Impression Tracking
  ====================================================== */
  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterSocial',
    })

    hasTracked.current = true
  }, [])

  /* ======================================================
     Click Tracking
  ====================================================== */
  function handleSocialClick(platform: SocialPlatform, url: string) {
    trackEvent('navigation_click', {
      placement: 'footer',
      component: 'FooterSocial',
      platform,
      href: url,
      external: true,
    })
  }

  return (
    <div
      className={styles.social}
      aria-label="WaveNation Media social links"
    >
      <h4 className={styles.heading}>Connect</h4>

      <div className={styles.socialLinks}>
        <a
          className={styles.link}
          href="https://www.facebook.com/people/WaveNation-Media/61585147160405/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WaveNation on Facebook"
          onClick={() =>
            handleSocialClick(
              'facebook',
              'https://www.facebook.com/people/WaveNation-Media/61585147160405/'
            )
          }
        >
          <Facebook size={18} aria-hidden />
        </a>

        <a
          className={styles.link}
          href="https://www.instagram.com/wavenationmedia/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WaveNation on Instagram"
          onClick={() =>
            handleSocialClick(
              'instagram',
              'https://www.instagram.com/wavenationmedia/'
            )
          }
        >
          <Instagram size={18} aria-hidden />
        </a>

        <a
          className={styles.link}
          href="https://x.com/WaveNationMedia"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WaveNation on X"
          onClick={() =>
            handleSocialClick(
              'x',
              'https://x.com/WaveNationMedia'
            )
          }
        >
          <X size={18} aria-hidden />
        </a>
      </div>
    </div>
  )
}
