'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './SpotlightArticles.module.css'

interface SpotlightItem {
  id: number
  title: string
  href: string
  imageUrl: string | null
  imageAlt: string
  category: string
}

export function SpotlightArticles() {
  const [items, setItems] = useState<SpotlightItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/spotlight-articles', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data.slice(0, 2))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.heading}>Featured Stories</h3>
        <Link href="/news" className={styles.more}>
          More →
        </Link>
      </header>

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`}>
                <div className={styles.skelImage} />
                <div className={styles.skelOverlay}>
                  <div className={styles.skelTag} />
                  <div className={styles.skelTitle} />
                </div>
              </div>
            ))
          : items.map(item => (
              <Link key={item.id} href={item.href} className={styles.card}>
                <div className={styles.imageWrap}>
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      unoptimized
                      className={styles.image}
                    />
                  )}

                  <div className={styles.overlay}>
                    <span className={styles.category}>
                      {item.category}
                    </span>
                    <h4 className={styles.title}>{item.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}
