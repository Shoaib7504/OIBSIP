import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Pizza from "../src/models/Pizza.js";

describe("Pizza Admin Authorization", () => {
    test("should reject pizza update by customer", async () => {
  const pizza = await Pizza.create(pizzaData);

  const response = await request(app)
    .put(`/api/pizzas/${pizza._id}`)
    .set("Authorization", `Bearer ${customerToken}`)
    .send({ name: "Updated Pizza" });

  expect(response.statusCode).toBe(403);
});

test("should allow admin to update pizza", async () => {
  const pizza = await Pizza.create(pizzaData);

  const response = await request(app)
    .put(`/api/pizzas/${pizza._id}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Updated Pizza" });

  expect(response.statusCode).toBe(200);
});

test("should reject pizza deletion by customer", async () => {
  const pizza = await Pizza.create(pizzaData);

  const response = await request(app)
    .delete(`/api/pizzas/${pizza._id}`)
    .set("Authorization", `Bearer ${customerToken}`);

  expect(response.statusCode).toBe(403);
});

test("should allow admin to delete pizza", async () => {
  const pizza = await Pizza.create(pizzaData);

  const response = await request(app)
    .delete(`/api/pizzas/${pizza._id}`)
    .set("Authorization", `Bearer ${adminToken}`);

  expect(response.statusCode).toBe(200);

  const deletedPizza = await Pizza.findById(pizza._id);
  expect(deletedPizza).toBeNull();
});
  let customer;
  let admin;
  let customerToken;
  let adminToken;

  const pizzaData = {
    name: "Test Pizza",
    description: "A delicious test pizza",
    category: "Veg",
    image: "https://example.com/pizza.jpg",
    prices: {
      small: 200,
      medium: 300,
      large: 400,
    },
    stock: 20,
  };

  const generateToken = (id) =>
    jwt.sign(
      { id },
      process.env.JWT_SECRET || "default_jwt_secret"
    );

  beforeEach(async () => {
    await User.deleteMany({});
    await Pizza.deleteMany({});

    customer = await User.create({
      name: "Test Customer",
      email: "customer@test.com",
      passwordHash: "test-hash",
      role: "user",
    });

    admin = await User.create({
      name: "Test Admin",
      email: "admin@test.com",
      passwordHash: "test-hash",
      role: "admin",
    });

    customerToken = generateToken(customer._id);
    adminToken = generateToken(admin._id);
  });

  test("should allow public users to view pizzas", async () => {
    const response = await request(app)
      .get("/api/pizzas");

    expect(response.statusCode).toBe(200);
  });

  test("should reject pizza creation without token", async () => {
    const response = await request(app)
      .post("/api/pizzas")
      .send(pizzaData);

    expect(response.statusCode).toBe(401);
  });

  test("should reject pizza creation by customer", async () => {
    const response = await request(app)
      .post("/api/pizzas")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(pizzaData);

    expect(response.statusCode).toBe(403);
  });

  test("should allow admin to create pizza", async () => {
    const response = await request(app)
      .post("/api/pizzas")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(pizzaData);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(pizzaData.name);
  });
});