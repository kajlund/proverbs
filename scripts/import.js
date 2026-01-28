import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import 'dotenv/config';

import { eq } from 'drizzle-orm';

import { getConfig } from '../src/utils/config.js';
import { authors, categories, proverbs } from '../src/db/schemas.js';
import db from '../src/db/index.js';
import { getLogger } from '../src/utils/logger.js';

const cnf = getConfig();
const log = getLogger(cnf);

async function importAuthors() {
  const data = readFileSync(
    join(process.cwd(), 'scripts/export_authors.json'),
    'utf-8',
  );
  const arr = JSON.parse(data);

  for (const item of arr) {
    const [found] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, item.id))
      .limit(1);

    if (!found) {
      await db.insert(authors).values({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    }
  }
}

async function importCategories() {
  const data = readFileSync(
    join(process.cwd(), 'scripts/export_categories.json'),
    'utf-8',
  );
  const arr = JSON.parse(data);

  for (const item of arr) {
    const [found] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, item.id))
      .limit(1);

    if (!found) {
      await db.insert(categories).values({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    }
  }
}

async function importProverbs() {
  const data = readFileSync(
    join(process.cwd(), 'scripts/export_proverbs.json'),
    'utf-8',
  );
  const arr = JSON.parse(data);

  for (const item of arr) {
    const [found] = await db
      .select()
      .from(proverbs)
      .where(eq(proverbs.id, item.id))
      .limit(1);

    if (!found) {
      await db.insert(proverbs).values({
        id: item.id,
        title: item.title,
        authorId: item.authorId,
        content: item.content,
        description: item.description,
        lang: item.lang,
        categoryId: item.categoryId,
        tags: item.tags,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    }
  }
}

async function importData() {
  log.info('Importing data');
  await importAuthors();
  log.info('Imported authors');
  await importCategories();
  log.info('Imported categories');
  await importProverbs();
  log.info('Imported proverbs');
}

importData()
  .then(() => {
    log.info('Import completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    log.error(err);
    process.exit(1);
  });
