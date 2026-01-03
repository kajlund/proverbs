import express from 'express';

import { getRootRoutes } from './root.routes.js';
import { getAuthorRoutes } from './author.routes.js';
import { getCategoryRoutes } from './category.routes.js';
import { getProverbRoutes } from './proverb.routes.js';

export function getRouter(cnf, log) {
  const rootRoutes = getRootRoutes();
  const authorRoutes = getAuthorRoutes(cnf, log);
  const categoryRoutes = getCategoryRoutes(cnf, log);
  const proverbRoutes = getProverbRoutes(cnf, log);
  const groups = [rootRoutes, authorRoutes, categoryRoutes, proverbRoutes];
  const router = express.Router();

  groups.forEach(({ group, routes }) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
      log.info(`Route: ${method} ${group.prefix}${path}`);
      router[method](
        group.prefix + path,
        [...(group.middleware || []), ...middleware],
        handler,
      );
    });
  });

  return router;
}
