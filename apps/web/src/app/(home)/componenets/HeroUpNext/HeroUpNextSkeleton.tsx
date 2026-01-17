'use client'

import styles from './HeroUpNext.module.css'

export function HeroUpNextSkeleton() {
  return (
    <section className={`${styles.card} ${styles.skeleton}`}>
      <div className={styles.skelStatus} />

      <div className={styles.header}>
        <div className={styles.skelLogo} />
        <div className={styles.skelMeta}>
          <div className={styles.skelLine} />
          <div className={styles.skelLineShort} />
        </div>
      </div>

      <div className={styles.skelButton} />
    </section>
  )
}
