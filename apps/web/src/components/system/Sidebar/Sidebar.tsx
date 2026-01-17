'use client'

import styles from './Sidebar.module.css'

/* ======================================================
   Sidebar Context Types
====================================================== */

type ArticleSidebarData = {
  articleId: number
  category?: string
}

type HomeSidebarData = {
  highlightIds?: number[]
}

type CustomSidebarData = {
  blocks: string[]
}

type SidebarProps =
  | {
      context: 'article'
      data: ArticleSidebarData
    }
  | {
      context: 'home'
      data?: HomeSidebarData
    }
  | {
      context: 'custom'
      data: CustomSidebarData
    }

/* ======================================================
   Sidebar Component
====================================================== */

export function Sidebar(props: SidebarProps) {
  const { context } = props

  return (
    <aside className={styles.sidebar}>
      {context === 'article' && (
        <>
          <section className={styles.block}>
            <h4>Up Next</h4>
            <p className={styles.hint}>
              Related to category:{' '}
              <strong>{props.data.category}</strong>
            </p>
            {/* wire related articles using articleId */}
          </section>

          <section className={styles.block}>
            <h4>Trending</h4>
            {/* trending logic */}
          </section>

          <section className={styles.block}>
            <h4>Newsletter</h4>
            {/* CTA */}
          </section>
        </>
      )}

      {context === 'home' && (
        <section className={styles.block}>
          <h4>Top Stories</h4>
          {/* homepage sidebar */}
        </section>
      )}

      {context === 'custom' && (
        <>
          {props.data.blocks.map((block) => (
            <section
              key={block}
              className={styles.block}
            >
              <h4>{block}</h4>
            </section>
          ))}
        </>
      )}
    </aside>
  )
}
