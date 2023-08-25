/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  async redirects() {
    // https://vercel.com/docs/edge-network/redirects
    return [
      {
        source: '/godmode',
        destination: 'https://github.com/smol-ai/GodMode'
      },
      {
        source: '/gods',
        destination: 'https://github.com/smol-ai/GodMode'
      },
      {
        source: '/god',
        destination: 'https://github.com/smol-ai/GodMode'
      },
      {
        source: '/haus',
        destination: 'https://smolai.netlify.app/haus'
      },
      {
        source: '/house',
        destination: 'https://smolai.netlify.app/haus'
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com'
      }
    ]
  }
}
