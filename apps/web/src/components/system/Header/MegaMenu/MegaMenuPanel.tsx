'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { FeaturedCard, MegaMenuItem } from './MegaMenu.types'
import styles from './MegaMenu.module.css'
import { trackEvent } from '@/lib/analytics'

interface Props {
  item: MegaMenuItem
  onNavigate?: () => void
}

export function MegaMenuPanel({ item, onNavigate }: Props) {
  const [featured, setFeatured] = useState<FeaturedCard[]>([])
  const [loading, setLoading] = useState(true)

  /* --------------------------------------------------
     Load featured editorial
  -------------------------------------------------- */
  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/menu-featured?context=${encodeURIComponent(item.id)}`,
          { cache: 'no-store' }
        )
        const json = (await res.json()) as FeaturedCard[]
        if (alive) {
          setFeatured(Array.isArray(json) ? json : [])
        }
      } catch {
        if (alive) setFeatured([])
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [item.id])

  const hero = featured[0]
  const rest = featured.slice(1)

  return (
    <section className={styles.panel}>
      {/* ======================================================
         LEFT: MAGAZINE INTRO (UNCHANGED)
      ====================================================== */}
      <div className={styles.intro}>
        <div className={styles.kicker}>WaveNation Desk</div>
        <h2 className={styles.title}>{item.label}</h2>

        {item.description ? (
          <p className={styles.desc}>{item.description}</p>
        ) : (
          <p className={styles.desc}>
            A curated front page for what matters right now.
          </p>
        )}

        <div className={styles.rule} />

        <div className={styles.introMeta}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Now Featuring</span>
            <span className={styles.metaValue}>
              {loading ? 'Loading…' : `${featured.length} picks`}
            </span>
          </div>

          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Section</span>
            <span className={styles.metaValue}>
              {item.id.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================
         CENTER: SECTION LINKS + SUBLINKS (ADDED)
      ====================================================== */}
      <nav
        className={styles.links}
        aria-label={`${item.label} links`}
      >
        {item.children?.map(link => (
          <div
            key={link.href}
            className={styles.linkGroup} /* NEW */
          >
            {/* Parent link (UNCHANGED) */}
            <a
              href={link.href}
              className={styles.link}
              data-megamenu-item
              onClick={() => {
                trackEvent('navigation_click', {
                  component: 'mega_menu',
                  section: item.id,
                  label: link.label,
                  href: link.href,
                })
                onNavigate?.()
              }}
            >
              <div className={styles.linkInner}>
                <strong className={styles.linkTitle}>
                  {link.label}
                </strong>

                {link.description ? (
                  <span className={styles.linkDesc}>
                    {link.description}
                  </span>
                ) : (
                  <span className={styles.linkDesc}>
                    Explore the latest updates.
                  </span>
                )}
              </div>

              <span className={styles.chev} aria-hidden>
                ↗
              </span>
            </a>

            {/* --------------------------------------------------
               SUBLINKS (NON-BREAKING ADDITION)
            -------------------------------------------------- */}
            {link.sublinks && link.sublinks.length > 0 && (
              <ul className={styles.sublinks}>
                {link.sublinks.map(s => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      className={styles.sublink}
                      data-megamenu-item
                      onClick={() => {
                        trackEvent('navigation_click', {
                          component: 'mega_menu',
                          section: item.id,
                          parent: link.label,
                          label: s.label,
                          href: s.href,
                        })
                        onNavigate?.()
                      }}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* ======================================================
         RIGHT: FEATURED EDITORIAL (UNCHANGED)
      ====================================================== */}
      <aside
        className={styles.featured}
        aria-label="Featured stories"
      >
        <div className={styles.featuredHeader}>
          <span className={styles.featuredLabel}>Featured</span>
          <span className={styles.featuredPill}>
            {loading ? '…' : featured.length}
          </span>
        </div>

        {/* Hero feature */}
        {hero ? (
          <a
            href={hero.href}
            className={styles.heroCard}
            data-megamenu-item
            onClick={() => {
              trackEvent('hero_click', {
                placement: 'mega_menu',
                section: item.id,
                title: hero.title,
              })
              onNavigate?.()
            }}
          >
            <div className={styles.heroMedia}>
              {hero.image?.url ? (
                <Image
                  src={hero.image.url}
                  alt={hero.image.alt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 420px"
                  className={styles.heroImg}
                />
              ) : (
                <div className={styles.heroFallback} />
              )}
              <div className={styles.heroShade} />
            </div>

            <div className={styles.heroBody}>
              <span className={styles.eyebrow}>
                {hero.eyebrow ?? 'Editor’s Pick'}
              </span>
              <h3 className={styles.heroTitle}>{hero.title}</h3>

              {hero.description && (
                <p className={styles.heroDesc}>
                  {hero.description}
                </p>
              )}

              <div className={styles.heroCta}>Read story</div>
            </div>
          </a>
        ) : (
          !loading && (
            <div className={styles.empty}>
              No featured articles yet for “{item.label}”.
            </div>
          )
        )}

        {/* Supporting cards */}
        {rest.length > 0 && (
          <div className={styles.cardList}>
            {rest.map(card => (
              <a
                key={card.href}
                href={card.href}
                className={styles.card}
                data-megamenu-item
                onClick={() => {
                  trackEvent('content_click', {
                    placement: 'mega_menu',
                    section: item.id,
                    title: card.title,
                  })
                  onNavigate?.()
                }}
              >
                <div className={styles.thumb}>
                  {card.image?.url ? (
                    <Image
                      src={card.image.url}
                      alt={card.image.alt}
                      fill
                      sizes="96px"
                      className={styles.thumbImg}
                    />
                  ) : (
                    <div className={styles.thumbFallback} />
                  )}
                </div>

                <div className={styles.cardBody}>
                  {card.eyebrow && (
                    <span className={styles.cardEyebrow}>
                      {card.eyebrow}
                    </span>
                  )}

                  <div className={styles.cardTitle}>
                    {card.title}
                  </div>

                  {card.description && (
                    <div className={styles.cardDesc}>
                      {card.description}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </aside>
    </section>
  )
}
