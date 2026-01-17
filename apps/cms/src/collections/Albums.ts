// apps/cms/src/collections/Albums.ts
import type { CollectionConfig } from 'payload'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: {
    singular: 'Album',
    plural: 'Albums',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'primaryArtist',
      'releaseDate',
      'status',
      'updatedAt',
    ],
    group: 'Music & Media',
  },

  access: {
    read: () => true,
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
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
      name: 'primaryArtist',
      type: 'text',
      required: true,
    },

    {
      name: 'featuredArtists',
      type: 'array',
      fields: [{ name: 'name', type: 'text' }],
    },

    {
      name: 'releaseDate',
      type: 'date',
    },

    {
      name: 'label',
      type: 'text',
    },

    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    /* ===============================
       TRACK RELATIONSHIP
       (AUTO + MANUAL SUPPORT)
    =============================== */

    {
      name: 'tracks',
      type: 'relationship',
      relationTo: 'mediaTracks',
      hasMany: true,
      admin: {
        description:
          'Tracks associated with this album. You may manually add tracks or rely on auto-association.',
      },
    },

    {
      name: 'manualTracks',
      type: 'array',
      admin: {
        description:
          'Optional manual track list for unreleased or external tracks.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'artist', type: 'text' },
        { name: 'duration', type: 'text' },
        { name: 'isExplicit', type: 'checkbox' },
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
      name: 'editorialNotes',
      type: 'textarea',
    },

    {
  name: 'isFeaturedRelease',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'Highlights this album in the homepage Featured Release slot.',
  },
},
  ],
}
