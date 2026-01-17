import type { CollectionConfig } from 'payload'

export const VOD: CollectionConfig = {
  slug: 'vod',
  labels: {
    singular: 'VOD Item',
    plural: 'VOD Library',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'vodType',
      'visibility',
      'status',
      'publishDate',
      'updatedAt',
    ],
    group: 'Video & TV',
  },

  versions: {
    drafts: true,
    maxPerDoc: 25,
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
    { name: 'slug', type: 'text', unique: true, admin: { position: 'sidebar' } },

    {
      name: 'vodType',
      type: 'select',
      required: true,
      options: [
        { label: 'Episode', value: 'episode' },
        { label: 'Series', value: 'series' },
        { label: 'Film', value: 'film' },
        { label: 'Documentary', value: 'documentary' },
        { label: 'Clip', value: 'clip' },
        { label: 'Live Replay', value: 'liveReplay' },
        { label: 'Special', value: 'special' },
      ],
    },

    {
      name: 'series',
      type: 'relationship',
      relationTo: 'vod',
      admin: {
        condition: (_, data) =>
          ['episode', 'clip'].includes(data?.vodType),
      },
    },
    { name: 'season', type: 'number' },
    { name: 'episodeNumber', type: 'number' },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Under Review', value: 'review' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'WaveNation+ (Premium)', value: 'premium' },
        { label: 'Pay Per View', value: 'ppv' },
        { label: 'Unlisted', value: 'unlisted' },
      ],
    },

    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'trailer',
      type: 'upload',
      relationTo: 'media',
    },

    { name: 'description', type: 'textarea' },
    { name: 'runtime', type: 'number' },
    { name: 'releaseDate', type: 'date' },

    {
      name: 'genres',
      type: 'select',
      hasMany: true,
      options: [
        'Music',
        'Talk',
        'Documentary',
        'Film',
        'Faith',
        'Culture',
        'News',
        'Lifestyle',
        'Comedy',
        'Southern',
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },

    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'WaveNation Original', value: 'original' },
        { label: 'Creator Hub', value: 'creator' },
        { label: 'Partner', value: 'partner' },
        { label: 'Event Capture', value: 'event' },
      ],
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        condition: (_, data) => data?.source === 'creator',
      },
    },

    {
      name: 'rights',
      type: 'group',
      fields: [
        { name: 'rightsHolder', type: 'text' },
        { name: 'territories', type: 'text' },
        { name: 'expiryDate', type: 'date' },
      ],
    },

    {
      name: 'pricing',
      type: 'group',
      admin: {
        condition: (_, data) => data?.visibility === 'ppv',
      },
      fields: [
        { name: 'price', type: 'number' },
        { name: 'currency', type: 'text', defaultValue: 'USD' },
      ],
    },

    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
    { name: 'isTVEligible', type: 'checkbox', defaultValue: true },

    {
      name: 'distribution',
      type: 'group',
      fields: [
        { name: 'web', type: 'checkbox', defaultValue: true },
        { name: 'mobile', type: 'checkbox', defaultValue: true },
        { name: 'tv', type: 'checkbox', defaultValue: true },
      ],
    },

    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'views', type: 'number' },
        { name: 'watchTime', type: 'number' },
        { name: 'completionRate', type: 'number' },
      ],
    },

    {
      name: 'publishDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
