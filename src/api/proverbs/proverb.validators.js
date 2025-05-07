import { proverbCategories, proverbLanguages } from "./proverb.model.js";

export const proverbSchema = {
  type: "object",
  required: ["title", "content", "author", "lang", "category"],
  properties: {
    title: {
      type: "string",
      minLength: 3,
      maxLength: 100,
      description: "Proverb title.",
      example: "",
    },
    content: {
      type: "string",
      description: "Proverb content",
      example: "Veni, vidi, vici",
    },
    author: {
      type: "string",
      description: "Proverb author",
      example: "Plato",
    },
    description: {
      type: "string",
      description: "Additional info of origin",
      example: "Popular Mecanics 1955",
    },
    lang: {
      type: "string",
      enum: proverbLanguages,
      description: "Language of the proverb",
      example: "eng",
    },
    category: {
      type: "string",
      enum: proverbCategories,
      description: "Proverb category",
      example: "IT",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
        minLength: 2,
        maxLength: 20,
      },
      description: "Tags associated with the proverb",
      example: ["it", "computers"],
    },
  },
};
