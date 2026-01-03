import { getProverbController } from '../controllers/proverb.controller.js';
import {
  proverbSchema,
  validateBody,
  validateIdParam,
} from '../middleware/validation.middleware.js';

export function getProverbRoutes(cnf, log) {
  const hnd = getProverbController(cnf, log);

  return {
    group: {
      prefix: '/api/v1/proverbs',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [], //isAuthenticated, requireAdmin
        handler: hnd.getProverbList,
      },
      {
        method: 'get',
        path: '/:id',
        middleware: [validateIdParam], //isAuthenticated, requireAdmin
        handler: hnd.findProverbById,
      },
      {
        method: 'post',
        path: '/',
        middleware: [validateBody(proverbSchema)], //isAuthenticated, requireAdmin
        handler: hnd.createProverb,
      },
      {
        method: 'put',
        path: '/:id',
        middleware: [validateIdParam, validateBody(proverbSchema)], //isAuthenticated, requireAdmin
        handler: hnd.updateProverb,
      },
      {
        method: 'delete',
        path: '/:id',
        middleware: [validateIdParam], // isAuthenticated, requireAdmin,
        handler: hnd.deleteProverb,
      },
    ],
  };
}
