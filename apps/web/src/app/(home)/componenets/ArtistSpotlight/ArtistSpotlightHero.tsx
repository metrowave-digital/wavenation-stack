import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import styles from './ArtistSpotlightHero.module.css'

import {
  ArtistSpotlightHeroImpression,
  ArtistSpotlightHeroClick,
} from './ArtistSpotlightHero.analytics'

type FeaturedArtistHero = {
  slug: string
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
  }
  featuredAlbum?: {
    slug: string
    title: string
    coverArt: {
      url: string
      alt?: string
    }
    primaryArtist: string
  }
}

/* ================= SERVER FETCH ================= */

async function getHeroData(): Promise<FeaturedArtistHero | null> {
  try {
    const h = await headers()
    const host = h.get('host')
    if (!host) return null

    const protocol =
      process.env.NODE_ENV === 'development'
        ? 'http'
        : 'https'

    const res = await fetch(
      `${protocol}://${host}/api/featured-artist`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/* ================= COMPONENT ================= */

export async function ArtistSpotlightHero() {
  const data = await getHeroData()
  if (!data) return null

  return (
    <section className={styles.section}>
      {/* ===== HERO IMPRESSION (client-only) ===== */}
      <ArtistSpotlightHeroImpression
        artist={data.artist.name}
        slug={data.slug}
      />

      <div className={styles.hero}>
        {/* ===== BACKGROUND HERO IMAGE ===== */}
        {data.heroImage?.url && (
          <Image
            src={data.heroImage.url}
            alt={data.heroImage.alt ?? data.artist.name}
            fill
            unoptimized
            priority
            className={styles.bg}
          />
        )}

        <div className={styles.overlay} />

        {/* ===== CONTENT GRID ===== */}
        <div className={styles.grid}>
          {/* ===== ARTIST SPOTLIGHT ===== */}
          <ArtistSpotlightHeroClick
            payload={{
              target: 'artist',
              artist: data.artist.name,
              slug: data.slug,
            }}
          >
            <Link
              href={`/artist-spotlight/${data.slug}`}
              className={styles.artist}
            >
              {data.artist.image?.url && (
                <div className={styles.portrait}>
                  <Image
                    src={data.artist.image.url}
                    alt={
                      data.artist.image.alt ??
                      data.artist.name
                    }
                    fill
                    unoptimized
                  />
                </div>
              )}

              <div className={styles.artistText}>
                <span className={styles.kicker}>
                  Artist Spotlight
                </span>
                <h1 className={styles.name}>
                  {data.artist.name}
                </h1>
                <span className={styles.cta}>
                  Explore →
                </span>
              </div>
            </Link>
          </ArtistSpotlightHeroClick>

          {/* ===== FEATURED RELEASE ===== */}
          {data.featuredAlbum && (
            <ArtistSpotlightHeroClick
              payload={{
                target: 'featured_release',
                album: data.featuredAlbum.title,
                albumSlug: data.featuredAlbum.slug,
                artist:
                  data.featuredAlbum.primaryArtist,
              }}
            >
              <Link
                href={`/albums/${data.featuredAlbum.slug}`}
                className={styles.release}
              >
                <span
                  className={styles.releaseLabel}
                >
                  Featured Release
                </span>

                <div className={styles.albumArt}>
                  <Image
                    src={
                      data.featuredAlbum.coverArt.url
                    }
                    alt={
                      data.featuredAlbum.coverArt
                        .alt ??
                      data.featuredAlbum.title
                    }
                    fill
                    unoptimized
                  />
                </div>

                <div className={styles.albumText}>
                  <strong>
                    {data.featuredAlbum.title}
                  </strong>
                  <span>
                    {
                      data.featuredAlbum
                        .primaryArtist
                    }
                  </span>
                </div>
              </Link>
            </ArtistSpotlightHeroClick>
          )}
        </div>
      </div>
    </section>
  )
}
