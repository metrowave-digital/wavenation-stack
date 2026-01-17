import type { ReactNode } from 'react'
import styles from './ArticleLayout.module.css'

type Author = {
  name: string
  href?: string
}

interface ArticleLayoutProps {
  hero: ReactNode
  children: ReactNode

  author?: Author
  publishedAt?: string
  readTime?: string

  sidebar?: ReactNode
  sidebarAd?: ReactNode
  newsletterCta?: ReactNode
  footerAd?: ReactNode
}

export function ArticleLayout({
  hero,
  children,
  author,
  publishedAt,
  readTime,
  sidebar,
  sidebarAd,
  newsletterCta,
  footerAd,
}: ArticleLayoutProps) {
  return (
    <article className={styles.article}>
      {/* ================= HERO ================= */}
      {hero}

      {/* ================= META ================= */}
      {(author || publishedAt || readTime) && (
        <div className={styles.metaBar}>
          {author && (
            <span className={styles.author}>
              By{' '}
              {author.href ? (
                <a href={author.href}>{author.name}</a>
              ) : (
                author.name
              )}
            </span>
          )}

          {(publishedAt || readTime) && (
            <span className={styles.metaDivider}>•</span>
          )}

          {publishedAt && (
            <time className={styles.date}>{publishedAt}</time>
          )}

          {readTime && (
            <>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.readTime}>{readTime}</span>
            </>
          )}
        </div>
      )}

      {/* ================= GRID ================= */}
      <div className={styles.grid}>
        {/* ===== CONTENT ===== */}
        <div className={styles.content}>
          {children}

          {newsletterCta && (
            <div className={styles.newsletter}>
              {newsletterCta}
            </div>
          )}

          {footerAd && (
            <div className={styles.footerAd}>
              {footerAd}
            </div>
          )}
        </div>

        {/* ===== SIDEBAR ===== */}
        {(sidebar || sidebarAd) && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              {sidebar}

              {sidebarAd && (
                <div className={styles.sidebarAd}>
                  {sidebarAd}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </article>
  )
}
