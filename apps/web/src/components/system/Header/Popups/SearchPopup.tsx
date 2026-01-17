'use client'

import { useContext } from 'react'
import { HeaderContext } from '../Header.context'
import styles from './Popup.module.css'

export function SearchPopup() {
  const { popup, setPopup } = useContext(HeaderContext)

  if (popup !== 'search') return null

  return (
    <div className={styles.overlay} onClick={() => setPopup(null)}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Search music, news, shows, creators…"
        />
      </div>
    </div>
  )
}
