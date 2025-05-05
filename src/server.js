import util from "node:util";

import { getConfig } from "./config.js";
import { getLogger } from "./logger.js";
import { AppBuilder } from "./app.js";

const cnf = getConfig();
const log = getLogger(cnf);
const application = new AppBuilder().withConfig(cnf).withLogger(log).withDBClient().build();

process.on("SIGINT", async () => {
  log.info("SIGINT signal received: closing HTTP server");
  await application.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  log.info("SIGTERM signal received: closing HTTP server");
  await application.stop();
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  log.fatal(`UNCAUGHT EXCEPTION - ${err.stack || err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  log.fatal(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)} reason: ${reason}`);
  process.exit(1);
});

application.initialize();
await application.start();

export default application;
