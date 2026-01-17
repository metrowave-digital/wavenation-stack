'use client'

import { MAIN_NAV } from '../nav/nav.config'
import { MainNavItem } from './MainNavItem'
import styles from './MainNav.module.css'

export function MainNav() {
  return (
    <nav
      className={styles.root}
      aria-label="Primary navigation"
      role="navigation"
    >
      {MAIN_NAV.map(item => (
        <MainNavItem key={item.id} item={item} />
      ))}
    </nav>
  )
}
