'use client'

import styles from './HeroPoll.module.css'

export function HeroPollSkeleton() {
  return (
    <section className={`${styles.wrapper} ${styles.skeleton}`}>
      <div className={styles.skelQuestion} />

      <div className={styles.skelOption} />
      <div className={styles.skelOption} />
      <div className={styles.skelOption} />
    </section>
  )
}
