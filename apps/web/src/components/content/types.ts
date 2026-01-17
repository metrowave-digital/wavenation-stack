/* ======================================================
   Lexical (read-only)
====================================================== */

export interface LexicalTextNode {
  text: string
}

export interface LexicalParagraphNode {
  type: 'paragraph'
  children: LexicalTextNode[]
}

export interface LexicalRoot {
  children: LexicalParagraphNode[]
}

/* ======================================================
   Blocks
====================================================== */

export interface RichTextBlockData {
  id: string
  blockType: 'richText'
  content: {
    root: LexicalRoot
  }
}

export interface ImageBlockData {
  id: string
  blockType: 'image'
  image: {
    url: string
    alt?: string | null
  }
  caption?: string | null
  credit?: string | null
  fullWidth?: boolean | null
}

export interface PullQuoteBlockData {
  id: string
  blockType: 'pullQuote'
  quote: string
  attribution?: string | null
}

export interface DividerBlockData {
  id: string
  blockType: 'divider'
}

export interface TimelineItem {
  date?: string | null
  headline: string
  description?: string | null
  highlight?: boolean | null
}

export interface TimelineBlockData {
  id: string
  blockType: 'timeline'
  title?: string | null
  style?: 'vertical' | 'horizontal' | 'compact'
  items: TimelineItem[]
}

/* ======================================================
   Union
====================================================== */

export type ContentBlock =
  | RichTextBlockData
  | ImageBlockData
  | PullQuoteBlockData
  | DividerBlockData
  | TimelineBlockData
