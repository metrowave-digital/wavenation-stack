import { NextResponse } from 'next/server'
import { getChartBySlug } from '../../../lib/charts/getChartBySlug'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing slug' },
      { status: 400 },
    )
  }

  const chart = await getChartBySlug(slug)

  if (!chart) {
    return NextResponse.json(
      { error: 'Chart not found' },
      { status: 404 },
    )
  }

  return NextResponse.json(chart)
}
