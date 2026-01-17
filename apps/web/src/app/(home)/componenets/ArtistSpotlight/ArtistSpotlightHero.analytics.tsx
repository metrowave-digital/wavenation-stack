'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ArtistSpotlightHeroImpression({
  artist,
  slug,
}: {
  artist: string
  slug: string
}) {
  useEffect(() => {
    trackEvent('content_impression', {
      placement: 'artist_spotlight_hero',
      artist,
      slug,
    })
  }, [artist, slug])

  return null
}

export function ArtistSpotlightHeroClick({
  children,
  payload,
}: {
  children: React.ReactNode
  payload: Record<string, unknown>
}) {
  return (
    <span
      onClick={() =>
        trackEvent('hero_click', {
          placement: 'artist_spotlight_hero',
          ...payload,
        })
      }
    >
      {children}
    </span>
  )
}
