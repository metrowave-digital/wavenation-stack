// lib/types/chartMetrics.ts

export type ChartMetric = {
  label: string
  value: number
  delta: number
  direction: 'up' | 'down' | 'flat'
  spark: number[]
}
