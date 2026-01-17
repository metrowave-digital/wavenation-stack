'use client'

import styles from './PlayerActions.module.css'
import { Maximize2, Share2 } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface PlayerActionsProps {
  placement?: 'sticky_player' | 'fullscreen_player'
  onExpand?: () => void
}

export function PlayerActions({
  placement = 'sticky_player',
  onExpand,
}: PlayerActionsProps) {
  function handleExpand() {
    trackEvent('hero_interaction', {
      action: 'player_expand',
      placement,
    })

    onExpand?.()
  }

  function handleShare() {
    trackEvent('content_click', {
      action: 'player_share',
      placement,
    })
  }

  return (
    <div className={styles.actions}>
      <button
        aria-label="Expand player"
        onClick={handleExpand}
      >
        <Maximize2 size={18} />
      </button>

      <button
        aria-label="Share"
        onClick={handleShare}
      >
        <Share2 size={18} />
      </button>
    </div>
  )
}
