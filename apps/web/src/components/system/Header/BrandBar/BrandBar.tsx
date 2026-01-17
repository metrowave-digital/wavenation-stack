'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './BrandBar.module.css'

export function BrandBar() {
  return (
    <div className={styles.wrap}>
      {/* Clickable brand */}
      <Link
        href="/"
        className={styles.root}
        aria-label="WaveNation home"
      >
        <div className={styles.brand}>
          <Image
            src="/brand/wavenation-logo-2.svg"
            alt="WaveNation logo"
            width={28}
            height={28}
            priority
          />

          <div className={styles.text}>
            <span className={styles.title}>WAVENATION</span>
            <span className={styles.tagline}>
              Amplify Your Vibe
            </span>
          </div>
        </div>
      </Link>

      {/* Decorative signal bars (NOT clickable) */}
      <div className={styles.signal} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
