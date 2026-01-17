'use client'

import { Search, User, ShoppingBag, Menu } from 'lucide-react'
import { useContext } from 'react'
import { HeaderContext } from '../Header.context'
import styles from './HeaderActions.module.css'

export function HeaderActions() {
  const { setPopup, setMobileOpen } = useContext(HeaderContext)

  return (
    <div className={styles.actions}>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setPopup('search')}
      >
        <Search />
      </button>

      <button
        type="button"
        aria-label="Profile"
        onClick={() => setPopup('profile')}
      >
        <User />
      </button>

      <a
        href="/shop"
        aria-label="Shop"
      >
        <ShoppingBag />
      </a>

      {/* Mobile menu toggle */}
      <button
        type="button"
        aria-label="Open menu"
        className={styles.mobileOnly}
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
      </button>
    </div>
  )
}
