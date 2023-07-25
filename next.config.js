const withMarkdoc = require('@markdoc/next.js');

module.exports =
  withMarkdoc(/* config: https://markdoc.io/docs/nextjs#options */)({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdoc'],
    // https://nextjs.org/docs/messages/next-image-unconfigured-host
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lightbug.io',
          port: '',
          pathname: '/images/**',
        },
      ],
    }
  });
