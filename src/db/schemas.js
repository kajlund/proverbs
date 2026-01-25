import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
};

export const authors = pgTable('authors', {
  id: varchar()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar().notNull().unique(),
  ...timestamps,
});

export const categories = pgTable('categories', {
  id: varchar()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar().notNull().unique(),
  ...timestamps,
});

export const proverbs = pgTable('proverbs', {
  id: varchar()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar().notNull().default(''),
  authorId: varchar()
    .notNull()
    .references(() => authors.id),
  content: text().notNull().default(''),
  description: text().notNull().default(''),
  lang: varchar().notNull().default('eng'),
  categoryId: varchar()
    .notNull()
    .references(() => categories.id),
  tags: text().notNull().default(''),
  ...timestamps,
});
