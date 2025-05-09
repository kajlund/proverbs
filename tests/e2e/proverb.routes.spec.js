import { test } from "@japa/runner";
import { MongoClient, ObjectId } from "mongodb";

const ISO8601RegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/

const uri = process.env.DB_URI;
let client, db;
let proverbId = "6682d3417dfa23ae0504036f";
let proverb = {
  _id: ObjectId.createFromHexString(proverbId),
  title: "Happiness",
  author: "Anne (After Life)",
  content: "Happiness is amazing! It's so amazing it doesn't matter if it's yours or not.",
  description: "Misc",
  lang: "eng",
  category: "Misc.",
  tags: [ "happiness" ],
  createdAt: "2024-07-01T16:03:13.768Z",
  updatedAt: "2025-01-25T19:50:00.388Z"
};

async function seed() {
  const proverbs = [];
  const coll = db.collection("proverbs");
  await coll.deleteMany();
  
  proverbs.push(proverb);
  proverbs.push({
    title: "Meaning of Life",
    author: "Unknown",
    content: "The realization that you were not created with a purpose does not mean your life has no meaning. It just means you get to find your own.",
    description: "",
    lang: "eng",
    category: "Secular",
    tags: [ "purpose", "meaning" ],
    createdAt: "2024-07-01T16:01:27.579Z",
    updatedAt: "2025-01-25T19:50:30.100Z"
  });
    
  await coll.insertMany(proverbs);
};

test.group("Testing proverb routes", (group) => {

  group.setup(() => {
    client = new MongoClient(uri);
    db = client.db(process.env.DB_NAME);
  });

  group.teardown(() => {
    client.close();
  });

  group.each.setup(() => {
    return seed();
  });

  group.each.teardown(() => {

  });

  test("Query Proverbs (default)", async ({ client, expect }) => {
    const response = await client.get("/api/v1/proverbs");
    expect(response.status()).toBe(200);
    expect(response.body()).toMatchObject({
      success: true,
      status: 200,
      message: "Found 2 proverbs",
      data: expect.arrayContaining([expect.objectContaining({
        _id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
        title: expect.any(String),
        author: expect.any(String),
        content: expect.any(String),
        description: expect.any(String),
        lang: expect.stringMatching(/^fin|swe|eng$/),
        category: expect.stringMatching(/^IT|Misc.|Science|Secular$/),
        tags: expect.arrayContaining([expect.any(String)]),
        createdAt: expect.stringMatching(ISO8601RegEx),
        updatedAt: expect.stringMatching(ISO8601RegEx),
      })])
    })
  });

  test("Query Proverb using filter");
  test("Query Proverb using sort");
  test("Query Proverb using paging");

  test("Find Proverb by Id", async ({ client, expect }) => {
    const response = await client.get(`/api/v1/proverbs/${proverbId}`);
    console.log(response.status());
    console.log(response.body());
    expect(response.status()).toBe(200);
    expect(response.body()).toMatchObject({
      success: true,
      status: 200,
      message: `Found proverb ${proverbId}`,
      data: {
        _id: proverbId  
      }
    });
  });

  test("Create Proverb");

  test("Update Proverb");

  test("Delete Proverb");
});
