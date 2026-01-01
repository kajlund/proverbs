import express from 'express';

import { getRootRoutes } from './root.routes.js';

export function getRouter(cnf, log) {
  const rootRoutes = getRootRoutes();
  const groups = [rootRoutes];
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
