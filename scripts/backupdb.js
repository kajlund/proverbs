import { writeFileSync } from "node:fs";
import { dirname } from "node:path";
import path from "node:path";

import { MongoClient } from "mongodb";
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

const uri = process.env.DB_URI;
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME);

async function backupProverbs() {
  log.info(`Backing up proverbs...`);
  try {
    const data = [];
    const fileName = path.join(basePath, "proverbs.json");
    const coll = db.collection("proverbs");
    const cursor = coll.find();
    for await (const doc of cursor) {
      const obj = {
        _id: doc._id,
        title: doc.title,
        author: doc.author,
        content: doc.content,
        description: doc.description,
        lang: doc.lang,
        category: doc.category ? doc.category : doc.group,
        tags: doc.tags || [],
        createdAt: doc.createdAt || doc.updatedAt,
        updatedAt: doc.updatedAt,
      };
      data.push(obj);
    }
    writeFileSync(fileName, JSON.stringify(data, null, 2), { flags: "w" });
    log.info("Backup of collection proverbs completed!");
  } catch (err) {
    log.error(err, "Error backing up collection proverbs");
  }
}

log.info(`Environment: ${process.env.NODE_ENV}`);
try {
  await backupProverbs();
  log.info("Backup done!");
} catch (err) {
  log.error(err);
} finally {
  await client.close();
}
