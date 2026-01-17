// app/(charts)/charts/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'

import styles from './ChartGenreEditorial.module.css'
import { EditorialHero } from '@/components/editorial/EditorialHero'
import {
  getChartsByGenre,
  type ChartDoc,
  type ChartEntry,
} from '../../../lib/charts/getChartsByGenre'

/* ======================================================
   GENRE CONFIG
====================================================== */

type GenreConfig = {
  title: string
  lede: string
  tone: string
}

const GENRES: Record<string, GenreConfig> = {
  'the-hitlist': {
    title: 'The Hit List',
    lede:
      'WaveNation’s flagship chart — tracking the records driving culture right now across radio, streets, and digital.',
    tone: 'Authoritative. Cultural. Definitive.',
  },
  'rnb-soul': {
    title: 'R&B & Soul',
    lede:
      'Smooth rotations, grown-folk anthems, and the records defining modern soul culture.',
    tone: 'Smooth. Emotional. Timeless.',
  },
  'hip-hop': {
    title: 'Hip-Hop',
    lede:
      'Bars, momentum, and movement — from mainstream heat to culture-shifting records.',
    tone: 'Raw. Competitive. Culture-driven.',
  },
  'southern-soul': {
    title: 'Southern Soul',
    lede:
      'Juke-joint favorites, dance-floor staples, and Southern records moving communities.',
    tone: 'Roots-forward. Regional. Powerful.',
  },
  gospel: {
    title: 'Gospel',
    lede:
      'Faith-centered records uplifting communities through praise, worship, and testimony.',
    tone: 'Spiritual. Uplifting. Purpose-driven.',
  },
}

/* ======================================================
   TYPES
====================================================== */

type ChartEntryWithMovement = ChartEntry & {
  delta: number | null
  isNew: boolean
}

/* ======================================================
   HELPERS
====================================================== */

function updatedLabel(date: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86_400_000,
  )

  if (diffDays === 0) return 'Updated today'
  if (diffDays === 1) return 'Updated yesterday'
  return `Updated ${diffDays} days ago`
}

function withMovement(
  current: ChartEntry[],
  previous?: ChartEntry[],
): ChartEntryWithMovement[] {
  if (!previous) {
    return current.map((e) => ({
      ...e,
      delta: null,
      isNew: true,
    }))
  }

  const prevIndex = new Map<string, number>(
    previous.map((e) => [`${e.trackTitle}|${e.artist}`, e.rank]),
  )

  return current.map((e) => {
    const key = `${e.trackTitle}|${e.artist}`
    const prevRank = prevIndex.get(key)

    return {
      ...e,
      delta: prevRank !== undefined ? prevRank - e.rank : null,
      isNew: prevRank === undefined,
    }
  })
}

function getDroppedTracks(
  current: ChartEntry[],
  previous?: ChartEntry[],
): ChartEntry[] {
  if (!previous) return []

  const currentKeys = new Set(
    current.map((e) => `${e.trackTitle}|${e.artist}`),
  )

  return previous.filter(
    (e) => !currentKeys.has(`${e.trackTitle}|${e.artist}`),
  )
}

function getTopFive(entries: ChartEntry[]): ChartEntry[] {
  return entries.slice(0, 5)
}

/* ======================================================
   PAGE
====================================================== */

