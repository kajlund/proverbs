import { z } from 'zod';

import { BadRequestError } from '../utils/api.error.js';

const cuidSchema = z.string().min(24).max(24);

export const authorSchema = z.strictObject({
  name: z.string().trim().min(2),
});

export const categorySchema = z.strictObject({
  name: z.string().trim().min(2),
});

export const proverbSchema = z.strictObject({
  title: z.string().trim().optional(),
  authorId: cuidSchema,
  content: z.string().trim().min(5),
  description: z.string().trim().optional(),
  lang: z.string().min(3).max(3),
  categoryId: cuidSchema,
  tags: z.string().trim().optional(),
});

export function validateIdParam(req, res, next) {
  try {
    const id = cuidSchema.parse(req.params?.id);
    req.locals ??= {};
    req.locals.id = id;
    next();
  } catch (err) {
    next(new BadRequestError('Invalid id', err));
  }
}

export function validateBody(schema) {
  return function (req, res, next) {
    const vld = schema.safeParse(req.body);
    if (!vld.success)
      return next(new BadRequestError('Faulty body data', vld.error));
    req.locals ??= {};
    req.locals.payload = vld.data;
    next();
  };
}
