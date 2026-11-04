import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://pizzacravehub.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, mobile apps, or curl)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/pizzacravehub.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Stripe webhook requires the original raw request body
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// Parse JSON for all other API requests
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Pizza Delivery API" });
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
