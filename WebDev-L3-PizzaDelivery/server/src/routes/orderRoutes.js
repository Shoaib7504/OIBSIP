import { Router } from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);

export default router;
