// lib/charts/getChartsByGenre.ts

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
}

/* ======================================================
   TYPES
====================================================== */

export type ChartEntry = {
  rank: number
  trackTitle: string
  artist: string
}

export type ChartDoc = {
  id: string
  slug: string
  chartKey: string
  week: string
  publishDate: string
  entries: ChartEntry[]
}

/* ======================================================
   FETCH
====================================================== */

export async function getChartsByGenre(
  genre: string,
): Promise<ChartDoc[]> {
  try {
    const params = new URLSearchParams({
      'where[and][0][status][equals]': 'published',
      'where[and][1][chartKey][equals]': genre,
      sort: '-publishDate',
      limit: '5', // ✅ max 5 weeks
    })

    const url = `${CMS_URL}/api/charts?${params}`

    const res = await fetch(url, {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      console.error('Charts fetch failed', res.status)
      return []
    }

    const json = await res.json()
    return json?.docs ?? []
  } catch (err) {
    console.error('Error fetching charts', err)
    return []
  }
}
