export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

/* ======================================================
   GraphQL Query
   - Published only
   - Latest first
   - NO relational filters (Payload-safe)
====================================================== */

const HOME_HERO_QUERY = `
  query HomeHero {
    Articles(
      where: { status: { equals: published } }
      sort: "-publishDate"
      limit: 10
    ) {
      docs {
        id
        title
        subtitle
        slug
        categories {
          name
          slug
        }
        subcategories {
          name
          slug
        }
        hero {
          image {
            url
            alt
            sizes {
              hero { url }
              card { url }
              thumb { url }
            }
          }
        }
      }
    }
  }
`

/* ======================================================
   Types
====================================================== */

interface GraphQLCategory {
  name?: string | null
  slug?: string | null
}

interface GraphQLImage {
  url?: string | null
  alt?: string | null
  sizes?: {
    hero?: { url?: string | null }
    card?: { url?: string | null }
    thumb?: { url?: string | null }
  }
}

interface GraphQLArticle {
  id: number
  title: string
  subtitle?: string | null
  slug: string
  categories?: GraphQLCategory[] | null
  subcategories?: GraphQLCategory[] | null
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
   GET /api/home-hero
====================================================== */

export async function GET() {
  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: HOME_HERO_QUERY }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('[home-hero] bad response', res.status)
      return NextResponse.json([])
    }

    const result = (await res.json()) as GraphQLResponse
    const docs = result.data?.Articles?.docs ?? []

    /* ======================================================
       FILTER OUT ARTIST SPOTLIGHTS (SAFE WAY)
    ===================================================== */

    const filtered = docs.filter((article) => {
      const slugs = [
        ...(article.categories ?? []),
        ...(article.subcategories ?? []),
      ]
        .map(c => c.slug?.toLowerCase())
        .filter(Boolean)

      return !slugs.includes('artist-spotlight')
    })

    /* ======================================================
       MAP FOR HOME HERO
    ===================================================== */

    const items = filtered.slice(0, 5).map((article) => {
      const img = article.hero?.image ?? null

      return {
        id: article.id,
        title: article.title,
        subtitle: article.subtitle ?? '',
        href: `/news/${article.slug}`,

        imageUrl:
          img?.sizes?.hero?.url ??
          img?.sizes?.card?.url ??
          img?.sizes?.thumb?.url ??
          img?.url ??
          null,

        imageAlt: img?.alt ?? '',

        category:
          article.categories?.[0]?.name ?? 'Featured',

        subcategory:
          article.subcategories?.[0]?.name ?? '',
      }
    })

    return NextResponse.json(items)
  } catch (err) {
    console.error('[home-hero]', err)
    return NextResponse.json([])
  }
}
