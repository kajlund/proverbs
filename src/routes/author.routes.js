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
      middleware: [],
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
        middleware: [isAuthenticated, isAdmin, validateBody(authorSchema)],
        handler: hnd.createAuthor,
      },
      {
        method: 'put',
        path: '/:id',
        middleware: [
          isAuthenticated,
          isAdmin,
          validateIdParam,
          validateBody(authorSchema),
        ],
        handler: hnd.updateAuthor,
      },
      {
        method: 'delete',
        path: '/:id',
        middleware: [isAuthenticated, isAdmin, validateIdParam],
        handler: hnd.deleteAuthor,
      },
    ],
  };
}
