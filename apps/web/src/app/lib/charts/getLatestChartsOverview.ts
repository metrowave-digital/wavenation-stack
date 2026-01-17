import type { Chart } from '../types/chart'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL!

export type ChartEditorialOverview = {
  chartKey: string
  label: string
  week: string
  updatedDaysAgo: number
  href: string

  topFive: {
    rank: number
    trackTitle?: string
    artist?: string
  }[]

  biggestGainer?: {
    trackTitle?: string
    artist?: string
  }

  highestDebut?: {
    trackTitle?: string
    artist?: string
  }

  dropped: {
    trackTitle?: string
    artist?: string
  }[]
}


function daysAgoFromWeek(week: string): number {
  // week format: YYYY-W##
  const [yearStr, weekStr] = week.split('-W')
  const year = Number(yearStr)
  const weekNum = Number(weekStr)

  // ISO week: Monday of the given week
  const simple = new Date(year, 0, 1 + (weekNum - 1) * 7)
  const dow = simple.getDay()
  const weekStart =
    dow <= 4
      ? new Date(simple.setDate(simple.getDate() - simple.getDay() + 1))
      : new Date(simple.setDate(simple.getDate() + 8 - simple.getDay()))

  const now = new Date()

  return Math.max(
    0,
    Math.floor(
      (now.getTime() - weekStart.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  )
}

function daysAgoFromPublishDate(
  publishDate: string,
): number {
  const published = new Date(publishDate)
  const now = new Date()

  return Math.max(
    0,
    Math.floor(
      (now.getTime() - published.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  )
}

export async function getChartsOverviewEditorial(): Promise<
  ChartEditorialOverview[]
> {
  const res = await fetch(
    `${CMS_URL}/api/charts?where[status][equals]=published&sort=-year,-week&limit=100`,
    { next: { revalidate: 300 } },
  )

  if (!res.ok) {
    throw new Error('Failed to load charts overview')
  }

  const data = await res.json()

  // Group by chartKey, newest first
  const grouped: Record<string, Chart[]> = {}

  for (const chart of data.docs as Chart[]) {
    if (!grouped[chart.chartKey]) {
      grouped[chart.chartKey] = []
    }
    grouped[chart.chartKey].push(chart)
  }

  const CHART_ORDER: {
  key: string
  label: string
}[] = [
  { key: 'hitlist', label: 'The Hitlist' },
  { key: 'rnb-soul', label: 'R&B & Soul' },
  { key: 'hip-hop', label: 'Hip-Hop' },
  { key: 'gospel', label: 'Gospel' },
  { key: 'southern-soul', label: 'Southern Soul' },
]

  return CHART_ORDER.flatMap(({ key, label }) => {
  const charts = grouped[key]
  if (!charts || charts.length === 0) return []

  const latest = charts[0]
  const previous = charts[1]

  const latestEntries = latest.entries
  const prevEntries = previous?.entries ?? []

  const dropped = prevEntries
    .filter(
      (prev) =>
        !latestEntries.some(
          (curr) =>
            curr.trackTitle === prev.trackTitle &&
            curr.artist === prev.artist,
        ),
    )
    .slice(0, 3)
    .map((e) => ({
      trackTitle: e.trackTitle,
      artist: e.artist,
    }))

  const topFive = latestEntries
    .filter((e) => e.rank <= 5)
    .sort((a, b) => a.rank - b.rank)

  return [
    {
      chartKey: key,
      label,
      week: latest.week,
      updatedDaysAgo: daysAgoFromPublishDate(
  latest.publishDate,
),
      href:
        key === 'hitlist'
          ? '/charts/hitlist'
          : `/charts/${latest.slug}`,

      topFive,
      biggestGainer: latestEntries[0],
      highestDebut:
        latestEntries[latestEntries.length - 1],
      dropped,
    },
  ]
  })
}