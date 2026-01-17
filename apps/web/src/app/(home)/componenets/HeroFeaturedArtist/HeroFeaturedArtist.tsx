'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ArtistSpotlightCard.module.css'
import { trackEvent } from '@/lib/analytics'
import { HeroFeaturedArtistSkeleton } from './HeroFeaturedArtistSkeleton'

/* ======================================================
   Types
====================================================== */

type SpotlightData = {
  slug: string
  artist: {
    name: string
    image?: {
      url: string
      alt?: string
    }
  }
}

/* ======================================================
   Component
====================================================== */

export function HeroFeaturedArtist() {
  const [data, setData] = useState<SpotlightData | null>(null)
  const [loading, setLoading] = useState(true)

  // Prevent double impression firing
  const hasTrackedImpression = useRef(false)

  /* ======================================================
     FETCH FEATURED ARTIST
  ===================================================== */

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/featured-artist', {
          cache: 'no-store',
        })

        if (!res.ok) return
        const json = await res.json()

        if (!cancelled) {
          setData(json)
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  /* ======================================================
     IMPRESSION ANALYTICS (ONCE)
  ===================================================== */

  useEffect(() => {
    if (!data || hasTrackedImpression.current) return

    trackEvent('content_impression', {
      placement: 'hero_featured_artist',
      page: 'home',
      artist: data.artist.name,
      slug: data.slug,
    })

    hasTrackedImpression.current = true
  }, [data])

  /* ======================================================
     RENDER GUARDS
  ===================================================== */

  if (loading) {
    return <HeroFeaturedArtistSkeleton />
  }

  if (!data) {
    return null
  }

  /* ======================================================
     RENDER
  ===================================================== */

  return (
    <Link
      href={`/artist-spotlight/${data.slug}`}
      className={styles.billboard}
      onClick={() =>
        trackEvent('hero_click', {
          placement: 'hero_featured_artist',
          page: 'home',
          target: 'artist_spotlight',
          artist: data.artist.name,
          slug: data.slug,
        })
      }
    >
      {/* ================= IMAGE ================= */}
      {data.artist.image?.url && (
        <div className={styles.imageWrap}>
          <Image
            src={data.artist.image.url}
            alt={data.artist.image.alt ?? data.artist.name}
            fill
            unoptimized
            priority
            className={styles.image}
          />
        </div>
      )}

      {/* ================= OVERLAY ================= */}
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.kicker}>
            Artist Spotlight
          </span>

          <h3 className={styles.name}>
            {data.artist.name}
          </h3>

          <span className={styles.explore}>
            Explore →
          </span>
        </div>
      </div>
    </Link>
  )
}
