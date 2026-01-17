import styles from './TimelineBlock.module.css'
import type { TimelineBlockData } from '../types'

export function TimelineBlock({
  block,
}: {
  block: TimelineBlockData
}) {
  return (
    <section className={styles.root}>
      {block.title && <h3>{block.title}</h3>}

      <ul>
        {block.items.map((item, i) => (
          <li key={i}>
            {item.date && <span>{item.date}</span>}
            <strong>{item.headline}</strong>
            {item.description && <p>{item.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
