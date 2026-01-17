// app/chart/page.tsx

import styles from './ChartEditorial.module.css'
import CountUpClient from './CountUpClient'
import { getChartMetrics } from '../../lib/charts/getChartMetrics'
import { EditorialHero } from '@/components/editorial/EditorialHero'

export const metadata = {
  title: 'Charts | WaveNation',
  description:
    'Weekly chart culture, movement, and editorial insight.',
}

/* ======================================================
   Types & Adapters
====================================================== */

type Direction = 'up' | 'down' | 'flat'

type EditorialEntry = {
  rank: number
  trackTitle: string
  artist: string
  movement?: 'up' | 'down' | 'same' | 'new'
}

function toMetricSignal(entry?: EditorialEntry) {
  if (!entry) {
    return { value: 0, delta: 0, direction: 'flat' as const }
  }

  return {
    value: entry.rank,
    delta:
      entry.movement === 'up'
        ? 1
        : entry.movement === 'down'
          ? -1
          : 0,
    direction:
      entry.movement === 'up'
        ? 'up'
        : entry.movement === 'down'
          ? 'down'
          : 'flat',
  }
}

function asDirection(value: unknown): Direction | undefined {
  return value === 'up' || value === 'down' || value === 'flat'
    ? value
    : undefined
}

/* ======================================================
   Page
====================================================== */

export default async function ChartEditorialPage() {
  const rawMetrics = await getChartMetrics()

  const metrics = {
    biggestGainer: toMetricSignal(rawMetrics.biggestGainer ?? undefined),
    highestDebut: toMetricSignal(rawMetrics.highestDebut ?? undefined),
    sparklines: rawMetrics.sparklines,
  }

  return (
    <main className={styles.page}>
      {/* ================= HERO ================= */}
<EditorialHero
  variant="charts"
  eyebrow="Charts & Culture"
  weekStamp="Week of January 12"
  pills={[
    'Updated weekly',
    'Editor-curated',
    'Culture-first',
  ]}
  title={
    <>
      Not just rankings.
      <br />
      <span>Reflections of the culture.</span>
    </>
  }
  lede="Every WaveNation chart tells a story — what’s rising, what’s breaking through, and what’s leading the sound this week."
  actions={[
    {
      label: "View This Week’s Charts",
      href: '/charts/index',
    },
    {
      label: 'Chart Coverage',
      href: '/news?tag=charts',
      variant: 'secondary',
    },
  ]}
/>

      {/* ================= WEEKLY PREVIEW STRIP ================= */}
      <section
        className={styles.previewStrip}
        aria-labelledby="weekly-preview"
      >
        <div className={styles.stripHeader}>
          <h2
            id="weekly-preview"
            className={styles.stripTitle}
          >
            This Week on the Charts
          </h2>

          <p className={styles.stripSub}>
            Key editorial signals — momentum and debuts
            shaping this week’s movement.
          </p>
        </div>

        <div className={styles.previewGrid}>
          {/* BIGGEST GAINER */}
          <MetricCard
            label="Biggest Gainer"
            title="Momentum Shift"
            value={metrics.biggestGainer.value}
            delta={metrics.biggestGainer.delta}
            direction={asDirection(metrics.biggestGainer.direction)}
            description="Fastest-rising record across all charts this week."
            spark={metrics.sparklines}
            trackTitle={rawMetrics.biggestGainer?.trackTitle}
            artist={rawMetrics.biggestGainer?.artist}
          />

          {/* HIGHEST DEBUT */}
          <MetricCard
            label="Highest Debut"
            title="New Entry"
            value={metrics.highestDebut.value}
            delta={metrics.highestDebut.delta}
            direction={asDirection(metrics.highestDebut.direction)}
            description="A new release making immediate cultural impact."
            spark={metrics.sparklines}
            prefix="#"
            trackTitle={rawMetrics.highestDebut?.trackTitle}
            artist={rawMetrics.highestDebut?.artist}
          />
        </div>
      </section>

      {/* ================= EDITORIAL BLOCKS ================= */}
      <section
        className={styles.blocks}
        aria-label="Chart pillars"
      >
        <article className={styles.block}>
          <h3>The Hit List</h3>
          <p>
            WaveNation’s flagship chart — cross-genre,
            editor-driven, and culture-centered.
          </p>
        </article>

        <article className={styles.block}>
          <h3>Genre Charts</h3>
          <p>
            R&B, Hip-Hop, Gospel, Southern Soul — each lane
            with its own rhythm and audience.
          </p>
        </article>

        <article className={styles.block}>
          <h3>Chart Intelligence</h3>
          <p>
            Momentum shifts, breakouts, and editorial insight
            behind the numbers.
          </p>
        </article>
      </section>

      <footer className={styles.footerNote}>
        Updated weekly · Curated by editors · Powered by culture
      </footer>
    </main>
  )
}

/* ======================================================
   Local Components
====================================================== */

function MetricCard(props: {
  label: string
  title: string
  value?: number
  delta?: number
  direction?: Direction
  description: string
  spark: number[]
  prefix?: string
  trackTitle?: string
  artist?: string
}) {
  const {
    label,
    title,
    value,
    delta,
    direction,
    description,
    spark,
    prefix,
    trackTitle,
    artist,
  } = props

  const deltaLabel =
    typeof delta === 'number'
      ? delta === 0
        ? 'No change'
        : delta > 0
          ? `+${delta} vs last week`
          : `${delta} vs last week`
      : null

  return (
    <article className={styles.previewCard}>
      <div className={styles.cardTop}>
        <span className={styles.cardLabel}>{label}</span>
        {direction && <MovementArrow direction={direction} />}
      </div>

      <h3 className={styles.metricHeading}>
        <span className={styles.metricValue}>
          {prefix ?? ''}
          <CountUpClient value={value ?? 0} />
        </span>{' '}
        <span className={styles.metricTitle}>{title}</span>
      </h3>

      {trackTitle && artist && (
        <p className={styles.trackMeta}>
          <strong>{trackTitle}</strong>
          <br />
          <span className={styles.artist}>{artist}</span>
        </p>
      )}

      {deltaLabel && direction && (
        <div className={styles.cardMid}>
          <span
            className={`${styles.deltaPill} ${
              direction === 'up'
                ? styles.deltaUp
                : direction === 'down'
                  ? styles.deltaDown
                  : styles.deltaFlat
            }`}
          >
            {deltaLabel}
          </span>

          <div className={styles.sparkWrap}>
  <Sparkline
    values={spark}
    label={`${label} sparkline`}
  />
</div>
        </div>
      )}

      <p className={styles.cardDesc}>{description}</p>
    </article>
  )
}

function MovementArrow({ direction }: { direction: Direction }) {
  return (
    <span
      className={`${styles.arrow} ${
        direction === 'up'
          ? styles.arrowUp
          : direction === 'down'
            ? styles.arrowDown
            : styles.arrowFlat
      }`}
      aria-hidden
    >
      {direction === 'up'
        ? '▲'
        : direction === 'down'
          ? '▼'
          : '•'}
    </span>
  )
}

function Sparkline({
  values,
  label,
}: {
  values: number[]
  label: string
}) {
  const w = 120
  const h = 28
  const pad = 2

  if (!values.length) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const step = w / (values.length - 1)

  const points = values
    .map((v, i) => {
      const x = i * step
      const y =
        h - pad - ((v - min) / span) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      className={styles.spark}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}
