'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import styles from './HeroSlider.module.css'
import { trackEvent } from '@/lib/analytics'

/* ======================================================
   Types
====================================================== */

interface HeroItem {
  id: number
  title: string
  subtitle: string
  href: string
  imageUrl: string | null
  imageAlt: string
  category?: string
}

/* ======================================================
   Constants
====================================================== */

const ROTATION_INTERVAL = 6000
const TICK_MS = 50

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0]

/* ======================================================
   Motion Variants
====================================================== */

const slideVariants: Variants = {
  enter: { opacity: 1 },
  center: { opacity: 1 },
  exit: { opacity: 1 },
}

const imageVariants: Variants = {
  initial: { opacity: 0, scale: 1 },
  animate: {
    opacity: 1,
    scale: 1.08,
    transition: {
      opacity: { duration: 0.8, ease: EASE_OUT },
      scale: { duration: 10, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.6, ease: EASE_IN },
  },
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.45,
      duration: 0.45,
      ease: EASE_OUT,
    },
  },
}

const pillVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.35,
      ease: EASE_OUT,
    },
  },
}

/* ======================================================
   Component
====================================================== */

export function HeroSlider() {
  const [items, setItems] = useState<HeroItem[]>([])
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const startX = useRef<number | null>(null)
  const seenIds = useRef<Set<number>>(new Set())

  /* ======================================================
     FETCH HERO ITEMS
  ===================================================== */

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/home-hero', {
          cache: 'no-store',
        })

        const data = await res.json()
        if (!cancelled && Array.isArray(data)) {
          setItems(data)
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const canRotate = items.length > 1
  const item = useMemo(() => items[index] ?? null, [items, index])

  /* ======================================================
     AUTO ROTATION
  ===================================================== */

  useEffect(() => {
    if (!canRotate) return

    const step = (TICK_MS / ROTATION_INTERVAL) * 100

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIndex((i) => (i + 1) % items.length)
          return 0
        }
        return p + step
      })
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [canRotate, items.length])

  /* ======================================================
     IMPRESSION ANALYTICS (ONCE PER ITEM)
  ===================================================== */

  useEffect(() => {
    if (!item) return
    if (seenIds.current.has(item.id)) return

    seenIds.current.add(item.id)

    trackEvent('content_impression', {
      placement: 'home_hero',
      page: 'home',
      article_id: item.id,
      position: index,
      category: item.category,
    })
  }, [item, index])

  /* ======================================================
     TOUCH NAVIGATION
  ===================================================== */

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return

    const delta =
      e.changedTouches[0].clientX - startX.current

    startX.current = null

    if (delta > 50) {
      setIndex((i) => (i - 1 + items.length) % items.length)
    }

    if (delta < -50) {
      setIndex((i) => (i + 1) % items.length)
    }

    setProgress(0)
  }

  const showSkeleton = !loaded || !item

  /* ======================================================
     RENDER
  ===================================================== */

  return (
    <section
      className={styles.root}
      aria-label="Featured stories"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.stageBg} />

      {/* ================= AnimatePresence ALWAYS mounted ================= */}
      <AnimatePresence mode="sync" initial={false}>
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            className={styles.skeleton}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonOverlay} />

            <div className={styles.skeletonContent}>
              <div className={styles.skeletonPill} />
              <div className={styles.skeletonH1} />
              <div className={styles.skeletonH2} />
              <div className={styles.skeletonCta} />
            </div>
          </motion.div>
        ) : (
          <motion.article
            key={item.id}
            className={styles.slide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* ================= IMAGE ================= */}
            {item.imageUrl && (
              <motion.div
                key={item.imageUrl}
                className={styles.imageMotion}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  priority={index === 0}
                  className={styles.image}
                  sizes="100vw"
                  unoptimized
                />
              </motion.div>
            )}

            <div className={styles.overlay} />

            {/* ================= CATEGORY ================= */}
            {item.category && (
              <motion.div
                className={styles.categoryTopRight}
                variants={pillVariants}
                initial="hidden"
                animate="show"
              >
                <span className={styles.categoryPill}>
                  {item.category}
                </span>
              </motion.div>
            )}

            {/* ================= CONTENT ================= */}
            <motion.div
              className={styles.content}
              variants={textVariants}
              initial="hidden"
              animate="show"
            >
              <h1 className={styles.title}>
                {item.title}
              </h1>

              {item.subtitle && (
                <h2 className={styles.subtitle}>
                  {item.subtitle}
                </h2>
              )}

              <Link
                href={item.href}
                prefetch={false}
                className={styles.cta}
                onClick={() =>
                  trackEvent('content_click', {
                    placement: 'home_hero',
                    page: 'home',
                    article_id: item.id,
                    position: index,
                  })
                }
              >
                Read Story →
              </Link>
            </motion.div>
          </motion.article>
        )}
      </AnimatePresence>

      {/* ================= PROGRESS ================= */}
      {canRotate && (
        <div className={styles.progress}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </section>
  )
}
