import { getAuthorController } from '../controllers/author.controller.js';
import {
  authorSchema,
  validateBody,
  validateIdParam,
} from '../middleware/validation.middleware.js';

export function getAuthorRoutes(cnf, log) {
  const hnd = getAuthorController(cnf, log);

  return {
    group: {
      prefix: '/api/v1/authors',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [], //isAuthenticated, requireAdmin
        handler: hnd.getAuthorList,
      },
      {
        method: 'get',
        path: '/:id',
        middleware: [validateIdParam], //isAuthenticated, requireAdmin
        handler: hnd.findAuthorById,
      },
      {
        method: 'post',
        path: '/',
        middleware: [validateBody(authorSchema)], //isAuthenticated, requireAdmin
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
        middleware: [validateIdParam], // isAuthenticated, requireAdmin,
        handler: hnd.deleteAuthor,
      },
    ],
  };
}
