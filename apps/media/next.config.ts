import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true
    }
  },
  transpilePackages: ['gying'],
  images: {
    remotePatterns: [
      {
        hostname: 'images.weserv.nl'
      },
      {
        hostname: 's.tutu.pm'
      }
    ]
  }
}

export default nextConfig
