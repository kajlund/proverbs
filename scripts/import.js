import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { eq } from 'drizzle-orm';

import { getConfig } from '../src/utils/config.js';
import { authors, categories, proverbs } from '../src/db/schemas.js';
import db from '../src/db/index.js';
import { getLogger } from '../src/utils/logger.js';

const cnf = getConfig();
const log = getLogger(cnf);

async function importAuthors(items) {
  for (const item of items) {
    const exists = await db
      .select()
      .from(authors)
      .where(eq(authors.name, item.author))
      .get();

    if (!exists) {
      await db.insert(authors).values({
        name: item.author,
      });
    }
  }
}

async function importCategories(items) {
  for (const item of items) {
    const exists = await db
      .select()
      .from(categories)
      .where(eq(categories.name, item.category))
      .get();

    if (!exists) {
      await db.insert(categories).values({
        name: item.category,
      });
    }
  }
}

async function importProverbs(items) {
  for (const item of items) {
    const author = await db
      .select()
      .from(authors)
      .where(eq(authors.name, item.author))
      .get();

    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.name, item.category))
      .get();

    await db.insert(proverbs).values({
      title: item.title,
      authorId: author.id,
      content: item.content,
      description: item.description,
      lang: item.lang,
      categoryId: category.id,
      tags: item.tags.join(','),
    });
  }
}

async function importData() {
  log.info('Importing data');
  const data = readFileSync(
    join(process.cwd(), 'scripts/proverbs.json'),
    'utf-8',
  );
  const dataArray = JSON.parse(data);
  await importAuthors(dataArray);
  log.info('Imported authors');
  await importCategories(dataArray);
  log.info('Imported categories');
  await importProverbs(dataArray);
  log.info('Imported proverbs');
}

importData().catch((err) => log.error(err));