export default async function ChartGenreEditorialPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const genre = GENRES[slug]
  if (!genre) notFound()

  const charts: ChartDoc[] = await getChartsByGenre(slug)
  if (!charts.length) notFound()

  const currentChart = charts[0]
  const previousChart = charts[1]

  const entriesWithMovement = withMovement(
    currentChart.entries,
    previousChart?.entries,
  )

  /* ================= METRICS ================= */

  const biggestGainers = entriesWithMovement
    .filter((e) => e.delta !== null && e.delta > 0)
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))
    .slice(0, 5)

  const biggestDebuts = entriesWithMovement
    .filter((e) => e.isNew)
    .slice(0, 5)

  const droppedTracks = getDroppedTracks(
    currentChart.entries,
    previousChart?.entries,
  )

  const fiveWeekCharts = charts.slice(0, 5)
  const lastThreeWeeks = charts.slice(1, 4)

  return (
    <main className={styles.page}>
        
      {/* ================= HERO ================= */}
      {/* ================= HERO META ================= */}
<div className={styles.heroMeta}>
  <span className={styles.heroMetaLabel}>Powered by</span>
  <a
    href="https://urbaninfluencer.media"
    target="_blank"
    rel="noopener noreferrer"
    className={styles.heroMetaLink}
  >
    Urban Influencer
  </a>
</div>
      <EditorialHero
        variant="charts"
        eyebrow="Charts · Genre"
        title={
          <>
            {genre.title}
            <br />
            <span>{genre.tone}</span>
          </>
        }
        lede={genre.lede}
      />

      {/* ================= CURRENT ================= */}
      <section className={styles.current}>
        <header className={styles.currentHeader}>
          <div className={styles.currentTitleRow}>
            <h2>Current Chart</h2>
            <div className={styles.currentMeta}>
              <span className={styles.week}>{currentChart.week}</span>
              <span className={styles.updatedPill}>
                {updatedLabel(currentChart.publishDate)}
              </span>
            </div>
          </div>
        </header>

        {/* ===== TOP 3 CARDS ===== */}
        <div className={styles.topThree}>
          {currentChart.entries.slice(0, 3).map((e) => (
            <div
              key={`top3-${currentChart.week}-${e.rank}`}
              className={styles.previewCard}
            >
              <div className={styles.previewRank}>#{e.rank}</div>
              <div className={styles.previewBody}>
                <div className={styles.track}>{e.trackTitle}</div>
                <div className={styles.artist}>{e.artist}</div>
              </div>
              <div className={styles.previewAccent} />
            </div>
          ))}
        </div>

        {/* ===== FULL CHART ===== */}
        <div className={styles.fullChartWrap}>
          <div className={styles.chartHeaderRow}>
            <span>Rank</span>
            <span>Move</span>
            <span>Track</span>
            <span>Artist</span>
          </div>

          {entriesWithMovement.map((e) => (
            <div
              key={`${currentChart.week}-${e.rank}`}
              className={styles.chartRow}
            >
              <span className={styles.rank}>#{e.rank}</span>
              <span className={styles.movement}>
                {e.isNew ? 'NEW' : e.delta ?? '—'}
              </span>
              <span className={styles.track}>{e.trackTitle}</span>
              <span className={styles.artist}>{e.artist}</span>
            </div>
          ))}
        </div>

        {/* ===== AD SLOT ===== */}
        <div className={styles.adSlot} data-ad-slot="billboard">
          <span className={styles.adLabel}>Advertisement</span>
        </div>
      </section>

      {/* ================= MOVEMENT ================= */}
      <section className={styles.history}>
        <div className={styles.movementGrid}>
          {biggestGainers.length > 0 && (
            <MovementPanel
              title="Biggest Gainers"
              items={biggestGainers}
            />
          )}

          {biggestDebuts.length > 0 && (
            <MovementPanel
              title="Biggest Debuts"
              items={biggestDebuts}
            />
          )}

          {droppedTracks.length > 0 && (
            <MovementPanel
              title="Dropped This Week"
              items={droppedTracks}
            />
          )}
        </div>
      </section>

      {/* ================= 5 WEEK SNAPSHOT ================= */}
      <section className={styles.snapshot}>
        <header className={styles.snapshotHeader}>
          <h3>5-Week Snapshot</h3>
        </header>

        <div className={styles.snapshotGrid}>
          {fiveWeekCharts.map((chart) => (
            <div key={chart.week} className={styles.snapshotWeek}>
              <h4>{chart.week}</h4>
              {getTopFive(chart.entries).map((e) => (
                <div
                  key={`snapshot-${chart.week}-${e.rank}`}
                  className={styles.snapshotItem}
                >
                  #{e.rank} {e.trackTitle}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= TOP 5 · LAST 3 WEEKS ================= */}
      <section className={styles.topWeeks}>
        <header className={styles.topWeeksHeader}>
          <h3>Top 5 · Last 3 Weeks</h3>
        </header>

        <div className={styles.topWeeksGrid}>
          {lastThreeWeeks.map((chart) => (
            <div key={chart.week} className={styles.topWeekColumn}>
              <h4>{chart.week}</h4>
              {getTopFive(chart.entries).map((e) => (
                <div
                  key={`topweeks-${chart.week}-${e.rank}`}
                  className={styles.topWeekItem}
                >
                  <span className={styles.topWeekRank}>
                    #{e.rank}
                  </span>
                  <span>{e.trackTitle}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= ARCHIVE ================= */}
      <section className={styles.archive}>
        <h3>Chart Archive</h3>
        <p>Explore previous weeks and long-term movement.</p>

        <div
          className={styles.adSlotInline}
          data-ad-slot="sponsored-inline"
        >
          <span className={styles.adLabel}>Sponsored</span>
        </div>

        <Link
          href={`/charts/index?genre=${slug}`}
          className={styles.archiveLink}
        >
          Browse {genre.title} archive →
        </Link>
      </section>
    </main>
  )
}

/* ======================================================
   MOVEMENT PANEL
====================================================== */

function MovementPanel({
  title,
  items,
}: {
  title: string
  items: ChartEntry[]
}) {
  return (
    <section className={styles.movementPanel}>
      <header className={styles.movementPanelHeader}>
        <h4>{title}</h4>
      </header>

      <ul className={styles.list}>
        {items.map((e) => (
          <li
            key={`${e.trackTitle}-${e.artist}`}
            className={styles.li}
          >
            <span className={styles.liTrack}>{e.trackTitle}</span>
            <span className={styles.liSep}>—</span>
            <span className={styles.liArtist}>{e.artist}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
