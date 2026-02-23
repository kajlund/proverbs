import { getAuthController } from '../controllers/auth.controller.js';

export function getAuthRoutes(cnf, log) {
  const hnd = getAuthController(cnf, log);

  return {
    group: {
      prefix: '/auth',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: hnd.checkAuthUser,
      },
    ],
  };
}
