'use client'

import { useContext, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeaderContext } from '../Header.context'
import { MAIN_NAV } from '../nav/nav.config'
import styles from './MobileMenu.module.css'

export function MobileMenu() {
  const { mobileOpen, setMobileOpen } = useContext(HeaderContext)
  const pathname = usePathname()

  const startX = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  /* ---------------------------------------------
     Lock body scroll
  ---------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  /* ---------------------------------------------
     Swipe to close
  ---------------------------------------------- */
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startX.current === null || !panelRef.current) return

    const deltaX = e.touches[0].clientX - startX.current
    if (deltaX > 0) {
      panelRef.current.style.transform = `translateX(${deltaX}px)`
    }
  }

  function onTouchEnd() {
    if (!panelRef.current) return

    const currentTransform = panelRef.current.style.transform
    const distance = Number(
      currentTransform.replace(/[^\d.]/g, '')
    )

    panelRef.current.style.transform = ''

    if (distance > 120) {
      setMobileOpen(false)
    }

    startX.current = null
  }

  if (!mobileOpen) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div
        ref={panelRef}
        className={styles.panel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.brand}>WaveNation</span>
          <button
            className={styles.close}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </header>

        {/* Navigation */}
        <nav className={styles.nav}>
          {MAIN_NAV.map((section, sectionIndex) => (
            <div key={section.id} className={styles.section}>
              <h3
                className={styles.sectionTitle}
                style={{ animationDelay: `${sectionIndex * 80}ms` }}
              >
                {section.label}
              </h3>

              <ul className={styles.links}>
                {section.children?.map((link, linkIndex) => {
                  const isActive =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`)

                  return (
                    <li
                      key={link.href}
                      className={styles.linkItem}
                      style={{
                        animationDelay: `${
                          sectionIndex * 120 + linkIndex * 60
                        }ms`,
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`${styles.link} ${
                          isActive ? styles.active : ''
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.tagline}>
            Culture • Music • Community
          </span>
        </footer>
      </div>
    </div>
  )
}
