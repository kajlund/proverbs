import { desc, eq } from 'drizzle-orm';

import db from './index.js';
import { authors, categories, proverbs } from './schemas.js';

export function getProverbDAO(log) {
  return {
    create: async function (data) {
      const time = new Date();
      data.createdAt = time;
      data.updatedAt = time;
      const [newProverb] = await db.insert(proverbs).values(data).returning();
      log.debug(newProverb, 'Created Proverb');
      return newProverb;
    },
    destroy: async function (id) {
      const [deleted] = await db
        .delete(proverbs)
        .where(eq(proverbs.id, id))
        .returning();
      log.debug(deleted, `Deleted Proverb id ${id}`);
      return deleted;
    },
    findById: async function (id) {
      const [found] = await db
        .select({
          id: proverbs.id,
          title: proverbs.title,
          authorId: proverbs.authorId,
          author: authors.name,
          content: proverbs.content,
          description: proverbs.description,
          lang: proverbs.lang,
          categoryId: proverbs.categoryId,
          category: categories.name,
          tags: proverbs.tags,
          createdAt: proverbs.createdAt,
          updatedAt: proverbs.updatedAt,
        })
        .from(proverbs)
        .innerJoin(authors, eq(proverbs.authorId, authors.id))
        .innerJoin(categories, eq(proverbs.categoryId, categories.id))
        .where(eq(proverbs.id, id))
        .limit(1);
      log.debug(found, `Found Proverb id ${id}`);
      return found;
    },
    query: async function () {
      const data = await db
        .select({
          id: proverbs.id,
          title: proverbs.title,
          authorId: proverbs.authorId,
          author: authors.name,
          content: proverbs.content,
          description: proverbs.description,
          lang: proverbs.lang,
          categoryId: proverbs.categoryId,
          category: categories.name,
          tags: proverbs.tags,
          createdAt: proverbs.createdAt,
          updatedAt: proverbs.updatedAt,
        })
        .from(proverbs)
        .innerJoin(authors, eq(proverbs.authorId, authors.id))
        .innerJoin(categories, eq(proverbs.categoryId, categories.id))
        .orderBy(desc(proverbs.createdAt));
      log.debug(data, 'Found Proverbs');
      return data;
    },
    update: async function (id, data) {
      data.updatedAt = new Date();
      const [updated] = await db
        .update(proverbs)
        .set(data)
        .where(eq(proverbs.id, id))
        .returning();
      log.debug(updated, `Updated Proverb id ${id}`);
      return updated;
    },
  };
}
