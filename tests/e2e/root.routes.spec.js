import { test } from "@japa/runner";

test.group("Testing API routes", (group) => {
  group.setup(() => {});

  test("ping", async ({ client, expect }) => {
    const response = await client.get("/ping");
    expect(response.status()).toBe(200);
    expect(response.body()).toMatchObject({ success: true, message: "Pong", status: 200, data: null });
  });

  test("notfound", async ({ client, expect }) => {
    const response = await client.get("/notfound");
    expect(response.status()).toBe(404);
    expect(response.body()).toMatchObject({
      success: false,
      status: 404,
      message: "Not Found",
      detail: "Route /notfound was not found",
      errors: null,
    });
  });
});
