import Link from 'next/link'
import styles from './EditorialHero.module.css'

type HeroVariant = 'charts' | 'article' | 'tv'

type HeroAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

interface EditorialHeroProps {
  variant?: HeroVariant
  eyebrow: string
  title: React.ReactNode
  lede?: string
  weekStamp?: string
  pills?: string[]
  actions?: HeroAction[]
}

export function EditorialHero({
  variant = 'charts',
  eyebrow,
  title,
  lede,
  weekStamp,
  pills = [],
  actions = [],
}: EditorialHeroProps) {
  return (
    <header
      className={`${styles.hero} ${styles[variant]}`}
    >
      <div className={styles.heroInner}>
        <span className={styles.eyebrow}>{eyebrow}</span>

        {(weekStamp || pills.length > 0) && (
          <div className={styles.heroTopRow}>
            {weekStamp && (
              <span className={styles.weekStamp}>
                {weekStamp}
              </span>
            )}

            {pills.length > 0 && (
              <div
                className={styles.heroMeta}
                aria-label="Editorial attributes"
              >
                {pills.map((pill) => (
                  <span key={pill} className={styles.pill}>
                    {pill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <h1 className={styles.title}>{title}</h1>

        {lede && <p className={styles.lede}>{lede}</p>}

        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={
                  action.variant === 'secondary'
                    ? styles.secondaryCta
                    : styles.primaryCta
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
