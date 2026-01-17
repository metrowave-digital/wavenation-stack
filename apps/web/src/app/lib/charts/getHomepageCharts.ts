// lib/charts/getHomepageCharts.ts

type ChartDoc = {
  slug: string
}

export async function getHomepageCharts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/charts` +
      `?where[status][equals]=published` +
      `&where[chartKey][in][0]=hitlist` +
      `&where[chartKey][in][1]=southern-soul` +
      `&where[chartKey][in][2]=gospel` +
      `&where[chartKey][in][3]=rnb-soul` +
      `&where[chartKey][in][4]=hip-hop` +
      `&limit=1000`,
    { cache: 'no-store' },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch charts')
  }

  const json = await res.json()

  return (json.docs ?? []).sort(sortBySlugWeek)
}

/* =========================================
   Slug-based chronological sort
   genre-YYYY-W00
========================================= */

function sortBySlugWeek(a: ChartDoc, b: ChartDoc): number {
  const parse = (slug: string) => {
    const match = slug.match(/-(\d{4})-W(\d{2})$/)

    if (!match) {
      return { year: 0, week: 0 }
    }

    return {
      year: Number(match[1]),
      week: Number(match[2]),
    }
  }

  const A = parse(a.slug)
  const B = parse(b.slug)

  if (A.year !== B.year) {
    return B.year - A.year
  }

  return B.week - A.week
}
