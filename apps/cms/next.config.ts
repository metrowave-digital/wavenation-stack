import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',

  experimental: {
    // ✅ Correct for Next 15 types
    turbo: {},

    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  webpack: (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),

      // REQUIRED: Payload virtual config
      '@payload-config': path.resolve(
        __dirname,
        'src/payload.config.ts',
      ),
    }

    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
