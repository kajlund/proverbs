import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import 'dotenv/config';

import { getConfig } from '../src/utils/config.js';
import { authors, categories, proverbs } from '../src/db/schemas.js';
import db from '../src/db/index.js';
import { getLogger } from '../src/utils/logger.js';

const cnf = getConfig();
const log = getLogger(cnf);

async function exportAuthors() {
  const list = await db.select().from(authors).orderBy(authors.name);
  const data = JSON.stringify(list, null, 2);
  writeFileSync(
    join(process.cwd(), 'scripts/export_authors.json'),
    data,
    'utf-8',
  );
  log.info(`Exported ${list.length} authors`);
}

async function exportCategories() {
  const list = await db.select().from(categories).orderBy(categories.name);
  const data = JSON.stringify(list, null, 2);
  writeFileSync(
    join(process.cwd(), 'scripts/export_categories.json'),
    data,
    'utf-8',
  );
  log.info(`Exported ${list.length} categories`);
}

async function exportProverbs() {
  const list = await db.select().from(proverbs).orderBy(proverbs.id);
  const data = JSON.stringify(list, null, 2);
  writeFileSync(
    join(process.cwd(), 'scripts/export_proverbs.json'),
    data,
    'utf-8',
  );
  log.info(`Exported ${list.length} proverbs`);
}

async function exportData() {
  log.info('Exporting data');
  await exportAuthors();
  await exportCategories();
  await exportProverbs();
}

exportData().catch((err) => log.error(err));
