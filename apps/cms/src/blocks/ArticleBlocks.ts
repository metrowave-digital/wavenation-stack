import type { Block } from 'payload'

/* ======================================================
   Rich Text Block
====================================================== */

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}

/* ======================================================
   Image Block
====================================================== */

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'credit',
      type: 'text',
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

/* ======================================================
   Gallery Block
====================================================== */

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}

/* ======================================================
   Pull Quote Block
====================================================== */

export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  labels: {
    singular: 'Pull Quote',
    plural: 'Pull Quotes',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
    },
  ],
}

/* ======================================================
   Video Block
====================================================== */

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'MP4 Upload', value: 'upload' },
      ],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, data) =>
          data?.provider !== 'upload',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, data) =>
          data?.provider === 'upload',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}

/* ======================================================
   Audio Block
====================================================== */

export const AudioBlock: Block = {
  slug: 'audio',
  labels: {
    singular: 'Audio',
    plural: 'Audio',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'showName',
      type: 'text',
    },
  ],
}

/* ======================================================
   Embed Block
====================================================== */

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: {
    singular: 'Embed',
    plural: 'Embeds',
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'X / Twitter', value: 'twitter' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
    },
  ],
}

/* ======================================================
   Artist Spotlight Block
====================================================== */

export const ArtistSpotlightBlock: Block = {
  slug: 'artistSpotlight',
  labels: {
    singular: 'Artist Spotlight',
    plural: 'Artist Spotlights',
  },
  fields: [
    {
      name: 'artistName',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

/* ======================================================
   Related Articles Block
====================================================== */

export const RelatedArticlesBlock: Block = {
  slug: 'relatedArticles',
  labels: {
    singular: 'Related Articles',
    plural: 'Related Articles',
  },
  fields: [
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },
  ],
}

/* ======================================================
   CTA Block
====================================================== */

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call To Action',
    plural: 'Calls To Action',
  },
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'buttonLabel',
      type: 'text',
    },
    {
      name: 'buttonUrl',
      type: 'text',
    },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
      defaultValue: 'primary',
    },
  ],
}

/* ======================================================
   Divider Block
====================================================== */

export const DividerBlock: Block = {
  slug: 'divider',
  labels: {
    singular: 'Divider',
    plural: 'Dividers',
  },
  fields: [],
}

/* ======================================================
   Question Block
====================================================== */

export const InterviewQuestionBlock: Block = {
  slug: 'interviewQuestion',
  labels: {
    singular: 'Interview Question',
    plural: 'Interview Questions',
  },
  fields: [
    {
      name: 'question',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The interviewer’s question.',
      },
    },
    {
      name: 'askedBy',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional interviewer name or role.',
      },
    },
  ],
}

/* ======================================================
   Answer Block
====================================================== */

export const InterviewAnswerBlock: Block = {
  slug: 'interviewAnswer',
  labels: {
    singular: 'Interview Answer',
    plural: 'Interview Answers',
  },
  fields: [
    {
      name: 'answer',
      type: 'richText',
      required: true,
      admin: {
        description: 'The interviewee’s response.',
      },
    },
    {
      name: 'answeredBy',
      type: 'text',
      required: false,
      admin: {
        description:
          'Interviewee name (useful for multi-guest interviews).',
      },
    },
    {
      name: 'highlight',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Mark this answer as a highlight for pull quotes or summaries.',
      },
    },
  ],
}

/* ======================================================
   Timeline Block
====================================================== */

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Timeline',
    plural: 'Timelines',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional heading for the timeline.',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      admin: {
        description:
          'Chronological sequence of events or milestones.',
      },
      fields: [
        {
          name: 'date',
          type: 'text',
          required: false,
          admin: {
            description:
              'Date or time label (e.g. “2018”, “March 2024”, “Day 3”).',
          },
        },
        {
          name: 'headline',
          type: 'text',
          required: true,
          admin: {
            description: 'Short title for this moment.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'link',
          type: 'text',
          required: false,
          admin: {
            description:
              'Optional link to a related article or source.',
          },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Marks this moment as a key highlight.',
          },
        },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical (default)', value: 'vertical' },
        { label: 'Horizontal (scroll)', value: 'horizontal' },
        { label: 'Compact', value: 'compact' },
      ],
      admin: {
        description:
          'Visual presentation hint for frontend rendering.',
      },
    },
  ],
}

