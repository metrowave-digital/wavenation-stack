'use client'

import { useContext } from 'react'
import type { ComponentType } from 'react'
import { HeaderContext } from '../Header.context'
import styles from './MainNavItem.module.css'

/* ======================================================
   Types
====================================================== */

export interface MainNavConfigItem {
  id: string
  label: string
  icon: ComponentType<{
    size?: number
    strokeWidth?: number
  }>
  hasMenu?: boolean
}

/* ======================================================
   Props
====================================================== */

interface MainNavItemProps {
  item: MainNavConfigItem
}

/* ======================================================
   Component
====================================================== */

export function MainNavItem({ item }: MainNavItemProps) {
  const { activeMenu, setActiveMenu } = useContext(HeaderContext)
  const Icon = item.icon

  const isActive = activeMenu === item.id

  function handleClick() {
    setActiveMenu(isActive ? null : item.id)
  }

  return (
    <button
      type="button"
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      data-active={isActive || undefined}
      aria-haspopup={item.hasMenu ? 'dialog' : undefined}
      aria-expanded={item.hasMenu ? isActive : undefined}
      aria-controls={item.hasMenu ? `mega-${item.id}` : undefined}
    >
      <Icon size={18} strokeWidth={2} aria-hidden />
      <span className={styles.label}>{item.label}</span>
    </button>
  )
}
