import { Codes } from "../../status.js";
import { NotFoundError, InternalServerError } from "../../errors.js";
import { getProverbService } from "./proverb.service.js";

export function getProverbHandler(options = { svc: getProverbService() }) {
  const { svc } = options;

  return {
    createProverb: async (req, res, next) => {
      const { body } = req;
      try {
        const proverb = await svc.createProverb(body);
        if (!proverb) throw new InternalServerError("Failed to create proverb");
        res.status(Codes.OK).json({
          success: true,
          status: Codes.OK,
          message: "Proverb created",
          data: proverb,
        });
      } catch (err) {
        next(err);
      }
    },

    deleteProverb: async (req, res, next) => {
      const { id } = req.params;
      try {
        const proverb = await svc.deleteProverb(id);
        if (!proverb) throw new InternalServerError(`Failed to delete proverb with id ${id}`);
        return res.status(Codes.OK).json({
          success: true,
          status: Codes.OK,
          message: `Deleted proverb ${id}`,
          data: proverb,
        });
      } catch (err) {
        next(err);
      }
    },

    findProverbById: async (req, res, next) => {
      const { id } = req.params;
      try {
        const proverb = await svc.findProverbById(id);
        if (!proverb) throw new NotFoundError(`Proverb with id ${id} not found`);
        return res.status(Codes.OK).json({
          success: true,
          status: Codes.OK,
          message: `Found proverb ${id}`,
          data: proverb,
        });
      } catch (err) {
        next(err);
      }
    },

    queryProverbs: async (req, res, next) => {
      try {
        const proverbs = await svc.queryProverbs(req.query);
        return res.status(Codes.OK).json({
          success: true,
          status: Codes.OK,
          message: `Found ${proverbs.length} proverbs`,
          data: proverbs,
        });
      } catch (err) {
        next(err);
      }
    },

    updateProverb: async (req, res, next) => {
      const { params, body } = req;
      try {
        const proverb = await svc.updateProverb(params.id, body);
        if (!proverb) throw new InternalServerError(`Failed to update proverb with id ${params.id}`);
        return res.status(Codes.OK).json({
          success: true,
          status: Codes.OK,
          message: `Updated proverb ${params.id}`,
          data: proverb,
        });
      } catch (err) {
        next(err);
      }
    },
  };
}
