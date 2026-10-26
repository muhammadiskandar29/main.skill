import url from 'node:url';
import { handleApiRequest } from './api-handler.js';

export function apiPlugin() {
  return {
    name: 'monolithic-backend-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Only intercept /api/* routes
        if (!pathname || !pathname.startsWith('/api')) {
          return next();
        }

        return handleApiRequest(req, res);
      });
    }
  };
}
