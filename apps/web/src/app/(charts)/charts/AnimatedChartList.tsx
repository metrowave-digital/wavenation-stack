'use client'

import { motion, AnimatePresence } from 'framer-motion'
import styles from './AnimatedChartList.module.css'

export interface AnimatedEntry {
  id: string
  rank: number
  title: string
  artist: string
  movement?: 'up' | 'down' | 'same' | 'new'
}

interface Props {
  entries: AnimatedEntry[]
}

export function AnimatedChartList({ entries }: Props) {
  return (
    <motion.ol layout className={styles.list}>
      <AnimatePresence>
        {entries.map((entry) => (
          <motion.li
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 35,
            }}
            className={styles.entry}
          >
            <span className={styles.rank}>
              {entry.rank}
            </span>

            <div className={styles.meta}>
              <span className={styles.title}>
                {entry.title}
              </span>
              <span className={styles.artist}>
                {entry.artist}
              </span>
            </div>

            {entry.movement && (
              <span
                className={`${styles.movement} ${
                  styles[entry.movement]
                }`}
              >
                {entry.movement === 'up' && '▲'}
                {entry.movement === 'down' && '▼'}
                {entry.movement === 'same' && '●'}
                {entry.movement === 'new' && '★'}
              </span>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ol>
  )
}
