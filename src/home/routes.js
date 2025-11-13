import { getHomeHandler } from './handlers.js';

export function getHomeRoutes() {
  const hnd = getHomeHandler();

  return {
    group: {
      prefix: '',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: hnd.home,
      },
      {
        method: 'get',
        path: '/about',
        middleware: [],
        handler: hnd.about,
      },
      {
        method: 'get',
        path: '/healthz',
        middleware: [],
        handler: hnd.healthz,
      },
    ],
  };
}
