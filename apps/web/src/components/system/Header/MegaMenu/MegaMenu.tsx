'use client'

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { X } from 'lucide-react'

import { HeaderContext } from '../Header.context'
import { MAIN_NAV } from '../nav/nav.config'
import { MegaMenuPanel } from './MegaMenuPanel'
import type { MegaMenuItem } from './MegaMenu.types'
import styles from './MegaMenu.module.css'
import { trackEvent } from '@/lib/analytics'

const EXIT_MS = 260

/* ======================================================
   Scroll Lock
====================================================== */
function lockScroll() {
  const html = document.documentElement
  const body = document.body

  const prevHtml = html.style.overflow
  const prevBody = body.style.overflow
  const prevPadding = body.style.paddingRight

  const scrollbarWidth = window.innerWidth - html.clientWidth
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`
  }

  html.style.overflow = 'hidden'
  body.style.overflow = 'hidden'

  return () => {
    html.style.overflow = prevHtml
    body.style.overflow = prevBody
    body.style.paddingRight = prevPadding
  }
}

/* ======================================================
   Component
====================================================== */
export function MegaMenu() {
  const { activeMenu, setActiveMenu } =
    useContext(HeaderContext)

  const [closing, setClosing] = useState(false)
  const closeTimer = useRef<number | null>(null)

  const isOpen = Boolean(activeMenu) && !closing

  const item = useMemo(() => {
    if (!activeMenu) return null
    return (
      MAIN_NAV.find(n => n.id === activeMenu) ?? null
    ) as MegaMenuItem | null
  }, [activeMenu])

  const requestClose = useCallback(
    (reason: string) => {
      setClosing(prev => {
        if (prev) return prev

        trackEvent('navigation_click', {
          component: 'mega_menu',
          action: 'close',
          reason,
          section: activeMenu,
        })

        closeTimer.current = window.setTimeout(() => {
          setActiveMenu(null)
          setClosing(false)
          closeTimer.current = null
        }, EXIT_MS)

        return true
      })
    },
    [activeMenu, setActiveMenu]
  )

  /* Scroll lock */
  useEffect(() => {
    if (!isOpen) return
    const unlock = lockScroll()
    return unlock
  }, [isOpen])

  /* Escape */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose('escape')
    }
    document.addEventListener('keydown', onKey)
    return () =>
      document.removeEventListener('keydown', onKey)
  }, [isOpen, requestClose])

  /* Impression */
  useEffect(() => {
    if (!isOpen || !item) return
    trackEvent('content_impression', {
      component: 'mega_menu',
      section: item.id,
    })
  }, [isOpen, item])

  if (!item) return null

  return (
    <div
      className={`${styles.overlay} ${
        isOpen ? styles.overlayOpen : styles.overlayExit
      }`}
      onMouseDown={() => requestClose('backdrop')}
      aria-hidden
    >
      <div
        className={`${styles.container} ${
          isOpen
            ? styles.containerOpen
            : styles.containerExit
        }`}
        role="dialog"
        aria-modal="true"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Close X */}
        <button
          className={styles.close}
          onClick={() => requestClose('x')}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        {/* Sheet with click-away */}
        <div
          className={styles.sheet}
          onMouseDown={e => {
            const target = e.target as HTMLElement | null
            const isInteractive = Boolean(
              target?.closest(
                'a, button, [data-megamenu-item]'
              )
            )
            if (!isInteractive) {
              requestClose('sheet')
            }
          }}
        >
          <MegaMenuPanel
            item={item}
            onNavigate={() => requestClose('navigate')}
          />
        </div>
      </div>
    </div>
  )
}
