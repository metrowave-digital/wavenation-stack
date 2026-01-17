'use client'

import { useState } from 'react'
import styles from './Player.module.css'

import { PlayerInfo } from './PlayerInfo/PlayerInfo'
import { PlayerControls } from './PlayerControls/PlayerControls'
import { PlayerActions } from './PlayerActions/PlayerActions'
import { PlayerPopup } from './PlayerPopup/PlayerPopup'
import { PlayerProgress } from './PlayerProgress/PlayerProgress'

export function Player() {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <div
        className={styles.player}
        role="region"
        aria-label="Audio player"
      >
        <div className={styles.texture} aria-hidden />

        {/* Top row */}
        <div className={styles.info}>
          <PlayerInfo />
        </div>

        <div className={styles.controls}>
          <PlayerControls placement="sticky_player" />
        </div>

        <div className={styles.actions}>
          <PlayerActions
            placement="sticky_player"
            onExpand={() => setPopupOpen(true)}
          />
        </div>

        {/* Bottom progress row */}
        <div className={styles.progress}>
          <PlayerProgress />
        </div>
      </div>

      <PlayerPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </>
  )
}
