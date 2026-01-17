import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,

  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['email', 'roles', 'createdAt'],
  },

  /* ======================================================
     Access Control
  ====================================================== */

  access: {
    /**
     * READ
     * - Admins: read all
     * - Logged-in users: list access (required for admin UI + relationships)
     * - Users: read their own profile
     */
    read: ({ req, id }) => {
      if (!req.user) return false

      // Admins can read all users
      if (req.user.roles?.includes('admin')) {
        return true
      }

      // Allow list access (admin UI, relationship fields)
      if (!id) {
        return true
      }

      // Allow users to read their own record
      return String(req.user.id) === String(id)
    },

    /**
     * CREATE
     * - Allow bootstrap + programmatic creation
     * - You can lock this down later if needed
     */
    create: () => true,

    /**
     * UPDATE
     * - Admins can update any user
     * - Users can update themselves (avatar, displayName, etc.)
     */
    update: ({ req, id }) => {
      if (!req.user) return false

      if (req.user.roles?.includes('admin')) {
        return true
      }

      return String(req.user.id) === String(id)
    },

    /**
     * DELETE
     * - Admin only
     */
    delete: ({ req }) =>
      Boolean(
        req.user &&
          req.user.roles?.includes('admin')
      ),
  },

  /* ======================================================
     Fields
  ====================================================== */

  fields: [
    /* ===============================
       Roles & Identity
    =============================== */

    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['listener'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'DJ / Host', value: 'talent' },
        { label: 'Creator', value: 'creator' },
        { label: 'Listener', value: 'listener' },
      ],
    },

    {
      name: 'displayName',
      type: 'text',
      admin: {
        description:
          'Public-facing name used across the platform.',
      },
    },

    /* ===============================
       Avatar
    =============================== */

    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Square image recommended. Used for profile and bylines.',
      },
    },

    /* ===============================
       Subscription
    =============================== */

    {
      name: 'subscription',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'WaveNation+', value: 'premium' },
      ],
      defaultValue: 'free',
    },

    /* ===============================
       Creator Profile (Conditional)
    =============================== */

    {
      name: 'creatorProfile',
      type: 'group',
      admin: {
        condition: (_, data) =>
          data?.roles?.includes('creator'),
      },
      fields: [
        {
          name: 'payoutEmail',
          type: 'email',
          admin: {
            description:
              'Email used for creator payouts.',
          },
        },
        {
          name: 'bio',
          type: 'textarea',
          maxLength: 500,
        },
      ],
    },
  ],
}

export default Users
