'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import styles from './HeroUpNext.module.css'

import { trackEvent } from '@/lib/analytics'
import { useRadioUpNext } from '@/app/lib/shows/useRadioUpNext'
import { getNextAirLabel } from '@/app/lib/shows/getNextAirLabel'
import { getAirsInLabel } from '@/app/lib/shows/getAirsInLabel'
import { parseHHmm, formatHHmm } from '@/lib/time'
import { HeroUpNextSkeleton } from './HeroUpNextSkeleton'

/* ======================================================
   Component
====================================================== */

export function HeroUpNext() {
  const { live, upNext, loading } = useRadioUpNext()
  const show = live ?? upNext

  // prevent duplicate impression firing
  const impressionFired = useRef(false)

  /* ======================================================
     SAFE ARTWORK RESOLUTION
     (NO invalid RadioShow fields)
  ===================================================== */

  const artwork = useMemo(() => {
    if (!show) return null

    const rs = show.radioShow as unknown as {
      image?: { url: string }
      heroImage?: { url: string }
      artwork?: { url: string }
    }

    return (
      rs.image?.url ??
      rs.heroImage?.url ??
      rs.artwork?.url ??
      null
    )
  }, [show])

  /* ======================================================
     IMPRESSION TRACKING (ONCE)
  ===================================================== */

  useEffect(() => {
    if (!show) return
    if (impressionFired.current) return

    impressionFired.current = true

    trackEvent('content_impression', {
      placement: 'hero_up_next',
      page: 'home',
      show: show.radioShow.title,
      state: live ? 'live' : 'up_next',
      isReplay: Boolean(show.isReplay),
    })
  }, [show, live])

  /* ======================================================
     RENDER GUARDS
  ===================================================== */

  if (loading) return <HeroUpNextSkeleton />
  if (!show) return null

  /* ======================================================
     DERIVED VALUES
  ===================================================== */

  const href = show.radioShow.slug
    ? `/radio/shows/${show.radioShow.slug}`
    : '/radio'

  // Central Time is authoritative
  const startDate = parseHHmm(show._start)

  const airsInLabel = !live
    ? getAirsInLabel(startDate)
    : null

  /* ======================================================
     RENDER
  ===================================================== */

  return (
    <section
      className={`${styles.card} ${
        live ? styles.live : styles.upNext
      }`}
      aria-label="Up Next on Radio"
    >
      {/* ================= STATUS ================= */}
      <span className={styles.status}>
        {live
          ? 'LIVE'
          : show.isReplay
          ? 'REPLAY'
          : 'UP NEXT'}
      </span>

      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          {artwork ? (
            <Image
              src={artwork}
              alt={show.radioShow.title}
              width={72}
              height={72}
              className={styles.logo}
              priority
            />
          ) : (
            <div className={styles.logoFallback} />
          )}
        </div>

        <div className={styles.meta}>
          <h3 className={styles.title}>
            {show.radioShow.title}
          </h3>

          <p className={styles.time}>
            {getNextAirLabel(show._days)} ·{' '}
            {formatHHmm(show._start)}–{formatHHmm(show._end)}
          </p>

          {airsInLabel && (
            <span className={styles.countdown}>
              {airsInLabel}
            </span>
          )}
        </div>
      </div>

      {/* ================= CTA ================= */}
      {live ? (
        <button
          className={styles.primaryButton}
          onClick={() =>
            trackEvent('player_play', {
              source: 'hero_up_next',
              page: 'home',
              show: show.radioShow.title,
              state: 'live',
            })
          }
        >
          Play Live
        </button>
      ) : (
        <Link
          href={href}
          className={styles.primaryButton}
          onClick={() =>
            trackEvent('navigation_click', {
              source: 'hero_up_next',
              page: 'home',
              destination: 'show_page',
              show: show.radioShow.title,
            })
          }
        >
          View Show →
        </Link>
      )}
    </section>
  )
}
