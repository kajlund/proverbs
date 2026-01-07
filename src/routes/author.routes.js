import { getAuthorController } from '../controllers/author.controller.js';
import { getAuthMiddleware } from '../middleware/auth.middleware.js';
import {
  authorSchema,
  validateBody,
  validateIdParam,
} from '../middleware/validation.middleware.js';

export function getAuthorRoutes(cnf, log) {
  const hnd = getAuthorController(cnf, log);
  const { isAuthenticated, checkRole } = getAuthMiddleware(cnf, log);
  const isAdmin = checkRole('ADMIN');

  return {
    group: {
      prefix: '/api/v1/authors',
      middleware: [isAuthenticated, isAdmin],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: hnd.getAuthorList,
      },
      {
        method: 'get',
        path: '/:id',
        middleware: [validateIdParam],
        handler: hnd.findAuthorById,
      },
      {
        method: 'post',
        path: '/',
        middleware: [validateBody(authorSchema)],
        handler: hnd.createAuthor,
      },
      {
        method: 'put',
        path: '/:id',
        middleware: [validateIdParam, validateBody(authorSchema)], //isAuthenticated, requireAdmin
        handler: hnd.updateAuthor,
      },
      {
        method: 'delete',
        path: '/:id',
        middleware: [validateIdParam],
        handler: hnd.deleteAuthor,
      },
    ],
  };
}
