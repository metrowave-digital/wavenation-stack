import type { CollectionConfig } from 'payload'

export const RadioShows: CollectionConfig = {
  slug: 'radioShows',
  labels: {
    singular: 'Radio Show',
    plural: 'Radio Shows',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Radio & Programming',
    defaultColumns: [
      'title',
      'showType',
      'status',
      'updatedAt',
    ],
  },

  versions: {
    drafts: true,
  },

  access: {
    read: () => true,

    create: ({ req }) =>
      Boolean(
        req.user &&
          (req.user.roles?.includes('editor') ||
           req.user.roles?.includes('admin'))
      ),

    update: ({ req }) =>
      Boolean(
        req.user &&
          (req.user.roles?.includes('editor') ||
           req.user.roles?.includes('admin'))
      ),

    delete: ({ req }) =>
      Boolean(
        req.user &&
          req.user.roles?.includes('admin')
      ),
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'showType',
      type: 'select',
      required: true,
      options: [
        { label: 'Live Show', value: 'live' },
        { label: 'Pre-Recorded', value: 'recorded' },
        { label: 'Syndicated', value: 'syndicated' },
        { label: 'Countdown / Chart', value: 'chart' },
      ],
    },

    {
      name: 'hosts',
      type: 'relationship',
      relationTo: 'talent',
      hasMany: true,
    },

    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'days',
          type: 'select',
          hasMany: true,
          options: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
        },
        { name: 'startTime', type: 'text' },
        { name: 'endTime', type: 'text' },
      ],
    },

    { name: 'description', type: 'textarea' },

    {
  name: 'genres',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'R&B', value: 'rnb' },
    { label: 'Hip-Hop', value: 'hip_hop' },
    { label: 'Southern Soul', value: 'southern_soul' },
    { label: 'Gospel', value: 'gospel' },
    { label: 'Talk', value: 'talk' },
    { label: 'Culture', value: 'culture' },
    { label: 'News', value: 'news' },
  ],
},

    {
      name: 'chart',
      type: 'relationship',
      relationTo: 'charts',
    },

    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
    },

    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
    { name: 'isPodcast', type: 'checkbox', defaultValue: false },

  ],
}
