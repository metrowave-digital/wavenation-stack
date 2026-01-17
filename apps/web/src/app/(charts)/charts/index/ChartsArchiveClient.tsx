'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './ChartsArchive.module.css'

/* ======================================================
   TYPES
====================================================== */

type ChartEntry = {
  rank: number
  trackTitle?: string
  artist?: string
}

type ChartDoc = {
  id: string
  slug: string
  chartKey: string
  entries: ChartEntry[]
}

type Meta = {
  genre: string
  year: number
  week: number
} | null

/* ======================================================
   HELPERS
====================================================== */

function parseSlug(slug: string): Meta {
  const match = slug.match(/^(.*)-(\d{4})-W(\d{2})$/)
  if (!match) return null

  return {
    genre: match[1],
    year: Number(match[2]),
    week: Number(match[3]),
  }
}

/**
 * US-aligned month buckets (simple + predictable)
 */
function monthFromWeek(week: number) {
  return Math.min(12, Math.max(1, Math.ceil(week / 4)))
}

/**
 * Current year + week (used for "This Week" highlight)
 */
function getCurrentWeekStamp() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff =
    (now.getTime() - start.getTime()) / 86400000

  const week = Math.ceil(
    (diff + start.getDay() + 1) / 7,
  )

  return {
    year: now.getFullYear(),
    week,
  }
}

/**
 * Convert YYYY + WXX → "Week of Jan 15, 2026"
 */
function weekToDate(year: number, week: number) {
  const firstDay = new Date(year, 0, 1)
  const date = new Date(
    firstDay.getTime() + (week - 1) * 7 * 86400000,
  )

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const PAGE_SIZE = 24

/* ======================================================
   CLIENT
====================================================== */

export default function ChartsArchiveClient({
  charts,
}: {
  charts: ChartDoc[]
}) {
  /* ================= PARSE SLUGS ================= */

  const parsed = useMemo(
    () =>
      charts
        .map((c) => ({
          ...c,
          meta: parseSlug(c.slug),
        }))
        .filter((c) => c.meta),
    [charts],
  )

  /* ================= FILTER OPTIONS ================= */

  const genres = useMemo(() => {
    const set = new Set<string>()
    parsed.forEach((c) => c.meta && set.add(c.meta.genre))
    return Array.from(set).sort()
  }, [parsed])

  const years = useMemo(() => {
    const set = new Set<number>()
    parsed.forEach((c) => c.meta && set.add(c.meta.year))
    return Array.from(set).sort((a, b) => b - a)
  }, [parsed])

  const weeks = useMemo(() => {
    const set = new Set<string>()
    parsed.forEach((c) => {
      if (!c.meta) return
      set.add(
        `${c.meta.year}-W${String(c.meta.week).padStart(
          2,
          '0',
        )}`,
      )
    })
    return Array.from(set)
  }, [parsed])

  /* ================= STATE ================= */

  const [genre, setGenre] = useState<string>('')
  const [year, setYear] = useState<number | ''>('')
  const [month, setMonth] = useState<number | ''>('')
  const [week, setWeek] = useState<string>('')

  const [visible, setVisible] = useState(PAGE_SIZE)
  const [filtersStuck, setFiltersStuck] =
    useState(false)

  const current = getCurrentWeekStamp()

  /* ================= STICKY FILTER OBSERVER ================= */

  useEffect(() => {
    const el = document.getElementById(
      'charts-filters',
    )
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFiltersStuck(!entry.isIntersecting)
      },
      { threshold: 1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ================= FILTERED ================= */

  const filtered = useMemo(() => {
    return parsed.filter((c) => {
      const m = c.meta!
      if (genre && m.genre !== genre) return false
      if (year !== '' && m.year !== year) return false
      if (month !== '' && monthFromWeek(m.week) !== month)
        return false
      if (
        week &&
        `${m.year}-W${String(m.week).padStart(2, '0')}` !==
          week
      )
        return false
      return true
    })
  }, [parsed, genre, year, month, week])

  const shown = filtered.slice(0, visible)

  /* ================= RENDER ================= */

  return (
    <>
      {/* ================= FILTER BAR ================= */}
      <section
        id="charts-filters"
        className={styles.filters}
        data-stuck={filtersStuck}
        aria-label="Chart filters"
      >
        <div className={styles.filterGroup}>
          <label>Genre</label>
          <select
            className={styles.select}
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value)
              setVisible(PAGE_SIZE)
            }}
          >
            <option value="">All</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Year</label>
          <select
            className={styles.select}
            value={year}
            onChange={(e) => {
              const v = e.target.value
              setYear(v ? Number(v) : '')
              setVisible(PAGE_SIZE)
            }}
          >
            <option value="">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Month</label>
          <select
            className={styles.select}
            value={month}
            onChange={(e) => {
              const v = e.target.value
              setMonth(v ? Number(v) : '')
              setVisible(PAGE_SIZE)
            }}
          >
            <option value="">All</option>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Week</label>
          <select
            className={styles.select}
            value={week}
            onChange={(e) => {
              setWeek(e.target.value)
              setVisible(PAGE_SIZE)
            }}
          >
            <option value="">All</option>
            {weeks.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            setGenre('')
            setYear('')
            setMonth('')
            setWeek('')
            setVisible(PAGE_SIZE)
          }}
        >
          Reset
        </button>
      </section>

      {/* ================= ARCHIVE GRID ================= */}
      <section className={styles.grid} aria-label="Charts archive">
        {shown.map((chart) => {
          const m = chart.meta!
          const no1 =
            chart.entries.find((e) => e.rank === 1) ??
            chart.entries[0]

          const isThisWeek =
            m.year === current.year &&
            m.week === current.week

          return (
            <Link
              key={chart.slug}
              href={`/chart/${chart.slug}`}
              className={styles.card}
              data-current={isThisWeek ? 'true' : undefined}
            >
              <div className={styles.cardGenre}>
                {m.genre}
              </div>

              <div className={styles.cardWeek}>
                {m.year}-W
                {String(m.week).padStart(2, '0')}
              </div>

              <div className={styles.cardDate}>
                Week of {weekToDate(m.year, m.week)}
              </div>

              <div className={styles.cardTop}>
                <span className={styles.cardRank}>
                  #1
                </span>
                <span className={styles.cardTrack}>
                  {no1?.trackTitle ?? '—'}
                </span>
              </div>

              <div className={styles.cardCTA}>
                Open chart →
              </div>
            </Link>
          )
        })}
      </section>

      {/* ================= LOAD MORE ================= */}
      {visible < filtered.length && (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={styles.loadMore}
            onClick={() =>
              setVisible((v) => v + PAGE_SIZE)
            }
          >
            Load more
          </button>
          <div className={styles.loadMeta}>
            Showing {shown.length} of{' '}
            {filtered.length}
          </div>
        </div>
      )}
    </>
  )
}
