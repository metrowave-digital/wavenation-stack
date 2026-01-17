'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './ChartPage.module.css'
import { EditorialHero } from '@/components/editorial/EditorialHero'
import type { Chart } from '../../../lib/types/chart'

type DerivedEntry = {
  rank: number
  trackTitle: string
  artist: string
  delta: number | null
  isDebut: boolean
}

/* ======================================================
   Helpers
====================================================== */

function normalize(chart: Chart): DerivedEntry[] {
  return chart.entries.map((e) => ({
    rank: e.rank,
    trackTitle: e.trackTitle ?? '—',
    artist: e.artist ?? '—',
    delta: null,
    isDebut: false,
  }))
}

function titleize(key: string) {
  return key
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

function getWeekNumber(slug: string): number | null {
  const match = slug.match(/-W(\d{2})$/)
  return match ? Number(match[1]) : null
}

/* ======================================================
   Component
====================================================== */

export default function ChartPageClient({
  chart,
}: {
  chart: Chart
}) {
  const [weeks, setWeeks] = useState<Chart[]>([])
  const [manualCompareSlug, setManualCompareSlug] =
    useState<string>('')

  const currentWeekNumber = getWeekNumber(chart.slug)

  /* ================= LOAD WEEKS ================= */

  useEffect(() => {
    fetch(`/api/charts/by-key?chartKey=${chart.chartKey}`)
      .then((r) => r.json())
      .then(setWeeks)
      .catch(() => {})
  }, [chart.chartKey])

  /* ================= LIMIT COMPARABLE WEEKS ================= */

  const comparableWeeks = useMemo(() => {
    if (!currentWeekNumber) return []

    return weeks.filter((w) => {
      const wNum = getWeekNumber(w.slug)
      if (!wNum) return false
      const diff = currentWeekNumber - wNum
      return diff >= 1 && diff <= 5
    })
  }, [weeks, currentWeekNumber])

  /* ================= DERIVED COMPARISON ================= */

  const compareChart = useMemo(() => {
    if (manualCompareSlug) {
      return (
        comparableWeeks.find(
          (w) => w.slug === manualCompareSlug,
        ) ?? null
      )
    }

    return comparableWeeks[0] ?? null
  }, [manualCompareSlug, comparableWeeks])

  const compareWeekNumber = compareChart
    ? getWeekNumber(compareChart.slug)
    : null

  const weekDiff =
    currentWeekNumber && compareWeekNumber
      ? currentWeekNumber - compareWeekNumber
      : null

  /* ================= NORMALIZED DATA ================= */

  const currentEntries = useMemo(
    () => normalize(chart),
    [chart],
  )

  const previousEntries = useMemo(
    () => (compareChart ? normalize(compareChart) : []),
    [compareChart],
  )

  /* ================= PREVIOUS RANK LOOKUP ================= */

  const previousRankMap = useMemo(() => {
    const map = new Map<string, number>()
    previousEntries.forEach((e) => {
      map.set(
        `${e.trackTitle}__${e.artist}`,
        e.rank,
      )
    })
    return map
  }, [previousEntries])

  /* ================= APPLY COMPARISON ================= */

  const entries = useMemo(() => {
    return currentEntries.map((entry) => {
      const key = `${entry.trackTitle}__${entry.artist}`
      const prevRank = previousRankMap.get(key)

      return {
        ...entry,
        delta:
          typeof prevRank === 'number'
            ? prevRank - entry.rank
            : null,
        isDebut: prevRank === undefined,
      }
    })
  }, [currentEntries, previousRankMap])

  /* ================= DERIVED INSIGHTS ================= */

  const topThree = entries.slice(0, 3)

  const biggestGainer = [...entries]
    .filter((e) => typeof e.delta === 'number' && e.delta! > 0)
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))[0]

  const topDebut = entries.find((e) => e.isDebut)

  const droppedTracks = previousEntries.filter(
    (p) =>
      !currentEntries.find(
        (c) =>
          c.trackTitle === p.trackTitle &&
          c.artist === p.artist,
      ),
  )

  const isComparing = Boolean(compareChart)

  /* ================= LABEL ================= */

  function comparisonLabel(prevRank: number) {
    if (!weekDiff) return null
    if (weekDiff === 1)
      return `was #${prevRank} last week`
    return `was #${prevRank} · ${weekDiff} weeks ago`
  }

  /* ================= RENDER ================= */

  return (
    <main className={styles.page}>
      <EditorialHero
        variant="charts"
        eyebrow="WaveNation Charts"
        title={titleize(chart.chartKey)}
        lede="Weekly rankings driven by culture, rotation, and editorial insight."
        weekStamp={`Week of ${chart.week}`}
        pills={[
          'Updated Weekly',
          isComparing ? 'Comparing Weeks' : 'Current Week',
        ]}
        actions={[
          {
            label: 'View Archive',
            href: '/charts/index',
            variant: 'secondary',
          },
        ]}
      />

      <div className={styles.poweredBy}>
        Powered by{' '}
        <a
          href="https://urbaninfluencer.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Urban Influencer
        </a>
      </div>

      {/* ================= WEEK SELECTOR ================= */}

      <div className={styles.weekSelector}>
        <label>Compare Week</label>
        <select
          value={manualCompareSlug}
          onChange={(e) =>
            setManualCompareSlug(e.target.value)
          }
        >
          <option value="">Auto (Previous)</option>
          {comparableWeeks.map((w) => (
            <option key={w.slug} value={w.slug}>
              {w.week}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TOP 3 ================= */}

      <section className={styles.insights}>
        {topThree.map((t) => {
          const prevRank =
            previousRankMap.get(
              `${t.trackTitle}__${t.artist}`,
            )

          return (
            <div
              key={`top-${t.rank}`}
              className={styles.insightCard}
            >
              <span>Top #{t.rank}</span>
              <strong>{t.trackTitle}</strong>
              <em>{t.artist}</em>

              {isComparing && prevRank && (
                <small className={styles.compareNote}>
                  {comparisonLabel(prevRank)}
                </small>
              )}
            </div>
          )
        })}
      </section>

      {/* ================= STATS ================= */}

      <section className={styles.insights}>
        <div className={styles.insightCard}>
          <span>Biggest Gainer</span>
          <strong>{biggestGainer?.trackTitle ?? '—'}</strong>
          <em>
            {biggestGainer?.delta
              ? `▲ ${biggestGainer.delta}`
              : '—'}
          </em>
        </div>

        <div className={styles.insightCard}>
          <span>Top Debut</span>
          <strong>{topDebut?.trackTitle ?? '—'}</strong>
          <em>{topDebut ? 'NEW' : '—'}</em>
        </div>
      </section>

      {/* ================= CHART ================= */}

      <section className={styles.chart}>
        <div className={styles.chartHeaderRow}>
          <span>Rank</span>
          <span>Track</span>
          <span>Artist</span>
          <span>Move</span>
        </div>

        {entries.map((e) => (
          <div
            key={`${chart.id}-${e.rank}-${e.trackTitle}`}
            className={styles.chartRow}
          >
            <span className={styles.rank}>#{e.rank}</span>
            <span className={styles.track}>{e.trackTitle}</span>
            <span className={styles.artist}>{e.artist}</span>
            <span
              className={`${styles.movement} ${
                e.isDebut
                  ? styles.new
                  : e.delta && e.delta > 0
                  ? styles.up
                  : e.delta && e.delta < 0
                  ? styles.down
                  : ''
              }`}
            >
              {e.isDebut
                ? 'NEW'
                : typeof e.delta === 'number'
                ? e.delta > 0
                  ? `▲ ${e.delta}`
                  : `▼ ${Math.abs(e.delta)}`
                : '—'}
            </span>
          </div>
        ))}
      </section>

      {/* ================= DROPPED ================= */}

      {droppedTracks.length > 0 && (
        <section className={styles.dropped}>
          <h3>Dropped This Week</h3>
          <ul>
            {droppedTracks.map((d) => (
              <li key={`${d.rank}-${d.trackTitle}`}>
                {d.trackTitle} — {d.artist}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
