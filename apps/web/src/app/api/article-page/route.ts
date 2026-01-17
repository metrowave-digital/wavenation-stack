export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not set')
}

/* ======================================================
   GraphQL Query
====================================================== */

const ARTICLE_PAGE_QUERY = `
  query ArticlePage($slug: String!) {
    Articles(
      where: {
        slug: { equals: $slug }
        status: { equals: published }
      }
      limit: 1
    ) {
      docs {
        id
        title
        subtitle
        slug
        publishedAt

        categories {
          name
        }

        authors {
          name
        }

        content

        hero {
          image {
            url
            alt
            caption
            credit
            sizes {
              hero { url }
              card { url }
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

interface GraphQLArticle {
  id: number
  title: string
  subtitle?: string | null
  slug: string
  publishedAt?: string | null
  content?: string | null

  categories?: { name?: string | null }[] | null
  authors?: { name?: string | null }[] | null

  hero?: {
    image?: {
      url?: string | null
      alt?: string | null
      caption?: string | null
      credit?: string | null
      sizes?: {
        hero?: { url?: string | null }
        card?: { url?: string | null }
      }
    } | null
  } | null
}

interface GraphQLResponse {
  data?: {
    Articles?: {
      docs: GraphQLArticle[]
    }
  }
}

/* ======================================================
   GET /api/article-page?slug=
====================================================== */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing slug' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(`${CMS_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ARTICLE_PAGE_QUERY,
        variables: { slug },
      }),
      cache: 'no-store', // IMPORTANT for news
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'CMS error' },
        { status: 502 }
      )
    }

    const result = (await res.json()) as GraphQLResponse
    const article = result.data?.Articles?.docs?.[0]

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: article.id,
      title: article.title,
      subtitle: article.subtitle ?? null,
      slug: article.slug,
      publishedAt: article.publishedAt ?? null,
      content: article.content ?? '',

      category:
        article.categories?.[0]?.name ?? null,

      author:
        article.authors?.[0]?.name ?? null,

      heroImage:
        article.hero?.image?.sizes?.hero?.url ??
        article.hero?.image?.sizes?.card?.url ??
        article.hero?.image?.url ??
        null,

      heroImageAlt:
        article.hero?.image?.alt ?? '',

      caption:
        article.hero?.image?.caption ?? null,

      credit:
        article.hero?.image?.credit ?? null,
    })
  } catch (err) {
    console.error('[article-page]', err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
