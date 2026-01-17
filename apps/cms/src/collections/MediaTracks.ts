import type { CollectionConfig } from 'payload'

export const MediaTracks: CollectionConfig = {
  slug: 'mediaTracks',
  labels: {
    singular: 'Track',
    plural: 'Tracks',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'primaryArtist',
      'releaseDate',
      'isIndie',
      'status',
      'updatedAt',
    ],
    group: 'Music & Media',
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
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
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
      name: 'isrc',
      type: 'text',
      unique: true,
    },
    {
      name: 'explicit',
      type: 'checkbox',
      defaultValue: false,
    },

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
      name: 'moods',
      type: 'select',
      hasMany: true,
      options: [
        'Chill',
        'Upbeat',
        'Late Night',
        'Inspirational',
        'Party',
        'Romantic',
        'Reflective',
      ],
    },

    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'rights',
      type: 'group',
      fields: [
        { name: 'rightsHolder', type: 'text' },
        { name: 'publishing', type: 'text' },
        { name: 'territories', type: 'text' },
        { name: 'expiryDate', type: 'date' },
      ],
    },

    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Label Submission', value: 'label' },
        { label: 'Creator Hub', value: 'creator' },
        { label: 'Internal Upload', value: 'internal' },
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
      name: 'isIndie',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isRadioApproved',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isChartEligible',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Under Review', value: 'review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },

    {
      name: 'editorialNotes',
      type: 'textarea',
    },

    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'radioPlays', type: 'number' },
        { name: 'streams', type: 'number' },
        { name: 'listenerVotes', type: 'number' },
      ],
    },

    {
  name: 'album',
  type: 'relationship',
  relationTo: 'albums',
  admin: {
    position: 'sidebar',
    description: 'Album this track belongs to.',
  },
},
  ],
}
