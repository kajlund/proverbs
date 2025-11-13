import path from 'node:path';

import express from 'express';
import flash from 'express-flash';
import { rateLimit } from 'express-rate-limit';
import sessions from 'express-session';
import { Liquid } from 'liquidjs';
import httpLogger from 'pino-http';

import { getRouter } from './router.js';
import { getErrorHandler } from './middleware/errorhandler.js';
import { getNotFoundHandler } from './middleware/notfoundhandler.js';

const oneDay = 1000 * 60 * 60 * 24;

export function getApp(cnf, log) {
  const app = express();

  // Add middleware
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.json({ limit: '1000kb' }));
  app.use(express.urlencoded({ extended: false }));

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

  // Session handling
  app.use(
    sessions({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: oneDay,
        secure: 'auto',
      },
    }),
  );

  app.use(flash());

  // Set view engine
  const engine = new Liquid({
    cache: process.env.NODE_ENV !== 'development',
    root: path.join(process.cwd(), 'views'),
    layouts: path.join(process.cwd(), 'views/layouts'),
    partials: path.join(process.cwd(), 'views/partials'),
    extname: '.liquid',
  });

  app.engine('liquid', engine.express()); // register liquid engine
  app.set('view engine', 'liquid'); // set as default

  // Add routes
  app.use(getRouter(log));

  // Add 404 handler
  app.use(getNotFoundHandler());

  // Add Generic Error handler
  app.use(getErrorHandler(log));

  return app;
}
