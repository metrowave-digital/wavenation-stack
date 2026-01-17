'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './NewsTicker.module.css'

import { Facebook, Instagram, X } from 'lucide-react'

import {
  trackNewsTickerClick,
  trackNewsTickerImpression,
  trackNewsTickerBreaking,
} from '@/lib/analytics'

/* ======================================================
   Types
====================================================== */

export interface NewsTickerItem {
  id: string
  label: string
  href?: string
  category?: 'news' | 'music' | 'culture' | 'events'
  isBreaking?: boolean
}

interface NewsTickerProps {
  label?: string
}

/* ======================================================
   Helpers
====================================================== */

function isExternalLink(href?: string) {
  return typeof href === 'string' && /^https?:\/\//.test(href)
}

/* ======================================================
   Component
====================================================== */

export function NewsTicker({
  label = 'Latest Stories',
}: NewsTickerProps) {
  const [items, setItems] = useState<NewsTickerItem[]>([])
  const [loading, setLoading] = useState(true)

  const [breakingHold, setBreakingHold] = useState(false)
  const [breakingFlash, setBreakingFlash] = useState(false)

  const breakingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const impressionTrackedRef = useRef(false)

  /* --------------------------------------------------
     Fetch ticker data
  -------------------------------------------------- */

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const res = await fetch('/api/newsticker-articles', {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!res.ok) throw new Error('Ticker fetch failed')

        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  /* --------------------------------------------------
     Derived state
  -------------------------------------------------- */

  const breakingItem = useMemo(
    () => items.find(item => item.isBreaking),
    [items]
  )

  const breakingId = breakingItem?.id ?? null

  const loopItems = useMemo(() => {
    if (items.length <= 1) return items
    return [...items, ...items]
  }, [items])

  /* --------------------------------------------------
     Breaking behavior (5s hard hold)
     ESLint-safe dependency
  -------------------------------------------------- */

  useEffect(() => {
    if (!breakingId) {
      setBreakingHold(false)
      setBreakingFlash(false)
      return
    }

    if (breakingTimerRef.current) {
      clearTimeout(breakingTimerRef.current)
    }

    setBreakingHold(true)
    setBreakingFlash(true)

    trackNewsTickerBreaking({ id: breakingId })

    breakingTimerRef.current = setTimeout(() => {
      setBreakingHold(false)
      setBreakingFlash(false)
    }, 5000)

    return () => {
      if (breakingTimerRef.current) {
        clearTimeout(breakingTimerRef.current)
        breakingTimerRef.current = null
      }
    }
  }, [breakingId])

  /* --------------------------------------------------
     Analytics – impression (once)
  -------------------------------------------------- */

  useEffect(() => {
    if (
      !loading &&
      items.length > 0 &&
      !impressionTrackedRef.current
    ) {
      trackNewsTickerImpression({
        itemCount: items.length,
        hasBreaking: Boolean(breakingId),
      })
      impressionTrackedRef.current = true
    }
  }, [loading, items.length, breakingId])

  /* --------------------------------------------------
     Skeleton
  -------------------------------------------------- */

  if (loading) {
    return (
      <aside className={styles.ticker} aria-busy="true">
        <div className={styles.label}>{label}</div>
        <span className={styles.sectionDivider} />
        <div className={styles.viewport}>
          <div className={styles.skeletonTrack}>
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </div>
        </div>
        <span className={styles.sectionDivider} />
      </aside>
    )
  }

  if (!items.length) return null

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <aside
      className={`${styles.ticker} ${
        breakingFlash ? styles.breakingActive : ''
      }`}
      role="region"
      aria-label={label}
      aria-live={breakingId ? 'assertive' : 'off'}
    >
      {/* Label */}
      <div className={styles.label}>{label}</div>

      <span className={styles.sectionDivider} />

      {/* Headlines */}
      <div className={styles.viewport}>
        {breakingId && breakingHold ? (
          <div className={styles.breakingHold}>
            <span className={styles.breakingBadge}>Breaking</span>
            <span className={styles.breakingText}>
              {breakingItem?.label}
            </span>
          </div>
        ) : (
          <div className={styles.track} aria-hidden="true">
            {loopItems.map((item, index) => {
              const content = (
                <>
                  {item.isBreaking && (
                    <span className={styles.breakingInline}>
                      Breaking
                    </span>
                  )}
                  <span className={styles.text}>{item.label}</span>
                </>
              )

              return (
                <div
                  key={`${item.id}-${index}`}
                  className={styles.item}
                  data-category={item.category}
                >
                  {item.href ? (
                    isExternalLink(item.href) ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackNewsTickerClick({
                            id: item.id,
                            breaking: item.isBreaking,
                            external: true,
                          })
                        }
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() =>
                          trackNewsTickerClick({
                            id: item.id,
                            breaking: item.isBreaking,
                            external: false,
                          })
                        }
                      >
                        {content}
                      </Link>
                    )
                  ) : (
                    content
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <span className={styles.sectionDivider} />

      {/* Mini menu */}
      <nav className={styles.miniMenu} aria-label="Quick links">
        <Link href="/submissions" className={styles.menuLink}>
          Submissions
        </Link>
        <Link href="/partner-with-us" className={styles.menuLink}>
          Advertise
        </Link>
        <Link href="/contact-us" className={styles.menuLink}>
          Contact
        </Link>

        <span className={styles.divider} />

        <a
          href="https://www.facebook.com/people/WaveNation-Media/61585147160405/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.social}
          aria-label="WaveNation on Facebook"
        >
          <Facebook size={14} />
        </a>

        <a
          href="https://www.instagram.com/wavenationmedia/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.social}
          aria-label="WaveNation on Instagram"
        >
          <Instagram size={14} />
        </a>

        <a
          href="https://x.com/WaveNationMedia"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.social}
          aria-label="WaveNation on X"
        >
          <X size={14} />
        </a>
      </nav>
    </aside>
  )
}
