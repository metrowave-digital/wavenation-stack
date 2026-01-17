import type { CollectionConfig } from 'payload'

export const RadioSchedule: CollectionConfig = {
  slug: 'radioSchedule',
  labels: {
    singular: 'Radio Schedule Entry',
    plural: 'Radio Schedule',
  },

  admin: {
    useAsTitle: 'label',
    group: 'Radio & Programming',
    defaultColumns: [
      'label',
      'scheduleType',
      'startTime',
      'endTime',
      'status',
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
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'scheduleType',
      type: 'select',
      required: true,
      options: [
        { label: 'Recurring', value: 'recurring' },
        { label: 'One-Time', value: 'oneTime' },
        { label: 'Special / Override', value: 'special' },
      ],
    },

    {
      name: 'radioShow',
      type: 'relationship',
      relationTo: 'radioShows',
      required: true,
    },
    {
      name: 'episode',
      type: 'relationship',
      relationTo: 'episodes',
    },
    {
      name: 'chart',
      type: 'relationship',
      relationTo: 'charts',
    },

    {
      name: 'daysOfWeek',
      type: 'select',
      hasMany: true,
      options: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      admin: {
        condition: (_, data) =>
          data?.scheduleType === 'recurring',
      },
    },

    {
      name: 'startDate',
      type: 'date',
      admin: {
        condition: (_, data) =>
          data?.scheduleType !== 'recurring',
      },
    },

    {
      name: 'endDate',
      type: 'date',
      admin: {
        condition: (_, data) =>
          data?.scheduleType === 'special',
      },
    },

    {
      name: 'startTime',
      type: 'text',
      required: true,
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
    },

    {
      name: 'priority',
      type: 'number',
      defaultValue: 1,
    },

    {
      name: 'overrideReason',
      type: 'textarea',
      admin: {
        condition: (_, data) =>
          data?.scheduleType === 'special',
      },
    },

    { name: 'isLive', type: 'checkbox', defaultValue: false },
    { name: 'isReplay', type: 'checkbox', defaultValue: false },
    {
      name: 'isAutomation',
      type: 'checkbox',
      defaultValue: true,
    },

  ],
}
