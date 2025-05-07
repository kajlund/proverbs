import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import path from "node:path";

import { MongoClient, ObjectId } from "mongodb";
import pino from "pino";

const log = pino({
  level: process.env.LOG_LEVEL || "trace",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

const basePath = path.join(dirname(new URL(import.meta.url).pathname), "data");
log.info(`Data folder: ${basePath}`);

const proverbsData = JSON.parse(readFileSync(path.join(basePath, "proverbs.json")));
proverbsData.forEach((proverb) => {
  let newId;
  try {
    newId = ObjectId.createFromHexString(proverb._id);
  } catch (err) {
    log.error(err);
  }
  proverb._id = newId;
});

const uri = process.env.DB_URI;
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME);

async function restoreProverbs() {
  const coll = db.collection("proverbs");
  await coll.deleteMany();
  const result = await coll.insertMany(proverbsData);
  log.info(`Successfully inserted ${result.insertedCount} documents.`);
}

log.info(`Environment: ${process.env.NODE_ENV}`);
try {
  await restoreProverbs();
  log.info("Restore done!");
} catch (err) {
  log.error(err);
} finally {
  await client.close();
}
