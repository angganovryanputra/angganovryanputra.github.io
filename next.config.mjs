/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages configuration
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Base path for GitHub Pages (if deploying to a subdirectory)
  basePath: process.env.NODE_ENV === 'production' ? '/cybersec-portfolio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cybersec-portfolio' : '',
  
  // Disable server-side features for static export
  experimental: {
    esmExternals: 'loose',
  },
  
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }
    
    // Handle markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    
    return config
  },
  
  // Environment variables
  env: {
    MEDIUM_USERNAME: process.env.MEDIUM_USERNAME,
    RSS2JSON_API_KEY: process.env.RSS2JSON_API_KEY,
    RSS2JSON_URL: process.env.RSS2JSON_URL,
  },
  
  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/articles',
        permanent: true,
      },
    ]
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // ESLint and TypeScript configurations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
