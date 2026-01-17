import type { CollectionConfig } from 'payload'

export const PayloadPreferences: CollectionConfig = {
  slug: 'payload-preferences',

  admin: {
    hidden: true,
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  fields: [],
}
