'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import styles from './MobilePlayerPopup.module.css'

import { useRadioUpNext } from '@/app/lib/shows/useRadioUpNext'
import { formatHHmm } from '@/lib/time'

/* ======================================================
   TYPES
====================================================== */

interface NowPlaying {
  track: string | null
  artist: string | null
  artwork: string | null
  album?: string | null
}

interface RecentTrack {
  key: string
  track: string
  artist: string
  artwork?: string | null
}

interface MobilePlayerPopupProps {
  open: boolean
  onClose: () => void
  now: NowPlaying
  recent: RecentTrack[]
  isPlaying: boolean
}

/* ======================================================
   HELPERS
====================================================== */

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : null
}

function firstString(...vals: unknown[]) {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v
  }
  return null
}

function getShowHosts(radioShow: unknown): string | null {
  const rs = asRecord(radioShow)
  if (!rs) return null

  if (Array.isArray(rs.hosts)) {
    const names = rs.hosts
      .map(h => {
        const hr = asRecord(h)
        return firstString(hr?.name, hr?.displayName, hr?.title)
      })
      .filter(Boolean) as string[]
    return names.length ? names.join(', ') : null
  }

  return firstString(
    rs.hostNames,
    rs.hostName,
    rs.host,
    rs.dj,
    rs.presenter
  )
}

function getShowArtwork(radioShow: unknown): string | null {
  const rs = asRecord(radioShow)
  if (!rs) return null

  const image = asRecord(rs.image)
  const coverImage = asRecord(rs.coverImage)
  const hero = asRecord(rs.hero)
  const heroImage = hero ? asRecord(hero.image) : null
  const artworkObj = asRecord(rs.artwork)

  return firstString(
    rs.artwork,
    artworkObj?.url,
    image?.url,
    coverImage?.url,
    heroImage?.url,
    rs.thumbnail,
    rs.poster
  )
}

/* ======================================================
   MOTION (v12-safe)
====================================================== */

const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
}

const sheet: Variants = {
  hidden: { y: '100%' },
  show: {
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 520,
      damping: 42,
    },
  },
  exit: {
    y: '100%',
    transition: {
      type: 'spring' as const,
      stiffness: 520,
      damping: 48,
    },
  },
}

/* ======================================================
   COMPONENT
====================================================== */

export function MobilePlayerPopup({
  open,
  onClose,
  now,
  recent,
  isPlaying,
}: MobilePlayerPopupProps) {
  const { live, upNext } = useRadioUpNext()
  const show = live ?? upNext

  const showTitle = show?.radioShow?.title ?? null
  const showHosts = getShowHosts(show?.radioShow)
  const showArtwork = getShowArtwork(show?.radioShow)
  const showTimeLabel = live
    ? 'Live now'
    : show
    ? `Starts ${formatHHmm(show._start)}`
    : null

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          variants={backdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={onClose}
        >
          <motion.section
            className={styles.sheet}
            variants={sheet}
            initial="hidden"
            animate="show"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.22}
            onClick={e => e.stopPropagation()}
            onDragEnd={(_, info) => {
              const distance = info.offset.y
              const velocity = info.velocity.y
              if (distance > 140 || velocity > 900) onClose()
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Now Playing"
          >
            <div className={styles.handleRow}>
              <div className={styles.handle} aria-hidden />
              <button
                className={styles.close}
                onClick={onClose}
                aria-label="Close player"
              >
                ✕
              </button>
            </div>

            <div className={styles.nowRow}>
              <div className={styles.artwork}>
                {!now.artwork && <div className={styles.artworkSkeleton} />}
                {now.artwork && (
                  <Image
                    src={now.artwork}
                    alt={now.track ?? 'Now playing'}
                    fill
                    priority
                    className={styles.image}
                  />
                )}
              </div>

              <div className={styles.meta}>
                <div className={styles.track}>{now.track}</div>
                <div className={styles.artist}>{now.artist}</div>

                <div
                  className={`${styles.soundBars} ${
                    isPlaying ? styles.playing : ''
                  }`}
                  aria-hidden
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            {(showTitle || showTimeLabel) && (
              <div className={styles.showCard}>
                <div className={styles.showArt}>
                  {!showArtwork && <div className={styles.showArtSkeleton} />}
                  {showArtwork && (
                    <Image
                      src={showArtwork}
                      alt={showTitle ?? 'Show'}
                      width={44}
                      height={44}
                      className={styles.showImage}
                    />
                  )}
                </div>

                <div className={styles.showMeta}>
                  <div className={styles.showTitle}>
                    {showTitle ?? 'WaveNation Radio'}
                  </div>
                  {showHosts && <div className={styles.showHosts}>{showHosts}</div>}
                  {showTimeLabel && (
                    <div className={styles.showTime}>{showTimeLabel}</div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.sectionTitle}>Last 5 tracks</div>
            {recent.length ? (
              <ul className={styles.recent}>
                {recent.map(t => (
                  <li key={t.key} className={styles.recentItem}>
                    <div className={styles.recentText}>
                      <div className={styles.recentTrack}>{t.track}</div>
                      <div className={styles.recentArtist}>{t.artist}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.empty}>No recent tracks yet.</div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
