import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../src/config/db.js";

jest.setTimeout(45000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await connectDB(mongoServer.getUri());

  console.log("Test MongoDB Connected");
}, 45000);

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
}, 45000);
