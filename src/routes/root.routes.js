import { getRootController } from '../controllers/root.controller.js';

export function getRootRoutes() {
  const hnd = getRootController();

  return {
    group: {
      prefix: '',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/healthz',
        middleware: [],
        handler: hnd.getServerHealth,
      },
    ],
  };
}
