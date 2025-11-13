import Ajv from 'ajv';

const configSchema = {
  type: 'object',
  properties: {
    env: { type: 'string', enum: ['development', 'production', 'test'] },
    port: { type: 'integer', minimum: 80, maximum: 65535 },
    logLevel: { type: 'string', enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] },
    logHttp: { type: 'boolean' },
    dbConnection: { type: 'string' },
    cookieSecret: { type: 'string' },
    saltRounds: { type: 'number', minimum: 10, maximum: 20 },
    sessionSecret: { type: 'string' },
    sessionExpiresIn: { type: 'integer', minimum: 1000, maximum: 65535 },
  },
  additionalProperties: false,
};

function getDefaultConfig() {
  return {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
    logHttp: process.env.LOG_HTTP === '1',
    dbConnection: process.env.DB_CONNECTION,
    cookieSecret: process.env.COOKIE_SECRET,
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
    sessionSecret: process.env.SESSION_SECRET,
    sessionExpiresIn: parseInt(process.env.SESSION_EXPIRES_IN) || 60000,
  };
}

export function getConfig(config = {}) {
  const cnf = { ...getDefaultConfig(), ...config };
  const ajv = new Ajv({ allErrors: true, useDefaults: true });
  const validate = ajv.compile(configSchema);
  const valid = validate(cnf);
  if (!valid) {
    const errors = validate.errors.map((err) => `${err.instancePath} ${err.message}`).join(', ');
    throw new Error(`Configuration validation error: ${errors}`);
  }
  cnf.isDev = cnf.env === 'development';
  return cnf;
}
