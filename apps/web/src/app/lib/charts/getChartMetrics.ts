// app/lib/charts/getChartMetrics.ts

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

/* ======================================================
   Types — CMS SHAPE
====================================================== */

export type Movement = 'up' | 'down' | 'same' | 'new'

export interface ManualTrack {
  title?: string | null
  artist?: string | null
}

export interface ChartEntry {
  id: string
  rank: number
  movement?: Movement
  trackTitle?: string | null
  artist?: string | null
  manualTrack?: ManualTrack | null
}

export interface Chart {
  id: number
  title: string
  chartKey: string
  chartMode: 'manual' | 'hybrid' | 'automated'
  week: string
  status: 'draft' | 'review' | 'published'
  entries: ChartEntry[]
}

export interface MetricSignal {
  rank: number
  trackTitle: string
  artist: string
  movement?: Movement
}

export interface ChartMetrics {
  biggestGainer: MetricSignal | null
  highestDebut: MetricSignal | null
  leaderCount: number
  chartCount: number
  sparklines: number[]
}

/* ======================================================
   Normalization Helpers
====================================================== */

function getTitle(entry: ChartEntry): string {
  return (
    entry.trackTitle ??
    entry.manualTrack?.title ??
    'Unknown Title'
  )
}

function getArtist(entry: ChartEntry): string {
  return (
    entry.artist ??
    entry.manualTrack?.artist ??
    'Unknown Artist'
  )
}

function toMetricSignal(entry: ChartEntry): MetricSignal {
  return {
    rank: entry.rank,
    trackTitle: getTitle(entry),
    artist: getArtist(entry),
    movement: entry.movement,
  }
}

/* ======================================================
   Fetch Helper
====================================================== */

async function fetchCharts(): Promise<Chart[]> {
  if (!CMS_URL) {
    throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
  }

  const res = await fetch(
    `${CMS_URL}/api/charts?where[status][equals]=published&depth=2`,
    { cache: 'no-store' },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch charts')
  }

  const json = (await res.json()) as { docs?: Chart[] }
  return json.docs ?? []
}

/* ======================================================
   Metrics Builder (MATCHES UI LOGIC)
====================================================== */

export async function getChartMetrics(): Promise<ChartMetrics> {
  const charts = await fetchCharts()
  if (charts.length === 0) return emptyMetrics()

  /* ----------------------------------------------
     Latest Week Only
  ---------------------------------------------- */

  const latestWeek = charts
    .map((c) => c.week)
    .sort()
    .at(-1)

  if (!latestWeek) return emptyMetrics()

  const chartsThisWeek = charts.filter(
    (c) => c.week === latestWeek,
  )

  const allEntries = chartsThisWeek.flatMap(
    (c) => c.entries ?? [],
  )

  if (allEntries.length === 0) return emptyMetrics()

  /* ----------------------------------------------
     Biggest Gainer (EDITORIAL PICK)
     → first "up" entry, fallback to first entry
  ---------------------------------------------- */

  const biggestGainerEntry =
    allEntries.find((e) => e.movement === 'up') ??
    allEntries[0]

  /* ----------------------------------------------
     Highest Debut (EDITORIAL PICK)
     → first "new" entry, fallback to best rank
  ---------------------------------------------- */

  const highestDebutEntry =
    allEntries.find((e) => e.movement === 'new') ??
    allEntries.reduce((best, curr) =>
      curr.rank < best.rank ? curr : best,
    )

  /* ----------------------------------------------
     Chart Leaders (#1 per chart)
  ---------------------------------------------- */

  const leaders = chartsThisWeek
    .map((c) =>
      c.entries.find((e) => e.rank === 1),
    )
    .filter(Boolean)

  /* ----------------------------------------------
     Sparklines (entries per chart)
  ---------------------------------------------- */

  const sparklines = chartsThisWeek.map(
    (c) => c.entries.length,
  )

  return {
    biggestGainer: biggestGainerEntry
      ? toMetricSignal(biggestGainerEntry)
      : null,

    highestDebut: highestDebutEntry
      ? toMetricSignal(highestDebutEntry)
      : null,

    leaderCount: leaders.length,
    chartCount: chartsThisWeek.length,
    sparklines,
  }
}

/* ======================================================
   Empty State
====================================================== */

function emptyMetrics(): ChartMetrics {
  return {
    biggestGainer: null,
    highestDebut: null,
    leaderCount: 0,
    chartCount: 0,
    sparklines: [],
  }
}
