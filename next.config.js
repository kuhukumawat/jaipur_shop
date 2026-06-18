/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5000' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },

    ],
  },
}

module.exports = nextConfig
