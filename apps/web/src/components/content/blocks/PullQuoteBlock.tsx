import styles from './PullQuoteBlock.module.css'
import type { PullQuoteBlockData } from '../types'

export function PullQuoteBlock({
  block,
}: {
  block: PullQuoteBlockData
}) {
  return (
    <blockquote className={styles.root}>
      <p>{block.quote}</p>
      {block.attribution && (
        <cite>— {block.attribution}</cite>
      )}
    </blockquote>
  )
}
