import { getProverbController } from '../controllers/proverb.controller.js';
// import { getAuthMiddleware } from '../middleware/auth.middleware.js';
import {
  proverbSchema,
  qryLngCatSchema,
  validateBody,
  validateIdParam,
  validateQuery,
} from '../middleware/validation.middleware.js';

export function getProverbRoutes(cnf, log) {
  const hnd = getProverbController(cnf, log);
  // const { isAuthenticated, checkRole } = getAuthMiddleware(cnf, log);
  // const isAdmin = checkRole('ADMIN');

  return {
    group: {
      prefix: '/api/v1/proverbs',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [], //isAuthenticated, isAdmin
        handler: hnd.getProverbList,
      },
      {
        method: 'get',
        path: '/random',
        middleware: [validateQuery(qryLngCatSchema)],
        handler: hnd.getRandomProverb,
      },
      {
        method: 'get',
        path: '/:id',
        middleware: [], //isAuthenticated, isAdmin, validateIdParam
        handler: hnd.findProverbById,
      },
      {
        method: 'post',
        path: '/',
        middleware: [validateBody(proverbSchema)], //isAuthenticated, isAdmin,
        handler: hnd.createProverb,
      },
      {
        method: 'put',
        path: '/:id',
        middleware: [
          // isAuthenticated,
          // isAdmin,
          validateIdParam,
          validateBody(proverbSchema),
        ],
        handler: hnd.updateProverb,
      },
      {
        method: 'delete',
        path: '/:id',
        middleware: [validateIdParam], //isAuthenticated, isAdmin,
        handler: hnd.deleteProverb,
      },
    ],
  };
}
