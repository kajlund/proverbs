export const proverbCategories = ["IT", "Misc.", "Science", "Secular"];

export const proverbLanguages = ["eng", "swe", "fin"];

class Proverb {
  constructor(
    data = {
      id: null,
      title: "",
      content: "",
      author: "",
      description: "",
      lang: "eng",
      likes: 0,
      category: "",
      tags: [],
      createdAt: "",
      updatedAt: "",
    },
  ) {
    const { id, title, content, author, description, lang, likes, category, tags, createdAt, updatedAt } = data;
    this._id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.description = description;
    this.lang = lang;
    this.likes = likes;
    this.category = category;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ProverbBuilder {
  #id;
  #title;
  #content;
  #author;
  #description;
  #lang;
  #likes;
  #category;
  #tags;
  #createdAt;
  #updatedAt;

  setId(id) {
    this.#id = id;
    return this;
  }

  setTitle(title) {
    this.#title = title.trim();
    return this;
  }

  setContent(content) {
    this.#content = content.trim();
    return this;
  }

  setAuthor(author) {
    this.#author = author.trim();
    return this;
  }

  build() {
    return new Proverb(
      this.#id,
      this.#title,
      this.#content,
      this.#author,
      this.#description,
      this.#lang,
      this.#likes,
      this.#category,
      this.#tags,
      this.#createdAt.toISOString(),
      this.#updatedAt.toISOString(),
    );
  }
}
