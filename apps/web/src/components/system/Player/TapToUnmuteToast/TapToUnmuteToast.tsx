'use client'

import styles from './TapToUnmuteToast.module.css'
import { Volume2, X } from 'lucide-react'
import { useAudio } from '@/components/system/Player/audio/AudioContext'

export function TapToUnmuteToast() {
  const { showUnmuteToast, dismissUnmuteToast } = useAudio()

  if (!showUnmuteToast) return null

  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.toast}>
        <div className={styles.icon} aria-hidden="true">
          <Volume2 size={18} />
        </div>

        <div className={styles.text}>
          <div className={styles.title}>Tap to unmute</div>
          <div className={styles.sub}>Your browser blocked autoplay audio.</div>
        </div>

        <button
          className={styles.close}
          aria-label="Dismiss"
          onClick={dismissUnmuteToast}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
