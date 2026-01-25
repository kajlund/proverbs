import 'dotenv/config';

import { startServer } from './server.js';

import 'dotenv/config';
console.log('--- DEBUG START ---');
console.log('Process CWD:', process.cwd());
console.log(
  'DB URL from Env:',
  process.env.DATABASE_URL ? 'FOUND (check credentials)' : 'NOT FOUND',
);
// DO NOT LOG THE FULL PASSWORD, just the first 10 chars to see if it matches your real one
console.log('URL Hint:', process.env.DATABASE_URL?.substring(0, 20));
console.log('--- DEBUG END ---');

startServer();
