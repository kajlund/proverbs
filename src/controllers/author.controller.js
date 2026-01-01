import { ApiResponse } from '../utils/api.response.js';
import { asyncHandler } from '../middleware/async.handler.js';
import { getAuthorService } from '../services/author.service.js';
import { codes } from '../utils/status.js';

export function getAuthorController(cnf, log) {
  const svcAuthor = getAuthorService(cnf, log);

  return {
    createAuthor: asyncHandler(async (req, res) => {
      const { payload } = req.locals;
      const author = await svcAuthor.createAuthor(payload);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, author, 'Created Author'));
    }),
    deleteAuthor: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const deleted = await svcAuthor.deleteAuthor(id);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, deleted, 'Deleted Author'));
    }),
    findAuthorById: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const author = await svcAuthor.findAuthorById(id);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, author, 'Found Author'));
    }),
    getAuthorList: asyncHandler(async (req, res) => {
      const authors = await svcAuthor.getAuthorList();
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, authors, 'Authors list'));
    }),
    updateAuthor: asyncHandler(async (req, res) => {
      const { id, payload } = req.locals;
      const updated = await svcAuthor.updateAuthor(id, payload);
      res
        .status(codes.OK)
        .json(
          new ApiResponse(codes.OK, updated, `Updated Author with id: ${id}`),
        );
    }),
  };
}
