'use client'

import { useContext } from 'react'
import { HeaderContext } from '../Header.context'
import styles from './Popup.module.css'

export function ProfilePopup() {
  const { popup, setPopup } = useContext(HeaderContext)

  if (popup !== 'profile') return null

  return (
    <div className={styles.overlay} onClick={() => setPopup(null)}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <a href="/account">My Account</a>
        <a href="/subscriptions">Subscriptions</a>
        <a href="/logout">Sign Out</a>
      </div>
    </div>
  )
}
