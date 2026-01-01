import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../utils/api.error.js';
import { getCategoryDAO } from '../db/category.dao.js';

export const getCategoryService = (cnf, log) => {
  const dao = getCategoryDAO(log);

  return {
    createCategory: async (payload) => {
      // Check duplicate
      const category = await dao.findByName(payload.name);
      if (category)
        throw new ConflictError(`Category ${payload.name} already exists`);

      const created = await dao.create(payload);
      if (!created)
        throw new InternalServerError('Failed trying to create Category');
      return created;
    },
    deleteCategory: async (id) => {
      const deleted = await dao.destroy(id);
      if (!deleted)
        throw new InternalServerError(`Failed deleting Category with id ${id}`);
      return deleted;
    },
    findCategoryById: async (id) => {
      const found = await dao.findById(id);
      if (!found)
        throw new NotFoundError(`Category with id ${id} was not found`);
      return found;
    },
    getCategoryList: async () => {
      const data = await dao.findAll();
      return data;
    },
    updateCategory: async (id, payload) => {
      const updated = await dao.update(id, payload);
      if (!updated)
        throw new InternalServerError(`Failed updating Category with id ${id}`);
      return updated;
    },
  };
};
