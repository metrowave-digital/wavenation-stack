import type { ContentBlock } from './types'

import { RichTextBlock } from './blocks/RichTextBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { PullQuoteBlock } from './blocks/PullQuoteBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { TimelineBlock } from './blocks/TimelineBlock'

interface Props {
  blocks?: ContentBlock[]
}

export function ContentRenderer({ blocks }: Props) {
  if (!blocks) return null

  return (
    <>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'richText':
            return <RichTextBlock key={block.id} block={block} />

          case 'image':
            return <ImageBlock key={block.id} block={block} />

          case 'pullQuote':
            return <PullQuoteBlock key={block.id} block={block} />

          case 'divider':
            return <DividerBlock key={block.id} />

          case 'timeline':
            return <TimelineBlock key={block.id} block={block} />

          default:
            return null
        }
      })}
    </>
  )
}
