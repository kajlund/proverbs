import pino from "pino";

import { getConfig } from "./config.js";

const config = getConfig();

export function getLogger(cnf = config) {
  const logConfig = {
    level: cnf.LOG_LEVEL,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
  };

  // pretty-printing in development mode
  if (!cnf.isProd) {
    logConfig.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    };
  }
  const logger = pino(logConfig);
  return logger;
}
