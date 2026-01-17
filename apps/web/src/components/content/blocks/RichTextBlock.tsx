import styles from './RichTextBlock.module.css'
import type { RichTextBlockData } from '../types'

export function RichTextBlock({
  block,
}: {
  block: RichTextBlockData
}) {
  return (
    <div className={styles.root}>
      {block.content.root.children.map((p, i) => (
        <p key={i}>
          {p.children.map((c) => c.text).join('')}
        </p>
      ))}
    </div>
  )
}
