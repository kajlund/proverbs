import { eq } from 'drizzle-orm';

import db from './index.js';
import { categories } from './schemas.js';

export function getCategoryDAO(log) {
  return {
    create: async function (data) {
      const time = new Date();
      data.createdAt = time;
      data.updatedAt = time;
      const [created] = await db.insert(categories).values(data).returning();
      log.debug(created, 'Created');
      return created;
    },
    destroy: async function (id) {
      const [deleted] = await db
        .delete(categories)
        .where(eq(categories.id, id))
        .returning();
      log.debug(deleted, `Deleted by id ${id}`);
      return deleted;
    },
    findById: async function (id) {
      const [found] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
      log.debug(found, `Found by id ${id}`);
      return found;
    },
    findByName: async function (name) {
      const [found] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1);
      log.debug(found, `Found by name ${name}`);
      return found;
    },
    findAll: async function () {
      const data = await db.select().from(categories).orderBy(categories.name);
      log.debug(data, 'Found');
      return data;
    },
    update: async function (id, data) {
      data.updatedAt = new Date();
      const [updated] = await db
        .update(categories)
        .set(data)
        .where(eq(categories.id, id))
        .returning();
      log.debug(updated, `Updated id ${id}`);
      return updated;
    },
  };
}
