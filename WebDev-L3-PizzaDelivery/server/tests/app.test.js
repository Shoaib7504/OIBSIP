import request from "supertest";
import app from "../src/app.js";

describe("Pizza Delivery API", () => {
  test("GET / should return API message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "Pizza Delivery API",
    });
  });
});