'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import styles from './PlayerInfo.module.css'

import { useNowPlaying } from '@/components/system/Player/NowPlayingContext'
import { useAudio } from '@/components/system/Player/audio/AudioContext'
import { normalizeNowPlaying } from '@/app/utils/normalizeNowPlaying'

export function PlayerInfo() {
  const rawNow = useNowPlaying()
  const now = useMemo(() => normalizeNowPlaying(rawNow), [rawNow])

  const audio = useAudio()
  const isPlaying =
    typeof audio.currentTime === 'number' &&
    typeof audio.duration === 'number' &&
    audio.currentTime > 0 &&
    audio.currentTime < audio.duration

  return (
    <div className={styles.stickyDesktop}>
      <div className={styles.artwork}>
        {!now.artwork && <div className={styles.artworkSkeleton} />}
        {now.artwork && (
          <Image
            src={now.artwork}
            alt={now.track ?? 'Now playing'}
            fill
            sizes="44px"
            className={styles.image}
          />
        )}
      </div>

      <div className={styles.meta}>
        <span className={styles.track}>{now.track}</span>
        <span className={styles.artist}>{now.artist}</span>

        <div
          className={`${styles.soundBars} ${
            isPlaying ? styles.playing : ''
          }`}
          aria-hidden
        >
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}
