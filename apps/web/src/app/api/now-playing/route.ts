import { NextResponse } from 'next/server'
import { getSpotifyArtwork } from '@/lib/spotify/getSpotifyArtwork'
import { getNowPlaying } from '@/lib/player/getNowPlaying'

export async function GET() {
  const now = await getNowPlaying()

  if (!now) {
    return NextResponse.json(null)
  }

  let artwork = now.cover

  // Spotify fallback if Live365 has no art
  if (!artwork && now.artist && now.track) {
    artwork = await getSpotifyArtwork(
      now.artist,
      now.track
    )
  }

  return NextResponse.json({
    track: now.track,
    artist: now.artist,
    artwork,
  })
}
