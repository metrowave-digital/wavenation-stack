import type { CollectionConfig } from 'payload'

export const Polls: CollectionConfig = {
  slug: 'polls',

  admin: {
    useAsTitle: 'question',
    group: 'Engagement',
    defaultColumns: [
      'question',
      'status',
      'featureOnHomepage',
      'startDate',
      'endDate',
      'updatedAt',
    ],
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
    /* ===============================
       Core Question
    =============================== */

    {
      name: 'question',
      type: 'text',
      label: 'Poll Question',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Supporting Copy',
      admin: {
        description:
          'Optional context shown under the poll question.',
      },
    },

    /* ===============================
       Poll Options
    =============================== */

    {
      name: 'options',
      type: 'array',
      label: 'Answer Options',
      required: true,
      minRows: 2,
      admin: {
        description:
          'Each option must have a label and a stable slug.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: {
            description:
              'Used internally for voting and results.',
          },
        },
      ],
    },

    /* ===============================
       Status & Visibility
    =============================== */

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Live', value: 'live' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'featureOnHomepage',
      type: 'checkbox',
      label: 'Feature on Homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },

    /* ===============================
       Scheduling
    =============================== */

    {
      name: 'startDate',
      type: 'date',
      label: 'Poll Start Date',
      admin: {
        position: 'sidebar',
        description:
          'Optional. Leave blank to start immediately.',
      },
    },

    {
      name: 'endDate',
      type: 'date',
      label: 'Poll End Date',
      admin: {
        position: 'sidebar',
        description:
          'Optional. Poll auto-closes after this date.',
      },
    },

    /* ===============================
       Editorial / Context
    =============================== */

    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal Notes',
    },

    {
      name: 'context',
      type: 'select',
      label: 'Poll Context',
      options: [
        { label: 'Homepage', value: 'homepage' },
        { label: 'Chart', value: 'chart' },
        { label: 'Radio Show', value: 'show' },
        { label: 'Article', value: 'article' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    /* ===============================
       Relationships
    =============================== */

    {
      name: 'relatedArticle',
      type: 'relationship',
      relationTo: 'articles',
      label: 'Related Article',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.context === 'article',
      },
    },

    {
      name: 'relatedShow',
      type: 'relationship',
      relationTo: 'radioShows',
      label: 'Related Radio Show',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.context === 'show',
      },
    },

    /* ===============================
       Admin-only Results Preview
    =============================== */

    {
      name: 'resultsPreview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/PollResultsPreview',
        },
      },
    },
  ],
}
