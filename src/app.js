import path from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { rateLimit } from 'express-rate-limit';
import httpLogger from 'pino-http';

import { getRouter } from './routes/index.js';
import { getErrorHandler } from './middleware/error.handler.js';
import { getNotFoundHandler } from './middleware/notfound.handler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getApp(cnf, log) {
  const app = express();

  // Add middleware
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: cnf.corsOrigin,
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
      exposedHeaders: ['set-cookie'],
    }),
  );

  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 1000, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  });

  app.use(limiter); // Apply the rate limiting middleware to all requests

  // Logging Middleware
  if (cnf.logHttp) {
    app.use(httpLogger({ logger: log }));
  }

  // Add API routes
  app.use(getRouter(cnf, log));

  const publicPath = path.join(__dirname, '..', 'public');
  app.use(express.static(publicPath));
  // The Catch-all route
  app.use((req, res, next) => {
    // We only want to fallback for GET requests (page loads)
    if (req.method === 'GET' && req.accepts('html')) {
      return res.sendFile(path.join(publicPath, 'index.html'));
    }
    next(); // Let Express handle 404s for JSON/API requests
  });

  // Add 404 handler
  app.use(getNotFoundHandler());

  // Add Generic Error handler
  app.use(getErrorHandler(log));

  return app;
}
