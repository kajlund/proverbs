# Proverbs REST Backend

Project implements a simple REST API service for managing proverbs.

Implemented using Express, MongoDB, JSON schema validation, Pino logger and the Japa testing framework.

Instead of Nodemon the `--watch` flag for restarting the server in development mode is used (Node.js v18+)

The server loads different environment variables depending on environment using the `--env-file` flag.

### Dependencies

- [Ajv JSON schema validator](https://ajv.js.org/)
- [Express.js v4](https://expressjs.com/)
- [MongoDB](https://github.com/mongodb/node-mongodb-native)
- [Pino](https://getpino.io/#/) logging
- [pino-http](https://github.com/pinojs/pino-http#readme)
- [pino-pretty](https://github.com/pinojs/pino-pretty#readme)

### Development Dependencies

- [Eslint](https://eslint.org/)
- [Japa](https://japa.dev/docs/introduction) testing framework
- [Prettier](https://prettier.io/) code formatter
