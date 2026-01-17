'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './ChartsOverview.module.css'

/* ======================================================
   TYPES
====================================================== */

type ChartEntry = {
  rank: number
  trackTitle: string
  artist: string
}

type ChartOverview = {
  chartKey: string
  label: string
  week: number
  updatedDaysAgo: number
  href: string

  topFive: ChartEntry[]
  biggestGainer?: ChartEntry
  highestDebut?: ChartEntry
  dropped: ChartEntry[]
}

/* ======================================================
   COMPONENT
====================================================== */

export default function ChartsClient({
  charts,
}: {
  charts: ChartOverview[]
}) {
  const [activeLane, setActiveLane] = useState<string | null>(null)

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>(
    {},
  )

  /* ======================================================
     SCROLL SPY
  ====================================================== */
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>(
      '[data-chart-row]',
    )

    if (!rows.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLane(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      },
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  /* ======================================================
     AUTO-CENTER ACTIVE STRIP ITEM
  ====================================================== */
  useEffect(() => {
    if (!activeLane) return
    itemRefs.current[activeLane]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeLane])

  return (
    <>
      {/* ================= LATEST STRIP ================= */}
      <section className={styles.latestStrip}>
        <div className={styles.latestInner}>
          {charts.map((c) => {
            const isActive = activeLane === c.chartKey
            const isToday = c.updatedDaysAgo === 0

            return (
              <a
                key={c.chartKey}
                href={`#${c.chartKey}`}
                ref={(el) => {
                  itemRefs.current[c.chartKey] = el
                }}
                className={`${styles.latestItem} ${
                  c.chartKey === 'hitlist'
                    ? styles.latestPrimary
                    : ''
                } ${isActive ? styles.latestActive : ''}`}
              >
                <span className={styles.latestLabel}>
                  {c.label}
                </span>

                <span className={styles.latestMeta}>
                  {isToday && isActive && (
                    <span
                      className={styles.liveDot}
                      aria-hidden
                    />
                  )}
                  {isToday
                    ? 'Updated today'
                    : c.updatedDaysAgo === 1
                      ? 'Updated yesterday'
                      : `Updated ${c.updatedDaysAgo} days ago`}
                </span>
              </a>
            )
          })}
        </div>
      </section>

      {/* ================= EDITORIAL ROWS ================= */}
      <section className={styles.rows}>
        {charts.map((chart) => (
          <article
            key={chart.chartKey}
            id={chart.chartKey}
            data-chart-row
            className={`${styles.row} ${
              chart.chartKey === 'hitlist'
                ? styles.hitlist
                : ''
            }`}
          >
            {/* ---------- HEADER ---------- */}
            <header className={styles.rowHeader}>
              <h2>{chart.label}</h2>
              <span className={styles.week}>
                Week {chart.week}
              </span>

              {chart.chartKey === 'hitlist' && (
                <span className={styles.flagship}>
                  Flagship Chart
                </span>
              )}
            </header>

            {/* ---------- GRID ---------- */}
            <div className={styles.rowGrid}>
              {/* TOP 5 */}
              <Block title="Top 5">
                <ol>
                  {chart.topFive.map((e, index) => (
  <li key={index}>
    #{index + 1}{' '}
    <strong>{e.trackTitle}</strong>
                      <span>{e.artist}</span>
                    </li>
                  ))}
                </ol>
              </Block>

              {/* BIGGEST GAINER */}
              <Block title="Biggest Gainer">
                {chart.biggestGainer ? (
                  <>
                    <strong>
                      {chart.biggestGainer.trackTitle}
                    </strong>
                    <span>
                      {chart.biggestGainer.artist}
                    </span>
                  </>
                ) : (
                  <em>—</em>
                )}
              </Block>

              {/* HIGHEST DEBUT */}
              <Block title="Highest Debut">
                {chart.highestDebut ? (
                  <>
                    <strong>
                      {chart.highestDebut.trackTitle}
                    </strong>
                    <span>
                      {chart.highestDebut.artist}
                    </span>
                  </>
                ) : (
                  <em>—</em>
                )}
              </Block>

              {/* DROPPED */}
              <Block title="Dropped">
                {chart.dropped.length ? (
                  chart.dropped.map((e, i) => (
                    <div key={i}>
                      {e.trackTitle}
                      <span>{e.artist}</span>
                    </div>
                  ))
                ) : (
                  <em>—</em>
                )}
              </Block>
            </div>

            {/* ---------- FOOTER ---------- */}
            <footer className={styles.rowFooter}>
              <span className={styles.powered}>
                Powered by The Urban Influencer™
              </span>

              <Link href={chart.href}>
                View Full Chart →
              </Link>
            </footer>
          </article>
        ))}
      </section>
    </>
  )
}

/* ======================================================
   BLOCK
====================================================== */

function Block({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.block}>
      <h4>{title}</h4>
      <div className={styles.blockBody}>{children}</div>
    </div>
  )
}
