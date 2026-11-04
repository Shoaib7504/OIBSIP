import mongoose from "mongoose";

const connectDB = async (uri = process.env.MONGODB_URI) => {
  try {
    if (!uri) {
      throw new Error("MONGODB_URI is missing");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log("MongoDB Connected");

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
};

export default connectDB;