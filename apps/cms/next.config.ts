import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',

  experimental: {
    // Required for TS compatibility (Next 15)
    turbo: {},

    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  webpack: (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
    }
    return config
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
