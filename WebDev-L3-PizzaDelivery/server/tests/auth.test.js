import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("User Authentication API", () => {
  const userData = {
    name: "Test User",
    email: "test@example.com",
    password: "123456",
    phone: "01700000000",
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/users/register", () => {
    test("should register a new user", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.data.email).toBe(userData.email);
    });

    test("should reject missing required fields", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          email: userData.email,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should reject duplicate email", async () => {
      await request(app)
        .post("/api/users/register")
        .send(userData);

      const response = await request(app)
        .post("/api/users/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Email already registered");
    });
  });

  describe("POST /api/users/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/users/register")
        .send(userData);
    });

    test("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    test("should reject invalid password", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          email: userData.email,
          password: "wrongpassword",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});