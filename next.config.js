const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  output: 'export',
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      // 2024-06-24: Moved a series of "overview" pages under /platform
      {
        source: '/devices',
        destination: '/platform/devices',
        permanent: true,
      },
      {
        source: '/devices/overview',
        destination: '/platform/devices',
        permanent: true,
      },
      {
        source: '/apis',
        destination: '/platform/apis',
        permanent: true,
      },
      {
        source: '/apis/overview',
        destination: '/platform/apis',
        permanent: true,
      },
      {
        source: '/apps',
        destination: '/platform/apps',
        permanent: true,
      },
      {
        source: '/apps/overview',
        destination: '/platform/apps',
        permanent: true,
      },
      // 2024-06-24: Moved "technology" to "terminology"
      {
        source: '/platform/technology/:path*',
        destination: '/platform/terminology/:path*',
        permanent: true,
      },
    ]
  },
})
