import { and, desc, eq } from 'drizzle-orm';

import db from './index.js';
import { authors, categories, proverbs } from './schemas.js';

export function getProverbDAO(log) {
  return {
    create: async function (data) {
      const time = new Date().toISOString();
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
      return data;
    },
    queryRandom: async function (qry) {
      const { lang, category } = qry;
      const ids = await db
        .select({
          id: proverbs.id,
          cat: categories.name,
          language: proverbs.lang,
        })
        .from(proverbs)
        .innerJoin(categories, eq(proverbs.categoryId, categories.id))
        .where(and(eq(proverbs.lang, lang), eq(categories.name, category)));

      const rnd = ids[Math.floor(Math.random() * ids.length)];
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
        .where(eq(proverbs.id, rnd.id))
        .limit(1);
      log.debug(found, `Found Random Proverb id ${found.id}`);
      return found;
    },
    update: async function (id, data) {
      data.updatedAt = new Date().toISOString();
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
