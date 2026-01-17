// collections/Playlists.ts
import type { CollectionConfig } from 'payload'

export const Playlists: CollectionConfig = {
  slug: 'playlists',

  labels: {
    singular: 'Playlist',
    plural: 'Playlists',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Music & Programming',
    defaultColumns: ['title', 'playlistType', 'status'],
  },

access: {
  read: () => true,

  create: ({ req }) =>
    Boolean(
      req.user?.roles?.some(role =>
        ['editor', 'admin'].includes(role)
      )
    ),

  update: ({ req }) =>
    Boolean(
      req.user?.roles?.some(role =>
        ['editor', 'admin'].includes(role)
      )
    ),

  delete: ({ req }) =>
    Boolean(req.user?.roles?.includes('admin')),
},

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
    },

    {
      name: 'playlistType',
      type: 'select',
      required: true,
      options: [
        { label: 'Chart Playlist', value: 'chart' },
        { label: 'Editorial', value: 'editorial' },
        { label: 'Creator Curated', value: 'creator' },
        { label: 'Sponsored', value: 'sponsored' },
      ],
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'tracks',
      type: 'array',
      fields: [
        {
          name: 'track',
          type: 'relationship',
          relationTo: 'mediaTracks',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
        },
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
    },
  ],
}
