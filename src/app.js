import path from "node:path";

import express from "express";
import httpLogger from "pino-http";

import { NotFoundError } from "./errors.js";
import { errorHandler } from "./middleware/errorhandler.js";
import { getMongoClient } from "./db.js";
import { getRoutes } from "./api/routes.js";

class App {
  constructor(cnf, log, db) {
    this.cnf = cnf;
    this.log = log;
    this.db = db;
    this.app = express();
    this.router = express.Router();
  }

  #addGroups(groups, prefix = "") {
    groups.forEach(({ group, routes }) => {
      routes.forEach(({ method, path, middleware = [], handler }) => {
        this.log.info(`Route: ${method} ${prefix}${group.prefix}${path}`);
        this.router[method](prefix + group.prefix + path, [...(group.middleware || []), ...middleware], handler);
      });
    });
  }

  async #connectDB() {
    await this.db.connect();
  }
  async #disconnectDB() {
    await this.db.disconnect();
  }

  #setupMiddleware() {
    this.app.disable("x-powered-by");
    this.app.set("trust proxy", 1); // trust first proxy
    this.app.use(express.json({ limit: "1000kb" }));
    this.app.use(express.urlencoded({ extended: false }));
    // Serve public
    // this.app.use(express.static(path.join(process.cwd(), "public")));
    if (this.cnf.LOG_HTTP) {
      this.app.use(httpLogger({ logger: this.log }));
    }
  }

  #attachRoutes(routes) {
    this.#addGroups(routes);
    this.app.use(this.router);
    // Add 404 handler
    this.app.use((req, _res, next) => {
      next(new NotFoundError(`Route ${req.originalUrl} was not found`));
    });

    // Add Generic Error handler
    this.app.use(errorHandler);
  }

  initialize() {
    this.#setupMiddleware();

    // Initialize routes
    this.#attachRoutes([getRoutes()]);
  }

  async start() {
    this.log.info(`Environment: ${this.cnf.NODE_ENV}`);
    this.log.info("Starting server...");
    await this.#connectDB();
    this.app.listen(this.cnf.PORT, () => {
      this.log.info(`Server running on port ${this.cnf.PORT}`);
    });
  }

  async stop() {
    await this.#disconnectDB();
    this.log.info("Server stopped");
  }
}

export class AppBuilder {
  #cnf;
  #log;
  #db;

  withConfig(cnf) {
    this.#cnf = cnf;
    return this;
  }

  withLogger(log) {
    this.#log = log;
    return this;
  }

  withDBClient() {
    this.#db = getMongoClient();
    return this;
  }

  build() {
    return new App(this.#cnf, this.#log, this.#db);
  }
}
