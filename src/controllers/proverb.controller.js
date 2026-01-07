import { ApiResponse } from '../utils/api.response.js';
import { asyncHandler } from '../middleware/async.handler.js';
import { getProverbService } from '../services/proverb.service.js';
import { codes } from '../utils/status.js';

export function getProverbController(cnf, log) {
  const svcProverb = getProverbService(cnf, log);

  return {
    createProverb: asyncHandler(async (req, res) => {
      const { payload } = req.locals;
      const created = await svcProverb.createProverb(payload);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, created, 'Created Proverb'));
    }),
    deleteProverb: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const deleted = await svcProverb.deleteProverb(id);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, deleted, 'Deleted Proverb'));
    }),
    findProverbById: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const found = await svcProverb.findProverbById(id);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, found, 'Found Proverb'));
    }),
    getProverbList: asyncHandler(async (req, res) => {
      const list = await svcProverb.getProverbList();
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, list, 'Proverb list'));
    }),
    getRandomProverb: asyncHandler(async (req, res) => {
      const { query } = req.locals;
      log.info(query, 'Fetching random:');
      const proverb = await svcProverb.getRandomProverb(query);
      res
        .status(codes.OK)
        .json(new ApiResponse(codes.OK, proverb, 'Fetched Random Proverb'));
    }),
    updateProverb: asyncHandler(async (req, res) => {
      const { id, payload } = req.locals;
      const updated = await svcProverb.updateProverb(id, payload);
      res
        .status(codes.OK)
        .json(
          new ApiResponse(codes.OK, updated, `Updated Proverb with id: ${id}`),
        );
    }),
  };
}
