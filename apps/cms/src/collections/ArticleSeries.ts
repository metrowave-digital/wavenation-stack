// apps/cms/src/collections/ArticleSeries.ts
import type { CollectionConfig } from 'payload'

export const ArticleSeries: CollectionConfig = {
  slug: 'article-series',

  labels: {
    singular: 'Article Series',
    plural: 'Article Series',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Editorial',
    defaultColumns: [
      'title',
      'status',
      'totalArticles',
      'updatedAt',
    ],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    /* ===============================
       Identity
    =============================== */

    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Series title (e.g. “Justice Rides a White Horse”)',
      },
    },

    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle or theme line.',
      },
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'URL-friendly identifier for the series.',
      },
    },

    /* ===============================
       Description
    =============================== */

    {
      name: 'description',
      type: 'textarea',
      admin: {
        description:
          'Overview of the series purpose, scope, or narrative arc.',
      },
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
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Feature this series on landing pages or homepage.',
      },
    },

    /* ===============================
       Series Cover Art
    =============================== */

    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'alt',
          type: 'text',
        },
        {
          name: 'credit',
          type: 'text',
        },
      ],
    },

    /* ===============================
       Articles in Series
    =============================== */

    {
      name: 'articles',
      type: 'array',
      admin: {
        description:
          'Articles included in this series, in reading order.',
      },
      fields: [
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'articles',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          admin: {
            description:
              'Reading order within the series (1, 2, 3…).',
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description:
              'Optional display label (e.g. “Part II”, “Chapter 3”).',
          },
        },
      ],
    },

    /* ===============================
       Derived Metadata
    =============================== */

    {
      name: 'totalArticles',
      type: 'number',
      admin: {
        readOnly: true,
        description:
          'Auto-calculated count of articles in this series.',
      },
    },

    /* ===============================
       Editorial Notes
    =============================== */

    {
      name: 'editorialNotes',
      type: 'array',
      admin: {
        description:
          'Internal notes about the series direction, updates, or changes.',
      },
      fields: [
        {
          name: 'note',
          type: 'textarea',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    /* ===============================
       SEO
    =============================== */

    {
      name: 'seo',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'noIndex',
          type: 'checkbox',
        },
      ],
    },
  ],
}

export default ArticleSeries
