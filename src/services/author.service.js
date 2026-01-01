import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../utils/api.error.js';
import { getAuthorDAO } from '../db/author.dao.js';

export const getAuthorService = (cnf, log) => {
  const dao = getAuthorDAO(log);

  return {
    createAuthor: async (payload) => {
      // Check duplicate
      const author = await dao.findByName(payload.name);
      if (author)
        throw new ConflictError(`Author ${payload.name} is already exists`);

      const created = await dao.create(payload);
      if (!created)
        throw new InternalServerError('Failed trying to create author');
      return created;
    },
    deleteAuthor: async (id) => {
      const deleted = await dao.destroy(id);
      if (!deleted)
        throw new InternalServerError(`Failed deleting author with id ${id}`);
      return deleted;
    },
    findAuthorById: async (id) => {
      const found = await dao.findById(id);
      if (!found) throw new NotFoundError(`Author with id ${id} was not found`);
      return found;
    },
    getAuthorList: async () => {
      const data = await dao.findAll();
      return data;
    },
    updateAuthor: async (id, payload) => {
      const updated = await dao.update(id, payload);
      if (!updated)
        throw new InternalServerError(`Failed updating author with id ${id}`);
      return updated;
    },
  };
};
