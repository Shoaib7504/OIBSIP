import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Pizza Delivery API" });
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
