// @ts-nocheck
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path'
import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Mixed-Next monorepo note:
 * Force the config to `unknown` so TS cannot infer NextConfig from a different
 * Next version elsewhere in the workspace.
 */
const nextConfig = {
  output: 'standalone',

  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  webpack: (config: any) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
    }

    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },
} as unknown

export default withPayload(nextConfig as any, {
  devBundleServerPackages: false,
})
