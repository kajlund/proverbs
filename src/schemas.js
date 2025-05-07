export const idSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
  },
};
