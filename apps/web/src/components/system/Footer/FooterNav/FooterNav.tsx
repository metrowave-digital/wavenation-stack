'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './FooterNav.module.css'
import { FOOTER_NAV } from '../nav/footer.config'
import { trackEvent } from '@/lib/analytics'

export function FooterNav() {
  const hasTracked = useRef(false)

  /* ======================================================
     Impression Tracking
  ====================================================== */
  useEffect(() => {
    if (hasTracked.current) return

    trackEvent('content_impression', {
      placement: 'footer',
      component: 'FooterNav',
      sectionCount: FOOTER_NAV.length,
    })

    hasTracked.current = true
  }, [])

  /* ======================================================
     Link Tracking
  ====================================================== */
  function handleNavClick(
    section: string,
    label: string,
    href: string
  ) {
    trackEvent('navigation_click', {
      placement: 'footer',
      component: 'FooterNav',
      section,
      label,
      href,
    })
  }

  return (
    <nav
      className={styles.nav}
      aria-label="Footer navigation"
    >
      {FOOTER_NAV.map(section => (
        <div
          key={section.label}
          className={styles.section}
        >
          <h4 className={styles.heading}>
            {section.label}
          </h4>

          <ul className={styles.list}>
            {section.links.map(link => (
              <li
                key={link.href}
                className={styles.item}
              >
                <Link
                  href={link.href}
                  className={styles.link}
                  onClick={() =>
                    handleNavClick(
                      section.label,
                      link.label,
                      link.href
                    )
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
