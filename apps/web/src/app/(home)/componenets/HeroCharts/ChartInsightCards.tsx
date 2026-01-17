'use client'

import { useEffect } from 'react'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import styles from './ChartInsightCards.module.css'
import { trackEvent } from '@/lib/analytics'
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react'

/* ======================================================
   Types
====================================================== */

type Entry = {
  rank: number
  movement?: 'up' | 'down' | 'same' | 'new'
  trackTitle: string
  artist: string
}

type Chart = {
  title: string
  chartKey:
    | 'hitlist'
    | 'southern-soul'
    | 'gospel'
    | 'rnb-soul'
    | 'hip-hop'
  week: string
  entries: Entry[]
}

interface Props {
  charts?: Chart[]
  isLoading?: boolean
}

/* ======================================================
   Motion Tokens
====================================================== */

const EASE_OUT: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
]

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const card: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
}

/* ======================================================
   Component
====================================================== */

export function ChartInsightCards({
  charts,
  isLoading,
}: Props) {
  const hasCharts =
    Array.isArray(charts) && charts.length > 0

  const showSkeleton = isLoading || !hasCharts

  const hitList = hasCharts
    ? charts.find(c => c.chartKey === 'hitlist') ??
      charts[0]
    : null

  const topFive = hitList
    ? hitList.entries
        .filter(e => e.rank <= 5)
        .sort((a, b) => a.rank - b.rank)
    : []

  const allEntries = hasCharts
    ? charts.flatMap(c => c.entries)
    : []

  const biggestGainer =
    allEntries.find(e => e.movement === 'up') ?? null

  const highestDebut =
    allEntries.find(e => e.movement === 'new') ??
    (allEntries.length
      ? allEntries.reduce((best, curr) =>
          curr.rank < best.rank ? curr : best
        )
      : null)

  /* ================= ANALYTICS ================= */

  useEffect(() => {
    if (!showSkeleton && hitList) {
      trackEvent('content_impression', {
        placement: 'chart_insight_cards',
        chart: hitList.chartKey,
        week: hitList.week,
      })
    }
  }, [showSkeleton, hitList])

  /* ================= MICRO STATS ================= */

  const movedUp =
    hitList?.entries.filter(e => e.movement === 'up')
      .length ?? 0

  const movedDown =
    hitList?.entries.filter(
      e => e.movement === 'down'
    ).length ?? 0

  const newEntries =
    hitList?.entries.filter(
      e => e.movement === 'new'
    ).length ?? 0

  return (
    <motion.section
      className={styles.stack}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {showSkeleton && (
        <>
          <SkeletonPrimary />
          <SkeletonCompact />
          <SkeletonCompact />
          <SkeletonExplore />
        </>
      )}

      {!showSkeleton && hitList && (
        <>
          {/* ================= PRIMARY (TOP 5) ================= */}
          <motion.article
            variants={card}
            className={`${styles.card} ${styles.primary}`}
          >
            <h4 className={styles.eyebrow}>
              Official Chart
            </h4>

            <h3 className={styles.title}>
              The Hit List
            </h3>

            <p className={styles.meta}>
              {hitList.week}
            </p>

            <div className={styles.microStats}>
              <span className={styles.stat}>
                <TrendingUp size={14} /> {movedUp}
              </span>
              <span className={styles.stat}>
                <TrendingDown size={14} /> {movedDown}
              </span>
              <span className={styles.stat}>
                <Sparkles size={14} /> {newEntries}
              </span>
            </div>

            <ol className={styles.topList}>
              {topFive.map(entry => (
                <li
                  key={entry.rank}
                  className={styles.topRow}
                >
                  <span className={styles.rank}>
                    #{entry.rank}
                  </span>

                  <div className={styles.metaBlock}>
                    <span className={styles.track}>
                      {entry.trackTitle}
                    </span>
                    <span className={styles.artist}>
                      {entry.artist}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/charts/hitlist"
              className={styles.link}
            >
              View Full Chart →
            </Link>
          </motion.article>

          {/* ================= RIGHT STACK ================= */}
          <div className={styles.compactScroller}>
            {biggestGainer && (
              <motion.article
                variants={card}
                className={`${styles.card} ${styles.compact}`}
              >
                <h4 className={styles.eyebrow}>
                  Biggest Gainer
                </h4>

                <div className={styles.compactRow}>
                  <span className={styles.compactStat}>
                    ▲
                  </span>
                  <div>
                    <p className={styles.track}>
                      {biggestGainer.trackTitle}
                    </p>
                    <p className={styles.artist}>
                      {biggestGainer.artist}
                    </p>
                  </div>
                </div>
              </motion.article>
            )}

            {highestDebut && (
              <motion.article
                variants={card}
                className={`${styles.card} ${styles.compact}`}
              >
                <h4 className={styles.eyebrow}>
                  Highest Debut
                </h4>

                <div className={styles.compactRow}>
                  <span className={styles.compactStat}>
                    #{highestDebut.rank}
                  </span>
                  <div>
                    <p className={styles.track}>
                      {highestDebut.trackTitle}
                    </p>
                    <p className={styles.artist}>
                      {highestDebut.artist}
                    </p>
                  </div>
                </div>
              </motion.article>
            )}

            <motion.article
              variants={card}
              className={`${styles.card} ${styles.powered}`}
            >
              <h4 className={styles.eyebrow}>
                Explore
              </h4>

              <p className={styles.poweredText}>
                View All Charts
                <span className={styles.poweredSub}>
                  Powered by The Urban Influencer™
                </span>
              </p>

              <Link
                href="/charts/overview"
                className={styles.link}
              >
                Explore →
              </Link>
            </motion.article>
          </div>
        </>
      )}
    </motion.section>
  )
}

/* ================= SKELETONS ================= */

function SkeletonPrimary() {
  return (
    <motion.article
      variants={card}
      className={`${styles.card} ${styles.primary} ${styles.skeleton}`}
    />
  )
}

function SkeletonCompact() {
  return (
    <motion.article
      variants={card}
      className={`${styles.card} ${styles.compact} ${styles.skeleton}`}
    />
  )
}

function SkeletonExplore() {
  return (
    <motion.article
      variants={card}
      className={`${styles.card} ${styles.powered} ${styles.skeleton}`}
    />
  )
}
