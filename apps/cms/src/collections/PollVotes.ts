import type { CollectionConfig } from 'payload'

export const PollVotes: CollectionConfig = {
  slug: 'pollVotes',

  admin: {
    useAsTitle: 'option',
    group: 'Engagement',
    defaultColumns: ['poll', 'option', 'ipHash', 'createdAt'],
  },

  access: {
    read: () => true,
    create: () => true, // votes come from public API
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
    },
    {
      name: 'option',
      type: 'text',
      required: true,
    },
    {
      name: 'ipHash',
      type: 'text',
      required: true,
    },
  ],

  indexes: [
    {
      fields: ['poll', 'ipHash'],
      unique: true,
    },
  ],
}
