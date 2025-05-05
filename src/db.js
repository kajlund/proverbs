import { MongoClient } from "mongodb";

import { getConfig } from "./config.js";
import { getLogger } from "./logger.js";

let client;
let db;

export function getMongoClient(options = { cnf: getConfig(), log: getLogger() }) {
  const { cnf, log } = options;

  async function connect() {
    try {
      if (!client) {
        client = new MongoClient(cnf.DB_URI, { maxPoolSize: 10 });
      }
      if (!client?.topology?.isConnected()) {
        await client.connect();
      }
      if (!db) db = client.db(cnf.DB_NAME);
      log.info("MongoClient connected");
    } catch (err) {
      log.error(err, "MongoDB connection error:");
      throw err;
    }
  }

  async function disconnect() {
    try {
      await client.close();
      log.info("MongoDB connection closed");
      db = null;
    } catch (err) {
      log.error(err, "Error Disconnecting MongoDB:");
      throw err;
    }
  }


  return {
    connect,
    disconnect,
    // getCollection: async (name) => {
    //   await connect();
    //   return db.collection(name);
    // },
    getDB: async () => {
      await connect();
      return db;
    }
  };
}
