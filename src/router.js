import express from 'express';

import { getHomeRoutes } from './home/routes.js';

export function getRouter(log) {
  const homeRoutes = getHomeRoutes();
  const groups = [homeRoutes];
  const router = express.Router();

  groups.forEach(({ group, routes }) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
      log.info(`Route: ${method} ${group.prefix}${path}`);
      router[method](group.prefix + path, [...(group.middleware || []), ...middleware], handler);
    });
  });

  return router;
}
