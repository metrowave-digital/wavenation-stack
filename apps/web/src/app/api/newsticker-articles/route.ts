import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

/**
 * GET /api/newsticker-articles
 * Fetches latest 5 articles for NewsTicker
 */
export async function GET() {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?` +
        new URLSearchParams({
          limit: '5',
          sort: '-publishedAt',
          depth: '0',
          where: JSON.stringify({
            status: { equals: 'published' },
          }),
        }),
      {
        next: { revalidate: 60 }, // ISR: 1 minute
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      )
    }

    const data = await res.json()

    const items = (data?.docs ?? []).map(
      (article: {
        id: string
        title: string
        slug: string
        category?: { slug?: string }
        isBreaking?: boolean
      }) => ({
        id: article.id,
        label: article.title,
        href: `/news/${article.slug}`,
        category: article.category?.slug ?? 'news',
        isBreaking: Boolean(article.isBreaking),
      })
    )

    return NextResponse.json(items.slice(0, 5))
  } catch {
    return NextResponse.json(
      { error: 'Ticker service unavailable' },
      { status: 500 }
    )
  }
}
