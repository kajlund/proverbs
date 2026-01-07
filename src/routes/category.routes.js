import { getCategoryController } from '../controllers/category.controller.js';
import { getAuthMiddleware } from '../middleware/auth.middleware.js';
import {
  categorySchema,
  validateBody,
  validateIdParam,
} from '../middleware/validation.middleware.js';

export function getCategoryRoutes(cnf, log) {
  const hnd = getCategoryController(cnf, log);
  const { isAuthenticated, checkRole } = getAuthMiddleware(cnf, log);
  const isAdmin = checkRole('ADMIN');

  return {
    group: {
      prefix: '/api/v1/categories',
      middleware: [isAuthenticated, isAdmin],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: hnd.getCategoryList,
      },
      {
        method: 'get',
        path: '/:id',
        middleware: [validateIdParam],
        handler: hnd.findCategoryById,
      },
      {
        method: 'post',
        path: '/',
        middleware: [validateBody(categorySchema)],
        handler: hnd.createCategory,
      },
      {
        method: 'put',
        path: '/:id',
        middleware: [validateIdParam, validateBody(categorySchema)],
        handler: hnd.updateCategory,
      },
      {
        method: 'delete',
        path: '/:id',
        middleware: [validateIdParam],
        handler: hnd.deleteCategory,
      },
    ],
  };
}
