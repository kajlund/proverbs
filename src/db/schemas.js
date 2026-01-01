import { createId } from '@paralleldrive/cuid2';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const timestamps = {
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
};

export const authors = sqliteTable('authors', {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('aut_name').notNull().unique(),
  ...timestamps,
});

export const categories = sqliteTable('categories', {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text().notNull().unique(),
  ...timestamps,
});

export const proverbs = sqliteTable('proverbs', {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text().notNull().default(''),
  authorId: text()
    .notNull()
    .references(() => authors.id),
  content: text().notNull().default(''),
  description: text().notNull().default(''),
  lang: text().notNull().default('eng'),
  categoryId: text()
    .notNull()
    .references(() => categories.id),
  tags: text().notNull().default(''),
  ...timestamps,
});
