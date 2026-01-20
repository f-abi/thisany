import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true
    }
  },
  transpilePackages: ['gying', 'shared'],
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        hostname: 'images.weserv.nl'
      },
      {
        hostname: 's.tutu.pm'
      }
    ]
  },
  output: 'standalone'
}

export default nextConfig
