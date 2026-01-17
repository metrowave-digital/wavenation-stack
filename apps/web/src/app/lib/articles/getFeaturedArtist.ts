type FeaturedArtist = {
  slug: string
  title: string
  excerpt?: string
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
}

export async function getFeaturedArtist(): Promise<FeaturedArtist | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?` +
        new URLSearchParams({
          'where[and][0][status][equals]': 'published',
          'where[and][1][isFeatured][equals]': 'true',
          'where[and][2][contentBlocks][contains]': 'artistSpotlight',
          sort: '-publishDate',
          limit: '1',
          depth: '0',
        }),
      {
        next: { revalidate: 300 },
      },
    )

    if (!res.ok) return null

    const data = await res.json()
    const doc = data?.docs?.[0]

    if (!doc) return null

    return {
      slug: doc.slug,
      title: doc.title,
      excerpt: doc.excerpt,
    }
  } catch {
    return null
  }
}
