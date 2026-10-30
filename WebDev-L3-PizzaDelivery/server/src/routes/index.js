import { Router } from "express";
import mongoose from "mongoose";
import pizzaRoutes from "./pizzaRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

router.use("/pizzas", pizzaRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);

export default router;
