'use client'

import { useEffect, useState } from 'react'
import { MobilePlayerPopup } from './MobilePlayerPopup'
import { DesktopPlayerPopup } from './DesktopPlayerPopup'

import { useNowPlaying } from '@/components/system/Player/NowPlayingContext'
import { useAudio } from '@/components/system/Player/audio/AudioContext'
import { normalizeNowPlaying } from '@/app/utils/normalizeNowPlaying'

/* ======================================================
   MEDIA QUERY
====================================================== */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)

    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/* ======================================================
   COMPONENT
====================================================== */

interface PlayerPopupProps {
  open: boolean
  onClose: () => void
}

export function PlayerPopup({ open, onClose }: PlayerPopupProps) {
  const rawNow = useNowPlaying()
  const now = normalizeNowPlaying(rawNow)

  const audio = useAudio()
  const isPlaying =
    typeof audio.currentTime === 'number' &&
    typeof audio.duration === 'number' &&
    audio.currentTime > 0 &&
    audio.currentTime < audio.duration

  const isDesktop = useMediaQuery('(min-width: 900px)')

  if (!open) return null

  return isDesktop ? (
    <DesktopPlayerPopup
      open={open}
      onClose={onClose}
      now={now}
      isPlaying={isPlaying}
      recent={[]} /* recent already handled inside popup */
    />
  ) : (
    <MobilePlayerPopup
      open={open}
      onClose={onClose}
      now={now}
      isPlaying={isPlaying}
      recent={[]} /* recent already handled inside popup */
    />
  )
}
