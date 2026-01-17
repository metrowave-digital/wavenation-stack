import type {
  CollectionConfig,
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
} from 'payload'

/* ======================================================
   Types
====================================================== */

type ChartEntry = {
  rank?: number
  movement?: 'up' | 'down' | 'same' | 'new'
  manualTrack: {
    title: string
    artist: string
    isrc?: string
    label?: string
    releaseDate?: string
  }
  trackTitle?: string
  artist?: string
  score?: number
}

type ChartSnapshot = {
  week: string
  weekRange: {
    startDate: string
    endDate: string
  }
  entries: ChartEntry[]
  createdAt: string
}

/* ======================================================
   Utilities
====================================================== */

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

/* ======================================================
   Hooks
====================================================== */

const normalizeAndRank: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data) return data

  // Auto-generate week
  if (!data.week && data.publishDate) {
    data.week = getISOWeek(new Date(data.publishDate))
  }

  // Auto-generate slug
  if (data.chartKey && data.week) {
    data.slug = `${data.chartKey}-${data.week}`
  }

  // Normalize entries + drag-to-reorder ranking
  if (Array.isArray(data.entries)) {
    data.entries.forEach((entry: ChartEntry, index: number) => {
      entry.rank = index + 1
      entry.trackTitle = entry.manualTrack.title
      entry.artist = entry.manualTrack.artist
    })
  }

  return data
}

const createSnapshot: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
}) => {
  if (!doc || !previousDoc) return

  if (!previousDoc.week || previousDoc.week === doc.week) return

  const snapshot: ChartSnapshot = {
    week: previousDoc.week,
    weekRange: previousDoc.weekRange,
    entries: previousDoc.entries,
    createdAt: new Date().toISOString(),
  }

  doc.snapshots = [...(doc.snapshots || []), snapshot]
}

/* ======================================================
   Charts Collection
====================================================== */

export const Charts: CollectionConfig = {
  slug: 'charts',

  labels: {
    singular: 'Chart',
    plural: 'Charts',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Music & Programming',
    defaultColumns: [
      'title',
      'chartKey',
      'chartMode',
      'week',
      'status',
      'publishDate',
    ],
  },

  versions: {
    drafts: true,
    maxPerDoc: 100,
  },

  access: {
    read: () => true,
    create: ({ req }) =>
      Boolean(
        req.user?.roles?.includes('editor') ||
        req.user?.roles?.includes('admin')
      ),
    update: ({ req }) =>
      Boolean(
        req.user?.roles?.includes('editor') ||
        req.user?.roles?.includes('admin')
      ),
    delete: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin')),
  },

  hooks: {
    beforeChange: [normalizeAndRank],
    afterChange: [createSnapshot],
  },

  /* ======================================================
     Fields
  ====================================================== */

  fields: [
    /* ================= CORE ================= */

    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'chartKey',
      type: 'select',
      required: true,
      options: [
        { label: 'The HitList', value: 'hitlist' },
        { label: 'R&B & Soul', value: 'rnb-soul' },
        { label: 'Hip-Hop', value: 'hip-hop' },
        { label: 'Southern Soul', value: 'southern-soul' },
        { label: 'Gospel', value: 'gospel' },
      ],
    },

    {
      name: 'chartMode',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Automated', value: 'automated' },
      ],
    },

    {
  name: 'playlist',
  type: 'relationship',
  relationTo: 'playlists',
  required: false,
  admin: {
    description:
      'Optional playlist associated with this chart (editorial or promotional)',
  },
},

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto format: chartKey-week',
      },
    },

    /* ================= STATUS ================= */

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    {
      name: 'publishDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },

    {
      name: 'week',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'ISO week (e.g. 2026-W05)',
      },
    },

    /* ================= WEEK RANGE ================= */

    {
      name: 'weekRange',
      type: 'group',
      admin: {
        description: 'Coverage range for this chart',
      },
      fields: [
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date', required: true },
      ],
    },

    /* ================= ENTRIES (MANUAL ONLY) ================= */

    {
      name: 'entries',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Drag to reorder — rank auto-updates',
      },
      fields: [
        {
          name: 'rank',
          type: 'number',
          admin: { readOnly: true },
        },

        {
          name: 'movement',
          type: 'select',
          options: [
            { label: 'Up', value: 'up' },
            { label: 'Down', value: 'down' },
            { label: 'Same', value: 'same' },
            { label: 'New', value: 'new' },
          ],
        },

        {
          name: 'manualTrack',
          label: 'Track Information',
          type: 'group',
          required: true,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'artist', type: 'text', required: true },
            { name: 'isrc', type: 'text' },
            { name: 'label', type: 'text' },
            { name: 'releaseDate', type: 'date' },
          ],
        },

        {
          name: 'trackTitle',
          type: 'text',
          admin: { readOnly: true },
        },

        {
          name: 'artist',
          type: 'text',
          admin: { readOnly: true },
        },

        {
          name: 'score',
          type: 'number',
          admin: {
            description: 'Optional editorial score',
          },
        },
      ],
    },

    /* ================= SNAPSHOTS ================= */

    {
      name: 'snapshots',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Historical weekly snapshots',
      },
      fields: [
        { name: 'week', type: 'text' },
        {
          name: 'weekRange',
          type: 'group',
          fields: [
            { name: 'startDate', type: 'date' },
            { name: 'endDate', type: 'date' },
          ],
        },
        {
          name: 'entries',
          type: 'json',
        },
        { name: 'createdAt', type: 'date' },
      ],
    },
  ],
}
