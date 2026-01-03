import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../utils/api.error.js';
import { getAuthorDAO } from '../db/author.dao.js';
import { getCategoryDAO } from '../db/category.dao.js';
import { getProverbDAO } from '../db/proverb.dao.js';

export const getProverbService = (cnf, log) => {
  const daoAuthor = getAuthorDAO(log);
  const daoCategory = getCategoryDAO(log);
  const daoProverb = getProverbDAO(log);

  return {
    createProverb: async (payload) => {
      // Validate author & category
      const author = await daoAuthor.findById(payload.authorId);
      if (!author)
        throw new BadRequestError(
          `authorId ${payload.authorId} does not exist`,
        );

      const category = await daoCategory.findById(payload.categoryId);
      if (!category)
        throw new BadRequestError(
          `categoryId ${payload.categoryId} does not exist`,
        );

      const created = await daoProverb.create(payload);
      if (!created)
        throw new InternalServerError('Failed trying to create Proverb');
      return created;
    },
    deleteProverb: async (id) => {
      const found = await daoProverb.findById(id);
      if (!found)
        throw new NotFoundError(`Proverb with id ${id} was not found`);

      const deleted = await daoProverb.destroy(id);
      if (!deleted)
        throw new InternalServerError(`Failed deleting Proverbwith id ${id}`);
      return deleted;
    },
    findProverbById: async (id) => {
      const found = await daoProverb.findById(id);
      if (!found)
        throw new NotFoundError(`Proverb with id ${id} was not found`);
      return found;
    },
    getProverbList: async () => {
      const data = await daoProverb.query();
      return data;
    },
    updateProverb: async (id, payload) => {
      const found = await daoProverb.findById(id);
      if (!found)
        throw new NotFoundError(`Proverb with id ${id} was not found`);

      const updated = await daoProverb.update(id, payload);
      if (!updated)
        throw new InternalServerError(`Failed updating Proverb with id ${id}`);
      return updated;
    },
  };
};
