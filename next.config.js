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
        permanent: false,
        destination: 'https://github.com/smol-ai/GodMode'
      },
      {
        source: '/gods',
        permanent: false,
        destination: 'https://github.com/smol-ai/GodMode'
      },
      {
        source: '/god',
        permanent: false,
        destination: 'https://github.com/smol-ai/GodMode'
      },
      {
        source: '/haus',
        permanent: false,
        destination: 'https://smolai.netlify.app/haus'
      },
      {
        source: '/house',
        permanent: false,
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
