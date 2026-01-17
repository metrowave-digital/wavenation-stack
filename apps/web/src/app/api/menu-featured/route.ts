import { NextResponse } from 'next/server'

/* ======================================================
   Types – CMS Response
====================================================== */

interface CMSImageSize {
  url?: string | null
}

interface CMSImage {
  url?: string | null
  alt?: string | null
  sizes?: {
    card?: CMSImageSize
    thumbnail?: CMSImageSize
  }
}

interface CMSArticle {
  id: string
  title: string
  slug: string
  menuEyebrow?: string | null
  menuDescription?: string | null
  menuImage?: CMSImage | null
}

interface CMSArticlesResponse {
  docs: CMSArticle[]
}

/* ======================================================
   Helpers
====================================================== */

function pickImageUrl(image?: CMSImage | null): string | null {
  if (!image) return null

  return (
    image.sizes?.card?.url ??
    image.sizes?.thumbnail?.url ??
    image.url ??
    null
  )
}

/* ======================================================
   Route
====================================================== */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const context = searchParams.get('context')

  if (!context) {
    return NextResponse.json([])
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/articles?` +
      new URLSearchParams({
        'where[menuFeature][equals]': 'true',
        'where[menuContext][equals]': context,
        limit: '4',
        sort: '-publishedAt',
        depth: '2',
      }),
    { cache: 'no-store' }
  )

  if (!res.ok) {
    return NextResponse.json([], { status: 200 })
  }

  const json = (await res.json()) as CMSArticlesResponse

  const items = json.docs.map(article => {
    const imageUrl = pickImageUrl(article.menuImage)

    return {
      title: article.title,
      description: article.menuDescription ?? '',
      eyebrow: article.menuEyebrow ?? '',
      href: `/articles/${article.slug}`,
      image: imageUrl
        ? {
            url: imageUrl,
            alt:
              article.menuImage?.alt ??
              article.title ??
              'Featured article',
          }
        : null,
    }
  })

  return NextResponse.json(items)
}
