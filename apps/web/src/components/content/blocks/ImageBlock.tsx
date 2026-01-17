import styles from './ImageBlock.module.css'
import type { ImageBlockData } from '../types'

export function ImageBlock({
  block,
}: {
  block: ImageBlockData
}) {
  return (
    <figure
      className={[
        styles.figure,
        block.fullWidth ? styles.full : styles.standard,
      ].join(' ')}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.image.url}
        alt={block.image.alt ?? ''}
      />

      {(block.caption || block.credit) && (
        <figcaption>
          {block.caption}
          {block.credit && ` · ${block.credit}`}
        </figcaption>
      )}
    </figure>
  )
}
