// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Allow production builds even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ This lets builds succeed despite TS errors — use cautiously
    ignoreBuildErrors: true,
  },
}

export default nextConfig
