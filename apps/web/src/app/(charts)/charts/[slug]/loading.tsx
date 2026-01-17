// app/(charts)/charts/[slug]/loading.tsx

import styles from './ChartGenreEditorial.module.css'

export default function Loading() {
  return (
    <main className={styles.page}>
      <section className={styles.current}>
        <div
          style={{
            height: 24,
            width: 180,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 6,
          }}
        />

        <div className={styles.topThree}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={styles.previewCard}
            >
              <div
                style={{
                  height: 14,
                  width: 40,
                  background:
                    'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  height: 18,
                  width: '80%',
                  background:
                    'rgba(255,255,255,0.12)',
                  borderRadius: 6,
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
