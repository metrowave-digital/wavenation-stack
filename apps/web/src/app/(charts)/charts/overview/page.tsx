import { EditorialHero } from '@/components/editorial/EditorialHero'
import styles from './ChartsOverview.module.css'
import { getChartsOverviewEditorial } from '../../../lib/charts/getLatestChartsOverview'
import ChartsClient from './ChartsClient'

export default async function ChartsOverviewPage() {
  const rawCharts = await getChartsOverviewEditorial()

  const charts = rawCharts.map((chart) => ({
    chartKey: chart.chartKey,
    label: chart.label,
    updatedDaysAgo: chart.updatedDaysAgo,
    href: chart.href,

    // "2026-W03" → 3
    week: Number(chart.week?.split('-W')?.[1] ?? 0),

    /* ---------- TOP 5 (rank derived) ---------- */
    topFive: chart.topFive.map((e, index) => ({
      rank: index + 1,
      trackTitle: e.trackTitle ?? '—',
      artist: e.artist ?? '—',
    })),

    /* ---------- SPOTLIGHTS ---------- */
    biggestGainer: chart.biggestGainer
      ? {
          rank: 0, // rank not meaningful here, but required by type
          trackTitle:
            chart.biggestGainer.trackTitle ?? '—',
          artist: chart.biggestGainer.artist ?? '—',
        }
      : undefined,

    highestDebut: chart.highestDebut
      ? {
          rank: 0,
          trackTitle:
            chart.highestDebut.trackTitle ?? '—',
          artist: chart.highestDebut.artist ?? '—',
        }
      : undefined,

    /* ---------- DROPPED ---------- */
    dropped: chart.dropped.map((e, index) => ({
      rank: index + 1,
      trackTitle: e.trackTitle ?? '—',
      artist: e.artist ?? '—',
    })),
  }))

  return (
    <main className={styles.page}>
      <EditorialHero
        variant="charts"
        eyebrow="Charts Overview"
        title={
          <>
            This week’s charts.
            <br />
            <span>Focused. Cultural. Current.</span>
          </>
        }
        lede="A curated view of WaveNation charts — one per lane, updated weekly, rooted in culture."
      />

      <ChartsClient charts={charts} />
    </main>
  )
}
