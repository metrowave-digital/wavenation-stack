import type { CollectionConfig } from 'payload'

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  labels: {
    singular: 'Podcast',
    plural: 'Podcasts',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Audio & Podcasts',
    defaultColumns: ['title', 'status', 'updatedAt'],
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

    { name: 'description', type: 'textarea' },

    {
      name: 'hosts',
      type: 'relationship',
      relationTo: 'talent',
      hasMany: true,
    },

    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'distribution',
      type: 'group',
      fields: [
        { name: 'applePodcasts', type: 'checkbox' },
        { name: 'spotify', type: 'checkbox' },
        { name: 'youtube', type: 'checkbox' },
        { name: 'wavenation', type: 'checkbox', defaultValue: true },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
