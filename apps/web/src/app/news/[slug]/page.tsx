import { notFound } from 'next/navigation'

import { EditorialHero } from '@/components/editorial/EditorialHero'
import { ArticleLayout } from '@/components/articles/ArticleLayout/ArticleLayout'
import { NewsletterCta } from '@/components/newsletter/NewsletterCTA'
import { ContentRenderer } from '@/components/content/ContentRenderer'

// Sidebar widgets (swap as needed)
import { TrendingArticles } from '@/components/articles/TrendingArticles'
import { SidebarAd } from '@/components/ads/SidebarAd'

/* ======================================================
   Types (article-level, read-only)
====================================================== */

interface PageProps {
  params: Promise<{ slug: string }>
}

interface Category {
  name: string
  slug: string
}

interface Author {
  displayName?: string | null
  slug?: string | null
}

interface HeroImage {
  url: string
  alt?: string | null
  caption?: string | null
  credit?: string | null
  sizes?: {
    hero?: { url?: string | null }
    card?: { url?: string | null }
  }
}

interface Article {
  title: string
  subtitle?: string | null
  slug: string
  publishDate?: string | null
  excerpt?: string | null
  isBreaking?: boolean
  categories?: Category[]
  subcategories?: Category[]
  author?: Author
  hero?: {
    image?: HeroImage
  }
  contentBlocks?: unknown[]
}

/* ======================================================
   Config
====================================================== */

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

/* ======================================================
   Page
====================================================== */

export default async function NewsArticlePage({
  params,
}: PageProps) {
  const { slug } = await params

  const res = await fetch(
    `${CMS_URL}/api/articles?where[slug][equals]=${slug}&where[_status][equals]=published&limit=1`,
    { cache: 'no-store' }
  )

  if (!res.ok) notFound()

  const data = (await res.json()) as {
    docs?: Article[]
  }

  const article = data.docs?.[0]
  if (!article) notFound()

  const category = article.categories?.[0]
  const heroImage = article.hero?.image

  return (
    <ArticleLayout
      hero={
        <EditorialHero
          variant="article"
          eyebrow={
            article.isBreaking
              ? 'Breaking'
              : category?.name ?? 'Article'
          }
          title={article.title}
          lede={article.subtitle ?? article.excerpt}
          pills={
            article.subcategories?.map(
              (c) => c.name
            ) ?? []
          }
        />
      }
      author={
        article.author?.displayName
          ? {
              name: article.author.displayName,
              href: article.author.slug
                ? `/authors/${article.author.slug}`
                : undefined,
            }
          : undefined
      }
      publishedAt={
        article.publishDate
          ? new Date(
              article.publishDate
            ).toLocaleDateString()
          : undefined
      }
      readTime={
        article.contentBlocks
          ? `${Math.max(
              3,
              Math.ceil(
                article.contentBlocks.length / 3
              )
            )} min read`
          : undefined
      }
      newsletterCta={<NewsletterCta />}
      sidebar={<TrendingArticles />}
      sidebarAd={<SidebarAd />}
    >
      {/* ===============================
         Hero Image (editorial placement)
      =============================== */}
      {heroImage?.url && (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              heroImage.sizes?.hero?.url ??
              heroImage.sizes?.card?.url ??
              heroImage.url
            }
            alt={heroImage.alt ?? article.title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 12,
            }}
          />

          {(heroImage.caption ||
            heroImage.credit) && (
            <figcaption
              style={{
                fontSize: 13,
                opacity: 0.65,
                marginTop: 8,
              }}
            >
              {heroImage.caption}
              {heroImage.credit &&
                ` · ${heroImage.credit}`}
            </figcaption>
          )}
        </figure>
      )}

      {/* ===============================
         Content Blocks
      =============================== */}
      <ContentRenderer
        blocks={article.contentBlocks}
      />
    </ArticleLayout>
  )
}
