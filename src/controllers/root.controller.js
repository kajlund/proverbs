import { asyncHandler } from '../middleware/async.handler.js';
import { ApiResponse } from '../utils/api.response.js';
import { codes } from '../utils/status.js';

export function getRootController() {
  return {
    getServerHealth: asyncHandler(async (req, res) => {
      res
        .status(codes.OK)
        .json(new ApiResponse(200, { message: 'OK' }, 'Status OK'));
    }),
  };
}
