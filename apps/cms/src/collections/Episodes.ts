import type { CollectionConfig } from 'payload'

export const Episodes: CollectionConfig = {
  slug: 'episodes',
  labels: {
    singular: 'Episode',
    plural: 'Episodes',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Audio & Episodes',
    defaultColumns: [
      'title',
      'episodeType',
      'podcast',
      'status',
      'publishDate',
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
      name: 'episodeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Podcast Episode', value: 'podcast' },
        { label: 'Radio Replay', value: 'radio' },
        { label: 'Special', value: 'special' },
      ],
    },

    {
      name: 'podcast',
      type: 'relationship',
      relationTo: 'podcasts',
      admin: {
        condition: (_, data) =>
          data?.episodeType === 'podcast',
      },
    },

    {
      name: 'radioShow',
      type: 'relationship',
      relationTo: 'radioShows',
      admin: {
        condition: (_, data) =>
          data?.episodeType === 'radio',
      },
    },

    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'hasVideo',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'vod',
      type: 'relationship',
      relationTo: 'vod',
      admin: {
        condition: (_, data) => data?.hasVideo === true,
      },
    },

    { name: 'description', type: 'textarea' },
    { name: 'duration', type: 'number' },

    {
      name: 'hosts',
      type: 'relationship',
      relationTo: 'talent',
      hasMany: true,
    },

    { name: 'isExplicit', type: 'checkbox', defaultValue: false },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },

    {
      name: 'distribution',
      type: 'group',
      fields: [
        { name: 'podcastPlatforms', type: 'checkbox', defaultValue: true },
        { name: 'radioReplay', type: 'checkbox' },
        { name: 'web', type: 'checkbox', defaultValue: true },
        { name: 'mobile', type: 'checkbox', defaultValue: true },
        { name: 'tv', type: 'checkbox' },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },

    {
      name: 'publishDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
