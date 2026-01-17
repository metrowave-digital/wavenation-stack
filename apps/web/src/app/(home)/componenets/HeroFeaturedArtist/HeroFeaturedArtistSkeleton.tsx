'use client'

import styles from './ArtistSpotlightCard.module.css'

export function HeroFeaturedArtistSkeleton() {
  return (
    <div className={`${styles.billboard} ${styles.skeleton}`}>
      <div className={styles.skelImage} />
      <div className={styles.skelOverlay}>
        <div className={styles.skelKicker} />
        <div className={styles.skelName} />
      </div>
    </div>
  )
}
