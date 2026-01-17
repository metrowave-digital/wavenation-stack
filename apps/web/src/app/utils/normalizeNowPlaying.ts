export interface NormalizedNowPlaying {
  track: string
  artist: string
  artwork: string | null
}

/**
 * Safely normalize unknown NowPlaying payloads
 * without violating strict TS or ESLint rules.
 */
export function normalizeNowPlaying(
  value: unknown
): NormalizedNowPlaying {
  if (typeof value !== 'object' || value === null) {
    return {
      track: 'Unknown Track',
      artist: 'Unknown Artist',
      artwork: null,
    }
  }

  const record = value as Record<string, unknown>

  const track =
    typeof record.track === 'string'
      ? record.track
      : 'Unknown Track'

  const artist =
    typeof record.artist === 'string'
      ? record.artist
      : 'Unknown Artist'

  const artwork =
    typeof record.artwork === 'string'
      ? record.artwork
      : null

  return { track, artist, artwork }
}
