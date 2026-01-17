'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

interface NowPlaying {
  track: string
  artist: string
  artwork: string | null
}

const NowPlayingContext =
  createContext<NowPlaying | null>(null)

export function NowPlayingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [nowPlaying, setNowPlaying] =
    useState<NowPlaying | null>(null)

  useEffect(() => {
  async function fetchNowPlaying() {
    try {
      const res = await fetch('/api/now-playing', {
        cache: 'no-store',
      })
      const data = await res.json()
      if (data) setNowPlaying(data)
    } catch {
      // silent fail
    }
  }

  fetchNowPlaying()

  const interval = setInterval(fetchNowPlaying, 15_000)

  return () => clearInterval(interval)
}, [])


  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      {children}
    </NowPlayingContext.Provider>
  )
}

export function useNowPlaying() {
  return useContext(NowPlayingContext)
}
