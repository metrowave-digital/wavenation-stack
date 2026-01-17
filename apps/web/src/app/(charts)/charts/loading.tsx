// app/chart/loading.tsx

import styles from './ChartEditorial.module.css'

export default function ChartEditorialLoading() {
  return (
    <main className={styles.page} aria-busy="true">
      {/* ================= HERO SKELETON ================= */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <SkeletonLine w="120px" h="14px" />

          <div className={styles.heroTopRow}>
            <SkeletonLine w="160px" h="14px" />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <SkeletonPill />
              <SkeletonPill />
              <SkeletonPill />
            </div>
          </div>

          <SkeletonBlock h="64px" />
          <SkeletonBlock h="36px" />

          <div className={styles.actions}>
            <SkeletonButton />
            <SkeletonButton variant="secondary" />
          </div>

          <aside className={styles.editorNote}>
            <SkeletonLine w="90px" h="12px" />
            <SkeletonBlock h="48px" />
            <SkeletonLine w="140px" h="12px" />
          </aside>
        </div>
      </header>

      {/* ================= METRIC GRID ================= */}
      <section className={styles.previewStrip}>
        <div className={styles.previewGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonMetricCard key={i} />
          ))}
        </div>
      </section>

      {/* ================= EDITORIAL BLOCKS ================= */}
      <section className={styles.blocks}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.block}>
            <SkeletonLine w="60%" h="16px" />
            <SkeletonBlock h="40px" />
          </div>
        ))}
      </section>
    </main>
  )
}

/* ======================================================
   Skeleton Atoms
====================================================== */

function SkeletonLine({
  w,
  h,
}: {
  w: string
  h: string
}) {
  return (
    <div
      className={styles.skeleton}
      style={{ width: w, height: h }}
    />
  )
}

function SkeletonBlock({ h }: { h: string }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width: '100%', height: h }}
    />
  )
}

function SkeletonPill() {
  return (
    <div
      className={styles.skeleton}
      style={{
        width: '80px',
        height: '22px',
        borderRadius: '999px',
      }}
    />
  )
}

function SkeletonButton({
  variant,
}: {
  variant?: 'secondary'
}) {
  return (
    <div
      className={styles.skeleton}
      style={{
        width: '180px',
        height: '44px',
        borderRadius: '999px',
        opacity: variant ? 0.6 : 1,
      }}
    />
  )
}

function SkeletonMetricCard() {
  return (
    <article className={styles.previewCard}>
      <SkeletonLine w="90px" h="12px" />
      <SkeletonBlock h="36px" />
      <SkeletonBlock h="22px" />
      <SkeletonBlock h="32px" />
    </article>
  )
}
