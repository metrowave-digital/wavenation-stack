// lib/charts/getChartBySlug.ts

import type { Chart } from '../../lib/types/chart'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

export async function getChartBySlug(
  slug: string,
): Promise<Chart | null> {
  if (!CMS_URL) {
    throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
  }

  const res = await fetch(
    `${CMS_URL}/api/charts?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
    {
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    console.error('Failed to fetch chart:', slug)
    return null
  }

  const json = await res.json()
  return json.docs?.[0] ?? null
}
