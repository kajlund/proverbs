import { getCategoryController } from '../controllers/category.controller.js';
import {
  categorySchema,
  validateBody,
  validateIdParam,
} from '../middleware/validation.middleware.js';

export function getCategoryRoutes(cnf, log) {
  const hnd = getCategoryController(cnf, log);

  return {
    group: {
      prefix: '/api/v1/categories',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [], //isAuthenticated, requireAdmin
        handler: hnd.getCategoryList,
      },
      {
        method: 'get',
        path: '/:id',
        middleware: [validateIdParam], //isAuthenticated, requireAdmin
        handler: hnd.findCategoryById,
      },
      {
        method: 'post',
        path: '/',
        middleware: [validateBody(categorySchema)], //isAuthenticated, requireAdmin
        handler: hnd.createCategory,
      },
      {
        method: 'put',
        path: '/:id',
        middleware: [validateIdParam, validateBody(categorySchema)], //isAuthenticated, requireAdmin
        handler: hnd.updateCategory,
      },
      {
        method: 'delete',
        path: '/:id',
        middleware: [validateIdParam], // isAuthenticated, requireAdmin,
        handler: hnd.deleteCategory,
      },
    ],
  };
}
