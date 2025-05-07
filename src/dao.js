import { ObjectId } from "mongodb";
import { BSON } from 'bson';

import { getLogger } from "./logger.js";
import { getMongoClient } from "./db.js";

const client = getMongoClient();

async function getCollection(name) {
  const db = await client.getDB();
  return db.collection(name);
}

export function getDAO(collectionName) {
  const log = getLogger();

  async function findById(id) {
    log.debug(`dao.findById from ${collectionName} with _id: ${id}`);
    const coll = await getCollection(collectionName);

    let objId = id;
    if (typeof objId === 'string') objId = ObjectId.createFromHexString(id);
    const result = await coll.findOne({ _id: objId });
    return result; // Return found document or null
  }

  return {
    count: async (qry = {}) => {
      const coll = await getCollection(collectionName);
      const cnt = await coll.countDocuments(qry); 
      return cnt;
    },
    createOne: async (data) => {
      const timestamp = new Date().toISOString();
      if (!data.createdAt) data.createdAt = timestamp;
      if (!data.updatedAt) data.updatedAt = timestamp;
      log.debug(data, `dao.createOne in ${collectionName}:`);
      const coll = await getCollection(collectionName);
      const result = await coll.insertOne(data);
      log.info(result, "Created");
      if (!result.acknowledged) return null;
      const found = await findById(result.insertedId);
      return found;
    },
    deleteOne: async (id) => {
      log.debug(`dao.deleteOne from ${collectionName} with id ${id}`);
      const coll = await getCollection(collectionName);
      const found = await findById(id);
      if (!found) return null;
      const result = await coll.deleteOne({ _id: ObjectId.createFromHexString(id) });
      log.debug(result, "Deleted");
      if (result.deletedCount > 0) return found;
      return null;
    },
    findById,
    findOne: async (query) => {
      log.debug(query, `dao.findOne in ${collectionName} with query:`);
      const coll = await getCollection(collectionName);
      const result = await coll.findOne(query);
      return result; // Return found document or null
    },
    findMany: async (query = {}) => {
      // , sort = {}, limit = 100, skip = 0
      // const { filter, sort, limit, skip } = query
      // how to handle filter, sort, limit, skip
      const result = [];
      const coll = await getCollection(collectionName);
      log.debug(query, `dao.findMany in ${collectionName} with query:`);
      const cursor = coll.find(query);
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        result.push(doc);
      }
      return result; // Return found documents or empty array
    },
    updateOne: async (id, data) => {
      data.updatedAt = new Date().toISOString();
      log.debug(data, `dao.updateOne in ${collectionName} with id ${id}:`);
      const coll = await getCollection(collectionName);
      const result = await coll.updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: data });
      log.debug(result, "Updated");
      if (result.modifiedCount > 0) {
        const updated = await findById(id);
        return updated;
      }
      return null;
    },
  };
}
