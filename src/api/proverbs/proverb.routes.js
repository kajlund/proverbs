import { proverbSchema } from "./proverb.validators.js";
import { idSchema } from "../../schemas.js";
import validate from "../../middleware/validator.js";
import { getProverbHandler } from "./proverb.handler.js";

export function getProverbRoutes(options = { hnd: getProverbHandler() }) {
  const { hnd } = options;

  return {
    group: {
      prefix: "/api/v1/proverbs",
      middleware: [],
    },
    routes: [
      {
        method: "get",
        path: "/",
        middleware: [],
        handler: hnd.queryProverbs,
      },
      {
        method: "get",
        path: "/:id",
        middleware: [validate({ params: idSchema })],
        handler: hnd.findProverbById,
      },
      {
        method: "post",
        path: "/",
        middleware: [validate({ body: proverbSchema })],
        handler: hnd.createProverb,
      },
      {
        method: "put",
        path: "/:id",
        middleware: [validate({ params: idSchema, body: proverbSchema })],
        handler: hnd.updateProverb,
      },
      {
        method: "delete",
        path: "/:id",
        middleware: [validate({ params: idSchema })],
        handler: hnd.deleteProverb,
      },
    ],
  };
}
