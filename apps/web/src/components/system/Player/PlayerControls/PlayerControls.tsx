'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './PlayerControls.module.css'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useAudio } from '@/components/system/Player/audio/AudioContext'

interface PlayerControlsProps {
  placement?: 'sticky_player' | 'fullscreen_player'
}

export function PlayerControls({
  placement = 'sticky_player',
}: PlayerControlsProps) {
  const {
    playing,
    volume,
    muted,
    play,
    pause,
    setVolume,
  } = useAudio()

  const [showVolume, setShowVolume] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  /**
   * Tracks whether audio has been unlocked
   * by a real user gesture (browser requirement)
   */
  const hasUnlockedAudio = useRef(false)

  /* ======================================================
     GESTURE-BASED AUTOPLAY (LEGAL + SAFE)
     - Runs once
     - Never retries
     - Never fights pause
  ====================================================== */
  useEffect(() => {
    function unlockAudio() {
      if (hasUnlockedAudio.current) return

      hasUnlockedAudio.current = true
      play()

      trackEvent('player_play', {
        placement,
        source: 'gesture_autoplay',
      })

      window.removeEventListener(
        'pointerdown',
        unlockAudio
      )
      window.removeEventListener(
        'keydown',
        unlockAudio
      )
    }

    window.addEventListener(
      'pointerdown',
      unlockAudio
    )
    window.addEventListener(
      'keydown',
      unlockAudio
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        unlockAudio
      )
      window.removeEventListener(
        'keydown',
        unlockAudio
      )
    }
  }, [play, placement])

  /* ======================================================
     Close volume popover on outside click
  ====================================================== */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(
          e.target as Node
        )
      ) {
        setShowVolume(false)
      }
    }

    if (showVolume) {
      document.addEventListener(
        'mousedown',
        handleClickOutside
      )
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [showVolume])

  /* ======================================================
     Controls
  ====================================================== */

  function togglePlay() {
    if (playing) {
      pause()
      trackEvent('player_pause', {
        placement,
        source: 'player_controls',
      })
    } else {
      play()
      trackEvent('player_play', {
        placement,
        source: 'player_controls',
      })
    }
  }

  function toggleMute() {
    const nextVolume = volume === 0 ? 0.6 : 0
    setVolume(nextVolume)

    trackEvent('volume_change', {
      placement,
      volume: Math.round(nextVolume * 100),
      muted: nextVolume === 0,
    })
  }

  function handleVolumeChange(value: number) {
    const normalized = value / 100
    setVolume(normalized)

    trackEvent('volume_change', {
      placement,
      volume: value,
      muted: value === 0,
    })
  }

  return (
    <div
      className={styles.controls}
      role="group"
      aria-label="Player controls"
    >
      {/* ================= PLAY / PAUSE ================= */}
      <button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        aria-pressed={playing}
        onClick={togglePlay}
        className={styles.controlButton}
      >
        {playing ? (
          <Pause size={18} />
        ) : (
          <Play size={18} />
        )}
      </button>

      {/* ================= VOLUME ================= */}
      <div
        className={styles.volumeWrap}
        ref={popoverRef}
      >
        <button
          type="button"
          aria-label="Volume"
          aria-expanded={showVolume}
          onClick={() =>
            setShowVolume(v => !v)
          }
          onContextMenu={e => {
            e.preventDefault()
            toggleMute()
          }}
          className={styles.controlButton}
        >
          {muted || volume === 0 ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </button>

        {showVolume && (
          <div
            className={styles.volumePopover}
            role="dialog"
            aria-label="Volume controls"
          >
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={e =>
                handleVolumeChange(
                  Number(e.target.value)
                )
              }
              className={styles.volumeSlider}
              aria-label="Volume slider"
            />

            <span
              className={styles.volumeValue}
            >
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
