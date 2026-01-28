import { ApiResponse } from '../utils/api.response.js';
import { asyncHandler } from '../middleware/async.handler.js';
import { getCategoryService } from '../services/category.service.js';
import { codes } from '../utils/status.js';

export function getCategoryController(cnf, log) {
  const svcCategory = getCategoryService(cnf, log);

  return {
    createCategory: asyncHandler(async (req, res) => {
      const { payload } = req.locals;
      const category = await svcCategory.createCategory(payload);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, category, 'Created Category'));
    }),
    deleteCategory: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const deleted = await svcCategory.deleteCategory(id);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, deleted, `Deleted Category: ${id}`));
    }),
    findCategoryById: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const category = await svcCategory.findCategoryById(id);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, category, `Found Category id: ${id}`));
    }),
    getCategoryList: asyncHandler(async (req, res) => {
      const categories = await svcCategory.getCategoryList();
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, categories, 'Category list'));
    }),
    updateCategory: asyncHandler(async (req, res) => {
      const { id, payload } = req.locals;
      const updated = await svcCategory.updateCategory(id, payload);
      res
        .status(codes.OK)
        .json(
          new ApiResponse(codes.OK, updated, `Updated Category with id: ${id}`),
        );
    }),
  };
}
