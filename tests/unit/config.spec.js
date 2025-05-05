import { test } from "@japa/runner";

import { getConfig } from "../../src/config.js";

test.group("Configuration tests", () => {
  test("cnf properties and values", ({ expect }) => {
    const cnf = getConfig({
      NODE_ENV: "test",
      PORT: 5000,
      LOG_LEVEL: "silent",
      LOG_HTTP: 0,
      DB_URI: "mongodb://localhost:27017",
      DB_NAME: "testdb",
    });

    expect(cnf).toMatchObject({
      isDev: false,
      isProd: false,
      isTest: true,
      NODE_ENV: "test",
      PORT: 5000,
      LOG_LEVEL: "silent",
      LOG_HTTP: 0,
      DB_URI: "mongodb://localhost:27017",
      DB_NAME: "testdb",
    });
  });
});
