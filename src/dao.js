import { ObjectId } from "mongodb";

import { getLogger } from "../logger.js";
import { getMongoClient } from "./db.js";

const client = getMongoClient();

async function getCollection(name) {
  const db = await client.getDB();
  return db.collection(name);
}

export function getDAO(collectionName) {
  const log = getLogger();

  return {
    createOne: async (data) => {
      // if (!data.createdAt) data.createdAt = new Date().toISOString();
      // if (!data.updatedAt) data.updatedAt = data.createdAt;
      log.debug(data, `Creating doc in ${collectionName}:`);
      const coll = await getCollection(collectionName);
      const result = await coll.insertOne(data);
      if (!result.acknowledged) return null;
      const found = await coll.findOne({ _id: result.insertedId });
      log.info(found, "Created");
      return found;
    },
    deleteOne: async (id) => {
      log.debug(`Deleting doc in ${collectionName} with id ${id}`);
      const coll = await getCollection(collectionName);
      const result = await coll.deleteOne({ _id: ObjectId.createFromHexString(id) });
      return result.deletedCount > 0; // Return true if deleted
    },
    findById: async (id) => {
      log.debug(`Finding doc in ${collectionName} with id ${id}`);
      const coll = await getCollection(collectionName);
      const result = await coll.findOne({ _id: ObjectId.createFromHexString(id) });
      return result; // Return found document or null
    },
    findOne: async (query) => {
      log.debug(query, `Finding doc in ${collectionName} with query:`);
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
      log.debug(query, `Finding docs in ${collectionName} with query:`);
      const cursor = coll.find(query);
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        result.push(doc);
      }
      return result; // Return found documents or empty array
    },
    updateOne: async (id, data) => {
      // data.updatedAt = new Date().toISOString();
      log.debug(data, `Updating doc in ${collectionName} with id ${id}:`);
      const coll = await getCollection(collectionName);
      const result = await coll.updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: data });
      return result.modifiedCount > 0; // Return true if updated
    },
  };
}
