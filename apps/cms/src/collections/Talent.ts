import type { CollectionConfig } from 'payload'

export const Talent: CollectionConfig = {
  slug: 'talent',
  labels: {
    singular: 'Talent',
    plural: 'Talent',
  },

  admin: {
    useAsTitle: 'displayName',
    group: 'People',
    defaultColumns: ['displayName', 'role', 'updatedAt'],
  },

  access: {
    read: () => true,

    create: ({ req }) =>
      Boolean(
        req.user &&
          req.user.roles?.includes('admin')
      ),

    update: ({ req }) =>
      Boolean(
        req.user &&
          req.user.roles?.includes('admin')
      ),

    delete: ({ req }) =>
      Boolean(
        req.user &&
          req.user.roles?.includes('admin')
      ),
  },

  fields: [
    { name: 'displayName', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Host', value: 'host' },
        { label: 'DJ', value: 'dj' },
        { label: 'Producer', value: 'producer' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Guest', value: 'guest' },
      ],
    },

    { name: 'bio', type: 'textarea' },

    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Link to platform user account (optional)',
      },
    },

    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
  ],
}
