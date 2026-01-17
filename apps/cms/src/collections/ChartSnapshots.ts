// collections/ChartSnapshots.ts
import type { CollectionConfig } from 'payload'

export const ChartSnapshots: CollectionConfig = {
  slug: 'chart-snapshots',

  admin: {
    useAsTitle: 'label',
    group: 'Music & Programming',
    defaultColumns: ['label', 'chart', 'week', 'createdAt'],
    description:
      'Immutable weekly snapshots used for chart history, movement, and analytics.',
  },

  access: {
    read: () => true,

    create: ({ req }) =>
      Boolean(
        req.user &&
          req.user.roles?.includes('admin')
      ),

    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'chart',
      type: 'relationship',
      relationTo: 'charts',
      required: true,
      index: true,
    },
    {
      name: 'week',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'ISO week or date range (e.g. 2026-W05)',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'entries',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'rank', type: 'number', required: true },
        { name: 'previousRank', type: 'number' },
        {
          name: 'movement',
          type: 'select',
          required: true,
          options: [
            { label: 'Up', value: 'up' },
            { label: 'Down', value: 'down' },
            { label: 'New', value: 'new' },
            { label: 'No Change', value: 'same' },
          ],
        },
        { name: 'trackId', type: 'text', required: true, index: true },
        { name: 'artist', type: 'text' },
        { name: 'finalScore', type: 'number', required: true },
      ],
    },
  ],

  indexes: [
    {
      fields: ['chart', 'week'],
      unique: true,
    },
  ],
}
