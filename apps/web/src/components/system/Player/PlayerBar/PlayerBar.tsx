'use client'

import { useEffect, useState } from 'react'

import { PlayerInfo } from '../PlayerInfo/PlayerInfo'
import { PlayerControls } from '../PlayerControls/PlayerControls'
import { PlayerActions } from '../PlayerActions/PlayerActions'
import { PlayerPopup } from '../PlayerPopup/PlayerPopup'

import styles from './PlayerBar.module.css'

export function PlayerBar() {
  const [popupOpen, setPopupOpen] = useState(false)

  // --------------------------------------------------
  // Accessibility + UX
  // --------------------------------------------------
  useEffect(() => {
    if (!popupOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopupOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [popupOpen])

  return (
    <>
      {/* Sticky Player Bar */}
      <div
        className={styles.bar}
        role="region"
        aria-label="Audio player"
        data-expanded={popupOpen}
      >
        <PlayerInfo placement="sticky_player" />

        <PlayerControls placement="sticky_player" />

        <PlayerActions
          placement="sticky_player"
          onExpand={() => setPopupOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={popupOpen}
        />
      </div>

      {/* Expanded Player */}
      <PlayerPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        aria-label="Expanded audio player"
      />
    </>
  )
}
