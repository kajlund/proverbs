import { eq } from 'drizzle-orm';

import db from './index.js';
import { authors } from './schemas.js';

export function getAuthorDAO(log) {
  return {
    create: async function (data) {
      const time = new Date();
      data.createdAt = time;
      data.updatedAt = time;
      const [created] = await db.insert(authors).values(data).returning();
      log.debug(created, 'Created');
      return created;
    },
    destroy: async function (id) {
      const [deleted] = await db
        .delete(authors)
        .where(eq(authors.id, id))
        .returning();
      log.debug(deleted, `Deleted by id ${id}`);
      return deleted;
    },
    findById: async function (id) {
      const [found] = await db
        .select()
        .from(authors)
        .where(eq(authors.id, id))
        .limit(1);
      log.debug(found, `Found by id ${id}`);
      return found;
    },
    findByName: async function (name) {
      const [found] = await db
        .select()
        .from(authors)
        .where(eq(authors.name, name))
        .limit(1);
      log.debug(found, `Found by name ${name}`);
      return found;
    },
    findAll: async function () {
      const data = await db.select().from(authors).orderBy(authors.name);
      log.debug(data, 'Found');
      return data;
    },
    update: async function (id, data) {
      data.updatedAt = new Date();
      const [updated] = await db
        .update(authors)
        .set(data)
        .where(eq(authors.id, id))
        .returning();
      log.debug(updated, `Updated id ${id}`);
      return updated;
    },
  };
}
