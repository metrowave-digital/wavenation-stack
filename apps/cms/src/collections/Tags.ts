// apps/cms/src/collections/Tags.ts
import type { CollectionConfig, FieldHook } from 'payload'

/* ======================================================
   Slug Helper
====================================================== */

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

/* ======================================================
   Auto Slug
====================================================== */

const autoSlug: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  const label =
    typeof data?.label === 'string' ? data.label : null

  return label ? slugify(label) : value
}

/* ======================================================
   Collection
====================================================== */

export const Tags: CollectionConfig = {
  slug: 'tags',

  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },

  admin: {
    useAsTitle: 'label',
    group: 'Taxonomy',
    defaultColumns: ['label', 'slug', 'updatedAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Human-readable tag name (e.g. “Southern Soul”)',
      },
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeValidate: [autoSlug],
      },
      admin: {
        description: 'Auto-generated URL-safe identifier',
      },
    },

    {
      name: 'description',
      type: 'textarea',
      admin: {
        description:
          'Optional context for editors and AI classification',
      },
    },

    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Used for trending tags, homepage features, or playlists',
      },
    },
  ],

  timestamps: true,
}

export default Tags
