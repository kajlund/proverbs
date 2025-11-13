import { createServer } from 'node:http';

import { getConfig } from './config.js';
import { getLogger } from './logger.js';
import { getApp } from './app.js';
import { getDatabase } from './db.js';

export async function startServer() {
  const cnf = getConfig();
  const log = getLogger(cnf);
  const db = getDatabase(cnf, log);

  process.on('uncaughtException', async (err) => {
    log.fatal(err, `Uncaught exception: ${err.message}`);
    if (db) await db.disconnect();
    throw err;
  });

  process.on('unhandledRejection', async (reason, p) => {
    log.fatal(p, `Uhandled promise rejection: Reason: ${reason}`);
    if (db) await db.disconnect();
    process.exitCode = 1;
  });

  process.on('SIGINT', async () => {
    log.info('SIGINT received, shutting down...');
    if (db) await db.disconnect();
    process.exitCode = 0;
  });

  log.info('Connecting DB');
  await db.connect();

  log.info('Starting http server');
  const app = getApp(cnf, log);
  const server = createServer(app);
  server.listen(cnf.port, () => {
    log.info(`HTTP server running on port ${cnf.port}`);
  });

  return server;
}
