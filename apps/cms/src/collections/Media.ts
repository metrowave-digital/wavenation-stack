import type { CollectionConfig } from 'payload'

type UploadMeta = {
  crop?: unknown
  focalPoint?: unknown
}

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    group: 'Media',
    description:
      'Images, audio, and video assets used across WaveNation platforms.',
  },

  /**
   * ✅ REQUIRED: allow public read
   * Does NOT affect uploads, edits, or admin access
   */
  access: {
    read: () => true,
  },

  /**
   * Upload configuration
   */
  upload: {
    staticDir: 'media',

    mimeTypes: [
      'image/*',
      'audio/*',
      'video/*',
    ],

    imageSizes: [
      { name: 'hero', width: 1600 },
      { name: 'card', width: 800 },
      { name: 'thumb', width: 400 },
      {
        name: 'square',
        width: 600,
        height: 600,
        crop: 'center',
      },
    ],
  },

  /**
   * Hooks
   */
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data && typeof data === 'object') {
          const mutableData = data as UploadMeta

          if ('crop' in mutableData) delete mutableData.crop
          if ('focalPoint' in mutableData) delete mutableData.focalPoint
        }
        return data
      },
    ],
  },

  /**
   * Metadata fields
   */
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption',
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Image / Media Credit',
    },
  ],
}
