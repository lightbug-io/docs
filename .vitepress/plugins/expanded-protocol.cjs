const { readExpandedProtocol, expandedProtocolFilename } = require('../../utils/expanded-protocol.cjs');

// Production uses VitePress's buildEnd hook. Serve the same export directly
// from the canonical source in development, without an intermediate file.
module.exports = function expandedProtocolPlugin(sourcePath, base = '/') {
  const downloadPath = `${base.replace(/\/$/, '')}/files/${expandedProtocolFilename}`;
  return {
    name: 'expanded-protocol-download',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!['GET', 'HEAD'].includes(request.method) || request.url?.split('?')[0] !== downloadPath) return next();
        try {
          const source = readExpandedProtocol(sourcePath);
          response.setHeader('Content-Type', 'application/yaml; charset=utf-8');
          response.setHeader('Cache-Control', 'no-cache');
          response.end(request.method === 'HEAD' ? undefined : source);
        } catch (error) {
          next(error);
        }
      });
    },
  };
};
