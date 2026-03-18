// @vitest-environment node

import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../server/src/app";
import { createInMemoryRepository } from "../../server/src/testing/createInMemoryRepository";

describe("server API", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp({
      repository: createInMemoryRepository(),
      sessionSecret: "test-session-secret",
      secureCookie: false,
    });
  });

  it("registers a user, sets a session cookie, and returns bootstrap data", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({ email: "cook@example.com", password: "hunter22" });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.email).toBe("cook@example.com");
    expect(registerResponse.headers["set-cookie"]?.[0]).toContain("foodwise_session=");

    const bootstrapResponse = await request(app)
      .get("/api/app/bootstrap")
      .set("Cookie", registerResponse.headers["set-cookie"]);

    expect(bootstrapResponse.status).toBe(200);
    expect(bootstrapResponse.body.user.email).toBe("cook@example.com");
    expect(bootstrapResponse.body.commonIngredients).toContain("Beras");
    expect(bootstrapResponse.body.foodItems).toHaveLength(6);
    expect(bootstrapResponse.body.disruptions).toHaveLength(3);
    expect(bootstrapResponse.body.recipes).toHaveLength(5);
    expect(bootstrapResponse.body.communityRecipes).toHaveLength(3);
    expect(bootstrapResponse.body.pantry).toEqual([]);
  });

  it("rejects duplicate emails and protects bootstrap without a session", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "cook@example.com", password: "hunter22" });

    const duplicateResponse = await request(app)
      .post("/api/auth/register")
      .send({ email: "cook@example.com", password: "hunter22" });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.error.code).toBe("email_taken");

    const bootstrapResponse = await request(app).get("/api/app/bootstrap");

    expect(bootstrapResponse.status).toBe(401);
    expect(bootstrapResponse.body.error.code).toBe("unauthorized");
  });

  it("lets an authenticated user add and remove pantry items", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({ email: "pantry@example.com", password: "hunter22" });

    const cookie = registerResponse.headers["set-cookie"];

    const addResponse = await request(app)
      .post("/api/pantry/items")
      .set("Cookie", cookie)
      .send({ name: "Beras" });

    expect(addResponse.status).toBe(200);
    expect(addResponse.body.pantry).toEqual(["Beras"]);

    const deleteResponse = await request(app)
      .delete("/api/pantry/items/Beras")
      .set("Cookie", cookie);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.pantry).toEqual([]);
  });
});
