'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MAIN_NAV } from '../nav/nav.config'
import styles from './SubNav.module.css'

/* ======================================================
   Types (local safety, no config refactor needed)
====================================================== */

interface SubNavLink {
  label: string
  href: string
}

export function SubNav() {
  const pathname = usePathname()

  const active = MAIN_NAV.find(item =>
    item.children?.some((child: SubNavLink) =>
      pathname.startsWith(child.href)
    )
  )

  if (!active?.children?.length) return null

  return (
    <div
      className={styles.root}
      role="navigation"
      aria-label={`${active.label} sub navigation`}
    >
      <nav className={styles.nav}>
        {active.children.map((link: SubNavLink) => {
          const isActive = pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                isActive ? styles.active : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={styles.label}>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
