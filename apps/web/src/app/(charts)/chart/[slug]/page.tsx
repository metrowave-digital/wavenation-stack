import { notFound } from 'next/navigation'
import ChartPageClient from './ChartPageClient'
import { getChartBySlug } from '../../../lib/charts/getChartBySlug'

export default async function ChartPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const chart = await getChartBySlug(slug)

  if (!chart) notFound()

  return <ChartPageClient chart={chart} />
}
