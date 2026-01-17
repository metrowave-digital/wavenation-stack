import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

/* ======================================================
   COLLECTION IMPORTS
====================================================== */

import { Users } from './collections/Users'
import { PayloadPreferences } from './collections/PayloadPreferences'

import { Articles } from './collections/Articles'
import { ArticleSeries } from './collections/ArticleSeries'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Subcategories } from './collections/Subcategories'
import { Tags } from './collections/Tags'

import { MediaTracks } from './collections/MediaTracks'
import { Albums } from './collections/Albums'

import { Charts } from './collections/Charts'
import { ChartSnapshots } from './collections/ChartSnapshots'

import { VOD } from './collections/VOD'

import { RadioShows } from './collections/RadioShows'
import { RadioSchedule } from './collections/RadioSchedule'

import { Podcasts } from './collections/Podcasts'
import { Episodes } from './collections/Episodes'
import { Playlists } from './collections/Playlists'

import { Polls } from './collections/Polls'
import { PollVotes } from './collections/PollVotes'

import { Talent } from './collections/Talent'

/* ======================================================
   PATH HELPERS
====================================================== */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* ======================================================
   ENV
====================================================== */

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'http://localhost:3001'

/* ======================================================
   PAYLOAD CONFIG
====================================================== */

export default buildConfig({
  serverURL,

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    /* ===== AUTH & USERS ===== */
    Users,
    PayloadPreferences,

    /* ===== EDITORIAL ===== */
    Articles,
    ArticleSeries,
    Categories,
    Subcategories,
    Tags,

    /* ===== MEDIA ===== */
    Media,
    MediaTracks,
    Albums,

    /* ===== CHARTS ===== */
    Charts,
    ChartSnapshots,

    /* ===== VIDEO ===== */
    VOD,

    /* ===== RADIO ===== */
    RadioShows,
    RadioSchedule,

    /* ===== PODCASTS / EPISODES ===== */
    Podcasts,
    Episodes,

    /* ===== PLAYLISTS ===== */
    Playlists,

    /* ===== PEOPLE ===== */
    Talent,

    /* ===== POLLS ===== */
    Polls,
    PollVotes,
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  sharp,

  /* ======================================================
     R2 / S3 STORAGE (Cloudflare R2 Compatible)
  ====================================================== */

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },

      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId:
            process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey:
            process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle:
          process.env.S3_FORCE_PATH_STYLE === 'true',
      },
    }),
  ],

  graphQL: {
    disable: true,
    disablePlaygroundInProduction:true,
  },
})
