export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

/* ======================================================
   GraphQL Query
   - Published
   - Featured
   - Latest 2
   - Uses SUBCATEGORIES (primary = first)
====================================================== */

const SPOTLIGHT_ARTICLES_QUERY = `
  query SpotlightArticles {
    Articles(
      where: {
        status: { equals: published }
        isFeatured: { equals: true }
      }
      sort: "-publishDate"
      limit: 2
    ) {
      docs {
        id
        title
        slug
        subcategories {
          name
        }
        hero {
          image {
            url
            sizes {
              card { url }
              thumb { url }
            }
            alt
            caption
            credit
          }
        }
      }
    }
  }
`

/* ======================================================
   Types
====================================================== */

interface GraphQLImage {
  url?: string | null
  alt?: string | null
  caption?: string | null
  credit?: string | null
  sizes?: {
    card?: { url?: string | null }
    thumb?: { url?: string | null }
  }
}

interface GraphQLSubcategory {
  name?: string | null
}

interface GraphQLArticle {
  id: number
  title: string
  slug: string
  subcategories?: GraphQLSubcategory[] | null
  hero?: {
    image?: GraphQLImage | null
  } | null
}

interface GraphQLResponse {
  data?: {
    Articles?: {
      docs: GraphQLArticle[]
    }
  }
  errors?: unknown
}

/* ======================================================
   GET /api/spotlight-articles
====================================================== */

export async function GET() {
  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: SPOTLIGHT_ARTICLES_QUERY,
      }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json([], { status: 200 })
    }

    const result = (await res.json()) as GraphQLResponse

    const docs = result.data?.Articles?.docs
    if (!docs) {
      return NextResponse.json([], { status: 200 })
    }

    const items = docs.map((article) => {
      const heroImage = article.hero?.image ?? null
      const subcategory =
        article.subcategories?.[0]?.name ?? 'Featured'

      return {
        id: article.id,
        title: article.title,
        href: `/news/${article.slug}`,

        imageUrl:
          heroImage?.sizes?.card?.url ??
          heroImage?.sizes?.thumb?.url ??
          heroImage?.url ??
          null,

        imageAlt: heroImage?.alt ?? '',
        category: subcategory,
        caption: heroImage?.caption ?? '',
        credit: heroImage?.credit ?? '',
      }
    })

    return NextResponse.json(items)
  } catch (err) {
    console.error('[spotlight-articles]', err)
    return NextResponse.json([], { status: 200 })
  }
}
