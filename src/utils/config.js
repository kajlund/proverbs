import { z } from 'zod';

const configSchema = z.strictObject({
  env: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('production'),
  port: z.coerce
    .number()
    .int()
    .positive()
    .gte(80)
    .lte(65000)
    .optional()
    .default(3005),
  logLevel: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .optional()
    .default('info'),
  logHttp: z.coerce.boolean().optional().default(false),
  dbUrl: z.string().trim(),
  dbAuthToken: z.string().trim().optional().default(''),
  accessTokenSecret: z.string().min(30),
  corsOrigin: z.array(z.string()).optional().default(['http://localhost:3005']),
});

function getEnvConfig() {
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL,
    logHttp: process.env.LOG_HTTP,
    dbUrl: process.env.DATABASE_URL,
    dbAuthToken: process.env.DATABASE_AUTH_TOKEN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    corsOrigin: process.env.CORS_ORIGIN?.split(','),
  };
}

export function getConfig(config = {}) {
  const candidate = { ...getEnvConfig(), ...config };
  const result = configSchema.safeParse(candidate);
  if (!result.success) {
    console.log(result.error);
    throw new Error('Configuration faulty');
  }
  const cnf = { ...result.data, isDev: result.data.env === 'development' };
  return cnf;
}
