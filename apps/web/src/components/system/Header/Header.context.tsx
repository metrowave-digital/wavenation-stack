'use client'

import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'

/* ======================================================
   Types
====================================================== */

export type HeaderPopup = 'search' | 'profile' | null

export interface HeaderState {
  compact: boolean
  activeMenu: string | null
  setActiveMenu: (id: string | null) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  popup: HeaderPopup
  setPopup: (p: HeaderPopup) => void
}

/* ======================================================
   Context
====================================================== */

export const HeaderContext = createContext<HeaderState>({
  compact: false,
  activeMenu: null,
  setActiveMenu: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
  popup: null,
  setPopup: () => {},
})

/* ======================================================
   Provider
====================================================== */

interface HeaderProviderProps {
  children: ReactNode
}

export function HeaderProvider({ children }: HeaderProviderProps) {
  const [compact, setCompact] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [popup, setPopup] = useState<HeaderPopup>(null)

  /* ---------------------------------------------
     Scroll → Compact Header
  ---------------------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const isCompact = window.scrollY > 64
      setCompact(isCompact)
      document.body.classList.toggle('header--compact', isCompact)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.classList.remove('header--compact')
    }
  }, [])

  /* ---------------------------------------------
     Close menus on Escape
  ---------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null)
        setPopup(null)
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* ---------------------------------------------
     Auto-close mobile menu on resize
  ---------------------------------------------- */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ---------------------------------------------
     Memoized Context Value
  ---------------------------------------------- */
  const value = useMemo<HeaderState>(
    () => ({
      compact,
      activeMenu,
      setActiveMenu,
      mobileOpen,
      setMobileOpen,
      popup,
      setPopup,
    }),
    [compact, activeMenu, mobileOpen, popup]
  )

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  )
}
