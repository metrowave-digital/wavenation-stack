'use client'

import { useEffect } from 'react'
import styles from './LeaderboardAd.module.css'

interface Props {
  onImpression?: () => void
}

export function LeaderboardAd({ onImpression }: Props) {
  useEffect(() => {
    onImpression?.()
  }, [onImpression])

  return (
    <div
      className={styles.ad}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Replace with GAM / AdSense */}
      <span>ADVERTISEMENT</span>
    </div>
  )
}
