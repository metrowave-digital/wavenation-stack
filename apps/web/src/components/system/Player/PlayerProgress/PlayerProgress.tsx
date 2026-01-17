'use client'

import styles from './PlayerProgress.module.css'
import { useAudio } from '@/components/system/Player/audio/AudioContext'
import { useMemo } from 'react'

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PlayerProgress() {
  const { currentTime, duration, seek } = useAudio()

  const isLive = !Number.isFinite(duration) || duration <= 0

  const percent = useMemo(() => {
    if (isLive || !duration) return 100
    return Math.min(100, Math.max(0, (currentTime / duration) * 100))
  }, [currentTime, duration, isLive])

  const trackStyle: React.CSSProperties = {
    '--progress': `${percent}%`,
  } as React.CSSProperties

  return (
    <div
      className={`${styles.root} ${
        isLive ? styles.live : ''
      }`}
    >
      {/* Time / LIVE label */}
      <div className={styles.timeRow}>
        {isLive ? (
          <span className={styles.liveBadge}>LIVE</span>
        ) : (
          <>
            <span className={styles.time}>
              {formatTime(currentTime)}
            </span>
            <span className={styles.time}>
              {formatTime(duration)}
            </span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className={styles.track} style={trackStyle}>
        {!isLive && (
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={e => seek(Number(e.target.value))}
            className={styles.scrubber}
            aria-label="Playback progress"
          />
        )}
      </div>
    </div>
  )
}
