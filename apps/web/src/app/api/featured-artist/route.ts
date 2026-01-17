import { NextResponse } from 'next/server'

/* ======================================================
   ENV
====================================================== */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined')
}

/* ======================================================
   Minimal CMS Types (API-safe)
====================================================== */

type MediaSize = {
  url: string
  width: number
  height: number
}

type MediaImage = {
  url: string
  alt?: string
  caption?: string
  credit?: string
  sizes?: {
    square?: MediaSize
    card?: MediaSize
    hero?: MediaSize
  }
}

type ArtistSpotlightBlock = {
  blockType: 'artistSpotlight'
  artistName: string
  image?: MediaImage
  description?: string
}

type UnknownBlock = {
  blockType: string
}

type ArticleDoc = {
  slug: string
  title: string
  excerpt?: string
  hero?: {
    image?: MediaImage
  }
  contentBlocks?: Array<ArtistSpotlightBlock | UnknownBlock>
}

type FeaturedArtistResponse = {
  slug: string
  articleTitle: string
  excerpt?: string
  artist: {
    name: string
    image?: {
      url: string
      alt?: string
    }
  }
  heroImage?: {
    url: string
    alt?: string
    caption?: string
  }
}

/* ======================================================
   GET
====================================================== */

export async function GET() {
  try {
    const url = new URL('/api/articles', CMS_URL)

    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('where[isFeatured][equals]', 'true')
    url.searchParams.set('sort', '-publishDate')
    url.searchParams.set('limit', '1')
    url.searchParams.set('depth', '2') // REQUIRED for blocks + media

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error('CMS request failed')
    }

    const data = (await res.json()) as {
      docs?: ArticleDoc[]
    }

    const doc = data?.docs?.[0]

    if (!doc || !Array.isArray(doc.contentBlocks)) {
      return NextResponse.json(null)
    }

    // 🔍 Narrow block type safely
    const spotlightBlock = doc.contentBlocks.find(
      (
        block,
      ): block is ArtistSpotlightBlock =>
        block.blockType === 'artistSpotlight',
    )

    if (!spotlightBlock) {
      return NextResponse.json(null)
    }

    const image =
      spotlightBlock.image?.sizes?.square ??
      spotlightBlock.image

    const response: FeaturedArtistResponse = {
      slug: doc.slug,
      articleTitle: doc.title,
      excerpt: doc.excerpt,
      artist: {
        name: spotlightBlock.artistName,
        image: image?.url
          ? {
              url: image.url,
              alt: spotlightBlock.image?.alt,
            }
          : undefined,
      },
      heroImage: doc.hero?.image?.sizes?.hero
        ? {
            url: doc.hero.image.sizes.hero.url,
            alt: doc.hero.image.alt,
            caption: doc.hero.image.caption,
          }
        : undefined,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[featured-artist]', error)
    return NextResponse.json(null)
  }
}
