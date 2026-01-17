// lib/types/chart.ts

export type ChartKey =
  | 'hitlist'
  | 'southern-soul'
  | 'gospel'
  | 'rnb-soul'
  | 'hip-hop'

export type ChartMovement = 'up' | 'down' | 'same' | 'new'

export interface ChartEntry {
  id?: string
  rank: number
  movement?: ChartMovement
  trackTitle: string
  artist: string
  score?: number | null
}

export interface ChartWeekRange {
  startDate: string
  endDate: string
}

export interface Chart {
  id: string
  slug: string
  title: string
  chartKey: string
  genre: string
  week: string
  year: number
  month: number
  status: 'draft' | 'review' | 'published'
  publishDate: string
  entries: {
    rank: number
    trackTitle?: string
    artist?: string
  }[]
}


export type MetricTrend = 'up' | 'down' | 'flat'

export interface MetricValue {
  value: number
  delta: number
  direction: MetricTrend
}

export interface ChartMetrics {
  biggestGainer: MetricValue
  highestDebut: MetricValue
  leaderCount: number
  chartCount: number
  sparklines: number[]
}
