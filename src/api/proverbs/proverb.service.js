// import Proverb from "./proverb.model.js";
import { getLogger } from "../../logger.js";
import { getDAO } from "../../dao.js";

export function getProverbService(opts = { log: getLogger(), dao: getDAO("proverbs") }) {
  const { log, dao } = opts;

  return {
    createProverb: async (data) => {
      log.debug(data, "Creating new proverb:");
      const created = await dao.createOne(data);
      return created;
    },
    deleteProverb: async (id) => {
      log.debug(`Deleting proverb ${id}`);
      const deleted = await dao.deleteOne(id);
      return deleted;
    },
    findProverbById: async (id) => {
      log.debug(`Finding proverb ${id}`);
      const found = await dao.findById(id);
      return found;
    },
    queryProverbs: async (query) => {
      const { title } = query;
      const qry = {};
      if (title) {
        qry.title = { $regex: title, $options: "i" };
      }
      log.debug({ qry }, "Querying proverbs:");
      const proverbs = await dao.findMany(qry);
      const cnt = await dao.count();
      log.info(`Number of documents ${cnt}`);
      return proverbs;
    },
    updateProverb: async (id, data) => {
      log.debug(data, `Updating proverb ${id}`);
      const updated = await dao.updateOne(id, data);
      return updated;
    },
  };
}
